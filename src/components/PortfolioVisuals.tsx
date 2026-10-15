import Image, { type StaticImageData } from 'next/image';
import tenurelReport from '../../public/images/work/tenurel-report.webp';
import parallaxConcept from '../../public/images/work/parallax-studio-concept.webp';
import earbudConcept from '../../public/images/work/earbud-concept.webp';
import styles from './PortfolioVisuals.module.css';

const previews: Record<
    string,
    { image: StaticImageData; alt: string; title: string; caption: string }
> = {
    'property-intelligence': {
        image: tenurelReport,
        alt: 'Tenurel report showing property details, costs, and flagged findings.',
        title: 'Property report',
        caption: 'Sample data',
    },
    'parallax-studio': {
        image: parallaxConcept,
        alt: 'Parallax Studio concept showing a video prompt, generation controls, and a coastal video preview.',
        title: 'Video generation',
        caption: 'Concept preview',
    },
    earbud: {
        image: earbudConcept,
        alt: 'Earbud concept showing sound levels, session exposure, and calibration controls with demo readings.',
        title: 'Metering & calibration',
        caption: 'Concept preview',
    },
};

export function ProjectPreview({ slug }: { slug: string }) {
    const preview = previews[slug];
    if (!preview) return null;

    return (
        <figure className={styles.preview}>
            <Image
                src={preview.image}
                alt={preview.alt}
                placeholder="blur"
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1312px) calc((100vw - 160px) * 0.625), 720px"
            />
            <figcaption>
                <span>{preview.title}</span>
                <span>{preview.caption}</span>
            </figcaption>
        </figure>
    );
}

export function PerformanceFigure() {
    return (
        <figure className={styles.performance}>
            <div className={styles.metric}>
                88<span>%</span>
            </div>
            <figcaption>
                Lower p75 response time
                <br />
                on a core dashboard API
            </figcaption>
            <div className={styles.comparison} aria-hidden="true">
                <div>
                    <span>Before</span>
                    <i />
                </div>
                <div>
                    <span>After</span>
                    <i />
                </div>
            </div>
        </figure>
    );
}

export function PublishingFlow() {
    return (
        <figure className={styles.publishing}>
            <figcaption className="eyebrow">
                From draft to published page
            </figcaption>
            <ol>
                <li>
                    <span>01</span>
                    <strong>Write</strong>
                    <p>In Notion</p>
                </li>
                <li>
                    <span>02</span>
                    <strong>Verify</strong>
                    <p>Published content only</p>
                </li>
                <li>
                    <span>03</span>
                    <strong>Serve</strong>
                    <p>Keep the last good page</p>
                </li>
            </ol>
        </figure>
    );
}
