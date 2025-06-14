"use client";

import {
  Box,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  Icon,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CheckCircleIcon, StarIcon, TimeIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);

interface StudentTypeSelectorProps {
  onSelect: (type: string) => void;
}

const studentTypes = [
  {
    id: "first_year",
    title: "First Year Student",
    description: "I am starting my first year at university",
    icon: CheckCircleIcon,
  },
  {
    id: "junior_transfer",
    title: "Junior Student",
    description: "I am transferring to university as a junior",
    icon: TimeIcon,
  },
  {
    id: "typical",
    title: "Typical Student",
    description: "I am a continuing or existing student",
    icon: StarIcon,
  },
];

export default function StudentTypeSelector({
  onSelect,
}: StudentTypeSelectorProps) {
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const descriptionColor = useColorModeValue("gray.600", "gray.400");
  const iconColor = useColorModeValue("gray.700", "gray.300");

  return (
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
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {studentTypes.map((type, index) => (
              <MotionBox
                key={type.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => onSelect(type.id)}
                  _hover={{
                    transform: "translateY(-2px)",
                    borderColor: "gray.400",
                  }}
                  transition="all 0.2s ease-in-out"
                >
                  <CardBody>
                    <VStack spacing={4} align="center" textAlign="center">
                      <Icon as={type.icon} w={8} h={8} color={iconColor} />
                      <Heading size="md" color={textColor} fontWeight="600">
                        {type.title}
                      </Heading>
                      <Text
                        color={descriptionColor}
                        fontSize="sm"
                        lineHeight="1.6"
                      >
                        {type.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>

          <HStack spacing={3} justify="center" color={descriptionColor}>
            <Icon as={StarIcon} color={iconColor} />
            <Text fontSize="sm">
              Choose the option that best describes your current academic status
            </Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
