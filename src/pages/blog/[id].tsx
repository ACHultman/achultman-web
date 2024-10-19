import '@9gustin/react-notion-render/dist/index.css';

import { Roboto } from 'next/font/google';
import { Render } from '@9gustin/react-notion-render';
import {
    Box,
    Container,
    Heading,
    Text,
    Image,
    Divider,
    Spinner,
    Stack,
    Tag,
    Alert,
    Center,
    VStack,
    Button,
    AlertIcon,
} from '@chakra-ui/react';
import { WithContentValidationProps } from '@9gustin/react-notion-render/dist/hoc/withContentValidation';
import { CodeBlock, CopyBlock, dracula } from 'react-code-blocks';
import Link from 'next/link';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import Head from 'next/head';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

function BlogPost({ post }) {
    if (!post) {
        return (
            <Container maxW="container.md">
                <Center>
                    <VStack textAlign="center" spacing={8}>
                        <Alert status="error">
                            <AlertIcon />
                            Sorry, this post could not be found. Please try
                            again later.
                        </Alert>
                        <Link href="/blog">
                            <Button leftIcon={<ArrowLeftIcon />}>
                                Back to blog
                            </Button>
                        </Link>
                    </VStack>
                </Center>
            </Container>
        );
    }

    const { page, blocks } = post;

    console.log({
        page,
    });

    return (
        <>
            <Head>
                <title>{page.title} | Hultman Dev</title>
                <meta
                    name="description"
                    content={
                        page.description ||
                        'A brief description of the blog post'
                    }
                />
                <meta name="author" content={page.author || 'Author Name'} />
                <meta property="og:title" content={page.title} />
                <meta
                    property="og:description"
                    content={
                        page.description ||
                        'A brief description of the blog post'
                    }
                />
                <meta property="og:type" content="article" />
                <meta
                    property="og:image"
                    content={page.coverImage || 'default-image-url.jpg'}
                />
            </Head>
            <Container maxW="container.md" className={roboto.className}>
                <Box>
                    <Heading
                        as="h1"
                        fontSize={{ base: '28px', md: '32px', lg: '36px' }}
                        mb={4}
                    >
                        {page.title}
                    </Heading>
                    <Text
                        as="time"
                        dateTime={page.publishedDate}
                        color="gray.500"
                        mb={2}
                    >
                        {page.publishedDate
                            ? page.publishedDate
                            : 'Unpublished'}
                    </Text>
                    <Text color="gray.500" mb={4}>
                        By Adam Hultman
                    </Text>
                    <Stack wrap="wrap" direction="row" spacing={2} mb={4}>
                        {page.tags.map((tag) => (
                            <Tag key={tag} colorScheme="green">
                                {tag}
                            </Tag>
                        ))}
                    </Stack>
                    {page.coverImage && (
                        <Image
                            src={page.coverImage}
                            alt={page.title}
                            width="100%"
                            height={400}
                            objectFit="cover"
                            mb={6}
                        />
                    )}
                    <Divider my={6} />
                    <Render
                        blocks={blocks.results}
                        useStyles
                        emptyBlocks
                        blockComponentsMapper={{
                            image: BlockImage,
                            code: BlockCode,
                            quote: BlockQuote,
                        }}
                    />
                </Box>
            </Container>
        </>
    );
}

function BlockImage({ block }: WithContentValidationProps) {
    console.log({ block });
    return (
        <Image
            src={block.content.external.url}
            alt={block.content.caption[0].plain_text ?? ''}
        />
    );
}

function BlockCode({ block }: WithContentValidationProps) {
    console.log({ codeBLock: block });
    return (
        <Box mb="1.5rem">
            <CopyBlock
                text={block.content.text
                    .map((text) => text.plain_text)
                    .join('\n')}
                language={block.content.language}
                theme={dracula}
                showLineNumbers
                codeBlock
            />
        </Box>
    );
}

function BlockQuote({ block }: WithContentValidationProps) {
    return (
        <Box mb="1.5rem" ml="1.5rem">
            <Text as="blockquote" fontSize="xl" fontStyle="italic">
                {block.content.text.map((text) => text.plain_text).join('')}
            </Text>
        </Box>
    );
}

export async function getServerSideProps({ params }) {
    const { id } = params;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/post/${id}`
        );
        const post = await response.json();

        return {
            props: {
                post,
            },
        };
    } catch (error) {
        console.error('Failed to fetch post:', error);
        return {
            notFound: true,
        };
    }
}

export default BlogPost;
