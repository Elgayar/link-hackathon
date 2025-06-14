import { Box, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface LearningPathHeaderProps {
  title: string;
  description: string;
}

export default function LearningPathHeader({
  title,
  description,
}: LearningPathHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Heading size="2xl" color="gray.800" mb={4} textAlign="center">
        {title}
      </Heading>
      <Text color="gray.600" fontSize="lg" textAlign="center" mx="auto">
        {description}
      </Text>
    </MotionBox>
  );
}
