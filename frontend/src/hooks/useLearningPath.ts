import { useState, useEffect, useRef, useCallback } from "react";

interface LearningPathStep {
  title: string;
  description: string;
  estimated_time?: string;
  match_percentage?: number;
  public_reviews?: string[];
  professor_reviews?: string[];
}

export function useLearningPath(sessionId: string, searchQuery?: string) {
  const [learningPath, setLearningPath] = useState<LearningPathStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const effectRan = useRef(false);

  const fetchLearningPath = useCallback(async () => {
    try {
      const url = new URL(
        `http://localhost:8000/api/learning-path/${sessionId}`
      );
      if (searchQuery) {
        url.searchParams.append("search", searchQuery);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to generate learning path");
      const { learning_path } = await response.json();
      setLearningPath(learning_path);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate learning path"
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, searchQuery]);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;
    fetchLearningPath();
  }, [fetchLearningPath]);

  return { learningPath, isLoading, error, refetch: fetchLearningPath };
}
