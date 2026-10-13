import type { Project } from '../data/projects';

export default function ProjectFlow({ project }: { project: Project }) {
    return (
        <figure className={`project-flow project-flow-${project.slug}`}>
            <figcaption>
                <span>{project.discipline}</span>
                <span>Implementation overview</span>
            </figcaption>
            <ol>
                {project.steps.map((step, index) => (
                    <li key={step.label}>
                        <span className="flow-number" aria-hidden="true">
                            0{index + 1}
                        </span>
                        <strong>{step.label}</strong>
                        <span>{step.detail}</span>
                    </li>
                ))}
            </ol>
        </figure>
    );
}
