from typing import List, Dict, Optional

class SurveyQuestion:
    def __init__(self, id: int, question: str, options: List[str], free_text: bool = False):
        self.id = id
        self.question = question
        self.options = options
        self.free_text = free_text

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "question": self.question,
            "options": self.options,
            "freeText": self.free_text
        }

FIRST_YEAR_SURVEY = [
    SurveyQuestion(
        id=1,
        question="Which learning style helps you absorb information best?",
        options=["Visual", "Auditory", "Reading/Writing", "Kinesthetic"]
    ),
    SurveyQuestion(
        id=2,
        question="Do you usually prefer working alone or with others?",
        options=["In groups", "Individually", "No preference"]
    ),
    SurveyQuestion(
        id=3,
        question="What kind of assignments help you learn most effectively?",
        options=["Quizzes", "Exams", "Projects", "Presentations"]
    ),
    SurveyQuestion(
        id=4,
        question="What are one or two personal goals you have for your first year?",
        options=[],
        free_text=True
    ),
    SurveyQuestion(
        id=5,
        question="What kind of professor helps you learn best?",
        options=[
            "Supportive and approachable",
            "Clear, structured, and organized",
            "Flexible and laid-back",
            "Challenging but fair",
            "Funny or entertaining",
            "Other"
        ]
    )
]

JUNIOR_TRANSFER_SURVEY = [
    SurveyQuestion(
        id=1,
        question="What do you hope to get out of your university experience now?",
        options=[],
        free_text=True
    ),
    SurveyQuestion(
        id=2,
        question="Which type of learning environment do you find most engaging?",
        options=["Lecture-based", "Discussion-based", "Hands-on", "Online/Asynchronous"]
    ),
    SurveyQuestion(
        id=3,
        question="Do you prefer working on projects with a team or individually?",
        options=["Team projects", "Individual work", "No preference"]
    ),
    SurveyQuestion(
        id=4,
        question="What motivates you most to succeed in your studies?",
        options=["Grades", "Personal growth", "Career goals", "Support from others", "Passion for the subject"]
    ),
    SurveyQuestion(
        id=5,
        question="What kind of assessments do you find most helpful?",
        options=["Quizzes", "Exams", "Research papers", "Major projects", "Presentations"]
    )
]

TYPICAL_STUDENT_SURVEY = [
    SurveyQuestion(
        id=1,
        question="What drives you the most when it comes to your academic work?",
        options=["Getting good grades", "Genuine interest in the subject", "Career goals", "Peers and social motivation"]
    ),
    SurveyQuestion(
        id=2,
        question="What's one challenge you've faced in your college experience so far, and how did you handle it?",
        options=[],
        free_text=True
    ),
    SurveyQuestion(
        id=3,
        question="Which type of assessment do you find most effective?",
        options=[
            "Frequent low-stakes quizzes",
            "A few big exams",
            "Major projects",
            "Research papers or essays",
            "No preference"
        ]
    ),
    SurveyQuestion(
        id=4,
        question="What class size do you learn best in?",
        options=[
            "Small (fewer than 25 students)",
            "Medium (25–75 students)",
            "Large (75+ students)",
            "No preference"
        ]
    ),
    SurveyQuestion(
        id=5,
        question="How often do you study with others?",
        options=["Regularly", "Sometimes", "Rarely or never"]
    )
]

SURVEY_TYPES = {
    "first_year": FIRST_YEAR_SURVEY,
    "junior_transfer": JUNIOR_TRANSFER_SURVEY,
    "typical": TYPICAL_STUDENT_SURVEY
} 