import { Flex } from "@chakra-ui/react";

import BookCard from "./BookCard";
import { Book } from "./types";

const BookList = ({ books }: { books: Book[] }) => {
  return (
    <Flex
      w="100%"
      mt={10}
      mx="auto"
      sx={{ columnCount: [1, 2, 3], columnGap: "20px" }}
      wrap={"wrap"}
    >
      {books.map((book) => (
        <BookCard book={book} key={`book-${book.name}`} />
      ))}
    </Flex>
  );
};

export default BookList;
