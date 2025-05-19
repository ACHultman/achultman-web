import { Tag, Wrap, WrapItem, useColorModeValue } from '@chakra-ui/react';

interface Props {
    tags: string[];
    selectedTag: string | null;
    setSelectedTag: (tag: string | null) => void;
}

function BookmarkTags({ tags, selectedTag, setSelectedTag }: Props) {
    const activeBg = useColorModeValue('green.200', 'green.500');
    const inactiveBg = useColorModeValue('gray.200', 'gray.700');

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
