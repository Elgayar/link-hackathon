import {
  Flex,
  HStack,
  Text,
  Icon,
  Tooltip,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

interface SurveyProgressProps {
  currentQuestion?: number;
  totalQuestions: number;
  progress: number;
  showQuestionNumber?: boolean;
}

export default function SurveyProgress({
  currentQuestion,
  totalQuestions,
  progress,
  showQuestionNumber = false,
}: SurveyProgressProps) {
  const textColor = useColorModeValue("gray.600", "gray.400");
  const progressBg = useColorModeValue("gray.100", "gray.700");
  const progressColor = useColorModeValue("gray.900", "white");

  return (
    <>
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          {showQuestionNumber ? (
            <Text
              fontSize="sm"
              color={textColor}
              fontWeight="500"
              letterSpacing="0.02em"
            >
              Question {currentQuestion} of {totalQuestions}
            </Text>
          ) : (
            <Text
              fontSize="sm"
              color={textColor}
              fontWeight="500"
              letterSpacing="0.02em"
            >
              {totalQuestions} Questions
            </Text>
          )}
        </HStack>
      </Flex>

      <Progress
        value={progress}
        size="sm"
        bg={progressBg}
        colorScheme="gray"
        borderRadius="full"
        mt={2}
      />
    </>
  );
}
