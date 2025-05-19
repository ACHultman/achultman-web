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
import { TbAssembly, TbBrandReactNative, TbCpu, TbGraph } from 'react-icons/tb';
import {
    SiAmazonwebservices,
    SiAngular,
    SiApollographql,
    SiCplusplus,
    SiCss3,
    SiDart,
    SiDatadog,
    SiDocker,
    SiDwavesystems,
    SiExpress,
    SiFigma,
    SiGit,
    SiGo,
    SiGooglecloud,
    SiGraphql,
    SiHtml5,
    SiJavascript,
    SiJest,
    SiKotlin,
    SiLangchain,
    SiMysql,
    SiNextdotjs,
    SiNodedotjs,
    SiPhp,
    SiPlaywright,
    SiPostgresql,
    SiPython,
    SiReact,
    SiSpring,
    SiTensorflow,
    SiTypescript,
    SiVisualbasic,
    SiVuedotjs,
} from 'react-icons/si';
import {
    FaClipboardCheck,
    FaClipboardList,
    FaEye,
    FaJava,
    FaKey,
    FaRobot,
} from 'react-icons/fa';
import {
    MdArchitecture,
    MdDesignServices,
    MdNetworkPing,
    MdSecurity,
} from 'react-icons/md';
import { ArrowDownIcon } from '@chakra-ui/icons';

const skillData = [
    {
        title: 'Languages',
        skills: [
            { name: 'Typescript', icon: SiTypescript },
            { name: 'JavaScript', icon: SiJavascript },
            { name: 'HTML', icon: SiHtml5 },
            { name: 'CSS', icon: SiCss3 },
            { name: 'PHP', icon: SiPhp },
            { name: 'Python', icon: SiPython },
            { name: 'Go', icon: SiGo },
            { name: 'C++', icon: SiCplusplus },
            { name: 'Java', icon: FaJava },
            { name: 'Dart', icon: SiDart },
            { name: 'Kotlin', icon: SiKotlin },
            { name: 'Assembly', icon: TbAssembly },
            { name: 'Visual Basic', icon: SiVisualbasic },
        ],
    },
    {
        title: 'Libs. & Frameworks',
        skills: [
            { name: 'React', icon: SiReact },
            { name: 'Next.js', icon: SiNextdotjs },
            { name: 'Node.js', icon: SiNodedotjs },
            { name: 'Express', icon: SiExpress },
            { name: 'Vue', icon: SiVuedotjs },
            { name: 'Angular', icon: SiAngular },
            { name: 'Spring', icon: SiSpring },
            { name: 'React Native', icon: TbBrandReactNative },
            { name: 'Langchain', icon: SiLangchain },
            { name: 'Apollo', icon: SiApollographql },
            { name: 'Playwright', icon: SiPlaywright },
            { name: 'Jest', icon: SiJest },
            { name: 'Tensorflow', icon: SiTensorflow },
        ],
    },
    {
        title: 'Coursework',
        skills: [
            { name: 'RTOS', icon: TbCpu },
            { name: 'UI/UX Design', icon: MdDesignServices },
            { name: 'Cryptography', icon: FaKey },
            { name: 'Cybersecurity', icon: MdSecurity },
            { name: 'Computer Vision', icon: FaEye },
            { name: 'Software Testing', icon: FaClipboardList },
            { name: 'Machine Learning', icon: FaRobot },
            { name: 'Quantum Algorithms', icon: SiDwavesystems },
            { name: 'Computer Networking', icon: MdNetworkPing },
            { name: 'Software Architecture', icon: MdArchitecture },
            { name: 'Requirements Engineering', icon: FaClipboardCheck },
            { name: 'Algorithms & Datastructures', icon: TbGraph },
        ],
    },
    {
        title: 'Tools',
        skills: [
            { name: 'Git', icon: SiGit },
            { name: 'Docker', icon: SiDocker },
            { name: 'MySQL', icon: SiMysql },
            { name: 'PostgreSQL', icon: SiPostgresql },
            { name: 'Figma', icon: SiFigma },
            { name: 'Datadog', icon: SiDatadog },
            { name: 'GraphQL', icon: SiGraphql },
            { name: 'Google Cloud Platform', icon: SiGooglecloud },
            { name: 'AWS', icon: SiAmazonwebservices },
            { name: 'AWS Lambda', icon: SiAmazonwebservices },
            { name: 'AWS CDK', icon: SiAmazonwebservices },
            { name: 'Amazon ECS', icon: SiAmazonwebservices },
        ],
    },
];

function Skills() {
    const [show, setShow] = useState(false);
    const iconColor = useColorModeValue('green.800', 'green.200');

    return (
        <>
            <Heading size="lg" id="skills" pb={4}>
                Skills
            </Heading>
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
                        rightIcon={<ArrowDownIcon />}
                    >
                        Show More
                    </Button>
                </Center>
            )}
        </>
    );
}

export default Skills;
