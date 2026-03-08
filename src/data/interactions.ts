export interface Interaction {
  medication: string;
  supplement: string;
  risk: 'High' | 'Moderate' | 'Low';
  mechanism: string;
  recommendation: string;
}

export const MEDICATIONS = [
  'Warfarin (Coumadin)',
  'Metformin',
  'Lisinopril',
  'Atorvastatin (Lipitor)',
  'Levothyroxine (Synthroid)',
  'Omeprazole (Prilosec)',
  'Sertraline (Zoloft)',
  'Metoprolol',
  'Amlodipine',
  'Losartan',
  'Gabapentin',
  'Fluoxetine (Prozac)',
  'Escitalopram (Lexapro)',
  'Prednisone',
  'Lithium',
];

export const SUPPLEMENTS = [
  'Vitamin D',
  'Fish Oil (Omega-3)',
  'Magnesium',
  'Vitamin K',
  'St. John\'s Wort',
  'Turmeric / Curcumin',
  'Iron',
  'Calcium',
  'Zinc',
  'Vitamin C',
  'Ashwagandha',
  'Melatonin',
  'CoQ10',
  'Ginkgo Biloba',
  'Vitamin B12',
  'Probiotics',
  'Green Tea Extract',
  'Garlic Extract',
  'Vitamin E',
  'Berberine',
];

