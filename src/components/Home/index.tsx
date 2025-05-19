import { Divider, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const loading = () => (
    <div className="section-loading" style={{ minHeight: 120 }} />
);

const Hero = dynamic(() => import('./Hero'), {
    loading,
});
const Timeline = dynamic(() => import('./Timeline'), {
    loading,
});
const GitTimeline = dynamic(() => import('./GitTimeline'), {
    loading,
});
const Chat = dynamic(() => import('@components/Chat'), {
    ssr: false,
    loading,
});
const Skills = dynamic(() => import('./Skills'), {
    loading,
});
const Contact = dynamic(() => import('@components/Contact'), {
    loading,
});

function Home() {
    return (
        <>
            <Hero />
            <Divider className="divider" my={10} />
            <Chat />
            <Divider className="divider" my={10} />
            <Skills />
            <Divider className="divider" my={10} />
            <Flex justifyContent="center">
                <GitTimeline />
                <Timeline />
            </Flex>
            <Divider className="divider" my={10} />
            <section id="contact">
                <Contact />
            </section>
        </>
    );
}

export default Home;
