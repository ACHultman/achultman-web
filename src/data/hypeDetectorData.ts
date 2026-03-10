export interface HypeClaimData {
  sampleSize: number;
  pValue: number;
  effectSize: string;
  confidenceInterval: string;
  studyType: string;
  duration: string;
}

export interface HypeClaimPipeline {
  headline: string;
  article: string;
  pressRelease: string;
  abstract: string;
  data: HypeClaimData;
}

export interface HypeClaim {
  id: string;
  headline: string;
  hypeScore: number;
  pipeline: HypeClaimPipeline;
  actualFinding: string;
  pubmedUrl: string;
  category: string;
}

export const HYPE_CLAIMS: HypeClaim[] = [
  {
    id: 'turmeric-inflammation',
    headline: 'Turmeric CURES Inflammation!',
    hypeScore: 92,
    pipeline: {
      headline: 'Turmeric CURES Inflammation! Scientists Stunned by Ancient Spice\'s Power!',
      article:
        'A new study suggests turmeric may hold the key to fighting chronic inflammation, with researchers calling the results "promising" for millions of sufferers.',
      pressRelease:
        'University researchers have identified anti-inflammatory properties in curcumin, the active compound in turmeric, which may warrant further clinical investigation.',
      abstract:
        'Curcumin demonstrated statistically significant inhibition of NF-κB pathway activation in cultured macrophage cell lines (p < 0.05), suggesting potential anti-inflammatory mechanisms requiring in vivo validation.',
      data: {
        sampleSize: 48,
        pValue: 0.038,
        effectSize: "Cohen's d = 0.41 (small-medium)",
        confidenceInterval: '95% CI [0.02, 0.80]',
        studyType: 'In vitro (cell culture)',
        duration: '72 hours',
      },
    },
    actualFinding:
      'Curcumin showed modest anti-inflammatory effects in isolated cells in a lab dish. No human clinical trial was conducted. The concentrations used were far higher than achievable through dietary turmeric consumption.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/17569205/',
    category: 'Supplements',
  },
  {
    id: 'vitamin-d-covid',
    headline: 'Vitamin D PREVENTS COVID-19!',
    hypeScore: 88,
    pipeline: {
      headline: 'Vitamin D PREVENTS COVID-19! Cheap Supplement Could End the Pandemic!',
      article:
        'Researchers have found that people with higher vitamin D levels were significantly less likely to test positive for COVID-19, sparking hopes for a simple preventive measure.',
      pressRelease:
        'A large observational study has identified a statistically significant association between serum 25-hydroxyvitamin D levels and COVID-19 positivity rates, warranting randomized controlled trials.',
      abstract:
        'In a retrospective cohort analysis, subjects with sufficient vitamin D levels (≥30 ng/mL) showed lower SARS-CoV-2 positivity rates compared to deficient subjects (OR 0.62, 95% CI [0.45, 0.84]). Causal inference is limited by the observational design.',
      data: {
        sampleSize: 489,
        pValue: 0.004,
        effectSize: 'OR = 0.62 (moderate association)',
        confidenceInterval: '95% CI [0.45, 0.84]',
        studyType: 'Retrospective observational cohort',
        duration: '3 months',
      },
    },
    actualFinding:
      'People with higher vitamin D levels tested positive for COVID-19 less often, but this was an observational correlation. Healthier people tend to have higher vitamin D. No causal evidence that supplementation prevents infection.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/32942005/',
    category: 'Supplements',
  },
  {
    id: 'fish-oil-heart',
    headline: 'Fish Oil PREVENTS Heart Disease!',
    hypeScore: 74,
    pipeline: {
      headline: 'Fish Oil PREVENTS Heart Disease! Omega-3 Supplements Save Lives!',
      article:
        'A major clinical trial has shown that omega-3 supplements can reduce the risk of cardiovascular events, leading cardiologists to reconsider supplementation guidelines.',
      pressRelease:
        'The REDUCE-IT trial demonstrated a 25% relative risk reduction in major adverse cardiovascular events with high-dose icosapent ethyl (EPA) supplementation in statin-treated patients with elevated triglycerides.',
      abstract:
        'High-dose icosapent ethyl (4g/day) reduced the composite endpoint of cardiovascular death, nonfatal MI, nonfatal stroke, coronary revascularization, or unstable angina (HR 0.75, 95% CI [0.68, 0.83]) vs. mineral oil placebo. The mineral oil placebo may have inflated LDL-C in the control group.',
      data: {
        sampleSize: 8179,
        pValue: 0.00000001,
        effectSize: 'HR = 0.75 (25% relative risk reduction)',
        confidenceInterval: '95% CI [0.68, 0.83]',
        studyType: 'RCT (REDUCE-IT)',
        duration: '4.9 years median follow-up',
      },
    },
    actualFinding:
      'High-dose prescription EPA (not regular fish oil supplements) reduced cardiovascular events in high-risk patients already on statins. The mineral oil placebo used in the trial may have worsened the control group\'s results. Over-the-counter fish oil supplements have shown mixed results in other trials.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/30415628/',
    category: 'Supplements',
  },
  {
    id: 'red-wine-heart',
    headline: 'Red Wine Is GOOD For Your Heart!',
    hypeScore: 85,
    pipeline: {
      headline: 'Red Wine Is GOOD For Your Heart! Scientists Say Drink Up!',
      article:
        'The "French Paradox" may finally be explained: researchers have found that resveratrol, a compound in red wine, has powerful cardioprotective effects in laboratory studies.',
      pressRelease:
        'Researchers at Harvard Medical School have demonstrated that resveratrol activates the SIRT1 longevity pathway in animal models, suggesting potential cardiovascular benefits that merit human clinical investigation.',
      abstract:
        'Resveratrol administration (22.4 mg/kg/day) in mice on a high-calorie diet improved survival, motor function, and insulin sensitivity compared to controls. Effective doses in mice would require consumption of approximately 750–1500 bottles of red wine daily to achieve equivalent human dosing.',
      data: {
        sampleSize: 120,
        pValue: 0.005,
        effectSize: '31% improved survival in treated mice',
        confidenceInterval: '95% CI [18%, 44%]',
        studyType: 'Animal model (mice)',
        duration: '2 years',
      },
    },
    actualFinding:
      'Resveratrol showed health benefits in mice fed high-calorie diets, but at doses equivalent to drinking 750–1500 bottles of wine per day. At actual wine consumption levels, resveratrol content is far too low for any measurable effect. Alcohol itself is classified as a Group 1 carcinogen.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/17086191/',
    category: 'Diet',
  },
  {
    id: 'coffee-cancer',
    headline: 'Coffee CAUSES Cancer!',
    hypeScore: 78,
    pipeline: {
      headline: 'Coffee CAUSES Cancer! Your Morning Cup Could Be Killing You!',
      article:
        'The World Health Organization once classified coffee as "possibly carcinogenic," putting it in the same category as lead and DDT. Should you be worried about your daily brew?',
      pressRelease:
        'Following a comprehensive review, IARC has reclassified coffee from Group 2B ("possibly carcinogenic") to Group 3 ("not classifiable"), noting that earlier associations were confounded by concurrent tobacco use among coffee drinkers.',
      abstract:
        'A meta-analysis of 1,000+ studies found no consistent association between coffee consumption (3–5 cups/day) and overall cancer risk. Earlier positive associations were attributable to confounding by smoking. Coffee consumption was inversely associated with liver and endometrial cancer risk.',
      data: {
        sampleSize: 500000,
        pValue: 0.72,
        effectSize: 'RR = 0.97 (no meaningful association)',
        confidenceInterval: '95% CI [0.93, 1.02]',
        studyType: 'Meta-analysis of cohort studies',
        duration: '20+ years of accumulated evidence',
      },
    },
    actualFinding:
      'After reviewing decades of research involving over 500,000 participants, the WHO reclassified coffee as "not classifiable as carcinogenic." The original cancer link was driven by smoking—coffee drinkers in older studies also tended to smoke. Coffee may actually reduce risk of some cancers.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/27318851/',
    category: 'Diet',
  },
  {
    id: 'chocolate-brain',
    headline: 'Chocolate IMPROVES Brain Function!',
    hypeScore: 81,
    pipeline: {
      headline: 'Chocolate IMPROVES Brain Function! Eat More Chocolate, Get Smarter!',
      article:
        'A new study from Columbia University shows that cocoa flavanols can reverse age-related memory decline, potentially offering a delicious way to keep your brain sharp.',
      pressRelease:
        'Columbia University Medical Center researchers have demonstrated that dietary cocoa flavanols improve dentate gyrus function in older adults, as measured by a pattern recognition memory task.',
      abstract:
        'Participants aged 50–69 consuming a high-flavanol cocoa drink (900 mg flavanols/day) for 3 months showed improved performance on a modified Benton Recognition test compared to low-flavanol controls. The high-flavanol preparation is not commercially available and differs substantially from processed chocolate.',
      data: {
        sampleSize: 37,
        pValue: 0.02,
        effectSize: "Cohen's d = 0.60 (medium)",
        confidenceInterval: '95% CI [0.09, 1.11]',
        studyType: 'RCT (small, single-site)',
        duration: '3 months',
      },
    },
    actualFinding:
      'A tiny study of 37 older adults found a modest memory improvement from a specially-prepared high-concentration cocoa flavanol drink (not chocolate). You would need to eat roughly 7 large dark chocolate bars daily to match the flavanol dose used. The study has not been replicated at scale.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/25344629/',
    category: 'Diet',
  },
  {
    id: 'running-knees',
    headline: 'Running DESTROYS Your Knees!',
    hypeScore: 76,
    pipeline: {
      headline: 'Running DESTROYS Your Knees! Experts Warn of Irreversible Damage!',
      article:
        'Despite popular belief, new research challenges the long-held assumption that running is bad for your joints. But orthopedic surgeons remain divided on the issue.',
      pressRelease:
        'A large-scale registry study from Brigham Young University found that recreational runners had lower rates of knee osteoarthritis compared to sedentary individuals, contradicting common assumptions about running and joint health.',
      abstract:
        'In a systematic review and meta-analysis of 25 studies (125,810 subjects), recreational runners had a significantly lower prevalence of knee and hip osteoarthritis (3.5%) compared to sedentary controls (10.2%) and competitive/elite runners (13.3%). Results suggest a U-shaped relationship between running volume and joint health.',
      data: {
        sampleSize: 125810,
        pValue: 0.001,
        effectSize: 'OR = 0.34 for recreational vs sedentary',
        confidenceInterval: '95% CI [0.20, 0.56]',
        studyType: 'Systematic review & meta-analysis',
        duration: 'Cross-sectional data, multi-decade range',
      },
    },
    actualFinding:
      'Moderate recreational running is actually associated with LOWER rates of knee osteoarthritis than being sedentary. The data shows a U-shaped curve: both inactivity and extreme competitive running may increase risk, but moderate running appears protective for joint health.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/28504066/',
    category: 'Lifestyle',
  },
  {
    id: 'eggs-smoking',
    headline: 'Eggs Are as Bad as SMOKING!',
    hypeScore: 95,
    pipeline: {
      headline: 'Eggs Are as Bad as SMOKING! Scientists Reveal Shocking Truth About Breakfast!',
      article:
        'A study published in Atherosclerosis found that eating egg yolks accelerates the buildup of artery-clogging plaque almost as much as smoking cigarettes, alarming health experts worldwide.',
      pressRelease:
        'Western University researchers report that egg yolk consumption is associated with carotid plaque area in a dose-response manner similar to smoking pack-years, based on self-reported dietary recall data.',
      abstract:
        'In a cross-sectional survey of 1,231 patients attending vascular prevention clinics, self-reported egg yolk-years of consumption correlated with carotid total plaque area (r = 0.03, p = 0.04). The study relied on recall of lifetime egg consumption and did not control for overall dietary pattern, exercise, or other confounders.',
      data: {
        sampleSize: 1231,
        pValue: 0.04,
        effectSize: 'r = 0.03 (negligible correlation)',
        confidenceInterval: '95% CI [0.001, 0.059]',
        studyType: 'Cross-sectional survey (self-reported)',
        duration: 'Single time point, recalled lifetime exposure',
      },
    },
    actualFinding:
      'A single cross-sectional study asked patients to recall how many eggs they\'d eaten over their entire lifetime, then correlated this with artery plaque. The correlation was r = 0.03 (essentially zero). The study did not control for exercise, diet, or other factors. The methodology was widely criticized by epidemiologists.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/22882905/',
    category: 'Diet',
  },
  {
    id: 'fasting-aging',
    headline: 'Intermittent Fasting REVERSES Aging!',
    hypeScore: 87,
    pipeline: {
      headline: 'Intermittent Fasting REVERSES Aging! Scientists Discover Fountain of Youth!',
      article:
        'Researchers have found that periodic fasting can trigger cellular repair mechanisms that slow — and potentially reverse — the aging process, according to a groundbreaking new study.',
      pressRelease:
        'A clinical trial from the University of Southern California\'s Longevity Institute shows that a fasting-mimicking diet reduces biomarkers associated with aging, cancer, cardiovascular disease, and diabetes in a randomized human trial.',
      abstract:
        'In a randomized crossover trial, 100 participants completing three monthly cycles of a 5-day fasting-mimicking diet (FMD) showed reduced BMI, blood pressure, fasting glucose, IGF-1, triglycerides, and C-reactive protein compared to controls. Biomarker changes were modest and returned toward baseline during ad libitum refeeding periods.',
      data: {
        sampleSize: 100,
        pValue: 0.01,
        effectSize: 'IGF-1 reduction: 11.3% from baseline',
        confidenceInterval: '95% CI [5.2%, 17.4%]',
        studyType: 'RCT (crossover design)',
        duration: '3 months (three 5-day FMD cycles)',
      },
    },
    actualFinding:
      'A small study found that a 5-day fasting-mimicking diet repeated monthly for 3 months modestly reduced some biomarkers associated with aging risk. These are surrogate markers, not actual evidence of reversed aging. Changes were small and partially reversed when normal eating resumed.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/28202779/',
    category: 'Lifestyle',
  },
  {
    id: 'cellphones-cancer',
    headline: 'Cell Phones CAUSE Brain Cancer!',
    hypeScore: 72,
    pipeline: {
      headline: 'Cell Phones CAUSE Brain Cancer! Is Your Phone Slowly Killing You?',
      article:
        'A decade-long international study has reignited fears about cell phone radiation, finding a possible link between heavy mobile phone use and a rare type of brain tumor.',
      pressRelease:
        'The INTERPHONE study, the largest case-control study of cell phone use and brain tumors to date, found no overall increase in glioma or meningioma risk, but noted a suggestion of increased risk at the highest exposure levels that could not be ruled as causal.',
      abstract:
        'The INTERPHONE multicenter case-control study (13 countries, 2,708 glioma cases, 2,409 meningioma cases) found no increased risk of glioma (OR 0.81, 95% CI [0.70, 0.94]) or meningioma (OR 0.79, 95% CI [0.68, 0.91]) for regular cell phone users. An elevated OR in the highest decile of recalled cumulative call time was noted but was subject to reporting bias.',
      data: {
        sampleSize: 5117,
        pValue: 0.16,
        effectSize: 'OR = 0.81 for glioma (protective direction)',
        confidenceInterval: '95% CI [0.70, 0.94]',
        studyType: 'Multicenter case-control (INTERPHONE)',
        duration: '10-year study period',
      },
    },
    actualFinding:
      'The largest study on cell phones and brain cancer (5,000+ participants across 13 countries over 10 years) found no increased risk. If anything, the data trended in the protective direction. After decades of research and billions of cell phone users, no consistent evidence of brain cancer risk has emerged.',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/20483835/',
    category: 'Lifestyle',
  },
];

export const PIPELINE_STAGES = [
  { key: 'headline', label: 'Viral Headline', color: 'red', emoji: '🔥' },
  { key: 'article', label: 'News Article', color: 'orange', emoji: '📰' },
  { key: 'pressRelease', label: 'Press Release', color: 'yellow', emoji: '🏛️' },
  { key: 'abstract', label: 'Study Abstract', color: 'teal', emoji: '📄' },
  { key: 'data', label: 'Raw Data', color: 'green', emoji: '📊' },
] as const;

export type PipelineStageKey = (typeof PIPELINE_STAGES)[number]['key'];

export const CATEGORY_COLORS: Record<string, string> = {
  Supplements: 'purple',
  Diet: 'orange',
  Lifestyle: 'blue',
};
