import styled from '@emotion/styled';
import Link, { LinkProps } from 'next/link';
import { PropsWithChildren } from 'react';

interface ExternalLinkProps extends PropsWithChildren<LinkProps> {
    underline?: boolean;
}

const UnderlineLink = styled(Link)<{ underline?: boolean }>`
    &:hover,
    *:hover {
        text-decoration: ${(props) => (props.underline ? 'underline' : 'none')};
    }
`;

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
