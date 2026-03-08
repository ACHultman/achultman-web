export type EvidenceGrade = 'A' | 'B' | 'C' | 'D';

export interface SupplementEvidence {
  name: string;
  studyCount: number;
  avgQuality: number; // 1-10 scale
  popularity: number; // 1-100 (relative search volume / market share)
  grade: EvidenceGrade;
  claims: string[];
  actualEvidence: string;
  keyStudies: string[];
  category: string;
}

export const GRADE_INFO: Record<
  EvidenceGrade,
  { label: string; color: string; description: string }
> = {
  A: {
    label: 'Strong',
    color: 'emerald',
    description: 'Multiple large RCTs with consistent positive results',
  },
  B: {
    label: 'Moderate',
    color: 'blue',
    description: 'Some RCTs with generally positive results, or strong observational data',
  },
  C: {
    label: 'Limited',
    color: 'orange',
    description: 'Few or small studies, mixed results, or primarily observational',
  },
  D: {
    label: 'Insufficient',
    color: 'gray',
    description: 'Very limited research, no quality RCTs, or evidence contradicts claims',
  },
};

export const GRADE_COLORS: Record<EvidenceGrade, { bg: string; border: string; text: string; dot: string }> = {
  A: { bg: 'green.50', border: 'green.400', text: 'green.600', dot: 'green.400' },
  B: { bg: 'blue.50', border: 'blue.400', text: 'blue.600', dot: 'blue.400' },
  C: { bg: 'orange.50', border: 'orange.400', text: 'orange.600', dot: 'orange.400' },
  D: { bg: 'gray.50', border: 'gray.400', text: 'gray.600', dot: 'gray.400' },
};

export const GRADE_COLORS_DARK: Record<EvidenceGrade, { bg: string; border: string; text: string; dot: string }> = {
  A: { bg: 'green.900', border: 'green.400', text: 'green.300', dot: 'green.400' },
  B: { bg: 'blue.900', border: 'blue.400', text: 'blue.300', dot: 'blue.400' },
  C: { bg: 'orange.900', border: 'orange.400', text: 'orange.300', dot: 'orange.400' },
  D: { bg: 'gray.700', border: 'gray.400', text: 'gray.300', dot: 'gray.400' },
};

