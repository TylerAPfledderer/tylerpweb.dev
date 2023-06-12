import { Box, Center, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <Center as="header">
        <Box maxW="container.lg" w="full" px={8} py={6}>
          <Text as="span" fontFamily="heading" fontSize="xl">
            TP
          </Text>
        </Box>
      </Center>
    </>
  );
}
