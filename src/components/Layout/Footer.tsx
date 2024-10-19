import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';

import {
    Box,
    ButtonGroup,
    Container,
    Divider,
    IconButton,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';

import Logo from '../Logo';

function Footer() {
    return (
        <Box
            as="footer"
            role="contentinfo"
            mx="auto"
            maxW="7xl"
            py="12"
            px={{ base: '4', md: '8' }}
        >
            <Container maxW="container.lg">
                <Stack
                    direction="row"
                    spacing="4"
                    align="center"
                    justify="space-between"
                    pb={5}
                >
                    <Logo />
                    <ButtonGroup variant="ghost">
                        <IconButton
                            as="a"
                            href="https://www.linkedin.com/in/adam-hultman/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Linkedin"
                            icon={<FaLinkedin fontSize="20px" />}
                        />
                        <IconButton
                            as="a"
                            href="https://www.github.com/achultman"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Github"
                            icon={<FaGithub fontSize="20px" />}
                        />
                    </ButtonGroup>
                </Stack>
                <Divider pt={2} />
                <Stack
                    direction="row"
                    align="center"
                    justify="space-between"
                    pt={5}
                >
                    <Text fontSize="md">
                        &copy; {new Date().getFullYear()} Adam Hultman
                    </Text>
                    <IconButton
                        as={Link}
                        rounded="md"
                        aria-label="Github Repo"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/achultman/achultman-web/"
                        isExternal
                        icon={<FaGithub fontSize="18px" />}
                    />
                </Stack>
            </Container>
        </Box>
    );
}

export default Footer;
