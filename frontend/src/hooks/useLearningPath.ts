import { useState, useEffect, useRef } from "react";

interface LearningPathStep {
  title: string;
  description: string;
  estimated_time?: string;
  match_percentage?: number;
  public_reviews?: string[];
}

export function useLearningPath(sessionId: string) {
  const [learningPath, setLearningPath] = useState<LearningPathStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const fetchLearningPath = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/learning-path/${sessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to generate learning path");
        const { learning_path } = await response.json();
        setLearningPath(learning_path);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate learning path"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPath();
  }, [sessionId]);

  return { learningPath, isLoading, error };
}
