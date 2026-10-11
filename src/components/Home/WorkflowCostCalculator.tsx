import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { captureEvent } from '../../lib/analytics';
import { calculateWorkflowEconomics } from '../../utils/workflowEconomics';

const fields = [
    {
        key: 'people',
        label: 'People doing the work',
        min: 1,
        max: 100,
        step: 1,
        example: '2',
        help: 'A whole number of people doing this same recurring task.',
    },
    {
        key: 'weeklyHours',
        label: 'Hours each person spends weekly',
        min: 0.5,
        max: 80,
        step: 'any',
        example: '5',
        help: 'Use an average week, including quiet periods.',
    },
    {
        key: 'hourlyCost',
        label: 'Loaded hourly cost',
        min: 1,
        max: 1000,
        step: 'any',
        example: '60',
        help: 'Include salary, benefits, and overhead.',
    },
    {
        key: 'timeReturnedPercent',
        label: 'Net time reduction (%)',
        min: 0,
        max: 100,
        step: 'any',
        example: '50',
        help: 'Allow for review, exceptions, and correcting mistakes.',
    },
    {
        key: 'implementationCost',
        label: 'One-time implementation cost',
        min: 0,
        max: 1_000_000,
        step: 'any',
        example: '6000',
        help: 'Include build, integration, testing, and training.',
    },
    {
        key: 'monthlyOperatingCost',
        label: 'Monthly operating cost',
        min: 0,
        max: 100_000,
        step: 'any',
        example: '100',
        help: 'Include software, model usage, hosting, maintenance, and support.',
    },
] as const;
type FieldName = (typeof fields)[number]['key'];
const emptyInputs: Record<FieldName, string> = {
    people: '',
    weeklyHours: '',
    hourlyCost: '',
    timeReturnedPercent: '',
    implementationCost: '',
    monthlyOperatingCost: '',
};

