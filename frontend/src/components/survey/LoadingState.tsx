import {
  Box,
  Container,
  VStack,
  Skeleton,
  SkeletonText,
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import PageLayout from "../PageLayout";

export default function LoadingState() {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <PageLayout>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          {/* Header Skeleton */}
          <VStack spacing={4} align="center">
            <Skeleton height="40px" width="300px" />
            <SkeletonText noOfLines={2} spacing={4} width="80%" />
          </VStack>

          {/* Survey Card Skeleton */}
          <Card
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
          >
            <CardBody>
              <VStack spacing={8} align="stretch">
                {/* Progress Skeleton */}
                <Skeleton height="20px" width="100%" />

                {/* Question Skeleton */}
                <VStack spacing={4} align="stretch">
                  <Skeleton height="24px" width="80%" />
                  <SkeletonText noOfLines={2} spacing={2} />

                  {/* Options Skeleton */}
                  <VStack spacing={3} align="stretch">
                    {[1, 2, 3, 4].map((index) => (
                      <Skeleton key={index} height="48px" width="100%" />
                    ))}
                  </VStack>
                </VStack>

                {/* Button Skeleton */}
                <Skeleton height="48px" width="100%" />
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </PageLayout>
  );
}
