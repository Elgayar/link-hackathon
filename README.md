# LINK - Student Guidance Assistant

An AI-powered application that helps students navigate their academic journey by providing personalized course recommendations and learning paths based on their school and major.

## Features

- School and major selection
- AI-generated survey questions based on course catalog
- Personalized learning path recommendations
- Course matching with percentage scores

## Tech Stack

### Frontend

- Next.js
- React
- Chakra UI
- TypeScript

### Backend

- FastAPI
- OpenAI API
- Firebase/Firestore

## Project Structure

```
.
├── frontend/          # Next.js frontend application
└── backend/          # FastAPI backend application
```

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   FIREBASE_CREDENTIALS=path_to_firebase_credentials.json
   ```

## Running the Application

### Frontend

```bash
cd frontend
npm run dev
```

### Backend

```bash
cd backend
uvicorn main:app --reload
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.
