import { useId, useState, type PointerEvent } from 'react';
import { TextLink } from './Editorial';
import type { GitHubActivity as Activity } from '../types/github-activity';
import { activityChange, workflowComparison } from '../utils/github-activity';
import styles from './GitHubActivity.module.css';

const number = new Intl.NumberFormat('en-CA');
const formatDate = (value: string) =>
    new Intl.DateTimeFormat('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
const formatMonth = (value: string, short = false) =>
    new Intl.DateTimeFormat('en-CA', {
        month: short ? 'short' : 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${value}-01T00:00:00Z`));

function MonthlyChart({ history }: { history: Activity['months'] }) {
    const [period, setPeriod] = useState('recent');
    const [selection, setSelection] = useState<number | null>(null);
    const [hover, setHover] = useState<number | null>(null);
    const years = Array.from(
        new Set(history.map((month) => month.month.slice(0, 4)))
    ).reverse();
    const months =
        period === 'recent'
            ? history.slice(-12)
            : period === 'all'
              ? history
              : history.filter((month) => month.month.startsWith(`${period}-`));
    const index = Math.min(selection ?? months.length - 1, months.length - 1);
    const displayedIndex = hover ?? index;
    const selected = months[displayedIndex];
    const pinned = months[index];
    const previous =
        history[
            history.findIndex((month) => month.month === selected?.month) - 1
        ];
    const highest = Math.max(1, ...months.map((month) => month.count));
    const step = 10 ** Math.floor(Math.log10(highest)) / 2;
    const ceiling = Math.ceil(highest / step) * step;
    const helpId = useId();
    const first = months[0];
    const last = months.at(-1);
    if (!selected || !pinned || !first || !last) return null;
    const selectAt = (event: PointerEvent<HTMLDivElement>) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        return Math.max(
            0,
            Math.min(
                months.length - 1,
                Math.floor(
                    ((event.clientX - bounds.left) / bounds.width) *
                        months.length
                )
            )
        );
    };
    return (
        <>
            <div className={styles.chartHeading}>
                <div>
                    <h3>Activity over time</h3>
                    <p>
                        {formatMonth(first.month, true)}–
                        {formatMonth(last.month, true)} · complete months
                    </p>
                </div>
                <label className={styles.periodPicker}>
                    Time range
                    <select
                        value={period}
                        onChange={(event) => {
                            setPeriod(event.target.value);
                            setSelection(null);
                            setHover(null);
                        }}
                    >
                        <option value="recent">Past 12 months</option>
                        <option value="all">Since 2022</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className={styles.readout}>
                <div>
                    <span>{formatMonth(selected.month)}</span>
                    <strong>
                        {number.format(selected.count)}{' '}
                        <small>contributions</small>
                    </strong>
                </div>
                <p>
                    {previous
                        ? activityChange(
                              selected.count,
                              previous.count
                          ).replace(
                              'the previous period',
                              formatMonth(previous.month, true)
                          )
                        : 'The first month in this history'}
                </p>
            </div>
            <div className={styles.chart}>
                <div className={styles.axis} aria-hidden="true">
                    <span>{number.format(ceiling)}</span>
                    <span>{number.format(ceiling / 2)}</span>
                    <span>0</span>
                </div>
                <div
                    className={styles.plot}
                    role="img"
                    aria-label={`Monthly GitHub contributions, ${formatMonth(first.month)} to ${formatMonth(last.month)}. Use the month slider or data table for exact counts.`}
                    onPointerMove={(event) => {
                        if (event.pointerType === 'mouse')
                            setHover(selectAt(event));
                    }}
                    onPointerLeave={() => setHover(null)}
                    onPointerDown={(event) => {
                        setSelection(selectAt(event));
                        setHover(null);
                    }}
                >
                    <div className={styles.gridLines} aria-hidden="true">
                        <i />
                        <i />
                        <i />
                    </div>
                    <div
                        className={styles.bars}
                        style={{
                            gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))`,
                        }}
                        aria-hidden="true"
                    >
                        {months.map((month, position) => (
                            <div
                                className={styles.barSlot}
                                key={month.month}
                                data-selected={position === displayedIndex}
                            >
                                <span
                                    className={styles.bar}
                                    style={{
                                        height: `${(month.count / ceiling) * 100}%`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.xLabels} aria-hidden="true">
                    {months.map((month, position) => {
                        const isYear = month.month.endsWith('-01');
                        const show =
                            months.length > 12
                                ? isYear
                                : position % 3 === 0 ||
                                  position === months.length - 1;
                        return show ? (
                            <span
                                key={month.month}
                                style={{
                                    left: `${((position + 0.5) / months.length) * 100}%`,
                                }}
                                data-edge={
                                    position === 0
                                        ? 'start'
                                        : position === months.length - 1
                                          ? 'end'
                                          : undefined
                                }
                            >
                                {months.length > 12
                                    ? month.month.slice(0, 4)
                                    : new Date(
                                          `${month.month}-01T00:00:00Z`
                                      ).toLocaleString('en-CA', {
                                          month: 'short',
                                          timeZone: 'UTC',
                                      })}
                            </span>
                        ) : null;
                    })}
                </div>
            </div>
            <div className={styles.scrubber}>
                <button
                    type="button"
                    aria-label="Previous month"
                    disabled={index === 0}
                    onClick={() => {
                        setSelection(index - 1);
                        setHover(null);
                    }}
                >
                    ←
                </button>
                <label className={styles.sliderLabel}>
                    Explore the months
                    <input
                        type="range"
                        min={0}
                        max={months.length - 1}
                        value={index}
                        step={1}
                        aria-label="Explore monthly activity"
                        aria-valuetext={`${formatMonth(pinned.month)}: ${number.format(pinned.count)} contributions`}
                        aria-describedby={helpId}
                        onChange={(event) => {
                            setSelection(Number(event.target.value));
                            setHover(null);
                        }}
                    />
                </label>
                <button
                    type="button"
                    aria-label="Next month"
                    disabled={index === months.length - 1}
                    onClick={() => {
                        setSelection(index + 1);
                        setHover(null);
                    }}
                >
                    →
                </button>
            </div>
            <p id={helpId} className={styles.chartHelp}>
                Hover or tap the chart, drag the slider, or use its arrow keys
                to explore.
            </p>
            <p role="status" className={styles.srOnly}>
                {formatMonth(pinned.month)}: {number.format(pinned.count)}{' '}
                contributions
            </p>
            <details className={styles.dataTable}>
                <summary>View monthly data</summary>
                <table>
                    <caption>
                        GitHub contributions in the selected period
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col">Month</th>
                            <th scope="col">Contributions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {months.map((month) => (
                            <tr key={month.month}>
                                <th scope="row">{formatMonth(month.month)}</th>
                                <td>{number.format(month.count)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </details>
        </>
    );
}

function WorkflowComparison({ months }: { months: Activity['months'] }) {
    const comparison = workflowComparison(months);
    if (!comparison)
        return (
            <p className={styles.unavailable}>
                Two complete comparison years aren’t available yet. You can
                explore the recorded months in Activity.
            </p>
        );
    const { before, after } = comparison;
    const maximum = Math.max(1, before.average, after.average);
    return (
        <div className={styles.comparison}>
            <h3>From autocomplete to Claude in the terminal</h3>
            <p>
                I switched around July–August 2025. Here are the 12 months
                before that transition and the first 12 full months after it,
                with the transition months left out.
            </p>
            <p className={styles.comparisonResult}>
                {activityChange(after.total, before.total).replace(
                    'previous period',
                    'year before the switch'
                )}
                <span>
                    Recorded GitHub contributions across equal 12-month windows.
                </span>
            </p>
            <dl className={styles.comparisonBars}>
                {[before, after].map((period) => (
                    <div key={period.start}>
                        <dt>
                            {period.label}
                            <span>{period.dates}</span>
                        </dt>
                        <dd>
                            <strong>
                                {number.format(Math.round(period.average))}{' '}
                                <small>/ month</small>
                            </strong>
                            <div
                                className={styles.comparisonTrack}
                                aria-hidden="true"
                            >
                                <span
                                    style={{
                                        width: `${(period.average / maximum) * 100}%`,
                                    }}
                                />
                            </div>
                            <span>
                                {number.format(period.total)} contributions in
                                12 months
                            </span>
                        </dd>
                    </div>
                ))}
            </dl>
            <p className={styles.comparisonNote}>
                My role, projects, and workflow changed over this period. This
                is a record of my activity; it doesn’t isolate the effect of AI
                or measure the quality of the work.
            </p>
        </div>
    );
}

export default function GitHubActivity({
    activity,
}: {
    activity: Activity | null;
}) {
    const [view, setView] = useState<'activity' | 'comparison'>('activity');
    const panelId = useId();
    return (
        <section
            className={styles.section}
            aria-labelledby="lately-heading"
            id="lately"
        >
            <header className={styles.introduction}>
                <div>
                    <p className="eyebrow">Lately</p>
                    <h2 id="lately-heading">I’ve been building a lot.</h2>
                </div>
                <div>
                    <p>
                        My work at Kopperfield spans product development,
                        operations automation, and keeping the engineering
                        systems running smoothly. I also build independent
                        projects in property intelligence, AI video, and audio.
                        GitHub captures one part of that work.
                    </p>
                    <div className="inline-actions">
                        <TextLink href="/work">See what I’m building</TextLink>
                        <TextLink href="/blog/ai-assisted-development-at-kopperfield">
                            How I work with AI
                        </TextLink>
                    </div>
                </div>
            </header>
            {activity ? (
                <>
                    <div className={styles.statsHeading}>
                        <h3>The last 30 days</h3>
                        <p>
                            <time dateTime={activity.from}>
                                {formatDate(activity.from)}
                            </time>
                            –
                            <time dateTime={activity.through}>
                                {formatDate(activity.through)}
                            </time>{' '}
                            · complete days
                        </p>
                    </div>
                    <dl className={styles.stats}>
                        <div>
                            <dt>GitHub contributions</dt>
                            <dd>
                                <strong>
                                    {number.format(activity.contributions)}
                                </strong>
                                <span>
                                    {activityChange(
                                        activity.contributions,
                                        activity.previous.contributions
                                    )}
                                </span>
                                <small>
                                    {number.format(
                                        activity.previous.contributions
                                    )}{' '}
                                    in the preceding 30 days
                                </small>
                            </dd>
                        </div>
                        <div>
                            <dt>Days active</dt>
                            <dd>
                                <strong>
                                    {activity.activeDays}
                                    <span> / 30</span>
                                </strong>
                                <span>
                                    At least one contribution on each of these
                                    days
                                </span>
                                <small>
                                    {activity.previous.activeDays} active days
                                    in the preceding 30 days
                                </small>
                            </dd>
                        </div>
                    </dl>
                    <div className={styles.chartSection}>
                        <div
                            className={styles.viewControls}
                            role="group"
                            aria-label="Activity view"
                        >
                            <button
                                type="button"
                                aria-pressed={view === 'activity'}
                                aria-controls={panelId}
                                onClick={() => setView('activity')}
                            >
                                Activity
                            </button>
                            <button
                                type="button"
                                aria-pressed={view === 'comparison'}
                                aria-controls={panelId}
                                onClick={() => setView('comparison')}
                            >
                                Before &amp; after Claude CLI
                            </button>
                        </div>
                        <div id={panelId}>
                            {view === 'activity' ? (
                                <MonthlyChart history={activity.months} />
                            ) : (
                                <WorkflowComparison months={activity.months} />
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <p className={styles.unavailable}>
                    The activity summary is temporarily unavailable. You can
                    still see the latest on my GitHub profile.
                </p>
            )}
            <div className={styles.workflow}>
                <h3>How my workflow changed</h3>
                <ol className={styles.timeline}>
                    <li>
                        <span>Before fall 2022</span>
                        <h4>Writing code directly</h4>
                        <p>
                            Working in the editor, writing the implementation
                            and debugging it as I went.
                        </p>
                    </li>
                    <li>
                        <span>~Fall 2022 · Assembly</span>
                        <h4>Autocomplete in VS Code</h4>
                        <p>
                            AI became part of my day-to-day work through
                            suggestions while I was writing code.
                        </p>
                    </li>
                    <li>
                        <span>~Summer 2025 · Kopperfield</span>
                        <h4>Claude in the terminal</h4>
                        <p>
                            I moved to working through changes with Claude in
                            the CLI, with more of my attention on context,
                            review, and verification.
                        </p>
                    </li>
                </ol>
            </div>
            <footer className={styles.source}>
                <div className={styles.sourceHeading}>
                    <TextLink href="https://github.com/ACHultman">
                        View the source on GitHub
                    </TextLink>
                    {activity ? (
                        <p>
                            Checked{' '}
                            <time dateTime={activity.fetchedAt}>
                                {formatDate(activity.fetchedAt)}
                            </time>{' '}
                            · Refreshes every 6 hours on visits
                        </p>
                    ) : null}
                </div>
                <details>
                    <summary>What counts—and whose work is included?</summary>
                    <div className={styles.methodology}>
                        <p>
                            A contribution is GitHub’s count of eligible
                            commits, pull requests, reviews, and other activity.
                            A single change can generate several contributions.
                            The project pages show what the work involves.
                        </p>
                        <p>
                            I use the same{' '}
                            <a href="https://github.com/ACHultman">
                                ACHultman account
                            </a>{' '}
                            for Assembly, Kopperfield, and personal projects.
                            This chart combines the activity visible on that
                            profile, including anonymous private contributions
                            that GitHub shares. It doesn’t split totals by
                            employer or expose private repository details.
                        </p>
                        <p>
                            The headline compares two consecutive 30-day periods
                            and excludes today. Monthly charts exclude the
                            current, unfinished month. Workflow dates are
                            approximate. If a refresh fails, the last successful
                            figures keep their original dates.
                        </p>
                        {activity ? (
                            <p>
                                Previous 30-day period:{' '}
                                {formatDate(activity.previous.from)}–
                                {formatDate(activity.previous.through)}.
                            </p>
                        ) : null}
                        <a href="https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference">
                            How GitHub counts contributions
                        </a>
                    </div>
                </details>
            </footer>
        </section>
    );
}
