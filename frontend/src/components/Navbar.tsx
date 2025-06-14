import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Container,
  Link,
} from "@chakra-ui/react";

export default function Navbar() {
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Box
      as="nav"
      position="fixed"
      w="100%"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex={10}
    >
      <Container maxW="container.xl">
        <Flex h="16" alignItems="center" justifyContent="space-between">
          <Text
            fontSize="xl"
            fontWeight="600"
            color={textColor}
            letterSpacing="-0.02em"
          >
            <Link textDecoration="none" href="/">
              LINK
            </Link>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
