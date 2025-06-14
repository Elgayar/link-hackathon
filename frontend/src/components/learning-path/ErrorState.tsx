import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Box minH="100vh" py={20}>
      <Container maxW="container.md">
        <VStack spacing={8} align="center">
          <Heading size="xl" color="red.500">
            Oops!
          </Heading>
          <Text color="gray.600" fontSize="lg">
            {error}
          </Text>
          <Button
            colorScheme="gray"
            size="lg"
            onClick={onRetry}
            leftIcon={<Icon as={InfoIcon} />}
            _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
            transition="all 0.2s"
          >
            Try Again
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
