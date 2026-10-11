import Head from 'next/head';
import Link from 'next/link';
import { PageIntro, PageSeo, TextLink } from '@components/Editorial';
import WorkflowCostCalculator from '@components/Home/WorkflowCostCalculator';
import BreadcrumbJsonLd from '@components/BreadcrumbJsonLd';
import { getBaseUrl } from '../utils/baseUrl';

const baseUrl = getBaseUrl();
const path = '/workflow-automation-roi-calculator';
const description =
    'Estimate workflow automation ROI, payback, and time savings with your own implementation and monthly operating costs. Free calculator with a worked example.';

const formulas = [
    [
        'Monthly hours saved',
        'people × weekly hours × (52 ÷ 12) × (time reduction ÷ 100)',
    ],
    ['Monthly time value', 'monthly hours saved × loaded hourly cost'],
    ['First-year cost', 'implementation cost + (monthly operating cost × 12)'],
    [
        'First-year ROI',
        '((monthly time value × 12 − first-year cost) ÷ first-year cost) × 100',
    ],
    [
        'Simple payback in months',
        'implementation cost ÷ (monthly time value − monthly operating cost)',
    ],
];

export default function WorkflowAutomationRoiCalculatorPage() {
    return (
        <>
            <PageSeo
                title="Workflow Automation ROI Calculator"
                path={path}
                description={description}
            />
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', url: baseUrl },
                    { name: 'Consulting', url: `${baseUrl}/consulting` },
                    {
                        name: 'Workflow automation ROI calculator',
                        url: `${baseUrl}${path}`,
                    },
                ]}
            />
            <Head>
                <script
                    key="workflow-calculator-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebApplication',
                            name: 'Workflow Automation ROI Calculator',
                            url: `${baseUrl}${path}`,
                            description,
                            applicationCategory: 'BusinessApplication',
                            operatingSystem: 'Any',
                            browserRequirements: 'Requires JavaScript.',
                            isAccessibleForFree: true,
                            offers: {
                                '@type': 'Offer',
                                price: '0',
                                priceCurrency: 'CAD',
                            },
                            creator: {
                                '@type': 'Person',
                                '@id': `${baseUrl}/#person`,
                                name: 'Adam Hultman',
                                url: `${baseUrl}/about`,
                            },
                        }).replace(/</g, '\\u003c'),
                    }}
                />
            </Head>
            <div className="page-container roi-page">
                <PageIntro
                    label="Free planning tool"
                    title="Workflow automation ROI calculator."
                >
                    Compare the value of time saved with the cost to build and
                    run an automation. Use your own numbers to estimate
                    first-year return and simple payback before scoping a
                    project.
                </PageIntro>
                <WorkflowCostCalculator showMethodLink={false} />
                <section className="about-row" aria-labelledby="roi-method">
                    <h2 id="roi-method">How the estimate works</h2>
                    <div className="prose">
                        <p>
                            This model values saved hours at your loaded hourly
                            cost. It assumes 52 working weeks, with savings and
                            running costs beginning immediately and staying
                            constant for 12 months.
                        </p>
                        <dl className="roi-formulas">
                            {formulas.map(([label, formula]) => (
                                <div key={label}>
                                    <dt>{label}</dt>
                                    <dd>{formula}</dd>
                                </div>
                            ))}
                        </dl>
                        <p>
                            ROI is undefined when total modeled costs are zero.
                            There is no payback when the monthly time value does
                            not exceed operating costs. Payback can extend
                            beyond the first year; the ROI percentage covers
                            only the first 12 months.
                        </p>
                        <p>
                            The model excludes taxes, financing, discounting,
                            ramp-up delays, and changes in workload. Include
                            training and internal implementation time in the
                            upfront cost, and allow for ongoing reviews and
                            exceptions in the time-reduction estimate.
                        </p>
                    </div>
                </section>
                <section className="about-row" aria-labelledby="roi-example">
                    <h2 id="roi-example">A worked example</h2>
                    <div className="prose">
                        <p>
                            Suppose two people each spend five hours a week
                            preparing a report. At a loaded cost of $60 an hour,
                            a 50% net time reduction returns about 21.7 hours
                            per month, valued at $1,300.
                        </p>
                        <p>
                            With $6,000 in implementation costs and $100 a month
                            in operating costs, the modeled first-year benefit
                            is $15,600 against $7,200 in total costs. That
                            leaves $8,400 in net time value, a 116.7% modeled
                            ROI, and a five-month payback.
                        </p>
                        <p>
                            This is a hypothetical example, not a client result
                            or a project quote. The “Try an example” button
                            loads these inputs. If salaries stay unchanged, the
                            immediate benefit is time for other work, not $8,400
                            added to the bank account.
                        </p>
                    </div>
                </section>
                <section className="about-row">
                    <h2>What to include in the inputs</h2>
                    <div className="principles">
                        <div>
                            <h3>Measure the recurring work.</h3>
                            <p>
                                Track a representative week. Count the time
                                spent preparing data, chasing missing
                                information, checking results, and fixing
                                errors. Avoid using the busiest week as the
                                baseline.
                            </p>
                        </div>
                        <div>
                            <h3>Leave room for human review.</h3>
                            <p>
                                A draft still needs an editor. An extracted
                                record may need checking. Estimate the time left
                                after automation, including exceptions, before
                                choosing the reduction percentage.
                            </p>
                        </div>
                        <div>
                            <h3>Count what it takes to run.</h3>
                            <p>
                                Software subscriptions, AI model calls, hosting,
                                maintenance, and support can change the result.
                                Try a conservative scenario with lower time
                                savings and higher operating costs.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="about-row">
                    <h2>From estimate to a useful tool</h2>
                    <div className="prose">
                        <p>
                            The calculator tests one part of the decision. A
                            build also depends on data access, the cost of
                            mistakes, and whether people will use the result. I
                            help teams work through those questions and build
                            internal tools and AI integrations.
                        </p>
                        <div className="inline-actions">
                            <TextLink href="/consulting#internal-tools">
                                Workflow automation consulting
                            </TextLink>
                            <TextLink href="/contact">
                                Discuss your workflow
                            </TextLink>
                        </div>
                        <p className="roi-source">
                            For background, read{' '}
                            <a
                                href="https://www.bdc.ca/en/articles-tools/entrepreneur-toolkit/financial-tools/return-on-total-assets"
                                target="_blank"
                                rel="noreferrer"
                            >
                                BDC’s explanation of ROI
                            </a>
                            . The formulas above define this calculator’s
                            specific time-value model.
                        </p>
                        <p className="roi-source">
                            Built by{' '}
                            <Link href="/about" rel="author">
                                Adam Hultman
                            </Link>
                            , a software engineer in Vancouver.
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}
