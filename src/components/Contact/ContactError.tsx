import {
    VStack,
    Text,
    Flex,
    Tooltip,
    IconButton,
    ButtonProps,
    Button,
    useClipboard,
    useColorModeValue,
} from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';
import { motion } from 'framer-motion';
import { ContactAlert } from './ContactAlert';

export const MotionButton = motion<ButtonProps>(Button);

export function ContactError({
    firstName,
    onRetry,
}: {
    firstName: string;
    onRetry: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
    const hoverBg = useColorModeValue('blue.500', 'blue.500');
    const hoverColor = useColorModeValue('white', 'gray.700');
    const { hasCopied, onCopy } = useClipboard(
        process.env.NEXT_PUBLIC_EMAIL || ''
    );

    return (
        <VStack spacing="4">
            <ContactAlert
                status="error"
                title="Not sent!"
                description={
                    <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        display="inline-flex"
                        alignItems="center"
                        flexWrap="wrap"
                    >
                        Sorry, {firstName}. Please press&nbsp;
                        <MdEmail
                            style={{
                                verticalAlign: 'middle',
                                fontSize: '1em',
                            }}
                        />
                        &nbsp;to copy my email address.
                    </Text>
                }
            >
                <Flex align="center" justifyContent="space-between" w="100%">
                    <Tooltip
                        label={hasCopied ? 'Email Copied!' : 'Copy Email'}
                        closeOnClick={false}
                        hasArrow
                    >
                        <IconButton
                            aria-label="email"
                            variant="ghost"
                            size="lg"
                            fontSize="3xl"
                            icon={<MdEmail />}
                            _hover={{
                                bg: hoverBg,
                                color: hoverColor,
                            }}
                            onClick={onCopy}
                            isRound
                        />
                    </Tooltip>
                    <MotionButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRetry}
                    >
                        Try Again
                    </MotionButton>
                </Flex>
            </ContactAlert>
        </VStack>
    );
}