export default function WorkflowCostCalculator({
    showMethodLink = true,
}: {
    showMethodLink?: boolean;
}) {
    const [inputs, setInputs] = useState(emptyInputs);
    const [currency, setCurrency] = useState('CAD');
    const tracked = useRef(false);
    const allEntered = fields.every(({ key }) => inputs[key].trim() !== '');
    const result = allEntered
        ? calculateWorkflowEconomics({
              people: Number(inputs.people),
              weeklyHours: Number(inputs.weeklyHours),
              hourlyCost: Number(inputs.hourlyCost),
              timeReturnedPercent: Number(inputs.timeReturnedPercent),
              implementationCost: Number(inputs.implementationCost),
              monthlyOperatingCost: Number(inputs.monthlyOperatingCost),
          })
        : null;
    const money = (value: number) =>
        new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0,
        }).format(value);

    useEffect(() => {
        if (!result || tracked.current) return;
        tracked.current = true;
        // Track use of the tool without sending the visitor's financial inputs.
        captureEvent('workflow_cost_calculated');
    }, [result]);

    return (
        <section
            id="calculator"
            className="roi-calculator"
            aria-labelledby="calculator-title"
        >
            <div className="roi-toolbar">
                <div>
                    <h2 id="calculator-title">Estimate a recurring workflow</h2>
                    <p>Enter your own assumptions, or load a worked example.</p>
                </div>
                <button
                    type="button"
                    className="roi-example"
                    onClick={() =>
                        setInputs({
                            people: '2',
                            weeklyHours: '5',
                            hourlyCost: '60',
                            timeReturnedPercent: '50',
                            implementationCost: '6000',
                            monthlyOperatingCost: '100',
                        })
                    }
                >
                    Try an example
                </button>
            </div>
            <div className="roi-grid">
                <div>
                    <div className="roi-currency">
                        <label htmlFor="workflow-currency">Currency</label>
                        <select
                            id="workflow-currency"
                            value={currency}
                            onChange={(event) =>
                                setCurrency(event.target.value)
                            }
                        >
                            <option value="CAD">CAD</option>
                            <option value="USD">USD</option>
                        </select>
                        <p>
                            Use the same currency for every cost. Changing this
                            label does not convert amounts.
                        </p>
                    </div>
                    <div className="roi-fields">
                        {fields.map((field) => {
                            const invalid =
                                inputs[field.key] !== '' &&
                                (!Number.isFinite(Number(inputs[field.key])) ||
                                    Number(inputs[field.key]) < field.min ||
                                    Number(inputs[field.key]) > field.max ||
                                    (field.key === 'people' &&
                                        !Number.isInteger(
                                            Number(inputs[field.key])
                                        )));
                            return (
                                <div key={field.key}>
                                    <label htmlFor={`workflow-${field.key}`}>
                                        {field.label}
                                    </label>
                                    <input
                                        id={`workflow-${field.key}`}
                                        type="number"
                                        inputMode={
                                            field.key === 'people'
                                                ? 'numeric'
                                                : 'decimal'
                                        }
                                        min={field.min}
                                        max={field.max}
                                        step={field.step}
                                        placeholder={field.example}
                                        value={inputs[field.key]}
                                        aria-invalid={invalid}
                                        aria-describedby={`workflow-${field.key}-help`}
                                        onChange={(event) =>
                                            setInputs((previous) => ({
                                                ...previous,
                                                [field.key]: event.target.value,
                                            }))
                                        }
                                    />
                                    <p id={`workflow-${field.key}-help`}>
                                        {invalid
                                            ? `Enter ${field.min.toLocaleString()}–${field.max.toLocaleString()}${field.key === 'people' ? ' whole people' : ''}.`
                                            : field.help}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div
                    className="roi-results"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {result ? (
                        <>
                            <p className="eyebrow">
                                Your estimate · {currency}
                            </p>
                            <dl>
                                <div>
                                    <dt>Monthly hours returned</dt>
                                    <dd>
                                        {result.monthlyHoursSaved.toFixed(1)}{' '}
                                        hours
                                    </dd>
                                </div>
                                <div>
                                    <dt>Monthly value of time saved</dt>
                                    <dd>
                                        {money(result.monthlyCapacityReturned)}
                                    </dd>
                                </div>
                                <div>
                                    <dt>Monthly value after operating costs</dt>
                                    <dd>{money(result.monthlyNetValue)}</dd>
                                </div>
                                <div>
                                    <dt>
                                        First-year value after all modeled costs
                                    </dt>
                                    <dd>{money(result.firstYearNetValue)}</dd>
                                </div>
                                <div>
                                    <dt>First-year ROI based on time value</dt>
                                    <dd>
                                        {result.firstYearRoiPercent === null
                                            ? 'Undefined with zero costs'
                                            : `${result.firstYearRoiPercent.toFixed(1)}%`}
                                    </dd>
                                </div>
                                <div>
                                    <dt>Simple payback based on time value</dt>
                                    <dd>
                                        {result.paybackMonths === null
                                            ? 'No payback at these inputs'
                                            : result.paybackMonths === 0
                                              ? 'No upfront cost to recover'
                                              : `${result.paybackMonths.toFixed(1)} months`}
                                    </dd>
                                </div>
                            </dl>
                            <p className="roi-note">
                                Time returned is capacity you can use elsewhere.
                                It only becomes cash savings if spending
                                actually falls.
                            </p>
                            <Link
                                className="text-link"
                                href="/consulting#internal-tools"
                                onClick={() =>
                                    captureEvent('workflow_consulting_clicked')
                                }
                            >
                                Explore workflow automation consulting →
                            </Link>
                        </>
                    ) : (
                        <>
                            <h3>
                                {allEntered
                                    ? 'Check the highlighted inputs'
                                    : 'Add your six estimates'}
                            </h3>
                            <p>
                                Results include implementation and running
                                costs. Enter 0 if a cost does not apply.
                            </p>
                        </>
                    )}
                </div>
            </div>
            {showMethodLink && (
                <Link
                    className="text-link"
                    href="/workflow-automation-roi-calculator"
                >
                    How the estimate works →
                </Link>
            )}
        </section>
    );
}
