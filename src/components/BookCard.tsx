import {
  Box,
  Heading,
  LinkOverlay,
  LinkBox,
  useColorModeValue,
  Tag,
  Text,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import Paragraph from "./Paragraph";
import { motion } from "framer-motion";
import Image from "next/image";

const BookCard = ({ book }) => {
  if (!book) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <LinkBox as="article">
        <Box
          w="100%"
          p={4}
          mb={5}
          d="inline-block"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          borderRadius={5}
          borderWidth="1px"
          transition=".5s"
          cursor="pointer"
          role="group"
          _hover={{
            borderColor: "green.300",
          }}
        >
          <Box
            d="flex"
            flexDirection="column"
            alignItems="start"
            justifyContent="space-between"
          >
            <Box position="relative" width="100%" height="400px" mb={4}>
              <Image
                src={book.cover}
                layout="fill"
                objectFit="cover"
                quality={100}
                alt={book.name}
              />
            </Box>
            <LinkOverlay href={book.url} isExternal>
              <Heading as="h6" size="md">
                {book.name}
              </Heading>
              <Paragraph mt={1} fontSize="sm">
                {book.note}
              </Paragraph>
            </LinkOverlay>
            <Tag mt={5} textTransform="uppercase" bg="transparent">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    color={i < book.rating ? "teal.500" : "gray.300"}
                  />
                ))}
              <Text ml={2} color="gray.500">
                {book.rating}
              </Text>
            </Tag>
          </Box>
        </Box>
      </LinkBox>
    </motion.div>
  );
};

export default BookCard;
