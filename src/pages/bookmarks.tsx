import Head from 'next/head'
import { Box, Container, Heading, Divider, SlideFade } from '@chakra-ui/react'

import Paragraph from '@components/Paragraph'
import BookmarksList from '@components/BookmarksList'
import BookmarkTags from '@components/BookmarksList/BookmarkTags'
import { Bookmark, Tag } from '@components/BookmarksList/types'
import { useBookmarkTagFilter } from '@components/BookmarksList/useTagFilter'

const Bookmarks = ({ bookmarksData }: { bookmarksData: Bookmark[] }) => {
    const { bookmarks, activeTag, onTagClick } =
        useBookmarkTagFilter(bookmarksData)

    // dynamically create list of all unique tags
    // and sort resulting list alphabetically
    const tags: Tag[] = bookmarksData
        .reduce((acc, bookmark) => {
            bookmark.tags.forEach((tag) => {
                if (!acc.includes(tag)) {
                    acc.push(tag)
                }
            })
            return acc
        }, [])
        .sort()

    return (
        <>
            <Head>
                <title>Adam Hultman | Bookmarks</title>
            </Head>
            <Container maxW="container.lg">
                <SlideFade in={true} offsetY={80}>
                    <Box>
                        <Heading
                            as="h1"
                            fontSize={{ base: '24px', md: '30px', lg: '36px' }}
                            mb={4}
                        >
                            Bookmarks
                        </Heading>
                        <Paragraph fontSize="xl" lineHeight={1.6}>
                            My favorite articles, websites, and tools.
                        </Paragraph>
                        <Paragraph fontSize="xs" mt={4}>
                            Last updated: Decemmber 28th, 2022
                        </Paragraph>
                    </Box>
                    <Divider my={10} />
                </SlideFade>
                <SlideFade in={true} offsetY={80} delay={0.2}>
                    <BookmarkTags
                        tags={tags}
                        activeTag={activeTag}
                        onClick={onTagClick}
                    />
                    <BookmarksList bookmarks={bookmarks} />
                </SlideFade>
            </Container>
        </>
    )
}

export async function getStaticProps() {
    // list of bookmarks
    // defined here just for fun
    const bookmarksData = [
        {
            title: 'Vite',
            domain: 'VITEJS.DEV',
            description: "Next generation frontend tooling. It's fast!",
            url: 'https://vitejs.dev/',
            image: 'https://vitejs.dev/logo.svg',
            tags: ['vite', 'tooling', 'javascript'],
        },
        // GUN - decentralized database
        {
            title: 'GUN',
            domain: 'GUNDB.IO',
            description:
                'GUN is a decentralized, offline-first, graph database engine. It is a serverless, peer-to-peer, and distributed data storage solution.',
            url: 'https://gun.eco/',
            image: 'https://camo.githubusercontent.com/64213f411349db936a0fa36ef41741b170d4c8d34d1cc0d1c887f7d880838707/68747470733a2f2f636c6475702e636f6d2f5445793979476834356c2e737667',
            tags: ['database', 'decentralized'],
        },

        // hack the box - HTB
        {
            title: 'Hack The Box',
            domain: 'HACKTHEBOX.COM',
            description:
                'Hack The Box is an online platform allowing you to test your penetration testing skills and exchange ideas and methodologies with thousands of people in the security field.',
            url: 'https://www.hackthebox.com/',
            image: 'https://www.hackthebox.eu/images/logo-htb.svg',
            tags: ['hacking', 'pentesting', 'cybersecurity'],
        },
        // https://serverlessland.com/patterns
        {
            title: 'Serverless Patterns',
            domain: 'SERVERLESSLAND.COM',
            description:
                'A collection of serverless patterns and solutions for common use cases.',
            url: 'https://serverlessland.com/patterns',
            image: 'https://serverlessland.com/assets/images/serverlessLandNewLogo.png',
            tags: ['serverless', 'patterns', 'solutions'],
        },

        // cyberchef - online tool for data manipulation
        {
            title: 'CyberChef',
            domain: 'CYBERCHEF.BBC.CO.UK',
            description:
                'CyberChef is the all-in-one web app for encryption, encoding, compression and data analysis.',
            url: 'https://gchq.github.io/CyberChef/',
            image: 'https://www.gchq.gov.uk/images/CyberChef768x512.jpg?mpwidth=545&mlwidth=737&twidth=961&dwidth=635&dpr=1&width=864',
            tags: ['cybersecurity', 'tooling', 'encryption', 'encoding'],
        },
        // ibm q experience
        {
            title: 'IBM Quantum Experience',
            domain: 'QUANTUMCOMPUTING.IBM.COM',
            description:
                'IBM Quantum Experience is a cloud-based platform that allows you to run quantum algorithms on real quantum processors. You can also design and simulate your own quantum algorithms using our open-source SDKs.',
            url: 'https://quantum-computing.ibm.com/',
            image: 'https://i.ytimg.com/vi/LAA0-vjTaNY/maxresdefault.jpg',
            tags: ['quantum computing', 'ibm'],
        },
        // hue mint - color scheme generator
        {
            title: 'Hue Mint',
            domain: 'HUEMINT.COM',
            description:
                "Hue Mint is a color scheme generator that helps you create beautiful color palettes that work together well. It's free and easy to use.",
            url: 'https://www.huemint.com/',
            image: 'https://huemint.com/assets/img/logo-icon.svg',
            tags: ['color', 'color scheme', 'generator'],
        },
        {
            title: 'Testing Recipes – React',
            domain: 'reactjs.org',
            description: 'A JavaScript library for building user interfaces',
            url: 'https://reactjs.org/docs/testing-recipes.html',
            image: 'https://reactjs.org/logo-og.png',
            tags: ['react', 'library', 'testing'],
        },
        {
            title: 'Easing Functions Cheat Sheet',
            domain: 'EASINGS.NET',
            description:
                'Easing functions specify the speed of animation to make the movement more natural. Real objects don’t just move at a constant speed, and do not start and stop in an instant. This page helps you choose the right easing function.',
            url: 'https://easings.net/',
            image: 'https://easings.net/192.c6b79276.png',
            tags: ['animation', 'css'],
        },
    ]

    return {
        props: {
            bookmarksData,
        },
        revalidate: 3600,
    }
}

export default Bookmarks
