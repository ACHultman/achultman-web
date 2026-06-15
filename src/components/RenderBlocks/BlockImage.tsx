import { WithContentValidationProps } from '@9gustin/react-notion-render/dist/hoc/withContentValidation';
import { Image } from '@chakra-ui/react';

function BlockImage({ block }: WithContentValidationProps) {
    const src = block.content?.external?.url || block.content?.file?.url;

    // Guard against a malformed/deleted image block rendering a broken <img>.
    if (!src) {
        return null;
    }

    return (
        <Image
            src={src}
            alt={block.content?.caption?.[0]?.plain_text || ''}
            loading="lazy"
            borderRadius="md"
            my={4}
        />
    );
}

export default BlockImage;
