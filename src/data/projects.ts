export interface Project {
    slug: string;
    name: string;
    discipline: string;
    status: string;
    description: string;
    role: string;
    technologies: string[];
    question: string;
    introduction: string;
    steps: { label: string; detail: string }[];
    sections: { title: string; body: string }[];
    currentState: string;
    nextStep: string;
    resume: string;
}

// Descriptions of implemented work, not claims of customer adoption or a public
// launch. Stable subject-based paths allow working product names to change.
export const projects: Project[] = [
    {
        slug: 'property-intelligence',
        name: 'Delve',
        discipline: 'Property intelligence',
        status: 'In development · working name',
        description:
            'Making property listings and strata documents easier to investigate, with structured reports, calculations, and evidence behind the findings.',
        role: 'Independent product development',
        technologies: [
            'TypeScript',
            'Next.js',
            'PostgreSQL',
            'Prisma',
            'OpenAI',
        ],
        question: 'What should a buyer investigate before making an offer?',
        introduction:
            'The useful information about a property is scattered across listing descriptions, building records, and strata documents. I’m building a way to bring those sources into one report, surface questions worth asking, and show where the available information is incomplete.',
        steps: [
            { label: 'Extract', detail: 'Listings & documents' },
            { label: 'Evaluate', detail: 'Rules & calculations' },
            { label: 'Explain', detail: 'Findings & evidence' },
        ],
        sections: [
            {
                title: 'A pipeline with distinct responsibilities',
                body: 'Site-specific extractors turn listing pages into structured fields and evidence snippets. Deterministic code handles property-risk factors and carrying-cost calculations. AI adds a written analysis and follow-up questions. These stages share a pipeline between the web application and its API.',
            },
            {
                title: 'Connecting a listing to building context',
                body: 'The implementation brings in building events, comparable properties, neighborhood information, and signals extracted from strata PDFs. Document analysis looks for subjects such as special levies, deferred maintenance, reserve funds, and insurance concerns. Reports retain extraction coverage, confidence, and citations alongside the findings.',
            },
            {
                title: 'Making incomplete information visible',
                body: 'A missing field is different from a clean bill of health. The code tests extraction, scoring, keyword detection, and calculations, including minimal listing input. The current document parser reads a bounded amount of text, so document completeness and citation quality need further evaluation before the reports can support a buyer’s due diligence.',
            },
        ],
        currentState:
            'A prototype with listing extraction, scoring, report storage, and AI-assisted document analysis. I’m developing and evaluating the reporting workflow. Delve is a working name.',
        nextStep:
            'Evaluate representative listings and full document sets against manually reviewed findings, then test a focused reporting workflow with prospective users.',
        resume: 'Built listing and strata-PDF analysis with Next.js and PostgreSQL, combining deterministic risk scoring and financial calculations with AI summaries and source evidence.',
    },
    {
        slug: 'parallax-studio',
        name: 'Parallax Studio',
        discipline: 'AI video & media workflows',
        status: 'In development',
        description:
            'An AI video studio built around long-running media jobs, with progress tracking, generated assets, and usage accounting.',
        role: 'Independent product development',
        technologies: [
            'TypeScript',
            'Next.js',
            'Inngest',
            'RunPod',
            'Supabase',
            'Cloudflare R2',
        ],
        question:
            'How do you turn a model request into a usable creative workflow?',
        introduction:
            'Generating a clip is one step in a video workflow. Creators also need to understand what is processing, recover from failures, find their output, and keep track of usage. Parallax Studio brings those product and infrastructure concerns into one application.',
        steps: [
            { label: 'Create', detail: 'Prompt & settings' },
            { label: 'Process', detail: 'GPU jobs & progress' },
            { label: 'Deliver', detail: 'Assets & usage' },
        ],
        sections: [
            {
                title: 'Orchestrating work beyond a request',
                body: 'The video workflow dispatches a job to RunPod and uses Inngest steps to poll for completion, update progress, and enforce a completion timeout. Job records persist queued, processing, complete, and failed states so the interface can follow work that outlives a single page request.',
            },
            {
                title: 'Handling the output as part of the product',
                body: 'The application connects media output to project and job records, object storage, and usage tracking. Separate integrations cover voiceover, transcription, upscaling, and script generation. I’ve also implemented an optional content-credentials signing path for generated video.',
            },
        ],
        currentState:
            'In development, with job orchestration, media storage, and provider integrations implemented. I’m working toward a repeatable generation-to-export workflow with measured processing time and operating costs.',
        nextStep:
            'Verify one complete creator workflow, measure processing time and cost per output, and use those results to choose the next integration.',
        resume: 'Implemented GPU video-generation jobs with Inngest and RunPod, including persisted progress, completion timeouts, failure handling, media storage, and usage accounting.',
    },
    {
        slug: 'earbud',
        name: 'Earbud',
        discipline: 'Native audio & DSP',
        status: 'Prototype',
        description:
            'A C++ audio plugin exploring calibrated level metering and listening-exposure estimates inside a music-production workflow.',
        role: 'Independent product development',
        technologies: ['C++', 'JUCE', 'DSP', 'CMake', 'VST3', 'Audio Unit'],
        question: 'What can a music session tell you about listening exposure?',
        introduction:
            'A DAW knows its digital signal level, but sound pressure at the listener also depends on the headphones, interface, and volume setting. Earbud explores the connection through a calibration workflow, signal processing, and an in-session display.',
        steps: [
            { label: 'Calibrate', detail: 'Reference level' },
            { label: 'Measure', detail: 'Weighted signal' },
            { label: 'Track', detail: 'Exposure estimate' },
        ],
        sections: [
            {
                title: 'Processing the signal inside the plugin',
                body: 'The JUCE processor measures a copy of the incoming audio, applies optional A-weighting, and calculates RMS and peak levels with selectable integration times. An exposure tracker accumulates the estimate over a session. The interface reads the latest measurements from the audio processor.',
            },
            {
                title: 'Bridging software levels and a physical setup',
                body: 'A calibration sequence plays a reference tone, monitors a sidechain microphone input, and stores a user-entered reference measurement as a level offset. The profile and session exposure state are saved with the plugin. The estimate depends on that calibration and on the listening setup remaining unchanged.',
            },
            {
                title: 'Building for native music tools',
                body: 'The CMake project targets VST3, Audio Unit, and a standalone application. The code includes a metering interface, calibration controls, warnings, configurable muting, and component tests for weighting, level estimation, calibration profiles, exposure tracking, and muting.',
            },
        ],
        currentState:
            'A native plugin prototype with metering, calibration, and exposure tracking implemented. Calibration accuracy and behavior across hardware and hosts are the next validation milestones.',
        nextStep:
            'Validate the calibration method against reference measurements and test host behavior before making measurement or protective claims.',
        resume: 'Built a C++/JUCE plugin with A-weighted metering, calibration profiles, and exposure estimates. Added DSP component tests and VST3/Audio Unit build targets.',
    },
];
