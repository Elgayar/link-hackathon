from config import db, logger
from fastapi import HTTPException
from datetime import datetime
from data.surveys import SURVEY_TYPES, SurveyQuestion

def get_initial_questions(student_type: str) -> list:
    """Get initial survey questions based on student type."""
    if student_type not in SURVEY_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid student type: {student_type}")
    
    # Convert SurveyQuestion objects to dictionaries
    questions = [question.to_dict() for question in SURVEY_TYPES[student_type]]
    return questions

def submit_survey_responses(session_id: str, responses: list) -> None:
    """Submit all survey responses for a session."""
    try:
        logger.info(f"Submitting survey responses for session {session_id}")
        
        # Get session data
        doc_ref = db.collection('sessions').document(session_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session_data = doc.to_dict()
        existing_responses = session_data.get("survey_responses", {}).get("responses", [])
        
        # Combine existing responses with new ones
        all_responses = existing_responses + responses
        
        # Store all responses in Firestore
        responses_data = {
            "responses": all_responses,
            "submitted_at": datetime.utcnow().isoformat(),
            "total_questions_answered": len(all_responses)
        }
        
        try:
            # Update the session document with the responses
            doc_ref.update({
                "survey_responses": responses_data,
                "status": "survey_in_progress" if len(all_responses) < 10 else "survey_completed"
            })
            logger.info(f"Successfully stored {len(responses)} new responses for session {session_id}")
        except Exception as e:
            logger.error(f"Failed to store responses in Firestore: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Failed to store responses: {str(e)}")
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in submit_survey_responses: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e)) 