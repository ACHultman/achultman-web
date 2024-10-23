import styled from '@emotion/styled';
import Link, { LinkProps } from 'next/link';
import { PropsWithChildren } from 'react';

const UnderlineLink = styled(Link, {
    shouldForwardProp: (prop) => prop !== 'underline',
})<{ underline?: boolean }>`
    &:hover,
    *:hover {
        text-decoration: ${(props) => (props.underline ? 'underline' : 'none')};
    }
`;

interface ExternalLinkProps extends PropsWithChildren<LinkProps> {
    underline?: boolean;
}

function ExternalLink({ href, children, underline }: ExternalLinkProps) {
    return (
        <UnderlineLink
            href={href}
            rel="noopener noreferrer"
            target="_blank"
            underline={underline}
        >
            {children}
        </UnderlineLink>
    );
}

export default ExternalLink;
