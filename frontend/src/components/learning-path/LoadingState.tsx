import {
  Box,
  Container,
  VStack,
  Skeleton,
  SkeletonText,
  List,
  ListItem,
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

          {/* Learning Path Steps Skeleton */}
          <List spacing={4}>
            {[1, 2, 3, 4].map((index) => (
              <ListItem
                key={index}
                bg={bgColor}
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <VStack align="stretch" spacing={3}>
                  <Skeleton height="24px" width="60%" />
                  <SkeletonText noOfLines={2} spacing={2} />
                  <Skeleton height="20px" width="30%" />
                </VStack>
              </ListItem>
            ))}
          </List>
        </VStack>
      </Container>
    </PageLayout>
  );
}
