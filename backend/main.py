from fastapi import FastAPI, HTTPException, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from services.session_service import create_session, get_session
from services.survey_service import get_initial_questions, submit_survey_responses
from services.assistant_service import generate_questions, generate_learning_path_from_responses
from firebase_admin import firestore

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SurveyResponse(BaseModel):
    question: str
    answer: str

class SurveyResponses(BaseModel):
    responses: List[SurveyResponse]

class SessionRequest(BaseModel):
    university_id: str
    major_id: str
    student_type: str

# this is hardcoded for now, but we should make it dynamic later
def major_id_to_name(major_id: str) -> str:
    return {
        "cs": "Computer Science",
        "dh": "Digital Health",
    }.get(major_id, "Unknown")

@app.post("/api/start-session")
async def start_session(request: SessionRequest):
    """Start a new session and initialize the assistant."""
    try:
        session_id = create_session(request.university_id, request.major_id, request.student_type)
        return {"session_id": session_id}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in start_session: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/initial-survey/{session_id}")
async def get_initial_survey(session_id: str):
    """Get initial survey questions based on session ID."""
    try:
        # Get session data
        session = get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get questions based on student type
        questions = get_initial_questions(session["student_type"])
        return {"questions": questions}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in get_initial_survey: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-survey")
async def generate_survey(session_id: str = Query(..., description="Session ID")):
    """Generate additional survey questions based on initial responses."""
    try:
        session = get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get all survey responses from the session
        survey_responses = session.get("survey_responses", {}).get("responses", [])
        if not survey_responses:
            raise HTTPException(status_code=400, detail="No survey responses found")
        
        print(major_id_to_name(session["major_id"]))
        questions = generate_questions(session["assistant_id"], survey_responses, session["student_type"], major_id_to_name(session["major_id"]))
        return {"questions": questions}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in generate_survey: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/submit-survey-response")
async def submit_survey_response(
    session_id: str = Query(..., description="Session ID"),
    responses: List[SurveyResponse] = Body(..., description="List of survey responses")
):
    """Submit survey responses for a session."""
    try:
        submit_survey_responses(session_id, [r.dict() for r in responses])
        return {"status": "success"}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in submit_survey_response: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/learning-path/{session_id}")
async def get_learning_path(session_id: str, search: str = None):
    """Generate a learning path based on survey responses and optional search query."""
    try:
        session = get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get all survey responses from the session
        survey_responses = session.get("survey_responses", {}).get("responses", [])
        if not survey_responses:
            raise HTTPException(status_code=400, detail="No survey responses found")
        
        # Generate learning path using the assistant
        learning_path = generate_learning_path_from_responses(session["assistant_id"], survey_responses, search)
        
        # Update session with learning path
        db = firestore.client()
        doc_ref = db.collection('sessions').document(session_id)
        doc_ref.update({
            "learning_path": learning_path,
            "status": "learning_path_generated"
        })
        
        return {"learning_path": learning_path}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in generate_learning_path: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 