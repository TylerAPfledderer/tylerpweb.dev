import { VStack, StackProps } from "@chakra-ui/react";

export const MainSection = (props: StackProps) => (
  <VStack
    as="section"
    px={{ base: 8, lg: 16 }}
    py={{ base: 12, lg: 20 }}
    {...props}
  />
);
