// Content layer: sources, withdrawal symptoms and health milestones.
// Every timing below comes from the cited literature; where studies give a
// range we use a typical midpoint and say so in the copy.

export const SOURCES = [
  { key: 'budney2003', title: 'The time course and significance of cannabis withdrawal', journal: 'Journal of Abnormal Psychology', authors: 'Budney AJ, Moore BA, Vandrey RG, Hughes JR', year: 2003 },
  { key: 'budney2004', title: 'Review of the validity and significance of cannabis withdrawal syndrome', journal: 'American Journal of Psychiatry', authors: 'Budney AJ, Hughes JR, Moore BA, Vandrey R', year: 2004 },
  { key: 'connor2022', title: 'Clinical management of cannabis withdrawal', journal: 'Addiction', authors: 'Connor JP, Stjepanović D, Budney AJ, Le Foll B, Hall WD', year: 2022 },
  { key: 'bahji2020', title: 'Prevalence of cannabis withdrawal symptoms among people with regular or dependent use of cannabinoids: a systematic review and meta-analysis', journal: 'JAMA Network Open', authors: 'Bahji A, Stephenson C, Tyo R, Hawken ER, Seitz DP', year: 2020 },
  { key: 'allsop2011', title: 'The Cannabis Withdrawal Scale development: patterns and predictors of cannabis withdrawal and distress', journal: 'Drug and Alcohol Dependence', authors: 'Allsop DJ, Norberg MM, Copeland J, Fu S, Budney AJ', year: 2011 },
  { key: 'schlienz2017', title: 'Cannabis withdrawal: a review of neurobiological mechanisms and sex differences', journal: 'Current Addiction Reports', authors: 'Schlienz NJ, Budney AJ, Lee DC, Vandrey R', year: 2017 },
  { key: 'hirvonen2012', title: 'Reversible and regionally selective downregulation of brain cannabinoid CB1 receptors in chronic daily cannabis smokers', journal: 'Molecular Psychiatry', authors: 'Hirvonen J, Goodwin RS, Li CT, Terry GE, Zoghbi SS, Morse C, Pike VW, Volkow ND, Huestis MA, Innis RB', year: 2012 },
  { key: 'dsouza2016', title: 'Rapid changes in CB1 receptor availability in cannabis dependent males after abstinence from cannabis', journal: 'Biological Psychiatry: Cognitive Neuroscience and Neuroimaging', authors: "D'Souza DC, Cortes-Briones JA, Ranganathan M, et al.", year: 2016 },
  { key: 'gates2016', title: 'Cannabis withdrawal and sleep: a systematic review of human studies', journal: 'Substance Abuse', authors: 'Gates P, Albertella L, Copeland J', year: 2016 },
  { key: 'bolla2008', title: 'Sleep disturbance in heavy marijuana users', journal: 'Sleep', authors: 'Bolla KI, Lesage SR, Gamaldo CE, et al.', year: 2008 },
  { key: 'schuster2018', title: 'One month of cannabis abstinence in adolescents and young adults is associated with improved memory', journal: 'Journal of Clinical Psychiatry', authors: 'Schuster RM, Gilman J, Schoenfeld D, et al.', year: 2018 },
  { key: 'tashkin2013', title: 'Effects of marijuana smoking on the lung', journal: 'Annals of the American Thoracic Society', authors: 'Tashkin DP', year: 2013 },
  { key: 'hancox2015', title: 'Effects of quitting cannabis on respiratory symptoms', journal: 'European Respiratory Journal', authors: 'Hancox RJ, Shin HH, Gray AR, Poulton R, Sears MR', year: 2015 },
  { key: 'wu1988', title: 'Pulmonary hazards of smoking marijuana as compared with tobacco', journal: 'New England Journal of Medicine', authors: 'Wu TC, Tashkin DP, Djahed B, Rose JE', year: 1988 },
  { key: 'weaver2009', title: 'Carbon monoxide poisoning', journal: 'New England Journal of Medicine', authors: 'Weaver LK', year: 2009 },
  { key: 'jones2002', title: 'Cardiovascular system effects of marijuana', journal: 'Journal of Clinical Pharmacology', authors: 'Jones RT', year: 2002 },
  { key: 'grotenhermen2003', title: 'Pharmacokinetics and pharmacodynamics of cannabinoids', journal: 'Clinical Pharmacokinetics', authors: 'Grotenhermen F', year: 2003 },
  { key: 'huestis2007', title: 'Human cannabinoid pharmacokinetics', journal: 'Chemistry & Biodiversity', authors: 'Huestis MA', year: 2007 },
  { key: 'chayasirisobhon2020', title: 'Mechanisms of action and pharmacokinetics of cannabis', journal: 'The Permanente Journal', authors: 'Chayasirisobhon S', year: 2020 },
  { key: 'johansson1989', title: 'Terminal elimination plasma half-life of Δ1-tetrahydrocannabinol (Δ1-THC) in heavy users of marijuana', journal: 'European Journal of Clinical Pharmacology', authors: 'Johansson E, Halldin MM, Agurell S, Hollister LE, Gillespie HK', year: 1989 },
  { key: 'goodwin2008', title: 'Urinary elimination of 11-nor-9-carboxy-Δ9-tetrahydrocannabinol in cannabis users during continuously monitored abstinence', journal: 'Journal of Analytical Toxicology', authors: 'Goodwin RS, Darwin WD, Chiang CN, Shih M, Li SH, Huestis MA', year: 2008 },
  { key: 'ellis1985', title: 'Excretion patterns of cannabinoid metabolites after last use in a group of chronic users', journal: 'Clinical Pharmacology & Therapeutics', authors: 'Ellis GM Jr, Mann MA, Judson BA, Schramm NT, Tashchian A', year: 1985 },
  { key: 'lally2010', title: 'How are habits formed: modelling habit formation in the real world', journal: 'European Journal of Social Psychology', authors: 'Lally P, van Jaarsveld CHM, Potts HWW, Wardle J', year: 2010 },
  { key: 'bowen2009', title: 'Surfing the urge: brief mindfulness-based intervention for college student smokers', journal: 'Psychology of Addictive Behaviors', authors: 'Bowen S, Marlatt A', year: 2009 },
  { key: 'buchowski2011', title: 'Aerobic exercise training reduces cannabis craving and use in non-treatment seeking cannabis-dependent adults', journal: 'PLoS ONE', authors: 'Buchowski MS, Meade NN, Charboneau E, et al.', year: 2011 },
  { key: 'kjaervik2024', title: 'A meta-analytic review of anger management activities that increase or decrease arousal: what fuels or douses rage?', journal: 'Clinical Psychology Review', authors: 'Kjaervik SL, Bushman BJ', year: 2024 },
  { key: 'zaccaro2018', title: 'How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing', journal: 'Frontiers in Human Neuroscience', authors: 'Zaccaro A, Piarulli A, Laurino M, et al.', year: 2018 },
  { key: 'haghayegh2019', title: 'Before-bedtime passive body heating by warm shower or bath to improve sleep: a systematic review and meta-analysis', journal: 'Sleep Medicine Reviews', authors: 'Haghayegh S, Khoshnevis S, Smolensky MH, Diller KR, Castriotta RJ', year: 2019 },
  { key: 'irish2015', title: 'The role of sleep hygiene in promoting public health: a review of empirical evidence', journal: 'Sleep Medicine Reviews', authors: 'Irish LA, Kline CE, Gunn HE, Buysse DJ, Hall MH', year: 2015 },
].map((s, i) => ({ ...s, n: i + 1 }));

