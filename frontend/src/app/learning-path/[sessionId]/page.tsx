"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Box,
  Container,
  VStack,
  useColorModeValue,
  Button,
  List,
  Text,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";
import LearningPathHeader from "@/components/learning-path/LearningPathHeader";
import LearningPathStep from "@/components/learning-path/LearningPathStep";
import ErrorState from "@/components/learning-path/ErrorState";
import LoadingState from "@/components/learning-path/LoadingState";
import PageLayout from "@/components/PageLayout";
import { useLearningPath } from "@/hooks/useLearningPath";

export default function LearningPath({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const router = useRouter();
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [viewedSteps, setViewedSteps] = useState<Set<number>>(new Set());

  const unwrappedParams = React.use(params);
  const { learningPath, isLoading, error } = useLearningPath(
    unwrappedParams.sessionId
  );

  const handleCardClick = (index: number) => {
    setSelectedStep(index);
    setViewedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const viewedPercentage = (viewedSteps.size / learningPath.length) * 100;
  const showCompletionButton = viewedPercentage >= 80;

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState error={error} onRetry={() => window.location.reload()} />
    );
  }

  const emptyRightPaneContent = [
    {
      title: "No step selected",
      content: <Text>Select a step to view details</Text>,
    },
  ];

  const rightPaneContent =
    selectedStep !== null
      ? [
          {
            title: learningPath[selectedStep].title,
            content: (
              <VStack spacing={4} align="stretch">
                <Text>{learningPath[selectedStep].description}</Text>
                {learningPath[selectedStep].estimated_time && (
                  <HStack>
                    <Tag size="md" colorScheme="gray" variant="subtle">
                      <TagLeftIcon as={TimeIcon} />
                      <TagLabel>
                        Estimated Time:{" "}
                        {learningPath[selectedStep].estimated_time}
                      </TagLabel>
                    </Tag>
                  </HStack>
                )}
                {learningPath[selectedStep].match_percentage && (
                  <HStack>
                    <Tag size="md" colorScheme="blue" variant="subtle">
                      <TagLabel>
                        Match: {learningPath[selectedStep].match_percentage}%
                      </TagLabel>
                    </Tag>
                  </HStack>
                )}
                {learningPath[selectedStep].public_reviews &&
                  learningPath[selectedStep].public_reviews.length > 0 && (
                    <Box mt={4}>
                      <Text fontWeight="medium" mb={2}>
                        Reviews from other learners:
                      </Text>
                      <VStack align="stretch" spacing={3}>
                        {learningPath[selectedStep].public_reviews.map(
                          (review, index) => (
                            <Box
                              key={index}
                              p={3}
                              bg="gray.50"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="gray.200"
                            >
                              <Text fontSize="sm">{review}</Text>
                            </Box>
                          )
                        )}
                      </VStack>
                    </Box>
                  )}
              </VStack>
            ),
          },
        ]
      : undefined;

  return (
    <PageLayout
      rightPane={rightPaneContent || emptyRightPaneContent}
      header={
        <LearningPathHeader
          title="Your Learning Path"
          description="Based on your survey responses, we've crafted a personalized journey to help you succeed in your academic goals."
        />
      }
    >
      <Container maxW="container.md">
        <VStack spacing={10} align="stretch">
          <List spacing={4}>
            {learningPath.map((step, index) => (
              <LearningPathStep
                key={index}
                step={step}
                index={index}
                isViewed={viewedSteps.has(index)}
                onClick={() => handleCardClick(index)}
                onDetailClick={() => handleCardClick(index)}
              />
            ))}
          </List>

          {showCompletionButton && (
            <Button
              colorScheme="green"
              size="lg"
              width="full"
              onClick={() => router.push("/")}
              _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
              transition="all 0.2s"
            >
              Your choices shaped it — here's what your college path could look
              like.{" "}
            </Button>
          )}
        </VStack>
      </Container>
    </PageLayout>
  );
}
