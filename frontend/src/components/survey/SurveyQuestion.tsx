import {
  Box,
  Text,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  useColorModeValue,
  Grid,
  Icon,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);

interface SurveyQuestionProps {
  question: {
    id: number;
    question: string;
    freeText: boolean;
    options?: string[];
  };
  value: string;
  onChange: (value: string) => void;
}

export default function SurveyQuestion({
  question,
  value,
  onChange,
}: SurveyQuestionProps) {
  const textColor = useColorModeValue("gray.800", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBorderColor = useColorModeValue("gray.400", "gray.500");
  const buttonBg = useColorModeValue("white", "gray.800");
  const buttonHoverBg = useColorModeValue("gray.50", "gray.700");
  const selectedButtonBg = useColorModeValue("gray.900", "white");
  const selectedButtonColor = useColorModeValue("white", "gray.900");
  const helperTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <FormControl>
        <VStack spacing={4} align="stretch">
          <HStack spacing={2}>
            <Text
              fontSize="sm"
              color={helperTextColor}
              fontWeight="500"
              letterSpacing="0.02em"
            >
              Question {question.id}
            </Text>
            {value && <Icon as={CheckCircleIcon} color="green.500" />}
          </HStack>

          <FormLabel fontSize="lg" color={textColor} fontWeight="500">
            {question.question}
          </FormLabel>

          {question.freeText ? (
            <>
              <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type your answer here..."
                size="lg"
                resize="vertical"
                minH="100px"
                borderRadius="md"
                borderColor={borderColor}
                _hover={{ borderColor: hoverBorderColor }}
                _focus={{
                  borderColor: hoverBorderColor,
                  boxShadow: "none",
                }}
                bg={buttonBg}
                color={textColor}
              />
              <FormHelperText color={helperTextColor}>
                Feel free to provide as much detail as you'd like
              </FormHelperText>
            </>
          ) : (
            <Grid templateColumns="repeat(1, 1fr)" gap={3}>
              {question.options?.map((option, optIndex) => (
                <MotionBox
                  key={optIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: optIndex * 0.1,
                  }}
                >
                  <Button
                    w="100%"
                    h="auto"
                    p={4}
                    variant="outline"
                    bg={value === option ? selectedButtonBg : buttonBg}
                    color={value === option ? selectedButtonColor : textColor}
                    borderColor={borderColor}
                    onClick={() => onChange(option)}
                    justifyContent="flex-start"
                    textAlign="left"
                    whiteSpace="normal"
                    _hover={{
                      bg: value === option ? selectedButtonBg : buttonHoverBg,
                      borderColor: hoverBorderColor,
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s ease-in-out"
                    fontWeight="normal"
                  >
                    {option}
                  </Button>
                </MotionBox>
              ))}
            </Grid>
          )}
        </VStack>
      </FormControl>
    </MotionBox>
  );
}
