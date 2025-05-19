import { Heading, SlideFade, ListItem } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Year } from './Year';
import { TIMELINE } from 'src/constants/timeline';

export const MotionHeading = motion(Heading);
export const MotionListItem = motion(ListItem);

function Timeline() {
    return (
        <SlideFade in={true} offsetY={80} delay={0.2} suppressHydrationWarning>
            {Object.entries(TIMELINE)
                .reverse()
                .map(([year, entries]) => {
                    return <Year key={year} year={year} entries={entries} />;
                })}
        </SlideFade>
    );
}

export default Timeline;
