import React, { Component, ErrorInfo, ReactNode } from 'react';
import { captureClientException, captureEvent } from '../lib/analytics';

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
        captureClientException(error);
        captureEvent('error_boundary_triggered', {
            error_message: error.message,
            error_name: error.name,
        });
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
                <section className="page-container error-fallback" role="alert">
                    <h1>This page could not load.</h1>
                    <p>
                        Please try again, or email{' '}
                        <a href="mailto:adam@hultman.dev">adam@hultman.dev</a>{' '}
                        if the problem continues.
                    </p>
                    {process.env.NODE_ENV === 'development' &&
                        this.state.error && (
                            <pre>{this.state.error.message}</pre>
                        )}
                    <button
                        type="button"
                        className="button-primary"
                        onClick={this.handleReset}
                    >
                        Try again
                    </button>
                </section>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
