import { Source_Serif_4 } from 'next/font/google';

// Only Home and About use the serif face. Import it from those pages so other
// routes do not preload a font they never render.
export const editorialFont = Source_Serif_4({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-editorial',
    weight: ['400'],
    style: ['normal'],
});
