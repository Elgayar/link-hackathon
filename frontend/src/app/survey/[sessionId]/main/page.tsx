"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Container,
  VStack,
  Button,
  useToast,
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import SurveyHeader from "@/components/survey/SurveyHeader";
import SurveyProgress from "@/components/survey/SurveyProgress";
import SurveyQuestion from "@/components/survey/SurveyQuestion";
import LoadingState from "@/components/survey/LoadingState";
import PageLayout from "@/components/PageLayout";
import { useMainSurvey } from "@/hooks/useMainSurvey";

export default function MainSurvey({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const router = useRouter();
  const toast = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unwrappedParams = React.use(params);
  const { questions, isLoading, submitResponses } = useMainSurvey(
    unwrappedParams.sessionId
  );

  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const buttonBg = useColorModeValue("gray.900", "white");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.800", "gray.100");

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: value,
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsSubmitting(true);
      try {
        const responses = Object.entries(answers).map(
          ([questionId, answer]) => ({
            question:
              questions.find((q) => q.id === parseInt(questionId))?.question ||
              "",
            answer,
          })
        );

        const success = await submitResponses(responses);
        if (success) {
          router.push(`/learning-path/${unwrappedParams.sessionId}`);
        } else {
          throw new Error("Failed to submit responses");
        }
      } catch (err) {
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to submit responses",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <PageLayout>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <SurveyHeader
            title="Main Survey"
            description="Let's dive deeper into your academic preferences"
          />

          <Card
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="sm"
          >
            <CardBody>
              <VStack spacing={8} align="stretch">
                <SurveyProgress
                  currentQuestion={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  progress={progress}
                  showQuestionNumber
                />

                <SurveyQuestion
                  question={currentQuestion}
                  value={answers[currentQuestion.id] || ""}
                  onChange={handleAnswer}
                />

                <Button
                  onClick={handleNext}
                  bg={buttonBg}
                  color={buttonColor}
                  size="lg"
                  width="full"
                  isLoading={isSubmitting}
                  loadingText="Submitting..."
                  rightIcon={<ArrowForwardIcon />}
                  _hover={{
                    bg: buttonHoverBg,
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s ease-in-out"
                  fontWeight="500"
                  letterSpacing="0.02em"
                >
                  {currentQuestionIndex === questions.length - 1
                    ? "Submit"
                    : "Next Question"}
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </PageLayout>
  );
}
