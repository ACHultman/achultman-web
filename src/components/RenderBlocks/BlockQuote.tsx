import { WithContentValidationProps } from '@9gustin/react-notion-render/dist/hoc/withContentValidation';
import { Box, Text } from '@chakra-ui/react';

function BlockQuote({ block }: WithContentValidationProps) {
    return (
        <Box mb="1.5rem" ml="1.5rem">
            <Text as="blockquote" fontSize="xl" fontStyle="italic">
                {block.content.text.map((text) => text.plain_text).join('')}
            </Text>
        </Box>
    );
}

export default BlockQuote;
