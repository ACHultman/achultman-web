import {
    VStack,
    Tooltip,
    Text,
    useColorModeValue,
    ListItem,
} from '@chakra-ui/react';
import Paragraph from '@components/Paragraph';
import Link from 'next/link';

interface Props {
    item: TimelineItem;
}

export function YearEntry({ item }: Props) {
    const titleColor = useColorModeValue('black', 'white');
    const fontColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <ListItem>
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
                <Paragraph textAlign="center">{item.subtitle}</Paragraph>
                <Text fontSize="sm">{item.dateRange}</Text>
            </VStack>
        </ListItem>
    );
}
