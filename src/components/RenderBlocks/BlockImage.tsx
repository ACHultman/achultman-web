import { WithContentValidationProps } from '@9gustin/react-notion-render/dist/hoc/withContentValidation';
import { Image } from '@chakra-ui/react';

function BlockImage({ block }: WithContentValidationProps) {
    return (
        <Image
            src={block.content.external?.url || block.content.file?.url || ''}
            alt={block.content.caption[0]?.plain_text || ''}
        />
    );
}

export default BlockImage;
