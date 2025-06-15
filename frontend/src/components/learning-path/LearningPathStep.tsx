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
        borderRadius="md"
        p={3}
        position="relative"
        cursor="pointer"
        onClick={onClick}
        _hover={{
          transform: "translateX(4px)",
          shadow: "sm",
        }}
        transition="all 0.2s"
      >
        <Flex justify="space-between" align="center" gap={2}>
          <Flex direction="column" flex={1} gap={1}>
            <HStack spacing={2}>
              {step.match_percentage && (
                <Tag size="sm" colorScheme="blue" variant="subtle" px={2}>
                  <TagLabel>{step.match_percentage}% Match</TagLabel>
                </Tag>
              )}
              {step.estimated_time && (
                <Tag size="sm" colorScheme="gray" variant="subtle" px={2}>
                  <TagLeftIcon as={TimeIcon} />
                  <TagLabel>{step.estimated_time}</TagLabel>
                </Tag>
              )}
              {isViewed && (
                <Icon as={CheckIcon} color="green.500" boxSize={4} />
              )}
            </HStack>
            <Text fontSize="md" fontWeight="medium" noOfLines={1}>
              {step.title}
            </Text>
          </Flex>
          <Icon
            as={ChevronRightIcon}
            color="gray.400"
            onClick={(e) => {
              e.stopPropagation();
              onDetailClick();
            }}
            _hover={{ color: "blue.500" }}
            transition="color 0.2s"
            boxSize={5}
          />
        </Flex>
      </Box>
    </MotionBox>
  );
}
