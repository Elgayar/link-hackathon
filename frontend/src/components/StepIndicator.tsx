import { HStack, Text, useColorModeValue } from "@chakra-ui/react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  const textColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("gray.800", "gray.200");

  return (
    <HStack spacing={2}>
      <Text
        color={textColor}
        fontSize="sm"
        fontWeight="500"
        letterSpacing="0.02em"
      >
        Step{" "}
        <Text as="span" color={accentColor}>
          {currentStep}
        </Text>{" "}
        of {totalSteps}
      </Text>
    </HStack>
  );
}
