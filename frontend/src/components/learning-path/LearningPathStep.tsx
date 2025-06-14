import {
  Box,
  Flex,
  Text,
  Badge,
  Icon,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { TimeIcon, CheckIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface LearningPathStepProps {
  step: {
    title: string;
    description: string;
    estimated_time?: string;
    match_percentage?: number;
    public_reviews?: string[];
  };
  index: number;
  isViewed: boolean;
  onClick: () => void;
  onDetailClick: () => void;
}

export default function LearningPathStep({
  step,
  index,
  isViewed,
  onClick,
  onDetailClick,
}: LearningPathStepProps) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={isViewed ? "green.300" : borderColor}
        borderRadius="lg"
        p={4}
        position="relative"
        cursor="pointer"
        onClick={onClick}
        _hover={{
          transform: "translateX(8px)",
          shadow: "md",
        }}
        transition="all 0.2s"
      >
        <Flex justify="space-between" align="center">
          <Flex direction="column" flex={1}>
            <HStack spacing={2} mb={2}>
              {step.match_percentage && (
                <Tag size="sm" colorScheme="blue" variant="subtle">
                  <TagLabel>{step.match_percentage}% Match</TagLabel>
                </Tag>
              )}
              {step.estimated_time && (
                <Tag size="sm" colorScheme="gray" variant="subtle">
                  <TagLeftIcon as={TimeIcon} />
                  <TagLabel>{step.estimated_time}</TagLabel>
                </Tag>
              )}
              {isViewed && <Icon as={CheckIcon} color="green.500" />}
            </HStack>
            <Text fontSize="lg" fontWeight="medium" mb={2}>
              {step.title}
            </Text>
          </Flex>
          <HStack spacing={4}>
            <Icon
              as={ChevronRightIcon}
              color="gray.400"
              onClick={(e) => {
                e.stopPropagation();
                onDetailClick();
              }}
              _hover={{ color: "blue.500" }}
              transition="color 0.2s"
            />
          </HStack>
        </Flex>
      </Box>
    </MotionBox>
  );
}
