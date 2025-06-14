from config import db, logger
from fastapi import HTTPException
from datetime import datetime
from services.assistant_service import get_or_create_assistant

def create_session(university_id: str, major_id: str, student_type: str) -> str:
    """Create a new session and initialize the assistant."""
    try:
        logger.info(f"Creating new session for university {university_id}, major {major_id}, type {student_type}")
        
        # Get or create assistant
        assistant_id = get_or_create_assistant(university_id, major_id)
        
        # Create session document
        session_data = {
            "university_id": university_id,
            "major_id": major_id,
            "student_type": student_type,
            "assistant_id": assistant_id,
            "status": "initialized",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        try:
            # Add session to Firestore
            doc_ref = db.collection('sessions').document()
            doc_ref.set(session_data)
            session_id = doc_ref.id
            logger.info(f"Created new session with ID: {session_id}")
            return session_id
        except Exception as e:
            logger.error(f"Failed to create session in Firestore: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in create_session: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

def get_session(session_id: str) -> dict:
    """Get session data from Firestore."""
    try:
        doc_ref = db.collection('sessions').document(session_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Session not found")
        return doc.to_dict()
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in get_session: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e)) 