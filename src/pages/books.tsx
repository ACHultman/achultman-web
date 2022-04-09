import {
  Box,
  Container,
  Heading,
  Divider,
  SlideFade,
  Flex,
} from "@chakra-ui/react";
import Paragraph from "../components/Paragraph";
import BookCard from "../components/BookCard";
import Message from "../components/Message";
import { NextSeo } from "next-seo";
export interface Book {
  cover: {
    src: string;
    alt: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
  name: string;
  note: string;
  link: string;
}

interface BooksProps {
  books: Book[];
}

const Books = ({ books }: BooksProps) => {
  return (
    <div>
      <NextSeo
        title="Adam Hultman | Books"
        description="A list of my favorite tech books."
        openGraph={{
          title: "Adam Hultman | Books",
          description: "A list of my favorite tech books.",
          url: "https://hultman.dev/books",
        }}
      />
      <Container maxW="container.lg" mt={10}>
        <SlideFade in={true} offsetY={80}>
          <Box>
            <Heading
              as="h1"
              fontSize={{ base: "24px", md: "30px", lg: "36px" }}
              mb={4}
            >
              Books
            </Heading>
            <Paragraph fontSize="xl" lineHeight={1.6}>
              A list of my favourite tech books.
            </Paragraph>
          </Box>
          <Divider my={10} />
        </SlideFade>
        <SlideFade in={true} offsetY={80} delay={0.2}>
          {!books || books.length === 0 ? (
            <Message />
          ) : (
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
          )}
        </SlideFade>
      </Container>
    </div>
  );
};

export async function getStaticProps() {
  // list of books
  const books: Book[] = [
    {
      cover: {
        src: "https://media.wiley.com/product_data/coverImage300/89/11197190/1119719089.jpg",
        alt: "Kali Linux Penetration Testing Bible",
        dimensions: {
          width: 300,
          height: 376,
        },
      },
      name: "Kali Linux Penetration Testing Bible",
      note: "Your ultimate guide to pentesting with Kali Linux",
      link: "https://www.wiley.com/en-us/Kali+Linux+Penetration+Testing+Bible-p-9781119719076",
    },
  ];

  return {
    props: {
      books,
    },
    revalidate: 3600,
  };
}

export default Books;
