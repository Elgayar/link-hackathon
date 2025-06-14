import { useState, useEffect, useRef } from "react";

interface Question {
  id: number;
  question: string;
  freeText: boolean;
  options?: string[];
}

interface SurveyResponse {
  question: string;
  answer: string;
}

export function useInitialSurvey(sessionId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/initial-survey/${sessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [sessionId]);

  const submitResponses = async (
    responses: SurveyResponse[]
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/submit-survey-response?session_id=${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(responses),
        }
      );

      if (!response.ok) throw new Error("Failed to submit responses");
      return true;
    } catch (err) {
      throw err;
    }
  };

  return { questions, isLoading, submitResponses };
}
