import type { NotionPageWithBlocks } from '../types/notion';
import kopperfield from '../data/published-writing/ai-assisted-development-at-kopperfield.json';
import agents from '../data/published-writing/building-a-multi-agent-ai-team-from-solo-agent-to-coordinated-crew.json';
import scaling from '../data/published-writing/scaling-full-stack-applications-patterns-i-actually-use.json';

import websockets from '../data/published-writing/building-real-time-applications-with-react-and-websockets.json';
import aiTools from '../data/published-writing/getting-started-with-ai-driven-development-tools-and-techniques.json';
import nextjs from '../data/published-writing/how-to-build-a-scalable-react-app-with-next-js-and-typescript.json';
import performance from '../data/published-writing/optimizing-frontend-performance-beyond-lighthouse-scores.json';
import reactPatterns from '../data/published-writing/react-compound-components-vs-render-props-vs-custom-hooks.json';
import security from '../data/published-writing/security-is-fun-10-cybersecurity-practices-every-developer-should-know.json';
import deployment from '../data/published-writing/top-mistakes-to-avoid-when-deploying-react-apps-to-production.json';

// Public articles exported from hultman.dev on October 10, 2026. Used only
// without a configured Notion connection, never to override live editorial data.
export const publishedWriting = [
    kopperfield,
    agents,
    scaling,
    websockets,
    aiTools,
    nextjs,
    performance,
    reactPatterns,
    security,
    deployment,
] as unknown as NotionPageWithBlocks<'blog'>[];

publishedWriting.sort((a, b) =>
    (b.page.publishedDate ?? '').localeCompare(a.page.publishedDate ?? '')
);
