import { Box, Button, ButtonProps, Heading, SlideFade } from '@chakra-ui/react'

import Paragraph from '../Paragraph'
import { motion } from 'framer-motion'

export const MotionButton = motion<ButtonProps>(Button)

function Hero() {
    return (
        <SlideFade in={true} offsetY={-80}>
            <Box>
                <Heading
                    as="h1"
                    fontSize={{ base: '28px', md: '40px', lg: '48px' }}
                    mb={3}
                >
                    Hey, I’m Adam
                </Heading>
                <Paragraph fontSize="2xl" lineHeight={1.6}>
                    Full-stack Developer, Designer, Cybersecurity + ML
                    Enthusiast
                </Paragraph>
            </Box>
        </SlideFade>
    )
}

export default Hero
