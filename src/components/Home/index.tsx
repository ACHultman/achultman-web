import { Divider, Flex } from '@chakra-ui/react';
import { useState } from 'react';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('./Hero'));
const Timeline = dynamic(() => import('./Timeline'));
const GitTimeline = dynamic(() => import('./GitTimeline'));
const Chat = dynamic(() => import('@components/Chat'), { ssr: false });
const Skills = dynamic(() => import('./Skills'));
const Contact = dynamic(() => import('@components/Contact'));
import LazySection from './LazySection';

function Home() {
    const [heroLoaded, setHeroLoaded] = useState(false);
    const [chatLoaded, setChatLoaded] = useState(false);
    const [skillsLoaded, setSkillsLoaded] = useState(false);
    const [gitTimelineLoaded, setGitTimelineLoaded] = useState(false);
    const [timelineLoaded, setTimelineLoaded] = useState(false);
    const [contactLoaded, setContactLoaded] = useState(false);

    return (
        <>
            <LazySection onLoaded={() => setHeroLoaded(true)}>
                <Hero />
            </LazySection>
            {heroLoaded && chatLoaded && <Divider my={10} />}
            <LazySection onLoaded={() => setChatLoaded(true)}>
                <Chat />
            </LazySection>
            {chatLoaded && skillsLoaded && <Divider my={10} />}
            <LazySection onLoaded={() => setSkillsLoaded(true)}>
                <Skills />
            </LazySection>
            {skillsLoaded && gitTimelineLoaded && timelineLoaded && (
                <Divider my={10} />
            )}
            <Flex justifyContent="center">
                <LazySection onLoaded={() => setGitTimelineLoaded(true)}>
                    <GitTimeline />
                </LazySection>
                <LazySection onLoaded={() => setTimelineLoaded(true)}>
                    <Timeline />
                </LazySection>
            </Flex>
            {timelineLoaded && contactLoaded && <Divider my={10} />}
            <section id="contact">
                <LazySection onLoaded={() => setContactLoaded(true)}>
                    <Contact />
                </LazySection>
            </section>
        </>
    );
}

export default Home;
