import {
  VStack,
  FormControl,
  FormLabel,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import SearchableDropdown from "./SearchableDropdown";
import { universities } from "@/data/universities";

interface UniversitySelectionFormProps {
  selectedUniversity: string;
  selectedMajor: string;
  isLoading: boolean;
  onUniversityChange: (value: string) => void;
  onMajorChange: (value: string) => void;
  onSubmit: () => void;
}

export default function UniversitySelectionForm({
  selectedUniversity,
  selectedMajor,
  isLoading,
  onUniversityChange,
  onMajorChange,
  onSubmit,
}: UniversitySelectionFormProps) {
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const buttonBg = useColorModeValue("gray.900", "white");
  const buttonColor = useColorModeValue("white", "gray.900");
  const buttonHoverBg = useColorModeValue("gray.800", "gray.100");

  const getAvailableMajors = () => {
    const university = universities.find((u) => u.id === selectedUniversity);
    if (!university) return [];

    return university.majors.map((major) => ({
      id: major.id,
      label: major.name,
      description: major.description,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <VStack spacing={6}>
        <FormControl isRequired>
          <FormLabel fontSize="md" color={labelColor} fontWeight="500">
            Select Your University
          </FormLabel>
          <SearchableDropdown
            options={universities.map((u) => ({
              id: u.id,
              label: u.name,
              description: u.location,
            }))}
            value={selectedUniversity}
            onChange={onUniversityChange}
            placeholder="Search for your university..."
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="md" color={labelColor} fontWeight="500">
            Select Your Major
          </FormLabel>
          <SearchableDropdown
            options={getAvailableMajors()}
            value={selectedMajor}
            onChange={onMajorChange}
            placeholder="Search for your major..."
            isDisabled={!selectedUniversity}
          />
        </FormControl>

        <Button
          type="submit"
          bg={buttonBg}
          color={buttonColor}
          size="lg"
          width="full"
          isLoading={isLoading}
          loadingText="Starting session..."
          rightIcon={<ArrowForwardIcon />}
          _hover={{
            bg: buttonHoverBg,
            transform: "translateY(-1px)",
          }}
          transition="all 0.2s ease-in-out"
          fontWeight="500"
          letterSpacing="0.02em"
        >
          Continue
        </Button>
      </VStack>
    </form>
  );
}