export const SUPPLEMENTS: SupplementEvidence[] = [
  {
    name: 'Vitamin D',
    studyCount: 320,
    avgQuality: 7.8,
    popularity: 95,
    grade: 'A',
    claims: ['Boosts immunity', 'Prevents cancer', 'Cures depression'],
    actualEvidence:
      'Strong evidence for bone health and deficiency correction. Moderate evidence for immune function. Limited evidence for cancer prevention or mood improvement in non-deficient individuals.',
    keyStudies: [
      'VITAL Trial (2019) — 25,871 participants, no significant cancer/CVD reduction',
      'Autier et al. (2017) — Meta-analysis: benefits mainly in deficient populations',
      'Martineau et al. (2017) — Modest reduction in respiratory infections',
    ],
    category: 'Vitamins',
  },
  {
    name: 'Omega-3 (Fish Oil)',
    studyCount: 280,
    avgQuality: 7.5,
    popularity: 88,
    grade: 'A',
    claims: ['Heart healthy', 'Brain booster', 'Anti-inflammatory cure-all'],
    actualEvidence:
      'Strong evidence for triglyceride reduction and cardiovascular benefit in high-risk populations. Moderate evidence for anti-inflammatory effects. Limited evidence for cognitive enhancement in healthy adults.',
    keyStudies: [
      'REDUCE-IT (2019) — 25% CVD risk reduction with high-dose EPA',
      'STRENGTH (2020) — No benefit from EPA+DHA combination',
      'Cochrane Review (2018) — Little or no effect on mortality in general population',
    ],
    category: 'Fatty Acids',
  },
  {
    name: 'Magnesium',
    studyCount: 180,
    avgQuality: 6.8,
    popularity: 82,
    grade: 'A',
    claims: ['Fixes everything', 'Sleep miracle', 'Anxiety cure'],
    actualEvidence:
      'Strong evidence for deficiency correction (widespread — ~50% of US adults). Good evidence for blood pressure reduction, migraine prevention, and sleep quality. Form matters: glycinate for sleep, citrate for general use.',
    keyStudies: [
      'Zhang et al. (2017) — Meta-analysis: reduces blood pressure by 2-3 mmHg',
      'Abbasi et al. (2012) — Improved sleep quality in elderly',
      'Chiu et al. (2017) — Effective for mild-to-moderate depression',
    ],
    category: 'Minerals',
  },
  {
    name: 'Probiotics',
    studyCount: 240,
    avgQuality: 5.8,
    popularity: 78,
    grade: 'B',
    claims: ['Gut health fix', 'Immune booster', 'Weight loss aid'],
    actualEvidence:
      'Moderate evidence for antibiotic-associated diarrhea and IBS symptoms. Strain-specific effects make general claims misleading. Limited evidence for immune boosting or weight loss.',
    keyStudies: [
      'Hempel et al. (2012) — Reduces antibiotic-associated diarrhea',
      'Ford et al. (2018) — Modest benefit for IBS symptoms',
      'Zmora et al. (2018) — Colonization is highly individual',
    ],
    category: 'Gut Health',
  },
  {
    name: 'Creatine',
    studyCount: 200,
    avgQuality: 8.2,
    popularity: 72,
    grade: 'A',
    claims: ['Muscle builder', 'Brain enhancer', 'Kidney damage risk'],
    actualEvidence:
      'One of the most well-studied supplements. Strong evidence for strength and power output. Emerging evidence for cognitive benefits, especially under stress or sleep deprivation. No evidence of kidney damage in healthy individuals.',
    keyStudies: [
      'Branch (2003) — Comprehensive meta-analysis confirming strength benefits',
      'Avgerinos et al. (2018) — Cognitive benefits in short-term memory and reasoning',
      'ISSN Position Stand (2017) — Safe for long-term use in healthy individuals',
    ],
    category: 'Performance',
  },
  {
    name: 'Turmeric / Curcumin',
    studyCount: 160,
    avgQuality: 5.5,
    popularity: 75,
    grade: 'C',
    claims: ['Anti-inflammatory miracle', 'Cancer fighter', 'Joint pain cure'],
    actualEvidence:
      'Curcumin has anti-inflammatory properties in vitro, but extremely poor bioavailability (<1% absorption). Enhanced formulations show modest benefits for osteoarthritis. Cancer claims are not supported by clinical trials.',
    keyStudies: [
      'Daily et al. (2016) — Modest pain reduction in osteoarthritis',
      'Nelson et al. (2017) — "Curcumin is a false lead" — PAINS compound in assays',
      'Kunnumakkara et al. (2017) — Bioavailability challenges remain unsolved',
    ],
    category: 'Anti-inflammatory',
  },
  {
    name: 'Ashwagandha',
    studyCount: 45,
    avgQuality: 5.2,
    popularity: 68,
    grade: 'B',
    claims: ['Stress killer', 'Testosterone booster', 'Adaptogen'],
    actualEvidence:
      'Moderate evidence for cortisol reduction and anxiety relief. Small studies show modest testosterone increase in men. Long-term safety data is limited. Most studies are small and industry-funded.',
    keyStudies: [
      'Chandrasekhar et al. (2012) — Reduced cortisol by 28% vs placebo',
      'Lopresti et al. (2019) — Modest improvements in stress and sleep',
      'Wankhede et al. (2015) — Small testosterone increase in exercising men',
    ],
    category: 'Adaptogens',
  },
  {
    name: 'Collagen',
    studyCount: 55,
    avgQuality: 5.0,
    popularity: 70,
    grade: 'C',
    claims: ['Anti-aging skin', 'Joint repair', 'Gut healing'],
    actualEvidence:
      'Limited evidence for skin elasticity improvement (small studies, mostly industry-funded). Modest evidence for joint pain in athletes. Collagen is broken down into amino acids during digestion — your body doesn\'t necessarily use them for collagen synthesis.',
    keyStudies: [
      'Bolke et al. (2019) — Improved skin elasticity after 4 weeks',
      'Clark et al. (2008) — Reduced joint pain in athletes',
      'Kirmse et al. (2019) — No benefit over whey protein for muscle',
    ],
    category: 'Beauty',
  },
  {
    name: 'Zinc',
    studyCount: 150,
    avgQuality: 6.5,
    popularity: 60,
    grade: 'B',
    claims: ['Cold fighter', 'Immune booster', 'Testosterone support'],
    actualEvidence:
      'Moderate evidence for reducing cold duration (by ~1 day) when taken within 24 hours of onset. Good evidence for correcting deficiency. Modest testosterone support only in deficient individuals.',
    keyStudies: [
      'Science et al. (2012) — Zinc lozenges reduce cold duration by 33%',
      'Prasad (2013) — Zinc deficiency affects 2 billion people globally',
      'Kilic (2007) — Testosterone restoration in deficient athletes',
    ],
    category: 'Minerals',
  },
  {
    name: 'Melatonin',
    studyCount: 195,
    avgQuality: 6.8,
    popularity: 85,
    grade: 'B',
    claims: ['Sleep pill', 'Safe for nightly use', 'More is better'],
    actualEvidence:
      'Good evidence for jet lag and circadian rhythm disorders. Modest effect on sleep onset (reduces time to fall asleep by ~7 minutes). Not a sedative — it\'s a circadian signal. Doses above 0.5mg may be counterproductive.',
    keyStudies: [
      'Ferracioli-Oda et al. (2013) — Reduces sleep onset by 7 minutes on average',
      'Herxheimer & Petrie (2002) — Effective for jet lag',
      'Erland & Saxena (2017) — Low doses (0.3-0.5mg) as effective as high doses',
    ],
    category: 'Sleep',
  },
  {
    name: 'Iron',
    studyCount: 250,
    avgQuality: 7.5,
    popularity: 55,
    grade: 'A',
    claims: ['Energy booster', 'Everyone needs it', 'More is better'],
    actualEvidence:
      'Strong evidence for treating iron-deficiency anemia. Should only be supplemented when deficient (blood test required). Excess iron is harmful — linked to oxidative stress and organ damage. Common deficiency in women, vegetarians, and athletes.',
    keyStudies: [
      'WHO Guidelines (2016) — Iron supplementation for confirmed deficiency',
      'Pasricha et al. (2021) — Iron deficiency without anemia still impairs function',
      'Muñoz et al. (2011) — IV iron superior for severe deficiency',
    ],
    category: 'Minerals',
  },
  {
    name: 'B-Complex',
    studyCount: 170,
    avgQuality: 6.2,
    popularity: 62,
    grade: 'B',
    claims: ['Energy vitamins', 'Stress reducer', 'Brain food'],
    actualEvidence:
      'Good evidence for correcting deficiency (common in elderly, vegans, alcoholics). B12 and folate are critical for nerve function and DNA synthesis. Limited evidence for energy boosting in non-deficient individuals. Neon yellow urine is just excess riboflavin.',
    keyStudies: [
      'Kennedy (2016) — B vitamins and brain function review',
      'Ford & Dimitrov (2013) — No benefit for cognitive decline in replete individuals',
      'Green et al. (2017) — B12 deficiency common in plant-based diets',
    ],
    category: 'Vitamins',
  },
  {
    name: 'Elderberry',
    studyCount: 15,
    avgQuality: 4.0,
    popularity: 52,
    grade: 'C',
    claims: ['Flu killer', 'Immune superfood', 'Antiviral'],
    actualEvidence:
      'Very limited clinical evidence. A few small studies suggest modest reduction in cold/flu duration. Concerns about cytokine storm potential in severe infections (theoretical). Most studies are industry-funded and small.',
    keyStudies: [
      'Tiralongo et al. (2016) — Reduced cold duration in air travelers',
      'Hawkins et al. (2019) — Modest antiviral activity in vitro',
      'Porter & Bode (2017) — Safety concerns re: immune overstimulation',
    ],
    category: 'Herbal',
  },
  {
    name: 'Caffeine',
    studyCount: 350,
    avgQuality: 8.0,
    popularity: 98,
    grade: 'A',
    claims: ['Performance enhancer', 'Weight loss aid', 'Addictive drug'],
    actualEvidence:
      'One of the most well-studied ergogenic aids. Strong evidence for cognitive and physical performance enhancement. Modest metabolic boost (3-5%). Tolerance develops. Withdrawal symptoms are real but mild. Safe up to ~400mg/day for most adults.',
    keyStudies: [
      'Goldstein et al. (2010) — ISSN position stand on caffeine and performance',
      'McLellan et al. (2016) — Military review: cognitive benefits well-established',
      'Poole et al. (2017) — 3-4 cups/day associated with lower all-cause mortality',
    ],
    category: 'Performance',
  },
  {
    name: 'CoQ10',
    studyCount: 85,
    avgQuality: 5.8,
    popularity: 45,
    grade: 'B',
    claims: ['Heart protector', 'Energy producer', 'Anti-aging'],
    actualEvidence:
      'Moderate evidence for statin-related muscle pain. Some evidence for heart failure patients. Your body produces CoQ10 naturally — levels decline with age. Ubiquinol form is better absorbed than ubiquinone.',
    keyStudies: [
      'Mortensen et al. (2014) — Q-SYMBIO: reduced mortality in heart failure',
      'Qu et al. (2018) — Modest benefit for statin myopathy',
      'Hernández-Camacho et al. (2018) — Age-related decline in CoQ10 levels',
    ],
    category: 'Antioxidants',
  },
  {
    name: 'Vitamin C',
    studyCount: 290,
    avgQuality: 7.0,
    popularity: 90,
    grade: 'B',
    claims: ['Cold cure', 'Immune miracle', 'Megadoses work'],
    actualEvidence:
      'Does NOT prevent colds in general population. May reduce cold duration by 8% in adults. Moderate evidence for immune support during physical stress. Megadoses (>2g/day) cause GI distress and kidney stone risk. 200mg/day saturates blood levels.',
    keyStudies: [
      'Hemilä & Chalker (2013) — Cochrane: no cold prevention, modest duration reduction',
      'Hemilä (2017) — Benefit mainly in physically stressed populations',
      'Carr & Maggini (2017) — 200mg/day sufficient for immune support',
    ],
    category: 'Vitamins',
  },
  {
    name: 'Berberine',
    studyCount: 40,
    avgQuality: 5.5,
    popularity: 42,
    grade: 'B',
    claims: ["Nature's Ozempic", 'Blood sugar miracle', 'Weight loss'],
    actualEvidence:
      'Moderate evidence for blood sugar reduction (comparable to metformin in small studies). NOT comparable to GLP-1 agonists like Ozempic for weight loss. May interact with many medications. GI side effects common.',
    keyStudies: [
      'Yin et al. (2012) — Blood glucose reduction comparable to metformin',
      'Liang et al. (2019) — Modest weight loss (avg 2-3 lbs over 12 weeks)',
      'Drug interaction concerns — inhibits CYP enzymes',
    ],
    category: 'Metabolic',
  },
  {
    name: 'Lion\'s Mane',
    studyCount: 20,
    avgQuality: 4.5,
    popularity: 55,
    grade: 'C',
    claims: ['Brain regenerator', 'Nerve growth factor booster', 'Nootropic'],
    actualEvidence:
      'Promising preclinical data for nerve growth factor stimulation. Very limited human studies. One small RCT in elderly with mild cognitive impairment showed improvement. Far too early to make strong claims.',
    keyStudies: [
      'Mori et al. (2009) — Improved cognitive function in elderly (n=30)',
      'Lai et al. (2013) — NGF stimulation in vitro',
      'Ratto et al. (2019) — Improved mood in overweight subjects',
    ],
    category: 'Nootropics',
  },
  {
    name: 'Protein (Whey)',
    studyCount: 300,
    avgQuality: 7.8,
    popularity: 92,
    grade: 'A',
    claims: ['Muscle builder', 'Required for gains', 'Kidney damage'],
    actualEvidence:
      'Strong evidence for muscle protein synthesis support. Effective when total protein intake is otherwise insufficient. No evidence of kidney damage in healthy individuals. Timing matters less than total daily intake.',
    keyStudies: [
      'Morton et al. (2018) — Meta-analysis: protein supplementation augments muscle gain',
      'Devries & Phillips (2015) — Whey superior for acute MPS vs casein/soy',
      'Van Elswyk et al. (2018) — No adverse renal effects in healthy adults',
    ],
    category: 'Performance',
  },
  {
    name: 'St. John\'s Wort',
    studyCount: 80,
    avgQuality: 6.0,
    popularity: 35,
    grade: 'B',
    claims: ['Natural antidepressant', 'Safe herbal remedy', 'No side effects'],
    actualEvidence:
      'Moderate evidence for mild-to-moderate depression (comparable to SSRIs in some studies). DANGEROUS drug interactions — induces CYP3A4 enzyme, reducing effectiveness of birth control, blood thinners, HIV medications, and many others.',
    keyStudies: [
      'Linde et al. (2008) — Cochrane: effective for mild-moderate depression',
      'Hypericum Depression Trial (2002) — Not effective for severe depression',
      'Multiple case reports of serious drug interactions',
    ],
    category: 'Herbal',
  },
  {
    name: 'Apple Cider Vinegar',
    studyCount: 12,
    avgQuality: 3.5,
    popularity: 65,
    grade: 'D',
    claims: ['Weight loss', 'Blood sugar control', 'Detox'],
    actualEvidence:
      'Very limited evidence. One small study showed modest blood sugar effect after high-carb meals. No meaningful weight loss evidence. Can damage tooth enamel and esophagus. "Detox" is not a real medical concept.',
    keyStudies: [
      'Johnston et al. (2004) — Modest postprandial glucose reduction (n=29)',
      'Kohn et al. (2015) — Tooth enamel erosion from regular use',
      'No large RCTs exist for any claimed benefit',
    ],
    category: 'Trendy',
  },
  {
    name: 'Biotin',
    studyCount: 25,
    avgQuality: 4.0,
    popularity: 58,
    grade: 'D',
    claims: ['Hair growth miracle', 'Nail strengthener', 'Beauty vitamin'],
    actualEvidence:
      'No evidence for hair/nail benefits in non-deficient individuals. Biotin deficiency is extremely rare. High-dose biotin interferes with lab tests (troponin, thyroid, hormone panels) — potentially dangerous misdiagnosis risk.',
    keyStudies: [
      'Patel et al. (2017) — No RCTs supporting hair/nail claims in healthy adults',
      'Li et al. (2017) — FDA warning: biotin interference with lab assays',
      'Biotin deficiency prevalence <0.1% in developed countries',
    ],
    category: 'Beauty',
  },
  {
    name: 'Glutamine',
    studyCount: 90,
    avgQuality: 5.5,
    popularity: 40,
    grade: 'C',
    claims: ['Muscle recovery', 'Gut healer', 'Immune booster'],
    actualEvidence:
      'Good evidence for ICU patients and severe burns. Minimal evidence for muscle recovery in healthy exercisers (body produces enough). Some evidence for gut barrier function in specific conditions. Your body makes 40-80g/day naturally.',
    keyStudies: [
      'Wischmeyer (2008) — Benefit in critical illness',
      'Candow et al. (2001) — No benefit for strength or body composition',
      'Benjamin et al. (2012) — No benefit for Crohn\'s disease maintenance',
    ],
    category: 'Performance',
  },
  {
    name: 'Rhodiola',
    studyCount: 30,
    avgQuality: 4.8,
    popularity: 38,
    grade: 'C',
    claims: ['Fatigue fighter', 'Stress adaptogen', 'Exercise performance'],
    actualEvidence:
      'Limited evidence for fatigue reduction in stressed individuals. A few small studies suggest modest anti-fatigue effects. Exercise performance data is mixed. Most studies are small, short-term, and from limited research groups.',
    keyStudies: [
      'Darbinyan et al. (2000) — Reduced mental fatigue in physicians on night duty',
      'Olsson et al. (2009) — Improved stress symptoms in burnout patients',
      'Parisi et al. (2010) — No ergogenic benefit in trained athletes',
    ],
    category: 'Adaptogens',
  },
];

export const CATEGORIES = [...new Set(SUPPLEMENTS.map((s) => s.category))];
