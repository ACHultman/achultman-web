import { Box } from '@chakra-ui/react';
import { Year } from './Year';
import { TIMELINE } from 'src/constants/timeline';

function Timeline() {
    return (
        <Box>
            {Object.entries(TIMELINE)
                .reverse()
                .map(([year, entries]) => {
                    return <Year key={year} year={year} entries={entries} />;
                })}
        </Box>
    );
}

export default Timeline;
