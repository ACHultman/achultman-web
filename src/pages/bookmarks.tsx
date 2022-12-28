import Head from "next/head"
import { Box, Container, Heading, Divider, SlideFade } from "@chakra-ui/react"

import Paragraph from "../components/Paragraph"
import BookmarksList from "../components/BookmarksList"
import BookmarkTags from "../components/BookmarksList/BookmarkTags"
import { Bookmark, Tag } from "../components/BookmarksList/types"
import { useBookmarkTagFilter } from "../components/BookmarksList/useTagFilter"

const Bookmarks = ({ bookmarksData }: { bookmarksData: Bookmark[] }) => {
  const { bookmarks, activeTag, onTagClick } =
    useBookmarkTagFilter(bookmarksData)

  // dynamically create list of all unique tags
  // and sort resulting list alphabetically
  const tags: Tag[] = bookmarksData
    .reduce((acc, bookmark) => {
      bookmark.tags.forEach((tag) => {
        if (!acc.includes(tag)) {
          acc.push(tag)
        }
      })
      return acc
    }, [])
    .sort()

  return (
    <>
      <Head>
        <title>Adam Hultman | Bookmarks</title>
      </Head>
      <Container maxW="container.lg">
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
          <BookmarkTags
            tags={tags}
            activeTag={activeTag}
            onClick={onTagClick}
          />
          <BookmarksList bookmarks={bookmarks} />
        </SlideFade>
      </Container>
    </>
  )
}

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
      url: "https://github.com/mitesh77/Best-Flutter-UI-Templates",
      image:
        "https://repository-images.githubusercontent.com/205812745/0de8a400-d662-11e9-8b88-ba362adb1830",
      tags: ["flutter", "UI", "dart"],
    },
    {
      title: "TensorFlow Object Detection with Home-Assistant",
      domain: "PROJECTS-RASPBERRY.COM",
      description:
        "Get started with TensorFlow object detection in your home automation projects using Home-Assistant. Introduction WARNING: there are currently issues with the Tensorflow integration in Home Assist",
      url: "https://projects-raspberry.com/tensorflow-object-detection-with-home-assistant/",
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
      domain: "BLOG.TENSORFLOW.ORG",
      description:
        "In this blog post, we will show you how to train a game agent using reinforcement learning using TensorFlow and TensorFlow Agents, and deploy it.",
      url: "https://blog.tensorflow.org/2021/10/building-board-game-app-with-tensorflow.html",
      image:
        "https://blogger.googleusercontent.com/img/a/AVvXsEj7K9sQBJ8GVQcgPNGxsMGJmgCkoPaOxvbTJttSqn0kRxpRDhVSW7gPzr93vcDWOhZDY73YKOSG0_ERiJHwcw9T08EuwUvUXUAt7bFC8giFOu-Shl6FWnWmILajHGZ2K41XSzCtKNoiEpMCc2WnxGavNPac2Ua8T2iGemtud1NQ_pVfRutYVlzv6HZt=w1200-h630-p-k-no-nu",
      tags: ["tensorflow", "machine learning", "reinforcement learning"],
    },
  ]

  return {
    props: {
      bookmarksData,
    },
    revalidate: 3600,
  }
}

export default Bookmarks
