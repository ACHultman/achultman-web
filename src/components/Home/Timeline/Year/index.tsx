import { Box, VStack, List } from '@chakra-ui/react';
import { MotionHeading } from '..';
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
                <MotionHeading
                    mt={10}
                    mb={5}
                    as="h2"
                    size="md"
                    borderBottom="2px"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    {year}
                </MotionHeading>
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
