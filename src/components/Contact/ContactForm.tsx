import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Textarea,
    Tooltip,
    useClipboard,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsPerson } from 'react-icons/bs';
import { MdOutlineEmail, MdEmail } from 'react-icons/md';

const MotionButton = motion(Button);

type FormData = {
    name: string;
    email: string;
    message: string;
};

function ContactForm() {
    const hoverBg = useColorModeValue('blue.500', 'blue.500');
    const hoverColor = useColorModeValue('white', 'gray.700');
    const { hasCopied, onCopy } = useClipboard(
        process.env.NEXT_PUBLIC_EMAIL || ''
    );

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<FormData>();

    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'error' | 'success'
    >('idle');

    async function onSubmitForm({ name, email, message }: FormData) {
        let r: Response;
        try {
            r = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });
            if (r.ok) {
                setSubmitStatus('success');
            } else {
                setSubmitStatus('error');
            }
        } catch {
            setSubmitStatus('error');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <VStack spacing={5}>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>

                    <InputGroup>
                        <InputLeftElement>
                            <BsPerson />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder="Your Name"
                            disabled={submitStatus === 'success'}
                            {...register('name', {
                                required: 'Name is required',
                            })}
                        />
                    </InputGroup>
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>

                    <InputGroup>
                        <InputLeftElement>
                            <MdOutlineEmail />
                        </InputLeftElement>
                        <Input
                            type="email"
                            placeholder="Your Email"
                            disabled={submitStatus === 'success'}
                            {...register('email', {
                                required: 'Email is required',
                            })}
                        />
                    </InputGroup>
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Message</FormLabel>

                    <Textarea
                        placeholder="Your Message"
                        rows={6}
                        disabled={submitStatus === 'success'}
                        {...register('message', {
                            required: 'Message is required',
                        })}
                    />
                    <FormErrorMessage>
                        {errors.message?.message}
                    </FormErrorMessage>
                </FormControl>

                {submitStatus === 'success' ? (
                    <Alert
                        status="success"
                        variant="subtle"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                        height="200px"
                        borderRadius="lg"
                    >
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="lg">
                            Message sent!
                        </AlertTitle>
                        <AlertDescription maxWidth="sm">
                            Thanks for reaching out. I&apos;ll get back to you
                            as soon as I can.
                        </AlertDescription>
                    </Alert>
                ) : submitStatus === 'error' ? (
                    <VStack spacing="4">
                        <Alert status="error">
                            <AlertIcon />
                            <AlertDescription>
                                Apologies! There was an error while sending your
                                message.
                            </AlertDescription>
                        </Alert>
                        <Flex
                            align="center"
                            justifyContent="space-between"
                            w="100%"
                        >
                            <Tooltip
                                label={
                                    hasCopied ? 'Email Copied!' : 'Copy Email'
                                }
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
                                whileHover={{
                                    scale: 1.05,
                                }}
                                whileTap={{
                                    scale: 0.95,
                                }}
                                onClick={() => setSubmitStatus('idle')}
                            >
                                Try Again
                            </MotionButton>
                        </Flex>
                    </VStack>
                ) : (
                <MotionButton
                        colorScheme="green"
                        bg="green.600"
                        color="white"
                        width="full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        isLoading={isSubmitting}
                        type="submit"
                    >
                        Send Message
                    </MotionButton>
                )}
            </VStack>
        </form>
    );
}

export default ContactForm;
