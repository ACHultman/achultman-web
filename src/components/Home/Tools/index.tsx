import { SimpleGrid, VStack } from '@chakra-ui/react';
import {
    SiChakraui,
    SiNextdotjs,
    SiNodedotjs,
    SiReact,
    SiTypescript,
    SiVercel,
} from 'react-icons/si';
import ToolCard from './ToolCard';
import SectionHeading from '@components/SectionHeading';

const tools = [
    { name: 'React', icon: SiReact, url: 'https://react.dev/' },
    { name: 'Next.js', icon: SiNextdotjs, url: 'https://nextjs.org/' },
    {
        name: 'TypeScript',
        icon: SiTypescript,
        url: 'https://www.typescriptlang.org/',
    },
    { name: 'Node.js', icon: SiNodedotjs, url: 'https://nodejs.org/' },
    { name: 'Chakra UI', icon: SiChakraui, url: 'https://chakra-ui.com/' },
    { name: 'Vercel', icon: SiVercel, url: 'https://vercel.com/' },
];

function Tools() {
    return (
        <VStack spacing={8} alignItems="stretch">
            <SectionHeading>Tools & Technologies</SectionHeading>
            <SimpleGrid
                columns={{ base: 2, md: 3 }}
                spacing={{ base: 4, md: 6 }}
            >
                {tools.map((tool, i) => (
                    <ToolCard
                        key={i}
                        name={tool.name}
                        icon={tool.icon} // Now passing the component itself
                        url={tool.url}
                    />
                ))}
            </SimpleGrid>
        </VStack>
    );
}

export default Tools;
