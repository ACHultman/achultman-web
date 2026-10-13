import type {
    GetStaticPaths,
    GetStaticProps,
    InferGetStaticPropsType,
} from 'next';
import { ContactClose, PageSeo, TextLink } from '@components/Editorial';
import ProjectFlow from '@components/ProjectFlow';
import { projects, type Project } from '../../data/projects';
import { editorialFont } from '../../styles/editorialFont';

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: projects.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
});

export const getStaticProps: GetStaticProps<
    { project: Project },
    { slug: string }
> = async ({ params }) => {
    const project = projects.find(({ slug }) => slug === params?.slug);
    if (!project) return { notFound: true };
    return { props: { project } };
};

export default function ProjectPage({
    project,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <PageSeo
                title={project.name}
                description={project.description}
                path={`/work/${project.slug}`}
            />
            <article
                className={`page-container project-page ${editorialFont.variable}`}
            >
                <header className="page-intro">
                    <TextLink href="/work#perspective-labs">
                        All independent work
                    </TextLink>
                    <p className="eyebrow">
                        Perspective Labs Inc. · {project.discipline}
                    </p>
                    <h1 className="editorial-title">{project.name}</h1>
                    <p className="intro-copy">{project.description}</p>
                    <p className="project-status">{project.status}</p>
                </header>
                <ProjectFlow project={project} />
                <div className="project-story">
                    <aside
                        className="project-facts"
                        aria-label="Project details"
                    >
                        <dl>
                            <div>
                                <dt>My role</dt>
                                <dd>{project.role}</dd>
                            </div>
                            <div>
                                <dt>Built with</dt>
                                <dd>{project.technologies.join(' · ')}</dd>
                            </div>
                        </dl>
                        <TextLink href="/contact">
                            Discuss this project
                        </TextLink>
                    </aside>
                    <div className="project-narrative">
                        <section>
                            <h2>{project.question}</h2>
                            <p>{project.introduction}</p>
                        </section>
                        {project.sections.map((section) => (
                            <section key={section.title}>
                                <h2>{section.title}</h2>
                                <p>{section.body}</p>
                            </section>
                        ))}
                        <section className="project-stage">
                            <h2>Current stage</h2>
                            <p>{project.currentState}</p>
                            <h3>What I’m working toward</h3>
                            <p>{project.nextStep}</p>
                        </section>
                    </div>
                </div>
                <nav
                    className="related-projects"
                    aria-label="More independent work"
                >
                    {projects
                        .filter(({ slug }) => slug !== project.slug)
                        .map((other) => (
                            <TextLink
                                key={other.slug}
                                href={`/work/${other.slug}`}
                            >
                                {other.name}
                            </TextLink>
                        ))}
                </nav>
            </article>
            <ContactClose />
        </>
    );
}
