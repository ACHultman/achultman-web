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
} from '@chakra-ui/react';
import { TbAssembly, TbBrandReactNative, TbCpu, TbGraph } from 'react-icons/tb';
import {
    SiAmazonwebservices,
    SiAngular,
    SiApollographql,
    SiAzuredevops,
    SiCloudflare,
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
    SiMicrosoftazure,
    SiMongodb,
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
    SiWordpress,
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

function Skills() {
    const [show, setShow] = useState(false);

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
                    <Box>
                        <Heading size="md" pb={4}>
                            Languages
                        </Heading>
                        <List spacing={3}>
                            <ListItem>
                                <ListIcon as={SiTypescript} color="green.500" />
                                Typescript
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiJavascript} color="green.500" />
                                JavaScript
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiHtml5} color="green.500" />
                                HTML
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiCss3} color="green.500" />
                                CSS
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiPhp} color="green.500" />
                                PHP
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiPython} color="green.500" />
                                Python
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiGo} color="green.500" />
                                Go
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiCplusplus} color="green.500" />
                                C++
                            </ListItem>
                            <ListItem>
                                <ListIcon as={FaJava} color="green.500" />
                                Java
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiDart} color="green.500" />
                                Dart
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiKotlin} color="green.500" />
                                Kotlin
                            </ListItem>
                            <ListItem>
                                <ListIcon as={TbAssembly} color="green.500" />
                                Assembly
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={SiVisualbasic}
                                    color="green.500"
                                />
                                Visual Basic
                            </ListItem>
                        </List>
                    </Box>
                    <Box>
                        <Heading size="md" pb={4}>
                            Libs. & Frameworks
                        </Heading>
                        <List spacing={3}>
                            <ListItem>
                                <ListIcon as={SiReact} color="green.500" />
                                React
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiNextdotjs} color="green.500" />
                                Next.js
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiNodedotjs} color="green.500" />
                                Node.js
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiExpress} color="green.500" />
                                Express
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiVuedotjs} color="green.500" />
                                Vue
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiAngular} color="green.500" />
                                Angular
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiSpring} color="green.500" />
                                Spring
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={TbBrandReactNative}
                                    color="green.500"
                                />
                                React Native
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiLangchain} color="green.500" />
                                Langchain
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={SiApollographql}
                                    color="green.500"
                                />
                                Apollo
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiPlaywright} color="green.500" />
                                Playwright
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiJest} color="green.500" />
                                Jest
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiTensorflow} color="green.500" />
                                Tensorflow
                            </ListItem>
                        </List>
                    </Box>

                    <Box>
                        <Heading size="md" pb={4}>
                            Coursework
                        </Heading>
                        <List spacing={3}>
                            <ListItem>
                                <ListIcon as={TbCpu} color="green.500" />
                                RTOS
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={MdDesignServices}
                                    color="green.500"
                                />
                                UI/UX Design
                            </ListItem>
                            <ListItem>
                                <ListIcon as={FaKey} color="green.500" />
                                Cryptography
                            </ListItem>
                            <ListItem>
                                <ListIcon as={MdSecurity} color="green.500" />
                                Cybersecurity
                            </ListItem>
                            <ListItem>
                                <ListIcon as={FaEye} color="green.500" />
                                Computer Vision
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaClipboardList}
                                    color="green.500"
                                />
                                Software Testing
                            </ListItem>
                            <ListItem>
                                <ListIcon as={FaRobot} color="green.500" />
                                Machine Learning
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={SiDwavesystems}
                                    color="green.500"
                                />
                                Quantum Algorithms
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={MdNetworkPing}
                                    color="green.500"
                                />
                                Computer Networking
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={MdArchitecture}
                                    color="green.500"
                                />
                                Software Architecture
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaClipboardCheck}
                                    color="green.500"
                                />
                                Requirements Engineering
                            </ListItem>
                            <ListItem>
                                <ListIcon as={TbGraph} color="green.500" />
                                Algorithms & Datastructures
                            </ListItem>
                        </List>
                    </Box>
                    <Box>
                        <Heading size="md" pb={4}>
                            Tools
                        </Heading>
                        <List spacing={3}>
                            <ListItem>
                                <ListIcon as={SiGit} color="green.500" />
                                Git
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiDocker} color="green.500" />
                                Docker
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiMysql} color="green.500" />
                                MySQL
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiMongodb} color="green.500" />
                                MongoDB
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiPostgresql} color="green.500" />
                                PostgreSQL
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiFigma} color="green.500" />
                                Figma
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiDatadog} color="green.500" />
                                Datadog
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiWordpress} color="green.500" />
                                WordPress
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiGraphql} color="green.500" />
                                GraphQL
                            </ListItem>
                            <ListItem>
                                <ListIcon as={SiCloudflare} color="green.500" />
                                Cloudflare
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={SiAmazonwebservices}
                                    color="green.500"
                                />
                                AWS
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={SiMicrosoftazure}
                                    color="green.500"
                                />
                                Azure
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={SiAzuredevops}
                                    color="green.500"
                                />
                                Azure Devops
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={SiGooglecloud}
                                    color="green.500"
                                />
                                Google Cloud Platform
                            </ListItem>
                        </List>
                    </Box>
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
