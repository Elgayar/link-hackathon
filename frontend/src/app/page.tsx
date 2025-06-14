"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  VStack,
  useToast,
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import UniversitySelectionForm from "@/components/UniversitySelectionForm";
import StudentTypeSelector from "@/components/StudentTypeSelector";
import PageLayout from "@/components/PageLayout";
import { useStartSession } from "@/hooks/useStartSession";

export default function Home() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<"type" | "school">("school");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [selectedMajor, setSelectedMajor] = useState<string>("");

  const { startSession, isLoading } = useStartSession();

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.900");

  const handleSchoolSelect = async () => {
    setStep("type");
  };

  const handleSubmit = async (type: string) => {
    if (!selectedUniversity || !selectedMajor) {
      toast({
        title: "Error",
        description: "Please select all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const result = await startSession({
        university_id: selectedUniversity,
        major_id: selectedMajor,
        student_type: type,
      });

      if (result) {
        router.push(`/survey/${result.session_id}/initial`);
      } else {
        throw new Error("Failed to start session");
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to start session",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const content =
    step === "type" ? (
      <VStack spacing={8} align="stretch">
        <Header
          title=""
          description="Let's find the perfect academic path for you"
        />
        <StudentTypeSelector onSelect={handleSubmit} />
      </VStack>
    ) : (
      <VStack spacing={8} align="stretch">
        <Header
          title="Let's LINK"
          description="Let's find the perfect academic path for you"
        />

        <Card
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="sm"
          _hover={{ transform: "translateY(-2px)", shadow: "md" }}
          transition="all 0.2s ease-in-out"
        >
          <CardBody>
            <VStack spacing={6} align="stretch">
              <StepIndicator currentStep={1} totalSteps={2} />

              <UniversitySelectionForm
                selectedUniversity={selectedUniversity}
                selectedMajor={selectedMajor}
                isLoading={isLoading}
                onUniversityChange={(value) => {
                  setSelectedUniversity(value);
                  setSelectedMajor("");
                }}
                onMajorChange={setSelectedMajor}
                onSubmit={handleSchoolSelect}
              />
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    );

  return (
    <PageLayout>
      <Container maxW="container.md">{content}</Container>
    </PageLayout>
  );
}
