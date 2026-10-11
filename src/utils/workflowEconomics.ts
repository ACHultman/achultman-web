export interface WorkflowInputs {
    people: number;
    weeklyHours: number;
    hourlyCost: number;
    timeReturnedPercent: number;
    implementationCost: number;
    monthlyOperatingCost: number;
}

export interface WorkflowEconomics {
    monthlyLabourCost: number;
    monthlyHoursSaved: number;
    monthlyCapacityReturned: number;
    monthlyNetValue: number;
    firstYearCost: number;
    firstYearNetValue: number;
    firstYearRoiPercent: number | null;
    paybackMonths: number | null;
}

// A capacity-value model, not a prediction of reduced payroll or cash flow.
// Savings and operating costs are assumed constant from the first month.
export function calculateWorkflowEconomics(
    input: WorkflowInputs
): WorkflowEconomics | null {
    const {
        people,
        weeklyHours,
        hourlyCost,
        timeReturnedPercent,
        implementationCost,
        monthlyOperatingCost,
    } = input;
    if (
        Object.values(input).some((value) => !Number.isFinite(value)) ||
        !Number.isInteger(people) ||
        people < 1 ||
        people > 100 ||
        weeklyHours < 0.5 ||
        weeklyHours > 80 ||
        hourlyCost < 1 ||
        hourlyCost > 1000 ||
        timeReturnedPercent < 0 ||
        timeReturnedPercent > 100 ||
        implementationCost < 0 ||
        implementationCost > 1_000_000 ||
        monthlyOperatingCost < 0 ||
        monthlyOperatingCost > 100_000
    )
        return null;

    const monthlyHours = (people * weeklyHours * 52) / 12;
    const monthlyLabourCost = monthlyHours * hourlyCost;
    const monthlyHoursSaved = (monthlyHours * timeReturnedPercent) / 100;
    const monthlyCapacityReturned = monthlyHoursSaved * hourlyCost;
    const rawMonthlyNetValue = monthlyCapacityReturned - monthlyOperatingCost;
    // Treat floating-point residue at break-even as zero, not a tiny benefit
    // that would misleadingly imply an astronomically long payback period.
    const precision =
        Number.EPSILON *
        Math.max(monthlyCapacityReturned, monthlyOperatingCost, 1) *
        4;
    const monthlyNetValue =
        Math.abs(rawMonthlyNetValue) <= precision ? 0 : rawMonthlyNetValue;
    const firstYearCost = implementationCost + monthlyOperatingCost * 12;
    const firstYearNetValue = monthlyCapacityReturned * 12 - firstYearCost;

    return {
        monthlyLabourCost,
        monthlyHoursSaved,
        monthlyCapacityReturned,
        monthlyNetValue,
        firstYearCost,
        firstYearNetValue,
        firstYearRoiPercent:
            firstYearCost > 0
                ? (firstYearNetValue / firstYearCost) * 100
                : null,
        paybackMonths:
            monthlyNetValue > 0 ? implementationCost / monthlyNetValue : null,
    };
}