export const INTERACTIONS: Interaction[] = [
  // --- Warfarin interactions ---
  {
    medication: 'Warfarin (Coumadin)',
    supplement: 'Vitamin K',
    risk: 'High',
    mechanism: 'Vitamin K directly opposes warfarin\'s anticoagulant mechanism by promoting clotting factor synthesis.',
    recommendation: 'Avoid large or variable doses of Vitamin K. Keep dietary intake consistent and inform your doctor of any supplement use.',
  },
  {
    medication: 'Warfarin (Coumadin)',
    supplement: 'Fish Oil (Omega-3)',
    risk: 'Moderate',
    mechanism: 'Fish oil has mild antiplatelet effects that can add to warfarin\'s anticoagulant action, increasing bleeding risk.',
    recommendation: 'Use with caution. Monitor INR more frequently if adding fish oil. Doses under 2g/day are generally lower risk.',
  },
  {
    medication: 'Warfarin (Coumadin)',
    supplement: 'St. John\'s Wort',
    risk: 'High',
    mechanism: 'St. John\'s Wort induces CYP3A4 and CYP2C9 enzymes, accelerating warfarin metabolism and reducing its effectiveness.',
    recommendation: 'Avoid this combination. St. John\'s Wort can cause dangerous drops in warfarin levels, leading to clot risk.',
  },
  {
    medication: 'Warfarin (Coumadin)',
    supplement: 'Ginkgo Biloba',
    risk: 'High',
    mechanism: 'Ginkgo has antiplatelet properties that compound with warfarin\'s anticoagulant effects.',
    recommendation: 'Avoid combining. Increased risk of serious bleeding events including intracranial hemorrhage.',
  },
  {
    medication: 'Warfarin (Coumadin)',
    supplement: 'Garlic Extract',
    risk: 'Moderate',
    mechanism: 'Garlic inhibits platelet aggregation and may potentiate warfarin\'s blood-thinning effects.',
    recommendation: 'Use caution with concentrated garlic supplements. Culinary garlic in normal amounts is generally safe.',
  },
  {
    medication: 'Warfarin (Coumadin)',
    supplement: 'Vitamin E',
    risk: 'Moderate',
    mechanism: 'High-dose Vitamin E (>400 IU) can inhibit vitamin K-dependent clotting and increase bleeding risk with warfarin.',
    recommendation: 'Keep Vitamin E under 400 IU/day. Monitor INR if supplementing.',
  },
  {
    medication: 'Warfarin (Coumadin)',
    supplement: 'Turmeric / Curcumin',
    risk: 'Moderate',
    mechanism: 'Curcumin may inhibit platelet aggregation and potentiate warfarin\'s anticoagulant effect.',
    recommendation: 'Use with caution, especially at high doses. Monitor INR closely.',
  },
  {
    medication: 'Warfarin (Coumadin)',
    supplement: 'CoQ10',
    risk: 'Moderate',
    mechanism: 'CoQ10 is structurally similar to Vitamin K and may reduce warfarin\'s anticoagulant effect.',
    recommendation: 'Monitor INR when starting or stopping CoQ10. Dose adjustments may be needed.',
  },
  {
    medication: 'Warfarin (Coumadin)',
    supplement: 'Green Tea Extract',
    risk: 'Moderate',
    mechanism: 'Green tea contains Vitamin K which can antagonize warfarin. Concentrated extracts have higher amounts.',
    recommendation: 'Moderate green tea consumption is usually fine, but avoid concentrated extract supplements.',
  },

  // --- Statin interactions ---
  {
    medication: 'Atorvastatin (Lipitor)',
    supplement: 'St. John\'s Wort',
    risk: 'High',
    mechanism: 'St. John\'s Wort induces CYP3A4, significantly reducing statin blood levels and effectiveness.',
    recommendation: 'Avoid this combination. Statin therapy may become ineffective.',
  },
  {
    medication: 'Atorvastatin (Lipitor)',
    supplement: 'Berberine',
    risk: 'Moderate',
    mechanism: 'Berberine inhibits CYP3A4, potentially increasing statin levels and risk of myopathy/rhabdomyolysis.',
    recommendation: 'Use with caution. Watch for muscle pain, weakness, or dark urine. Consider lower statin doses.',
  },
  {
    medication: 'Atorvastatin (Lipitor)',
    supplement: 'CoQ10',
    risk: 'Low',
    mechanism: 'Statins deplete CoQ10 levels. Supplementing may help with statin-related muscle symptoms.',
    recommendation: 'Generally beneficial. 100-200mg/day CoQ10 may help with statin side effects.',
  },

  // --- SSRI interactions ---
  {
    medication: 'Sertraline (Zoloft)',
    supplement: 'St. John\'s Wort',
    risk: 'High',
    mechanism: 'Both increase serotonin levels. Combining creates risk of serotonin syndrome — a potentially fatal condition.',
    recommendation: 'Never combine SSRIs with St. John\'s Wort. This is a well-documented dangerous interaction.',
  },
  {
    medication: 'Sertraline (Zoloft)',
    supplement: 'Fish Oil (Omega-3)',
    risk: 'Low',
    mechanism: 'Omega-3 may have mild mood-supporting effects. No significant pharmacokinetic interaction.',
    recommendation: 'Generally safe to combine. Some evidence suggests omega-3 may complement antidepressant therapy.',
  },
  {
    medication: 'Fluoxetine (Prozac)',
    supplement: 'St. John\'s Wort',
    risk: 'High',
    mechanism: 'Serotonin syndrome risk. Both compounds increase synaptic serotonin through different mechanisms.',
    recommendation: 'Absolutely avoid. Wait at least 5 weeks after stopping fluoxetine before using St. John\'s Wort (long half-life).',
  },
  {
    medication: 'Escitalopram (Lexapro)',
    supplement: 'St. John\'s Wort',
    risk: 'High',
    mechanism: 'Serotonin syndrome risk from dual serotonergic activity.',
    recommendation: 'Do not combine. Potentially life-threatening interaction.',
  },
  {
    medication: 'Escitalopram (Lexapro)',
    supplement: 'Melatonin',
    risk: 'Low',
    mechanism: 'No significant pharmacokinetic interaction. SSRIs may affect sleep; melatonin may help.',
    recommendation: 'Generally safe. Start with low melatonin doses (0.5-3mg).',
  },

  // --- Levothyroxine interactions ---
  {
    medication: 'Levothyroxine (Synthroid)',
    supplement: 'Calcium',
    risk: 'High',
    mechanism: 'Calcium binds to levothyroxine in the gut, drastically reducing absorption.',
    recommendation: 'Separate by at least 4 hours. Take levothyroxine on an empty stomach, calcium later in the day.',
  },
  {
    medication: 'Levothyroxine (Synthroid)',
    supplement: 'Iron',
    risk: 'High',
    mechanism: 'Iron forms insoluble complexes with levothyroxine, reducing absorption by up to 75%.',
    recommendation: 'Separate by at least 4 hours. This is one of the most clinically significant nutrient-drug interactions.',
  },
  {
    medication: 'Levothyroxine (Synthroid)',
    supplement: 'Magnesium',
    risk: 'Moderate',
    mechanism: 'Magnesium can bind levothyroxine and reduce its absorption, though less severely than calcium or iron.',
    recommendation: 'Separate by at least 4 hours for best absorption.',
  },

  // --- Metformin interactions ---
  {
    medication: 'Metformin',
    supplement: 'Vitamin B12',
    risk: 'Low',
    mechanism: 'Metformin reduces B12 absorption over time. Supplementing B12 is often recommended, not contraindicated.',
    recommendation: 'Beneficial to supplement. Long-term metformin users should monitor B12 levels annually.',
  },
  {
    medication: 'Metformin',
    supplement: 'Berberine',
    risk: 'Moderate',
    mechanism: 'Both lower blood glucose through similar mechanisms (AMPK activation). Combined use increases hypoglycemia risk.',
    recommendation: 'Monitor blood sugar closely if combining. May need to reduce metformin dose.',
  },

  // --- PPI interactions ---
  {
    medication: 'Omeprazole (Prilosec)',
    supplement: 'Magnesium',
    risk: 'Low',
    mechanism: 'Long-term PPI use depletes magnesium. Supplementation may be beneficial.',
    recommendation: 'Supplementing is generally helpful. Use magnesium citrate or glycinate for better absorption.',
  },
  {
    medication: 'Omeprazole (Prilosec)',
    supplement: 'Iron',
    risk: 'Moderate',
    mechanism: 'PPIs reduce stomach acid needed for iron absorption, potentially worsening iron deficiency.',
    recommendation: 'Take iron with vitamin C to improve absorption. Consider iron bisglycinate form.',
  },
  {
    medication: 'Omeprazole (Prilosec)',
    supplement: 'Vitamin B12',
    risk: 'Moderate',
    mechanism: 'PPIs reduce acid needed to release B12 from food proteins. Long-term use linked to B12 deficiency.',
    recommendation: 'Consider sublingual B12 which bypasses the need for stomach acid.',
  },

  // --- Lithium interactions ---
  {
    medication: 'Lithium',
    supplement: 'Caffeine / Green Tea Extract',
    risk: 'Moderate',
    mechanism: 'Caffeine increases renal lithium clearance. Sudden changes in caffeine intake can alter lithium levels.',
    recommendation: 'Keep caffeine intake consistent. Don\'t suddenly start or stop caffeinated supplements.',
  },

  // --- Other notable ---
  {
    medication: 'Lisinopril',
    supplement: 'Potassium',
    risk: 'High',
    mechanism: 'ACE inhibitors increase potassium retention. Additional potassium supplementation can cause dangerous hyperkalemia.',
    recommendation: 'Avoid potassium supplements unless directed by a physician. Monitor serum potassium levels.',
  },
  {
    medication: 'Prednisone',
    supplement: 'Calcium',
    risk: 'Low',
    mechanism: 'Corticosteroids deplete calcium and increase osteoporosis risk. Calcium supplementation is often recommended.',
    recommendation: 'Supplementing calcium + vitamin D is generally advised during long-term prednisone use.',
  },
  {
    medication: 'Gabapentin',
    supplement: 'Magnesium',
    risk: 'Low',
    mechanism: 'Magnesium antacids can reduce gabapentin absorption if taken simultaneously.',
    recommendation: 'Separate by at least 2 hours. Otherwise no significant interaction.',
  },
  {
    medication: 'Amlodipine',
    supplement: 'St. John\'s Wort',
    risk: 'Moderate',
    mechanism: 'St. John\'s Wort induces CYP3A4, potentially reducing amlodipine levels and blood pressure control.',
    recommendation: 'Avoid if possible. Monitor blood pressure closely if combining.',
  },
  {
    medication: 'Metoprolol',
    supplement: 'Melatonin',
    risk: 'Low',
    mechanism: 'Beta-blockers can suppress melatonin production. Supplementing may help with beta-blocker-related insomnia.',
    recommendation: 'Generally safe and may be beneficial. Start with 0.5-1mg melatonin.',
  },
];

export function findInteractions(medication: string, supplement: string): Interaction | null {
  return INTERACTIONS.find(
    (i) => i.medication === medication && i.supplement === supplement
  ) || null;
}

export function getInteractionsForMedication(medication: string): Interaction[] {
  return INTERACTIONS.filter((i) => i.medication === medication);
}

export function getInteractionsForSupplement(supplement: string): Interaction[] {
  return INTERACTIONS.filter((i) => i.supplement === supplement);
}
