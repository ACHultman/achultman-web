import type { NextApiRequest, NextApiResponse } from 'next';
import { TIMELINE } from '../../../../constants/timeline';
import { gitTimelineRootData } from '../../../../data/gitTimelineData';
import type { BranchDefinition } from '../../../../data/gitTimelineData';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { query } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: 'Query parameter required' });
        }

        const searchLower = query.toLowerCase();
        const results: string[] = [];

        // Search in TIMELINE data
        Object.entries(TIMELINE).forEach(([year, items]) => {
            items.forEach((item) => {
                const orgMatch = item.org.title
                    .toLowerCase()
                    .includes(searchLower);
                const subtitleMatch = item.subtitle
                    .toLowerCase()
                    .includes(searchLower);
                const dateMatch = item.dateRange
                    .toLowerCase()
                    .includes(searchLower);
                const yearMatch = year.includes(query);

                if (orgMatch || subtitleMatch || dateMatch || yearMatch) {
                    results.push(
                        `${item.org.title}: ${item.subtitle} (${item.dateRange})`
                    );
                }
            });
        });

        // Helper function to recursively search git timeline
        function searchGitBranch(
            branch: BranchDefinition,
            path: string = ''
        ): void {
            const currentPath = path ? `${path} → ${branch.name}` : branch.name;

            // Search commits
            branch.commits?.forEach((commit) => {
                const subjectMatch = commit.subject
                    .toLowerCase()
                    .includes(searchLower);
                const bodyMatch = commit.body.toLowerCase().includes(searchLower);

                if (subjectMatch || bodyMatch) {
                    results.push(`${commit.subject} - ${commit.body}`);
                }
            });

            // Search sub-branches recursively
            branch.subBranches?.forEach((subBranch) => {
                searchGitBranch(subBranch, currentPath);
            });

            // Search final commits
            branch.finalCommits?.forEach((commit) => {
                const subjectMatch = commit.subject
                    .toLowerCase()
                    .includes(searchLower);
                const bodyMatch = commit.body.toLowerCase().includes(searchLower);

                if (subjectMatch || bodyMatch) {
                    results.push(`${commit.subject} - ${commit.body}`);
                }
            });
        }

        searchGitBranch(gitTimelineRootData);

        return res.status(200).json({
            success: true,
            events: results.slice(0, 10), // Limit to top 10 results
        });
    } catch (error) {
        console.error('Error searching timeline:', error);
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
}
