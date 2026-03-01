import { Heading, HeadingProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type SectionHeadingProps = PropsWithChildren<HeadingProps>;

function SectionHeading({ children, ...props }: SectionHeadingProps) {
    return (
        <Heading as="h2" size={{ base: 'lg', md: 'xl' }} my={{ base: 4, md: 8 }} textAlign="center" {...props}>
            {children}
        </Heading>
    );
}

export default SectionHeading;
