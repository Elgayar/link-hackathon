import { useState } from "react";

interface StartSessionParams {
  university_id: string;
  major_id: string;
  student_type: string;
}

export function useStartSession() {
  const [isLoading, setIsLoading] = useState(false);

  const startSession = async (
    params: StartSessionParams
  ): Promise<{ session_id: string } | null> => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/start-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error("Failed to start session");
      return await response.json();
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { startSession, isLoading };
}
