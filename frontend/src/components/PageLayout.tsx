import {
  Box,
  Container,
  useColorModeValue,
  Flex,
  VStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import { ReactNode } from "react";

interface PageLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  rightPane?: {
    title: string;
    content: ReactNode;
  }[];
}

export default function PageLayout({
  header,
  children,
  sidebar,
  rightPane,
}: PageLayoutProps) {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const sidebarBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const infoBoxBg = useColorModeValue("white", "gray.800");

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar />
      <Box pt="16">
        <Container maxW="container.xl" py={8}>
          {header && <Box mb={8}>{header}</Box>}
          <Flex gap={8} flexDirection={{ base: "column", md: "row" }}>
            {sidebar && (
              <Box
                w="280px"
                flexShrink={0}
                bg={sidebarBg}
                borderRight="1px"
                borderColor={borderColor}
                p={6}
                position="sticky"
                top="88px"
                h="calc(100vh - 88px)"
                overflowY="auto"
              >
                {sidebar}
              </Box>
            )}
            <Box flex={1}>{children}</Box>
            {rightPane && (
              <Box
                w={{ base: "100%", md: "500px" }}
                flexShrink={0}
                position="sticky"
                h="calc(100vh - 88px)"
                overflowY="auto"
              >
                <VStack spacing={4} align="stretch">
                  {rightPane.map((info, index) => (
                    <Box
                      key={index}
                      bg={infoBoxBg}
                      p={4}
                      borderRadius="md"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <Heading size="sm" mb={2}>
                        {info.title}
                      </Heading>
                      {info.content}
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
