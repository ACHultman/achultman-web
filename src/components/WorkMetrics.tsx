import { workMetrics } from '../data/work';

export default function WorkMetrics() {
    return (
        <dl className="work-metrics" aria-label="Selected Kopperfield results">
            {workMetrics.map((metric) => (
                <div key={metric.label}>
                    <dt>{metric.label}</dt>
                    <dd>
                        <strong>{metric.value}</strong>
                        <span>{metric.detail}</span>
                    </dd>
                </div>
            ))}
        </dl>
    );
}
