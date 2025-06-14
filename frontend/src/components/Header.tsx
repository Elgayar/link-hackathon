import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface HeaderProps {
  title: string;
  description: string;
}

export default function Header({ title, description }: HeaderProps) {
  const textColor = useColorModeValue("gray.800", "gray.200");
  const descriptionColor = useColorModeValue("gray.600", "gray.400");

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Heading
        size="2xl"
        mb={3}
        color={textColor}
        fontWeight="600"
        textAlign="center"
        letterSpacing="-0.02em"
      >
        {title}
      </Heading>
      <Text
        color={descriptionColor}
        fontSize="lg"
        textAlign="center"
        maxW="2xl"
        mx="auto"
        lineHeight="1.6"
      >
        {description}
      </Text>
    </MotionBox>
  );
}
