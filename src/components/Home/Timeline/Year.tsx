import {
    Box,
    VStack,
    List,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react';
import Paragraph from '@components/Paragraph';
import Link from 'next/link';
import { MotionHeading, MotionListItem } from '.';
import { TIMELINE } from './data';

interface Props {
    yearString: string;
}

export function Year({ yearString }: Props) {
    const titleColor = useColorModeValue('black', 'white');
    const fontColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Box>
            <VStack>
                <MotionHeading
                    mt={10}
                    mb={5}
                    as="h2"
                    size="md"
                    borderBottom="2px"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    {yearString}
                </MotionHeading>
                <List spacing={18} fontSize="18">
                    {TIMELINE[yearString].map((item, i) => (
                        <MotionListItem
                            key={`timeline-${yearString}-item-${i}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <VStack color={fontColor}>
                                <Link
                                    href={item.org.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Tooltip
                                        label={item.org.description}
                                        aria-label={item.org.description}
                                        placement="auto"
                                    >
                                        <Text
                                            borderBottom={`0.5px dotted ${item.org.color}`}
                                            color={titleColor}
                                        >
                                            {item.org.title}
                                        </Text>
                                    </Tooltip>
                                </Link>
                                <Paragraph textAlign="center">
                                    {item.subtitle}
                                </Paragraph>
                                <Text fontSize="sm">{item.dateRange}</Text>
                            </VStack>
                        </MotionListItem>
                    ))}
                </List>
            </VStack>
        </Box>
    );
}
