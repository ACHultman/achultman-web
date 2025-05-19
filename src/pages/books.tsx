import { Box, Container, Heading, Divider, SlideFade } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';

import Paragraph from '@components/Paragraph';
import Message from '@components/Message';
import BookList from '@components/BookList';
import { fetchNotions } from '../services/notion';
import { Buffer } from 'buffer';
import { Book } from '../types/notion';

/** number of seconds in one day (used for ISR revalidation) */
const SECONDS_IN_A_DAY = 86400;

function isPng(buffer: Buffer): boolean {
    return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
    );
}

function getPngDimensions(buffer: Buffer): { width: number; height: number } {
    return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
    };
}

function isJpeg(buffer: Buffer): boolean {
    return buffer[0] === 0xff && buffer[1] === 0xd8;
}

/** extract width and height from a JPEG buffer by parsing its SOF markers */
function getJpegDimensions(
    buffer: Buffer
): { width: number; height: number } | undefined {
    let offset = 2;
    while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) {
            offset++;
            continue;
        }
        const marker = buffer[offset + 1];
        const length = buffer.readUInt16BE(offset + 2);
        // SOF0 (baseline) or SOF2 (progressive) markers
        if (marker === 0xc0 || marker === 0xc2) {
            return {
                height: buffer.readUInt16BE(offset + 5),
                width: buffer.readUInt16BE(offset + 7),
            };
        }
        offset += 2 + length;
    }
}

/**
 * Attempt to fetch an image URL and derive its dimensions.
 * Returns undefined if fetch fails or format is unsupported.
 */
async function fetchImageDimensions(
    url: string
): Promise<{ width: number; height: number } | undefined> {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            return;
        }
        const buffer = Buffer.from(await res.arrayBuffer());
        if (isPng(buffer)) {
            return getPngDimensions(buffer);
        }
        if (isJpeg(buffer)) {
            return getJpegDimensions(buffer);
        }
    } catch {
        /* ignore errors */
    }
}

interface Props {
    books: Book[];
}

function Books({ books }: Props) {
    return (
        <>
            <NextSeo
                title="Adam Hultman | Books"
                description="A list of my favorite tech books."
                openGraph={{
                    title: 'Adam Hultman | Books',
                    description: 'A list of my favorite tech books.',
                    url: 'https://hultman.dev/books',
                }}
                canonical="https://hultman.dev/books"
            />
            <Container maxW="container.lg">
                <SlideFade in={true} offsetY={80}>
                    <Box>
                        <Heading
                            as="h1"
                            fontSize={{ base: '24px', md: '30px', lg: '36px' }}
                            mb={4}
                        >
                            Books
                        </Heading>
                        <Paragraph fontSize="xl" lineHeight={1.6}>
                            A list of my favourite tech books.
                        </Paragraph>
                    </Box>
                    <Divider my={10} />
                </SlideFade>
                <SlideFade in={true} offsetY={80} delay={0.2}>
                    {!books || books.length === 0 ? (
                        <Message />
                    ) : (
                        <BookList books={books} />
                    )}
                </SlideFade>
            </Container>
        </>
    );
}

export async function getStaticProps() {
    const booksRaw = await fetchNotions('books');

    const books: Book[] = await Promise.all(
        booksRaw.map(async (book) => {
            let coverWidth: number | undefined;
            let coverHeight: number | undefined;

            if (book.cover && book.cover.startsWith('http')) {
                const dimensions = await fetchImageDimensions(book.cover);
                if (dimensions) {
                    coverWidth = dimensions.width;
                    coverHeight = dimensions.height;
                }
            }

            return { ...book, coverWidth, coverHeight };
        })
    );

    return {
        props: { books },
        revalidate: SECONDS_IN_A_DAY,
    };
}

export default Books;
