import Image from 'next/image';
import Link from 'next/link';
import monogram from '../../public/images/ah-monogram.png';

export function LogoMark() {
    return (
        <Image
            className="personal-mark"
            src={monogram}
            width={36}
            height={36}
            alt=""
            unoptimized
            loading="eager"
        />
    );
}

export default function Logo() {
    return (
        <Link href="/" aria-label="Home">
            <LogoMark />
        </Link>
    );
}
