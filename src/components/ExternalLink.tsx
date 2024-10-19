import Link from 'next/link';

function ExternalLink({ href, children }) {
    return (
        <Link href={href} rel="noopener noreferrer" target="_blank">
            {children}
        </Link>
    );
}

export default ExternalLink;
