import { WithContentValidationProps } from '@9gustin/react-notion-render/dist/hoc/withContentValidation';
import { Box, Link } from '@chakra-ui/react';

function BlockBookmark({ block }: WithContentValidationProps) {
    if (!block.content?.url) {
        return null;
    }

    const caption =
        block.content.caption
            ?.map((text) => text.plain_text || '')
            .join('') || block.content.url;

    return (
        <Box mb="1.5rem">
            <Link href={block.content.url} isExternal color="green.500">
                {caption}
            </Link>
        </Box>
    );
}

export default BlockBookmark;