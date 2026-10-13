import { TextLink } from './Editorial';
import { projects } from '../data/projects';

export default function ProjectList() {
    return (
        <div className="project-list">
            {projects.map((project, index) => (
                <article className="project-row" key={project.slug}>
                    <p className="project-index" aria-hidden="true">
                        0{index + 1}
                    </p>
                    <div>
                        <p className="eyebrow">{project.discipline}</p>
                        <h3>{project.name}</h3>
                        <p className="project-status">{project.status}</p>
                    </div>
                    <div className="project-row-copy">
                        <p>{project.description}</p>
                        <TextLink href={`/work/${project.slug}`}>
                            Explore {project.name}
                        </TextLink>
                    </div>
                </article>
            ))}
        </div>
    );
}
