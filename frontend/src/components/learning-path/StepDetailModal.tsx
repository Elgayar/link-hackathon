import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Box,
} from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";

interface StepDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: {
    title: string;
    description: string;
    estimated_time?: string;
    match_percentage?: number;
    public_reviews?: string[];
    professor_reviews?: string[];
  } | null;
}

export default function StepDetailModal({
  isOpen,
  onClose,
  step,
}: StepDetailModalProps) {
  if (!step) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{step.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>{step.description}</Text>
            {step.estimated_time && (
              <HStack>
                <Tag size="md" colorScheme="gray" variant="subtle">
                  <TagLeftIcon as={TimeIcon} />
                  <TagLabel>Estimated Time: {step.estimated_time}</TagLabel>
                </Tag>
              </HStack>
            )}
            {step.match_percentage && (
              <HStack>
                <Tag size="md" colorScheme="blue" variant="subtle">
                  <TagLabel>Match: {step.match_percentage}%</TagLabel>
                </Tag>
              </HStack>
            )}
            {step.public_reviews && step.public_reviews.length > 0 && (
              <Box mt={4}>
                <Text fontWeight="medium" mb={2}>
                  Reviews from other learners:
                </Text>
                <VStack align="stretch" spacing={3}>
                  {step.public_reviews.map((review, index) => (
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
                  ))}
                </VStack>
              </Box>
            )}
            {step.professor_reviews && step.professor_reviews.length > 0 && (
              <Box mt={4}>
                <Text fontWeight="medium" mb={2}>
                  Professor Reviews:
                </Text>
                <VStack align="stretch" spacing={3}>
                  {step.professor_reviews.map((review, index) => (
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
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
