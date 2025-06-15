"use client";

import { useState, useEffect } from "react";
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
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";
import LearningPathHeader from "@/components/learning-path/LearningPathHeader";
import LearningPathStep from "@/components/learning-path/LearningPathStep";
import ErrorState from "@/components/learning-path/ErrorState";
import LoadingState from "@/components/learning-path/LoadingState";
import PageLayout from "@/components/PageLayout";
import { useLearningPath } from "@/hooks/useLearningPath";
import { GiSparkles } from "react-icons/gi";
import { PiSparkle } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi";

export default function LearningPath({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const router = useRouter();
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [viewedSteps, setViewedSteps] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const unwrappedParams = React.use(params);
  const { learningPath, isLoading, error, refetch } = useLearningPath(
    unwrappedParams.sessionId,
    debouncedSearchQuery
  );

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Refetch learning path when search query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      refetch();
    }
  }, [debouncedSearchQuery, refetch]);

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
  const showCompletionButton = viewedPercentage >= 60;

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
                {learningPath[selectedStep].professor_reviews &&
                  learningPath[selectedStep].professor_reviews.length > 0 && (
                    <Box mt={4}>
                      <Text fontWeight="medium" mb={2}>
                        Professor Reviews:
                      </Text>
                      <VStack align="stretch" spacing={3}>
                        {learningPath[selectedStep].professor_reviews.map(
                          (review, index) => (
                            <Box
                              key={index}
                              p={3}
                              bg="blue.50"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="blue.200"
                            >
                              <Text fontSize="sm">{review}</Text>
                            </Box>
                          )
                        )}
                      </VStack>
                    </Box>
                  )}
                <Button
                  mt={6}
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                  transition="all 0.2s"
                >
                  Enroll in this Course
                </Button>
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
      <Container maxW="container.md" mb={20}>
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

      <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        p={4}
        bg="white"
        boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
        zIndex={1000}
      >
        <Container maxW="container.md">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={HiSparkles} color="yellow.500" />
            </InputLeftElement>
            <Input
              placeholder="Dive deeper, refine your course search"
              bg="gray.50"
              borderWidth="1px"
              borderColor="gray.200"
              _hover={{ borderColor: "blue.300" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
              }}
              transition="all 0.2s"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Container>
      </Box>
    </PageLayout>
  );
}
