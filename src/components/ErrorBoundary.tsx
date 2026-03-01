import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents the entire app from crashing when a component error occurs
 */
class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Box
                    minH="50vh"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={8}
                >
                    <VStack spacing={4} maxW="600px" textAlign="center">
                        <Heading size="lg" color="red.500">
                            Oops! Something went wrong
                        </Heading>
                        <Text color="gray.600">
                            We&apos;re sorry, but something unexpected happened.
                            Please try refreshing the page or contact support if
                            the problem persists.
                        </Text>
                        {process.env.NODE_ENV === 'development' &&
                            this.state.error && (
                                <Box
                                    p={4}
                                    bg="red.50"
                                    borderRadius="md"
                                    width="100%"
                                    textAlign="left"
                                >
                                    <Text
                                        fontFamily="mono"
                                        fontSize="sm"
                                        color="red.700"
                                    >
                                        {this.state.error.message}
                                    </Text>
                                </Box>
                            )}
                        <Button colorScheme="blue" onClick={this.handleReset}>
                            Try Again
                        </Button>
                    </VStack>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
