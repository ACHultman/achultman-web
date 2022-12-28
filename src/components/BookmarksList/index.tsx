import { Flex } from "@chakra-ui/react"

import Message from "../Message"
import BookmarkCard from "./BookmarkCard"
import { Bookmark } from "./types"
import Tilt from "react-parallax-tilt"

const BookmarksList = ({ bookmarks }: { bookmarks: Bookmark[] }) => {
  // render Message component if bookmarks is empty, defaults to empty message
  if (bookmarks.length === 0) {
    return <Message />
  }

  return (
    <Flex
      wrap="wrap"
      direction={"row"}
      gap={4}
      w="100%"
      mt={10}
      mx="auto"
      sx={{ columnCount: [1, 2, 3], columnGap: "20px" }}
    >
      {bookmarks.map((bookmark, i) => (
        <Tilt key={`bookmark-${i}`}>
          <BookmarkCard bookmark={{ ...bookmark, id: i }} />
        </Tilt>
      ))}
    </Flex>
  )
}

export default BookmarksList
