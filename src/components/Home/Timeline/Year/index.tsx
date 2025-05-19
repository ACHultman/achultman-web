import { Box, VStack, List, Heading } from '@chakra-ui/react';
import { YearEntry } from './YearEntry';
import { TIMELINE } from 'src/constants/timeline';

type Year = keyof typeof TIMELINE;

interface Props {
    year: Year;
    entries: TimelineItem[];
}

export function Year({ year, entries }: Props) {
    return (
        <Box>
            <VStack>
                <Heading
                    suppressHydrationWarning
                    mt={10}
                    mb={5}
                    as="h2"
                    size="md"
                    borderBottom="2px"
                >
                    {year}
                </Heading>
                <List spacing={18} fontSize="18">
                    {entries.map((item, i) => (
                        <YearEntry
                            key={`timeline-${year}-item-${i}`}
                            item={item}
                        />
                    ))}
                </List>
            </VStack>
        </Box>
    );
}
