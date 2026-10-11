import { test, expect } from '@playwright/test';

const slug = 'ai-assisted-development-at-kopperfield';
const canonical = `https://hultman.dev/blog/${slug}`;

test('writing topics preserve every published article and link from the personal homepage', async ({
    page,
    request,
}) => {
    await page.goto('/');
    await expect(page).toHaveTitle(
        'Adam Hultman | Software Engineer in Vancouver'
    );
    await expect(
        page
            .getByRole('navigation', { name: 'Main navigation' })
            .getByRole('link', { name: 'Consulting', exact: true })
    ).toHaveCount(0);
    await expect(page.locator('.consulting-preview')).toHaveCount(0);
    await expect(
        page.getByRole('link', {
            name: 'React: compound components vs render props vs custom hooks',
            exact: true,
        })
    ).toHaveAttribute(
        'href',
        '/blog/react-compound-components-vs-render-props-vs-custom-hooks'
    );
    await page
        .locator('.writing-preview')
        .getByRole('link', { name: 'React and Next.js', exact: true })
        .click();
    await expect(page).toHaveURL('/blog#react-nextjs');
    await expect(
        page.getByRole('heading', { name: 'React and Next.js', exact: true })
    ).toBeVisible();
    const response = await request.get('/blog');
    expect(response.status()).toBe(200);
    const server = await page.evaluate(
        (source) => {
            const document = new DOMParser().parseFromString(
                source,
                'text/html'
            );
            return {
                expected: JSON.parse(
                    document.querySelector('#__NEXT_DATA__')!.textContent!
                )
                    .props.pageProps.posts.map(
                        (post: { slug: string }) => `/blog/${post.slug}`
                    )
                    .sort(),
                rendered: Array.from(
                    document.querySelectorAll(
                        '.writing-topic .article-row h3 a'
                    )
                )
                    .map((link) => link.getAttribute('href'))
                    .sort(),
            };
        },
        await response.text()
    );
    expect(server.rendered).toEqual(server.expected);
    const actual = await page
        .locator('.writing-topic .article-row h3 a')
        .evaluateAll((links) =>
            links.map((link) => link.getAttribute('href')).sort()
        );
    expect(actual).toEqual(server.expected);
    for (const [id, article] of [
        ['ai-development', 'ai-assisted-development-at-kopperfield'],
        [
            'react-nextjs',
            'react-compound-components-vs-render-props-vs-custom-hooks',
        ],
        [
            'performance-and-systems',
            'optimizing-frontend-performance-beyond-lighthouse-scores',
        ],
    ]) {
        await expect(
            page.locator(`#${id} a[href="/blog/${article}"]`)
        ).toBeVisible();
    }
    for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= window.innerWidth
            ),
            `${width}px`
        ).toBe(true);
    }
});

test('articles ship readable HTML and consistent canonical/author/schema metadata', async ({
    page,
}) => {
    const response = await page.goto(`/blog/${slug}`);
    expect(response?.status()).toBe(200);
    const html = await response!.text();
    expect(html).toContain('class="article-body"');
    expect(html).toContain(`<link rel="canonical" href="${canonical}"`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        canonical
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        'content',
        canonical
    );
    await expect(
        page.locator('meta[property="article:author"]')
    ).toHaveAttribute('content', 'https://hultman.dev/about');
    await expect(page.locator('.article-meta a[rel="author"]')).toHaveText(
        'Adam Hultman'
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'index,follow'
    );
    const schemas = (
        await page
            .locator('script[type="application/ld+json"]')
            .allTextContents()
    ).map((text) => JSON.parse(text));
    const article = schemas.find((schema) => schema['@type'] === 'BlogPosting');
    expect(article.url).toBe(canonical);
    expect(article.author.url).toBe('https://hultman.dev/about');
    expect(article.description).toBeTruthy();
    expect(new Date(article.dateModified).getTime()).toBeGreaterThanOrEqual(
        new Date(article.datePublished).getTime()
    );
    expect(schemas.some((schema) => schema['@type'] === 'BreadcrumbList')).toBe(
        true
    );
    await expect(page.locator('.article-body p').first()).toBeVisible();
});

test('technical articles retain highlighted code and exact copyable source', async ({
    page,
    context,
}) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(
        '/blog/react-compound-components-vs-render-props-vs-custom-hooks'
    );
    const original = await page.evaluate(() => {
        const post = JSON.parse(
            document.querySelector('#__NEXT_DATA__')!.textContent!
        ).props.pageProps.post;
        return post.blocks.results
            .find((block: { type: string }) => block.type === 'code')
            .code.rich_text.map(
                (part: { plain_text: string }) => part.plain_text
            )
            .join('');
    });
    const block = page.locator('.code-block').first();
    expect(await block.locator('code').textContent()).toBe(original);
    expect(await block.locator('.token').count()).toBeGreaterThan(0);
    await block.getByRole('button', { name: 'Copy code' }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        original
    );
});

test('every archive article appears in the sitemap and RSS feed', async ({
    page,
    request,
}) => {
    await page.goto('/blog');
    const paths = await page
        .locator('.article-row :is(h2, h3) a')
        .evaluateAll((links) =>
            links.map((link) => link.getAttribute('href')!)
        );
    expect(paths.length).toBeGreaterThan(3);
    for (const path of ['/sitemap.xml', '/feed.xml']) {
        const response = await request.get(path);
        expect(response.status()).toBe(200);
        const xml = await response.text();
        for (const article of paths)
            expect(xml).toContain(`https://hultman.dev${article}`);
        expect(xml).not.toContain('localhost');
        const valid = await page.evaluate(
            (source) =>
                !new DOMParser()
                    .parseFromString(source, 'application/xml')
                    .querySelector('parsererror'),
            xml
        );
        expect(valid).toBe(true);
    }
});

test('legacy IDs redirect permanently and unknown articles return actual 404s', async ({
    page,
    request,
}) => {
    await page.goto(`/blog/${slug}`);
    const id = await page.evaluate(
        () =>
            JSON.parse(document.querySelector('#__NEXT_DATA__')!.textContent!)
                .props.pageProps.post.page.id
    );
    for (const legacy of [id, id.replace(/-/g, '')]) {
        const response = await request.get(`/blog/${legacy}`, {
            maxRedirects: 0,
        });
        expect(response.status()).toBe(308);
        expect(response.headers().location).toBe(`/blog/${slug}`);
    }
    const missing = await request.get('/blog/this-is-not-a-published-article');
    expect(missing.status()).toBe(404);
});