export const SOURCE_BY_KEY = Object.fromEntries(SOURCES.map((s) => [s.key, s]));

export function sourceUrl(s) {
  return 'https://pubmed.ncbi.nlm.nih.gov/?term=' + encodeURIComponent(s.title);
}

export const CATEGORIES = {
  detox: { label: 'Detox', icon: '🧪' },
  body: { label: 'Body', icon: '❤️' },
  mind: { label: 'Mind', icon: '🧠' },
  lungs: { label: 'Lungs', icon: '🫁' },
  sleep: { label: 'Sleep', icon: '🌙' },
  you: { label: 'You', icon: '⭐' },
};

// Withdrawal symptoms. Times are in days since the last use.
//   onset   – when the symptom typically appears
//   peak    – when it is typically at its worst (0 = worst at the start)
//   resolve – when it has typically faded back to baseline
// Core pattern (Budney 2003/2004, Connor 2022): onset 1–3 days, peak days 2–6,
// most symptoms gone within 1–2 weeks; sleep problems and strange dreams last longest.
export const SYMPTOMS = [
  {
    id: 'irritability', name: 'Irritability & Anger', resolvedName: 'Calmer Temper', emoji: '😤', cat: 'mind',
    onset: 1, peak: 3, resolve: 14, range: '1–2 weeks',
    what: 'Irritability is one of the most common withdrawal symptoms. With THC gone, the brain’s own cannabinoid system is temporarily under-powered, so small annoyances feel bigger. It typically peaks around days 2–6 and is back to normal within about two weeks.',
    tips: [
      { text: 'Calm the body down rather than “letting it out”: slow breathing, a slow walk or yoga reduce anger; venting and high-arousal activities tend to fuel it.', src: ['kjaervik2024'] },
      { text: 'Give the people close to you a heads-up that you might be short for a week or so.' },
    ],
    src: ['budney2003', 'budney2004', 'bahji2020'],
  },
  {
    id: 'anxiety', name: 'Anxiety & Nervousness', resolvedName: 'Steadier Nerves', emoji: '😰', cat: 'mind',
    onset: 1, peak: 3, resolve: 14, range: '1–2 weeks',
    what: 'Feeling on edge is very common in the first two weeks. It follows the classic withdrawal curve: rising over the first days, peaking in the first week, then easing off.',
    tips: [
      { text: 'Slow breathing (about 6 breaths per minute, long exhales) measurably calms the nervous system. Try 3 minutes when it spikes.', src: ['zaccaro2018'] },
      { text: 'Go easy on coffee and energy drinks for now. Caffeine can amplify jitteriness.' },
    ],
    src: ['budney2003', 'allsop2011', 'bahji2020'],
  },
  {
    id: 'restlessness', name: 'Restlessness', resolvedName: 'Settled & Still', emoji: '🌀', cat: 'body',
    onset: 1, peak: 3, resolve: 14, range: '1–2 weeks',
    what: 'A fidgety “can’t sit still” feeling, especially in the evenings when you used to smoke. It tracks the other early symptoms and fades within about two weeks.',
    tips: [
      { text: 'Burn it off. Regular aerobic exercise lowered craving and use in daily cannabis users.', src: ['buchowski2011'] },
      { text: 'Give your hands something to do in the old smoking moments: a walk, a shower, cooking, a game.' },
    ],
    src: ['budney2003', 'budney2004'],
  },
  {
    id: 'appetite', name: 'Low Appetite', resolvedName: 'Appetite Is Back', emoji: '🍽️', cat: 'body',
    onset: 1, peak: 2, resolve: 14, range: '1–2 weeks',
    what: 'Without THC’s “munchies” effect, many people barely feel hungry for the first days and some lose a little weight. Appetite typically returns to normal within about two weeks.',
    tips: [
      { text: 'Eat small, regular meals even when you’re not hungry. Smoothies and soups are easy wins.' },
    ],
    src: ['budney2003', 'budney2004'],
  },
  {
    id: 'headaches', name: 'Headaches', resolvedName: 'Clear Head', emoji: '🤕', cat: 'body',
    onset: 1, peak: 2, resolve: 14, range: 'up to 2 weeks',
    what: 'Headaches are one of the less common, physical withdrawal symptoms. When they happen they are usually early and gone within the first two weeks.',
    tips: [
      { text: 'Drink water, eat regularly and protect your sleep. Skipped meals and short nights make withdrawal headaches worse.' },
    ],
    src: ['budney2004', 'connor2022'],
  },
  {
    id: 'sweats', name: 'Night Sweats & Chills', resolvedName: 'Sleeping Dry', emoji: '💦', cat: 'body',
    onset: 1, peak: 3, resolve: 14, range: 'up to 2 weeks',
    what: 'THC affects body-temperature regulation, and sweating or chills are recognised physical withdrawal symptoms. They are less common than the mood symptoms and usually pass within two weeks.',
    tips: [
      { text: 'Keep the bedroom cool, use light breathable bedding and keep a spare shirt by the bed.' },
    ],
    src: ['budney2004', 'connor2022'],
  },
  {
    id: 'stomach', name: 'Stomach Pain & Nausea', resolvedName: 'Settled Stomach', emoji: '🤢', cat: 'body',
    onset: 1, peak: 2, resolve: 10, range: 'about 1–2 weeks',
    what: 'Some people get stomach cramps or mild nausea early on. Physical symptoms like this are usually milder and shorter than the mood and sleep symptoms.',
    tips: [
      { text: 'Bland foods, ginger tea and small meals help. See a doctor if you can’t keep fluids down.' },
    ],
    src: ['budney2004', 'connor2022'],
  },
  {
    id: 'shakiness', name: 'Shakiness', resolvedName: 'Steady Hands', emoji: '✋', cat: 'body',
    onset: 1, peak: 3, resolve: 10, range: 'about 1–2 weeks',
    what: 'A mild tremor or shaky feeling is a less common physical symptom that shows up in the first days and fades quickly.',
    tips: [{ text: 'Regular meals and less caffeine help. It passes on its own.' }],
    src: ['budney2004', 'connor2022'],
  },
  {
    id: 'mood', name: 'Low Mood', resolvedName: 'Mood Lifting', emoji: '😔', cat: 'mind',
    onset: 2, peak: 4, resolve: 21, range: '2–3 weeks',
    what: 'A flat or down mood is part of the withdrawal syndrome. Your reward system is recalibrating to work without THC. It typically lifts over the following weeks as receptors recover.',
    tips: [
      { text: 'Get daylight and movement early in the day. Plan one small thing to look forward to each day.' },
      { text: 'If low mood is severe, gets worse, or lasts beyond a few weeks, talk to a doctor. That isn’t just withdrawal.' },
    ],
    src: ['budney2004', 'connor2022', 'schlienz2017'],
  },
  {
    id: 'fog', name: 'Brain Fog', resolvedName: 'Sharper Memory', emoji: '🌫️', cat: 'mind',
    onset: 0, peak: 0, resolve: 28, range: 'about 4 weeks',
    what: 'Regular use dulls memory and focus. In a month-long abstinence study, verbal memory improved already within the first week. Brain CB1 receptors, which heavy use turns down, return to normal levels after about four weeks.',
    tips: [
      { text: 'Write things down for now, and notice how much easier it gets week by week.' },
    ],
    src: ['schuster2018', 'hirvonen2012', 'dsouza2016'],
  },
  {
    id: 'insomnia', name: 'Trouble Sleeping', resolvedName: 'Sleeping Well', emoji: '🛌', cat: 'sleep',
    onset: 1, peak: 3, resolve: 35, range: '2–6 weeks',
    what: 'Sleep trouble is one of the most common and longest-lasting withdrawal symptoms. It often continues after the other symptoms are gone and can take a month or more to settle fully.',
    tips: [
      { text: 'A warm shower or bath 1–2 hours before bed helps you fall asleep faster.', src: ['haghayegh2019'] },
      { text: 'Keep a fixed wake-up time, and keep screens and caffeine away from the evening.', src: ['irish2015'] },
    ],
    src: ['bolla2008', 'gates2016', 'budney2003'],
  },
  {
    id: 'dreams', name: 'Vivid, Strange Dreams', resolvedName: 'Calm Dreams', emoji: '💭', cat: 'sleep',
    onset: 2, peak: 7, resolve: 45, range: '3–7 weeks',
    what: 'THC suppresses REM (dreaming) sleep. When you stop, REM sleep rebounds, so dreams get vivid, weird, sometimes about smoking. It is harmless, a sign your sleep is rebalancing, and it lasts the longest of all symptoms.',
    tips: [{ text: 'Dreams about using are normal and don’t mean you’re failing. They fade as REM sleep settles.' }],
    src: ['budney2003', 'gates2016'],
  },
  {
    id: 'cravings', name: 'Cravings', resolvedName: 'Cravings Faded', emoji: '🌿', cat: 'mind',
    onset: 0.5, peak: 2, resolve: 42, range: '3–6 weeks',
    what: 'Craving is the most common withdrawal symptom. It is strongest in the first days and then declines steadily. Later urges are mostly triggered by cues (places, people, times of day) and get weaker and rarer.',
    tips: [
      { text: 'Urges rise, crest and pass, usually within minutes. Observe it like a wave instead of fighting it (“urge surfing”).', src: ['bowen2009'] },
      { text: 'A 10–30 minute walk or workout takes the edge off.', src: ['buchowski2011'] },
    ],
    src: ['budney2003', 'allsop2011', 'bahji2020'],
  },
];

