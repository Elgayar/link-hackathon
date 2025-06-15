from config import client, db, logger
from fastapi import HTTPException
import json
from datetime import datetime
import time

def get_assistant_key(university_id: str, major_id: str) -> str:
    """Get the unique key for an assistant based on university and major."""
    return f"{university_id}_{major_id}"

def get_or_create_assistant(university_id: str, major_id: str) -> str:
    """Get an existing assistant or create a new one if it doesn't exist."""
    assistant_key = get_assistant_key(university_id, major_id)
    
    # Check if assistant exists in Firestore
    assistant_doc = db.collection('assistants').document(assistant_key).get()
    
    if assistant_doc.exists:
        logger.info(f"Found existing assistant for {assistant_key}")
        return assistant_doc.to_dict()['assistant_id']
    
    # If no existing assistant, create a new one
    logger.info(f"Creating new assistant for {assistant_key}")

    try:
        assistant = client.beta.assistants.create(
            name=f"Course Advisor - {university_id} - {major_id}",
            instructions=f"""You are a course advisor for {university_id} specializing in {major_id}.

            Your role is to help students by:
            1. Generating relevant survey questions based on the course catalog
            2. Analyzing student responses to provide personalized course recommendations
            3. Creating semester-by-semester learning paths
            
            When generating survey questions or learning paths, consider:
            1. Prerequisites and course dependencies
            2. Course difficulty and workload
            3. Career goals and interests
            4. Academic strengths and weaknesses
            5. Only recommend courses that are in the course catalog
            
            Always provide detailed explanations for your recommendations.
            Return responses in valid JSON format.""",
            model="gpt-4o-mini"
        )
        
        # Store assistant info in Firestore so we don't have to create a new assistant every time
        assistant_data = {
            'assistant_id': assistant.id,
            'university_id': university_id,
            'major_id': major_id,
            'created_at': datetime.utcnow().isoformat()
        }
        db.collection('assistants').document(assistant_key).set(assistant_data)
        
        return assistant.id
    except Exception as e:
        logger.error(f"Failed to create assistant: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to create assistant: {str(e)}")

def generate_questions(assistant_id: str, responses: list, student_type: str, major_id: str) -> list:
    """Generate survey questions using the assistant."""
    try:
        # Create a thread
        thread = client.beta.threads.create()

        # Format responses for the assistant
        formatted_responses = "\n".join([
            f"Q: {response['question']}\nA: {response['answer']}"
            for response in responses
        ])

        print(formatted_responses)
        
        # Add message to thread
        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=f"""
            Student responses:
            {formatted_responses}

            The goal is to create personalized course recommendation questionnaires for university students.

            Student type: {student_type}
            Major: {major_id}

            Based on this information and the student's initial survey responses, create a dynamic follow-up questionnaire that will help match them with the most suitable courses.

            Include questions specific only to the courses in the course catalog.

            The questionnaire should:
            1. Have 5 personalized questions based on their initial responses
            2. Be designed to work with embeddings from Rate My Professor, Reddit and course catalog data for better matching
            3. Consider their student type (first-year, transfer, typical student) in question design
            4. Help identify courses that align with their personal growth and aspirations
            5. Include a mix of multiple-choice and open-ended questions for deeper personalization, if the question is open-ended, the freeText field should be true, otherwise it should be false
            6. Make sure the response is valid JSON and follows this exact structure.
            {{
                "questions": [
                    {{
                        "id": "int",
                        "question": "string",
                        "options": "string[]",
                        "freeText": "boolean"
                    }}
                ]
            }}
        """
        )
        
        # Run the assistant
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant_id
        )
        
        # Wait for the run to complete
        while True:
            run_status = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )
            if run_status.status == 'completed':
                break
            elif run_status.status == 'failed':
                logger.error(f"Run failed: {run_status.last_error}")
                raise HTTPException(status_code=500, detail="Failed to generate questions")
        
        # Get the messages
        messages = client.beta.threads.messages.list(
            thread_id=thread.id
        )
        
        # Parse the JSON response from the last message
        try:
            response_text = messages.data[0].content[0].text.value
            logger.info(f"Raw response from assistant: {response_text}")
            
            # Try to find JSON in the response text
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_start == -1 or json_end == 0:
                raise ValueError("No JSON object found in response")
            
            json_str = response_text[json_start:json_end]
            response_json = json.loads(json_str)
            
            # Validate the response structure
            if 'questions' not in response_json:
                raise ValueError("Response missing 'questions' field")
            
            for question in response_json['questions']:
                if not all(key in question for key in ['id', 'question', 'options', 'freeText']):
                    raise ValueError("Question missing required fields")
            
            return response_json['questions']
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse assistant response as JSON: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to parse assistant response as JSON"
            )
        except ValueError as e:
            logger.error(f"Invalid response format: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Invalid response format: {str(e)}"
            )
    except Exception as e:
        logger.error(f"Error in generate_questions: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

def generate_learning_path_from_responses(assistant_id: str, responses: list, search_query: str = None) -> list:
    """Generate a learning path based on survey responses and optional search query."""
    try:
        # Format responses for the assistant
        formatted_responses = "\n".join([
            f"Q: {response['question']}\nA: {response['answer']}"
            for response in responses
        ])

        # Create the prompt for the assistant
        prompt = f"""Based on the following survey responses, create a personalized learning path with specific steps, resources, and time estimates:

            {formatted_responses}

            {f"Additionally, focus on courses and topics related to: {search_query}" if search_query else ""}

            Please provide a structured learning path with the following format for each step:
            - title: A clear, concise title for the step
            - description: A detailed explanation of what to do and why
            - estimated_time: How long this step should take
            - match_percentage: The percentage of the course that matches the student's profile
            - public_reviews: A list of public reviews of the course
            - professor_reviews: A list of professor reviews of the course

            ONLY recommend courses that are in the course catalog in your context, do not recommend random courses.
            In the title, include only the course number and name, do not include verbose descriptions.
            If there are public reviews on a given course, include them in a list of strings.
            If there are professor reviews and ratings on a given course, include them in a list of strings.

            Format the response as a JSON array of objects with these fields."""

        # Create a thread if it doesn't exist
        thread = client.beta.threads.create()

        # Add the message to the thread
        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=prompt
        )

        # Run the assistant
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant_id
        )

        # Wait for the run to complete
        while True:
            run_status = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )
            if run_status.status == 'completed':
                break
            elif run_status.status in ['failed', 'cancelled', 'expired']:
                raise Exception(f"Run failed with status: {run_status.status}")
            time.sleep(1)

        # Get the messages
        messages = client.beta.threads.messages.list(
            thread_id=thread.id
        )

        # Get the latest assistant message
        assistant_messages = [msg for msg in messages.data if msg.role == "assistant"]
        if not assistant_messages:
            raise Exception("No response from assistant")
        
        latest_message = assistant_messages[0]
        content = latest_message.content[0].text.value

        # Parse the response to get the learning path
        try:
            # Find JSON array in the response
            start_idx = content.find('[')
            end_idx = content.rfind(']') + 1
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No JSON array found in response")
            
            json_str = content[start_idx:end_idx]
            learning_path = json.loads(json_str)
            
            # Validate the structure
            for step in learning_path:
                if not all(key in step for key in ['title', 'description']):
                    raise ValueError("Invalid learning path structure")
                if 'resources' in step and not isinstance(step['resources'], list):
                    step['resources'] = [step['resources']]
            
            return learning_path
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse learning path JSON: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to parse learning path")
        except ValueError as e:
            logger.error(f"Invalid learning path structure: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    except Exception as e:
        logger.error(f"Error generating learning path: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e)) 