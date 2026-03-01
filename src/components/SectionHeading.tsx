import { Heading, HeadingProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type SectionHeadingProps = PropsWithChildren<HeadingProps>;

function SectionHeading({ children, ...props }: SectionHeadingProps) {
    return (
        <Heading as="h2" size="xl" my={8} textAlign="center" {...props}>
            {children}
        </Heading>
    );
}

export default SectionHeading;
