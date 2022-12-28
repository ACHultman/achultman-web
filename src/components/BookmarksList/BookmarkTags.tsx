import { Button, Flex, VStack } from "@chakra-ui/react"
import { Tag } from "./types"
import { useState } from "react"

const BookmarkTags = ({
  tags,
  activeTag,
  onClick,
}: {
  tags: Tag[]
  activeTag: Tag
  onClick: (tag: Tag) => void
}) => {
  // add expand button to show all tags if more than 5

  const [showAllTags, setShowAllTags] = useState(false)

  return (
    <VStack gap={4}>
      <Flex gap={3} align="left" wrap={"wrap"}>
        {tags.slice(0, showAllTags ? tags.length : 5).map((tag, i) => {
          return (
            <Button
              w="fit-content"
              key={tag}
              textTransform="capitalize"
              isActive={activeTag === tag}
              onClick={() => onClick(tag)}
              _active={{
                bg: "green.500",
              }}
            >
              {tag}
            </Button>
          )
        })}
      </Flex>
      <Button
        w="100%"
        onClick={() => setShowAllTags(!showAllTags)}
        variant="outline"
      >
        {`Show ${showAllTags ? "less" : "more"}`}
      </Button>
    </VStack>
  )
}

export default BookmarkTags