// Health timeline milestones. `at` is in hours since the last use.
export const MILESTONES = [
  { id: 'heart', at: 3, cat: 'body', emoji: '💓', title: 'Heart Rate Back to Normal',
    text: 'THC raises heart rate by roughly 20–50 beats per minute, an effect that wears off within about 2–3 hours.', src: ['jones2002'] },
  { id: 'high', at: 6, cat: 'mind', emoji: '🌤️', title: 'The High Has Worn Off',
    text: 'The acute psychological effects of smoked cannabis fade within a few hours as THC moves out of the blood into tissues.', src: ['grotenhermen2003', 'huestis2007', 'chayasirisobhon2020'] },
  { id: 'co', at: 24, cat: 'lungs', emoji: '🫁', title: 'Carbon Monoxide Cleared',
    text: 'Smoking cannabis loads your blood with carbon monoxide, even more per puff than tobacco. Breathing normal air, CO has a half-life of about 5 hours, so after a day it is essentially gone and your blood carries oxygen at full capacity.', src: ['wu1988', 'weaver2009'] },
  { id: 'onset', at: 24, cat: 'mind', emoji: '🔄', title: 'Your Brain Starts Rebalancing',
    text: 'Withdrawal usually begins 1–3 days after the last use. If you feel rough now, that’s expected. It means your brain is adjusting to running without THC.', src: ['budney2004', 'connor2022'] },
  { id: 'cb1start', at: 48, cat: 'mind', emoji: '⚡', title: 'Receptors Start to Recover',
    text: 'Brain imaging shows CB1 cannabinoid receptors, turned down by regular use, already begin to come back within two days of stopping.', src: ['dsouza2016'] },
  { id: 'thchalf', at: 4 * 24, cat: 'detox', emoji: '🧪', title: 'Stored THC Halved',
    text: 'THC is stored in fat and released slowly. In heavy users its terminal half-life is about 4 days (range 3–13), so roughly half of it is gone now.', src: ['johansson1989', 'huestis2007'] },
  { id: 'pastpeak', at: 6 * 24, cat: 'mind', emoji: '⛰️', title: 'Past the Peak',
    text: 'Withdrawal symptoms typically peak between days 2 and 6. From here the curve trends downhill.', src: ['budney2003'] },
  { id: 'memory', at: 7 * 24, cat: 'mind', emoji: '📝', title: 'Memory Starts Improving',
    text: 'In a study of young regular users, verbal learning and memory improved already within the first week of abstinence.', src: ['schuster2018'] },
  { id: 'cravingease', at: 7 * 24, cat: 'mind', emoji: '🌿', title: 'Cravings Start to Ease',
    text: 'Craving is strongest in the first days and declines steadily after the first week.', src: ['budney2003', 'allsop2011'] },
  { id: 'mostgone', at: 14 * 24, cat: 'mind', emoji: '🌈', title: 'Most Withdrawal Is Behind You',
    text: 'For most people, the bulk of withdrawal symptoms (irritability, anxiety, restlessness, appetite) are back to baseline within about two weeks.', src: ['budney2003', 'connor2022'] },
  { id: 'thc90', at: 14 * 24, cat: 'detox', emoji: '💧', title: 'Stored THC Down ~90%',
    text: 'After about three and a half half-lives, roughly 90% of the THC stored in your body has been eliminated.', src: ['johansson1989'] },
  { id: 'cb1', at: 28 * 24, cat: 'mind', emoji: '🧠', title: 'Receptors Back to Normal',
    text: 'PET imaging shows CB1 receptor levels in daily users return to the same levels as non-users after about four weeks of abstinence.', src: ['hirvonen2012', 'dsouza2016'] },
  { id: 'metabolites', at: 30 * 24, cat: 'detox', emoji: '🧫', title: 'Metabolites Largely Cleared',
    text: 'Many daily users drop below the standard urine-test cutoff within 3–4 weeks. Heavy long-term users can take longer (up to ~11 weeks in one study). This is an average, not a drug-test guarantee.', src: ['goodwin2008', 'ellis1985'] },
  { id: 'sleep', at: 35 * 24, cat: 'sleep', emoji: '😴', title: 'Sleep Settles Down',
    text: 'Sleep problems are the longest-lasting physical part of withdrawal, often persisting for a month or more, and by now they are typically settling.', src: ['bolla2008', 'gates2016'] },
  { id: 'dreams', at: 45 * 24, cat: 'sleep', emoji: '💭', title: 'Dreams Calm Down',
    text: 'The REM rebound that causes vivid dreams is the last withdrawal effect to fade, typically within about six weeks.', src: ['budney2003', 'gates2016'] },
  { id: 'habit', at: 66 * 24, cat: 'you', emoji: '🔁', title: 'New Routines Feel Automatic',
    text: 'On average it takes about 66 days of repetition for a new behaviour to become automatic. Your cannabis-free evenings are becoming the default.', src: ['lally2010'] },
  { id: 'lungs', at: 90 * 24, cat: 'lungs', emoji: '🍃', title: 'Cough & Phlegm Easing',
    text: 'Smoking cannabis causes chronic bronchitis symptoms (cough, phlegm, wheeze). These improve after quitting, and people who quit report fewer respiratory symptoms than those who continue.', src: ['tashkin2013', 'hancox2015'] },
  { id: 'half', at: 182 * 24, cat: 'you', emoji: '🌻', title: 'Half a Year Clear',
    text: 'Six months. Take a moment to look back at where you started.', src: [] },
  { id: 'year', at: 365 * 24, cat: 'you', emoji: '🏔️', title: 'One Year Clear',
    text: 'A full year. Every season, every birthday, every holiday. Done clear.', src: [] },
];

// Timeline groups: a milestone belongs to the last group whose start it has passed.
export const GROUPS = [
  { at: 0, label: 'Quit day' },
  { at: 24, label: '1 day' },
  { at: 3 * 24, label: '3 days' },
  { at: 7 * 24, label: '1 week' },
  { at: 14 * 24, label: '2 weeks' },
  { at: 28 * 24, label: '4 weeks' },
  { at: 60 * 24, label: '2 months' },
  { at: 90 * 24, label: '3 months' },
  { at: 182 * 24, label: '6 months' },
  { at: 365 * 24, label: '1 year' },
];
