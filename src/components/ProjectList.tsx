import { TextLink } from './Editorial';
import { projects } from '../data/projects';
import { ProjectPreview } from './PortfolioVisuals';

const summaries: Record<string, string> = {
    'property-intelligence':
        'Property research that connects listings, strata documents, and the evidence behind each finding.',
    'parallax-studio':
        'An AI video workspace that takes a generation request through processing to a usable asset.',
    earbud: 'A native audio plugin for calibrated metering and listening-exposure estimates.',
};

export default function ProjectList() {
    return (
        <div className="project-list">
            {projects.map((project, index) => (
                <article className="project-row" key={project.slug}>
                    <ProjectPreview slug={project.slug} />
                    <div className="project-row-copy">
                        <p className="eyebrow">
                            <span className="project-index" aria-hidden="true">
                                0{index + 1} /{' '}
                            </span>
                            {project.discipline}
                        </p>
                        <h3>{project.name}</h3>
                        <p className="project-summary">
                            {summaries[project.slug] ?? project.description}
                        </p>
                        <p className="project-status">{project.status}</p>
                        <TextLink href={`/work/${project.slug}`}>
                            Explore {project.name}
                        </TextLink>
                    </div>
                </article>
            ))}
        </div>
    );
}
