"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  Text,
  useOutsideClick,
  useColorModeValue,
} from "@chakra-ui/react";

export interface Option {
  id: string;
  label: string;
  description?: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Search...",
  isDisabled = false,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const descriptionColor = useColorModeValue("gray.600", "gray.400");

  useOutsideClick({
    ref: ref as React.RefObject<HTMLElement>,
    handler: () => setIsOpen(false),
  });

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((option) => option.id === value);

  return (
    <Box ref={ref} position="relative">
      <Input
        value={selectedOption ? selectedOption.label : searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        isDisabled={isDisabled}
        borderColor={borderColor}
        _hover={{ borderColor: borderColor }}
        _focus={{ borderColor: borderColor, boxShadow: "none" }}
        bg={bgColor}
        color={textColor}
        fontSize="md"
        height="48px"
      />
      {isOpen && filteredOptions.length > 0 && (
        <List
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
          mt={1}
          maxH="300px"
          overflowY="auto"
          zIndex={1}
          boxShadow="sm"
        >
          {filteredOptions.map((option) => (
            <ListItem
              key={option.id}
              p={3}
              cursor="pointer"
              _hover={{ bg: hoverBg }}
              onClick={() => {
                onChange(option.id);
                setSearchTerm("");
                setIsOpen(false);
              }}
              transition="background-color 0.2s ease-in-out"
            >
              <Text fontWeight="500" color={textColor}>
                {option.label}
              </Text>
              {option.description && (
                <Text fontSize="sm" color={descriptionColor} mt={0.5}>
                  {option.description}
                </Text>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
