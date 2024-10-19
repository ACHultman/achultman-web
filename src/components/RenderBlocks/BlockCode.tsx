import { WithContentValidationProps } from '@9gustin/react-notion-render/dist/hoc/withContentValidation';
import { Box } from '@chakra-ui/react';
import { CopyBlock, dracula } from 'react-code-blocks';

function BlockCode({ block }: WithContentValidationProps) {
    return (
        <Box mb="1.5rem">
            <CopyBlock
                text={block.content.text
                    .map((text) => text.plain_text)
                    .join('\n')}
                language={block.content.language}
                theme={dracula}
                showLineNumbers
                codeBlock
            />
        </Box>
    );
}

export default BlockCode;
