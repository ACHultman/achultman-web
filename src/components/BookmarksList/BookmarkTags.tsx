import { Stack, Button } from "@chakra-ui/react";
import { Tag } from "./types";

const BookmarkTags = ({
  tags,
  activeTag,
  onClick,
}: {
  tags: Tag[];
  activeTag: Tag;
  onClick: (tag: Tag) => void;
}) => {
  return (
    <Stack direction={["column", "row"]} gap={3} align="left" wrap={"wrap"}>
      {tags.map((tag) => (
        <Button
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
      ))}
    </Stack>
  );
};

export default BookmarkTags;
