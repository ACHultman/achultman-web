import { PageIntro, PageSeo, TextLink } from '@components/Editorial';
import { toolPages } from '../../data/toolPages';

export default function Tools() {
    return (
        <>
            <PageSeo
                title="Interactive tools"
                path="/tools"
                description="Six browser tools for working with regular expressions, algorithms, graphics, sound, and neural networks."
            />
            <div className="page-container">
                <PageIntro label="Tools" title="Interactive tools.">
                    Six small tools for trying an idea and seeing what changes.
                    Computation and the text you enter stay in your browser.
                </PageIntro>
                <div className="tool-list">
                    {Object.values(toolPages).map((tool) => (
                        <article key={tool.path}>
                            <p className="eyebrow">{tool.category}</p>
                            <h2>
                                <TextLink href={tool.path} prefetch={false}>
                                    {tool.title}
                                </TextLink>
                            </h2>
                            <p>{tool.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
}
