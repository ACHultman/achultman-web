import { Tag, Wrap, WrapItem } from '@chakra-ui/react';

const activeBg = 'green.600';
const inactiveBg = 'gray.600';

interface Props {
    tags: string[];
    selectedTag: string | null;
    setSelectedTag: (tag: string | null) => void;
}

function BookmarkTags({ tags, selectedTag, setSelectedTag }: Props) {
    return (
        <Wrap spacing={2} justify="center">
            <WrapItem>
                <Tag
                    size="lg"
                    variant="solid"
                    bg={!selectedTag ? activeBg : inactiveBg}
                    cursor="pointer"
                    onClick={() => setSelectedTag(null)}
                    style={{ transition: '.2s' }}
                >
                    All
                </Tag>
            </WrapItem>
            {tags.map((tag) => (
                <WrapItem key={tag}>
                    <Tag
                        size="lg"
                        variant="solid"
                        bg={selectedTag === tag ? activeBg : inactiveBg}
                        cursor="pointer"
                        onClick={() => setSelectedTag(tag)}
                        style={{ transition: '.2s' }}
                    >
                        {tag}
                    </Tag>
                </WrapItem>
            ))}
        </Wrap>
    );
}

export default BookmarkTags;
