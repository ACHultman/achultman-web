import { Box, Container, Heading, Divider, SlideFade } from "@chakra-ui/react";
import Paragraph from "../components/Paragraph";
import Head from "next/head";
import BookCard from "../components/BookCard";
import Message from "../components/Message";
import { NextSeo } from "next-seo";

const Books = ({ books }) => {
  return (
    <div>
      <NextSeo
        title="Adam Hultman | Books"
        description="A list of my favorite tech books."
        openGraph={{
          title: "Adam Hultman | Books",
          description: "A list of my favorite tech books.",
          url: "https://hultman.tech/books",
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
          {books?.length === 0 ? (
            <Message />
          ) : (
            <Box
              w="100%"
              mt={10}
              mx="auto"
              sx={{ columnCount: [1, 2, 3], columnGap: "20px" }}
            >
              {books?.map((book) => (
                <BookCard book={book} key={book.name} />
              ))}
            </Box>
          )}
        </SlideFade>
      </Container>
    </div>
  );
};

export async function getStaticProps() {
  // let sortQuery = "sort[0][field]=order&sort[0][direction]=asc";

  // let res = await fetch(
  //   `${process.env.API_ENPOINT}${process.env.WEBSITE_BASE}/books?${sortQuery}`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${process.env.AIRETABLE_AUTH}`,
  //     },
  //   }
  // );

  // let data = await res.json();

  // if (data.error) {
  //   return {
  //     notFound: true,
  //   };
  // }

  // list of books
  const books = [
    {
      cover:
        "https://media.wiley.com/product_data/coverImage300/89/11197190/1119719089.jpg",
      name: "Kali Linux Penetration Testing Bible",
      note: "Your ultimate guide to pentesting with Kali Linux",
      rating: 5,
      link: "https://www.wiley.com/en-us/Kali+Linux+Penetration+Testing+Bible-p-9781119719076",
    },
  ];

  return {
    props: {
      books,
    },
    revalidate: 5,
  };
}

export default Books;
