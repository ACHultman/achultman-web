import { PageIntro, PageSeo, TextLink } from '@components/Editorial';
export default function Custom404() {
    return (
        <div className="page-container not-found">
            <PageSeo
                title="Page not found"
                path="/404"
                description="This page may have moved, or the link may be out of date."
            />
            <PageIntro label="404" title="This page isn’t here.">
                It may have moved, or the link may be out of date.
            </PageIntro>
            <div className="inline-actions">
                <TextLink href="/">Back home</TextLink>
                <TextLink href="/work">View my work</TextLink>
            </div>
        </div>
    );
}
