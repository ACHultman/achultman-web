import {
  Box,
  Heading,
  LinkOverlay,
  LinkBox,
  useColorModeValue,
  Tag,
  Flex,
  Image,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Bookmark } from "../../pages/bookmarks";

import Paragraph from "../Paragraph";

// TODO: Fix first bookmark render bug

const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      layout
    >
      <LinkBox h="100%" as="article">
        <Box
          h="100%"
          maxW={"400px"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          borderRadius={10}
          borderWidth="1px"
          transition=".5s"
          cursor="pointer"
          role="group"
          _hover={{
            borderColor: "green.300",
          }}
        >
          <VStack h="100%">
            <Image src={bookmark.image} alt="" h="auto" borderTopRadius={10} />
            <Flex
              flexDirection="column"
              alignItems="start"
              justifyContent="space-between"
              h="auto"
              p={4}
              gap={3}
            >
              <LinkOverlay href={bookmark.url} isExternal>
                <Heading as="h6" size="md" mb={2}>
                  {bookmark?.title}
                </Heading>
                <Paragraph fontSize="sm">{bookmark.description}</Paragraph>
              </LinkOverlay>
              <Flex wrap={"wrap"} gap={2}>
                {bookmark.tags.length > 0 &&
                  bookmark.tags.map((tag) => (
                    <Tag
                      key={`${bookmark.id}-${tag}`}
                      textTransform="capitalize"
                      p={2}
                    >
                      {tag}
                    </Tag>
                  ))}
              </Flex>
            </Flex>
          </VStack>
        </Box>
      </LinkBox>
    </motion.div>
  );
};

export default BookmarkCard;
