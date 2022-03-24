import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Divider,
  SlideFade,
  Button,
  Stack,
} from "@chakra-ui/react";

import Paragraph from "../components/Paragraph";
import BookmarksList from "../components/BookmarksList";

export interface Bookmark {
  id?: number;
  title: string;
  domain: string;
  description: string;
  url: string;
  image: string;
  tags: string[];
}

const Bookmarks = ({ bookmarksData }: { bookmarksData: Bookmark[] }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const [activeTag, setActiveTag] = useState<string>();

  useEffect(() => {
    let filteredBookmark = bookmarksData.filter(
      (bookmark) => !activeTag || bookmark.tags.includes(activeTag)
    );
    setBookmarks(filteredBookmark);
  }, [activeTag]);

  // create list of all unique tags of bookmarksData
  const tags: string[] = bookmarksData.reduce((acc, bookmark) => {
    bookmark.tags.forEach((tag) => {
      if (!acc.includes(tag)) {
        acc.push(tag);
      }
    });
    return acc;
  }, []);

  return (
    <div>
      <Head>
        <title>Adam Hultman | Bookmarks</title>
      </Head>
      <main>
        <Container maxW="container.lg" mt={10}>
          <SlideFade in={true} offsetY={80}>
            <Box>
              <Heading
                as="h1"
                fontSize={{ base: "24px", md: "30px", lg: "36px" }}
                mb={4}
              >
                Bookmarks
              </Heading>
              <Paragraph fontSize="xl" lineHeight={1.6}>
                A list of my favorite articles & websites and tools.
              </Paragraph>
              <Paragraph fontSize="xs" mt={4}>
                Last updated: February 8th, 2022
              </Paragraph>
            </Box>
            <Divider my={10} />
          </SlideFade>
          <SlideFade in={true} offsetY={80} delay={0.2}>
            <Stack
              direction={["column", "row"]}
              gap={3}
              align="left"
              wrap={"wrap"}
            >
              {tags.map((tag) => (
                <Button
                  key={tag}
                  textTransform="capitalize"
                  isActive={activeTag === tag}
                  onClick={(e) =>
                    activeTag === tag ? setActiveTag(null) : setActiveTag(tag)
                  }
                  _active={{
                    bg: "green.500",
                  }}
                >
                  {tag}
                </Button>
              ))}
            </Stack>
            <BookmarksList bookmarks={bookmarks} />
          </SlideFade>
        </Container>
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const bookmarksData = [
    {
      title: "Testing Recipes – React",
      domain: "reactjs.org",
      description: "A JavaScript library for building user interfaces",
      url: "https://reactjs.org/docs/testing-recipes.html",
      image: "https://reactjs.org/logo-og.png",
      tags: ["react", "library", "testing", "web"],
    },
    {
      title: "Easing Functions Cheat Sheet",
      domain: "EASINGS.NET",
      description:
        "Easing functions specify the speed of animation to make the movement more natural. Real objects don’t just move at a constant speed, and do not start and stop in an instant. This page helps you choose the right easing function.",
      url: "https://easings.net/",
      image: "https://easings.net/192.c6b79276.png",
      tags: ["design", "animation", "css", "web"],
    },
    {
      title:
        "GitHub - mitesh77/Best-Flutter-UI-Templates: completely free for everyone. Its build-in Flutter Dart.",
      domain: "GITHUB.COM",
      description:
        "Completely free for everyone. Its build-in Flutter Dart. - GitHub - mitesh77/Best-Flutter-UI-Templates: completely free for everyone. Its build-in Flutter Dart.",
      url: "https://reactjs.org/docs/testing-recipes.html",
      image:
        "https://repository-images.githubusercontent.com/205812745/0de8a400-d662-11e9-8b88-ba362adb1830",
      tags: ["flutter", "UI", "dart"],
    },
    {
      title: "TensorFlow Object Detection with Home-Assistant",
      domain: "PROJECTS-RASPBERRY.COM",
      description:
        "Get started with TensorFlow object detection in your home automation projects using Home-Assistant. Introduction WARNING: there are currently issues with the Tensorflow integration in Home Assist",
      url: "https://reactjs.org/docs/testing-recipes.html",
      image:
        "https://projects-raspberry.com/wp-content/uploads/2020/05/TensorFlow-Object-Detection-with-Home-Assistant.jpg",
      tags: [
        "raspberry pi",
        "computer vision",
        "tensorflow",
        "machine learning",
      ],
    },
    {
      title:
        "Building a board game app with TensorFlow: a new TensorFlow Lite reference app",
      domain: "LOG.TENSORFLOW.ORG",
      description:
        "In this blog post, we will show you how to train a game agent using reinforcement learning using TensorFlow and TensorFlow Agents, and deploy it.",
      url: "https://reactjs.org/docs/testing-recipes.html",
      image:
        "https://blogger.googleusercontent.com/img/a/AVvXsEj7K9sQBJ8GVQcgPNGxsMGJmgCkoPaOxvbTJttSqn0kRxpRDhVSW7gPzr93vcDWOhZDY73YKOSG0_ERiJHwcw9T08EuwUvUXUAt7bFC8giFOu-Shl6FWnWmILajHGZ2K41XSzCtKNoiEpMCc2WnxGavNPac2Ua8T2iGemtud1NQ_pVfRutYVlzv6HZt=w1200-h630-p-k-no-nu",
      tags: ["tensorflow", "machine learning", "reinforcement learning"],
    },
  ];

  return {
    props: {
      bookmarksData,
    },
    revalidate: 5,
  };
}

export default Bookmarks;