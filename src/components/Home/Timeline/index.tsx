import { Heading, SlideFade, ListItem } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Year } from './Year'
import { TIMELINE } from './data'

export const MotionHeading = motion(Heading)
export const MotionListItem = motion(ListItem)

function Timeline() {
    return (
        <SlideFade in={true} offsetY={80} delay={0.2}>
            {Object.keys(TIMELINE)
                .reverse()
                .map((y) => {
                    return <Year key={y} yearString={y} />
                })}
        </SlideFade>
    )
}

export default Timeline
