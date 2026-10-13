export type GitHubActivity = {
    contributions: number;
    activeDays: number;
    previous: {
        contributions: number;
        activeDays: number;
        from: string;
        through: string;
    };
    from: string;
    through: string;
    fetchedAt: string;
    months: { month: string; count: number }[];
};
