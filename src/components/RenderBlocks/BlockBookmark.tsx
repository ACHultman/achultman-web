import { WithContentValidationProps } from '@9gustin/react-notion-render/dist/hoc/withContentValidation';
import { Box, Link, useColorModeValue } from '@chakra-ui/react';

function BlockBookmark({ block }: WithContentValidationProps) {
    const linkColor = useColorModeValue('green.700', 'green.400');

    if (!block.content?.url) {
        return null;
    }

    const caption =
        block.content.caption?.map((text) => text.plain_text || '').join('') ||
        block.content.url;

    return (
        <Box mb="1.5rem">
            <Link href={block.content.url} isExternal color={linkColor}>
                {caption}
            </Link>
        </Box>
    );
}

export default BlockBookmark;
