import { useState } from 'react';
import {
    Box,
    Button,
    Center,
    Collapse,
    Heading,
    List,
    ListIcon,
    ListItem,
    SimpleGrid,
    useColorModeValue,
} from '@chakra-ui/react';
import { TbGraph } from 'react-icons/tb';
import {
    SiAmazonwebservices,
    SiAngular,
    SiCplusplus,
    SiDatadog,
    SiDocker,
    SiExpress,
    SiFigma,
    SiGit,
    SiGo,
    SiGooglecloud,
    SiGraphql,
    SiHtml5,
    SiJavascript,
    SiJest,
    SiLangchain,
    SiMysql,
    SiNextdotjs,
    SiNodedotjs,
    SiPhp,
    SiPlaywright,
    SiPostgresql,
    SiPython,
    SiReact,
    SiTypescript,
    SiVuedotjs,
} from 'react-icons/si';
import { FaEye, FaKey, FaRobot } from 'react-icons/fa';
import {
    MdArchitecture,
    MdDesignServices,
    MdNetworkPing,
    MdSecurity,
} from 'react-icons/md';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Paragraph from '../../Paragraph';

const skillData = [
    {
        title: 'Languages',
        skills: [
            { name: 'TypeScript', icon: SiTypescript },
            { name: 'JavaScript', icon: SiJavascript },
            { name: 'Python', icon: SiPython },
            { name: 'Go', icon: SiGo },
            { name: 'PHP', icon: SiPhp },
            { name: 'SQL', icon: SiPostgresql },
            { name: 'C++', icon: SiCplusplus },
            { name: 'HTML / CSS', icon: SiHtml5 },
        ],
    },
    {
        title: 'Frameworks',
        skills: [
            { name: 'React', icon: SiReact },
            { name: 'Next.js', icon: SiNextdotjs },
            { name: 'Node.js', icon: SiNodedotjs },
            { name: 'Express', icon: SiExpress },
            { name: 'Vue', icon: SiVuedotjs },
            { name: 'Angular', icon: SiAngular },
            { name: 'LangChain', icon: SiLangchain },
            { name: 'Playwright', icon: SiPlaywright },
            { name: 'Jest', icon: SiJest },
        ],
    },
    {
        title: 'Knowledge & Theory',
        skills: [
            { name: 'Cybersecurity', icon: MdSecurity },
            { name: 'Cryptography', icon: FaKey },
            { name: 'Machine Learning', icon: FaRobot },
            { name: 'Software Architecture', icon: MdArchitecture },
            { name: 'Computer Networking', icon: MdNetworkPing },
            { name: 'Algorithms & Data Structures', icon: TbGraph },
            { name: 'Computer Vision', icon: FaEye },
            { name: 'UI/UX Design', icon: MdDesignServices },
        ],
    },
    {
        title: 'Tools & Platforms',
        skills: [
            { name: 'AWS (Lambda, CDK, ECS)', icon: SiAmazonwebservices },
            { name: 'Docker', icon: SiDocker },
            { name: 'PostgreSQL', icon: SiPostgresql },
            { name: 'MySQL', icon: SiMysql },
            { name: 'GraphQL', icon: SiGraphql },
            { name: 'Google Cloud', icon: SiGooglecloud },
            { name: 'Git', icon: SiGit },
            { name: 'Datadog', icon: SiDatadog },
            { name: 'Figma', icon: SiFigma },
        ],
    },
];

function Skills() {
    const [show, setShow] = useState(false);
    const iconColor = useColorModeValue('green.800', 'green.200');
    const subtleColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <>
            <Heading size="lg" id="skills" pb={2}>
                Skills
            </Heading>
            <Paragraph mb={4} color={subtleColor}>
                Here&apos;s what I work with — and what I&apos;ve built deeply into.
            </Paragraph>
            <Collapse
                startingHeight={300}
                in={show}
                onClick={() => setShow(true)}
            >
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={10}>
                    {skillData.map((category) => (
                        <Box key={category.title}>
                            <Heading size="md" pb={4}>
                                {category.title}
                            </Heading>
                            <List spacing={3}>
                                {category.skills.map((skill) => (
                                    <ListItem key={skill.name}>
                                        <ListIcon
                                            as={skill.icon}
                                            color={iconColor}
                                            aria-hidden={true}
                                        />
                                        {skill.name}
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ))}
                </SimpleGrid>
            </Collapse>
            {!show && (
                <Center>
                    <Button
                        onClick={() => setShow(true)}
                        size="sm"
                        mt="1rem"
                        rightIcon={<ChevronDownIcon />}
                    >
                        Show full list
                    </Button>
                </Center>
            )}
        </>
    );
}

export default Skills;
