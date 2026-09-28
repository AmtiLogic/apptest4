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
  { key: 'lundahl2016', title: 'Magnitude and duration of cue-induced craving for marijuana in volunteers with cannabis use disorder', journal: 'Drug and Alcohol Dependence', authors: 'Lundahl LH, Greenwald MK', year: 2016 },
  { key: 'babson2014', title: 'Sleep disturbances: implications for cannabis use, cannabis use cessation, and cannabis use treatment', journal: 'Current Addiction Reports', authors: 'Babson KA, Bonn-Miller MO', year: 2014 },
  { key: 'nsw2022', title: 'Management of Withdrawal from Alcohol and Other Drugs Handbook', journal: 'NSW Ministry of Health', authors: 'NSW Ministry of Health', year: 2022, url: 'https://www.google.com/search?q=' + encodeURIComponent('NSW Health Management of Withdrawal from Alcohol and Other Drugs Handbook 2022') },
  { key: 'anderson2016', title: 'Pharmacokinetic drug interactions with tobacco, cannabinoids and smoking cessation products', journal: 'Clinical Pharmacokinetics', authors: 'Anderson GD, Chan LN', year: 2016 },
  { key: 'swanson1997', title: 'The impact of caffeine use on tobacco cessation and withdrawal', journal: 'Addictive Behaviors', authors: 'Swanson JA, Lee JW, Hopp JW, Berk LS', year: 1997 },
  { key: 'ichd3', title: 'ICHD-3 10.5: Headache attributed to fasting', journal: 'International Classification of Headache Disorders, 3rd edition', authors: 'Headache Classification Committee of the International Headache Society', year: 2018, url: 'https://ichd-3.org/10-disorders-of-homoeostasis/10-5-headache-attributed-to-fasting/' },
  { key: 'utiyama2016', title: 'The effects of smoking and smoking cessation on nasal mucociliary clearance, mucus properties and inflammation', journal: 'Clinics (Sao Paulo)', authors: 'Utiyama DMO, Yoshida CT, Goto DM, Carvalho TS, Santos UP, Koczulla AR, Saldiva PHN, Nakagawa NK', year: 2016 },
  { key: 'schrott2021', title: 'Refraining from use diminishes cannabis-associated epigenetic changes in human sperm', journal: 'Environmental Epigenetics', authors: 'Schrott R, Murphy SK, Modliszewski JL, King DE, Hill B, Itchon-Ramos N, Raburn D, Price T, Levin ED, Vandrey R, Corcoran DL, Kollins SH, Mitchell JT', year: 2021 },
  { key: 'payne2019', title: 'Cannabis and male fertility: a systematic review', journal: 'Journal of Urology', authors: 'Payne KS, Mazur DJ, Hotaling JM, Pastuszak AW', year: 2019 },
  { key: 'cameron2025', title: 'The impact of cannabinoids on reproductive function', journal: 'Reproduction', authors: 'Cameron RS, Perono GA, Natale CD, Petrik JJ, Holloway AC, Hardy DB', year: 2025 },
  { key: 'ryan2021', title: 'Effects of marijuana on reproductive health: preconception and gestational effects', journal: 'Current Opinion in Endocrinology, Diabetes and Obesity', authors: 'Ryan KS, Bash JC, Hanna CB, Hedges JC, Lo JO', year: 2021 },
  { key: 'herrmann2015', title: 'Sex differences in cannabis withdrawal symptoms among treatment-seeking cannabis users', journal: 'Experimental and Clinical Psychopharmacology', authors: 'Herrmann ES, Weerts EM, Vandrey R', year: 2015 },
  { key: 'bonnet2017', title: 'The cannabis withdrawal syndrome: current insights', journal: 'Substance Abuse and Rehabilitation', authors: 'Bonnet U, Preuss UW', year: 2017 },
  { key: 'lawn2016', title: 'Acute and chronic effects of cannabis on effort-related decision-making and reward learning: an evaluation of the cannabis “amotivational” hypotheses', journal: 'Psychopharmacology', authors: 'Lawn W, Freeman TP, Pope RA, et al.', year: 2016 },
  { key: 'volkow2014', title: 'Decreased dopamine brain reactivity in marijuana abusers is associated with negative emotionality and addiction severity', journal: 'Proceedings of the National Academy of Sciences', authors: 'Volkow ND, Wang GJ, Telang F, et al.', year: 2014 },
  { key: 'volkow2016', title: 'Effects of cannabis use on human behavior, including cognition, motivation, and psychosis: a review', journal: 'JAMA Psychiatry', authors: 'Volkow ND, Swanson JM, Evins AE, et al.', year: 2016 },
].map((s, i) => ({ ...s, n: i + 1 }));

export const SOURCE_BY_KEY = Object.fromEntries(SOURCES.map((s) => [s.key, s]));

export function sourceUrl(s) {
  if (s.url) return s.url;
  return 'https://pubmed.ncbi.nlm.nih.gov/?term=' + encodeURIComponent(s.title);
}

// Categories are shown as a small line symbol plus a label (see art.js).
export const CATEGORIES = {
  mind: { label: 'Mind' },
  body: { label: 'Body' },
  sleep: { label: 'Sleep' },
  lungs: { label: 'Lungs' },
  detox: { label: 'Detox' },
  fertility: { label: 'Fertility' },
};

export const SYMPTOM_GROUPS = {
  withdrawal: {
    label: 'Caused by quitting',
    short: 'From quitting',
    note: 'Withdrawal. Temporary effects of the brain readjusting to working without THC. About half of regular users get some of these.',
    src: ['bahji2020', 'budney2004'],
  },
  use: {
    label: 'Caused by regular use',
    short: 'From use',
    note: 'Effects regular use was having on you. They lift as THC leaves your body and your brain recovers.',
    src: ['volkow2016'],
  },
};

// The negative effects the app tracks. Times are in days since the last use.
//   onset   – when it typically appears (0 = already there while using)
//   peak    – when it is typically at its worst (0 = worst at the start)
//   resolve – when it has typically faded back to baseline
//   cause   – one plain line on why it happens, shown on the card
// Withdrawal pattern (Budney 2003/2004, Connor 2022): onset 1–3 days, peak
// days 2–6, most gone within 1–2 weeks; sleep problems and dreams last longest.
export const SYMPTOMS = [
  // ----- caused by quitting (withdrawal) -----
  {
    id: 'irritability', group: 'withdrawal', womenWorse: true, common: true, name: 'Short temper', cat: 'mind',
    cause: 'Your brain’s own cannabinoid system is running low while it readjusts.',
    onset: 1, peak: 3, resolve: 14, range: '1–2 weeks',
    what: 'Irritability and anger are among the most common withdrawal symptoms. With THC gone, the brain’s own cannabinoid system is temporarily under-powered, so small annoyances land harder. It typically peaks around days 2–6 and is back to baseline within about two weeks.',
    tips: [
      { text: 'Calm the body down rather than venting: slow breathing, a slow walk or yoga reduce anger; venting and high-arousal activities tend to feed it.', src: ['kjaervik2024'] },
      { text: 'Tell the people close to you that you may be short-tempered for a week or two.' },
    ],
    src: ['budney2003', 'budney2004', 'bahji2020', 'nsw2022'],
  },
  {
    id: 'anxiety', group: 'withdrawal', common: true, name: 'Anxiety & nerves', cat: 'mind',
    cause: 'A core withdrawal symptom. Strongest in the first week, then easing.',
    onset: 1, peak: 3, resolve: 14, range: '1–2 weeks',
    what: 'Feeling on edge is one of the most common withdrawal symptoms. It follows the typical withdrawal curve: rising over the first days, peaking in the first week, then easing off.',
    tips: [
      { text: 'Slow breathing (about 6 breaths a minute, long exhales) measurably calms the nervous system. Try 3 minutes when it spikes.', src: ['zaccaro2018'] },
      { text: 'Cut back on coffee for now. Smoke speeds up how fast the liver breaks down caffeine, so after quitting the same cup hits harder. In tobacco quitters, caffeine levels rise noticeably after stopping.', src: ['anderson2016', 'swanson1997'] },
    ],
    src: ['budney2003', 'allsop2011', 'bahji2020'],
  },
  {
    id: 'restlessness', group: 'withdrawal', womenWorse: true, common: true, name: 'Restless, can’t settle', cat: 'body',
    cause: 'A core withdrawal symptom, worst in the evenings you used to smoke.',
    onset: 1, peak: 3, resolve: 14, range: '1–2 weeks',
    what: 'A fidgety, can’t-sit-still feeling, often worst at the times of day you used to smoke. It tracks the other early withdrawal symptoms and fades within about two weeks.',
    tips: [
      { text: 'Aerobic exercise lowered craving and use in daily cannabis users.', src: ['buchowski2011'] },
      { text: 'Fill the old smoking times with something physical: a walk, a shower, cooking.' },
    ],
    src: ['budney2003', 'budney2004'],
  },
  {
    id: 'appetite', group: 'withdrawal', common: true, name: 'No appetite', cat: 'body',
    cause: 'THC was driving your hunger. Appetite takes time to reset without it.',
    onset: 1, peak: 2, resolve: 14, range: '1–2 weeks',
    what: 'THC stimulates appetite. Without it, many people barely feel hungry for the first days and some lose a little weight. Appetite typically returns to normal within about two weeks.',
    tips: [{ text: 'Eat small, regular meals even when you’re not hungry. Soups and smoothies are easy.' }],
    src: ['budney2003', 'budney2004'],
  },
  {
    id: 'headaches', group: 'withdrawal', common: false, name: 'Headaches', cat: 'body',
    cause: 'A less common physical withdrawal symptom, usually in the first days.',
    onset: 1, peak: 2, resolve: 14, range: 'up to 2 weeks',
    what: 'Headaches are one of the less common, physical withdrawal symptoms. When they happen they are usually early and gone within the first two weeks.',
    tips: [
      { text: 'Don’t skip meals, even with a low appetite. Going too long without food is a recognised headache trigger in its own right.', src: ['ichd3'] },
      { text: 'Keep caffeine steady rather than swinging it up and down, and drink water.', src: ['anderson2016'] },
    ],
    src: ['budney2004', 'connor2022', 'nsw2022'],
  },
  {
    id: 'sweats', group: 'withdrawal', common: false, name: 'Night sweats & chills', cat: 'body',
    cause: 'THC affects temperature control. The body is recalibrating.',
    onset: 1, peak: 3, resolve: 14, range: 'up to 2 weeks',
    what: 'THC affects body-temperature regulation, and sweating or chills are recognised physical withdrawal symptoms. They are less common than the mood symptoms and usually pass within two weeks.',
    tips: [{ text: 'Keep the bedroom cool, use light bedding and keep a spare shirt by the bed.' }],
    src: ['budney2004', 'connor2022'],
  },
  {
    id: 'stomach', group: 'withdrawal', womenWorse: true, common: false, name: 'Stomach pain & nausea', cat: 'body',
    cause: 'A less common physical withdrawal symptom, milder and shorter than the rest.',
    onset: 1, peak: 2, resolve: 10, range: 'about 1–2 weeks',
    what: 'Some people get stomach cramps or mild nausea early on. Physical symptoms like this are usually milder and shorter than the mood and sleep symptoms.',
    tips: [{ text: 'Bland food, ginger tea and small meals. See a doctor if you can’t keep fluids down.' }],
    src: ['budney2004', 'connor2022'],
  },
  {
    id: 'shakiness', group: 'withdrawal', common: false, name: 'Shakiness', cat: 'body',
    cause: 'A less common physical withdrawal symptom that fades quickly.',
    onset: 1, peak: 3, resolve: 10, range: 'about 1–2 weeks',
    what: 'A mild tremor or shaky feeling is a less common physical symptom that shows up in the first days and fades quickly.',
    tips: [{ text: 'Regular meals and less caffeine help.' }],
    src: ['budney2004', 'connor2022'],
  },
  {
    id: 'mood', group: 'withdrawal', common: true, name: 'Low mood', cat: 'mind',
    cause: 'The reward system is recalibrating to work without THC.',
    onset: 2, peak: 4, resolve: 21, range: '2–3+ weeks',
    what: 'A flat or low mood is part of the withdrawal syndrome while the brain’s reward system recalibrates to work without THC. It typically lifts over the following weeks as cannabinoid receptors recover.',
    tips: [
      { text: 'Daylight and movement early in the day.' },
      { text: 'If low mood is severe, gets worse, or lasts beyond a few weeks, talk to a doctor. That is more than withdrawal.' },
    ],
    src: ['budney2004', 'connor2022', 'schlienz2017'],
  },
  {
    id: 'insomnia', group: 'withdrawal', common: true, name: 'Can’t sleep', cat: 'sleep',
    cause: 'THC was acting as a sedative. Natural sleep takes weeks to return.',
    onset: 1, peak: 3, resolve: 45, range: '4–6+ weeks',
    what: 'Sleep trouble is one of the most common and longest-lasting withdrawal symptoms. It often continues after the other symptoms are gone and has been reported to last around 45 days, sometimes longer.',
    tips: [
      { text: 'A warm shower or bath 1–2 hours before bed helps you fall asleep faster.', src: ['haghayegh2019'] },
      { text: 'Keep a fixed wake-up time, and keep screens and caffeine out of the evening.', src: ['irish2015'] },
      { text: 'Caffeine may linger longer now that you’ve stopped smoking. Try no coffee after lunch.', src: ['anderson2016'] },
    ],
    src: ['bonnet2017', 'gates2016', 'bolla2008', 'babson2014', 'budney2003'],
  },
  {
    id: 'dreams', group: 'withdrawal', common: true, name: 'Vivid, strange dreams', cat: 'sleep',
    cause: 'THC suppressed dreaming (REM) sleep. It is now rebounding.',
    onset: 2, peak: 7, resolve: 45, range: '3–7 weeks',
    what: 'THC suppresses REM, the sleep stage where most dreaming happens. When you stop, REM rebounds, so dreams get vivid and strange, often about smoking. It is harmless and it is the last withdrawal effect to fade.',
    tips: [{ text: 'Dreams about using are a normal part of REM rebound. They are not a sign of wanting to relapse.' }],
    src: ['budney2004', 'gates2016', 'bonnet2017'],
  },
  {
    id: 'cravings', group: 'withdrawal', common: true, name: 'Cravings', cat: 'mind',
    cause: 'Learned cues plus a brain still readjusting to no THC.',
    onset: 0.5, peak: 2, resolve: 45, range: '3–6+ weeks',
    what: 'Craving is the most common withdrawal symptom. It is strongest in the first days and then declines steadily. Later urges are mostly triggered by cues (places, people, times of day) and get weaker and rarer.',
    tips: [
      { text: 'Urges rise, crest and pass, usually within minutes. Observing one like a wave works better than fighting it (“urge surfing”).', src: ['bowen2009'] },
      { text: 'A 10–30 minute walk or workout takes the edge off.', src: ['buchowski2011'] },
      { text: 'Cues (a lighter, a certain friend, the couch at 9 pm) can switch a craving on in seconds. Changing the situation is easier than holding out in it.', src: ['lundahl2016'] },
    ],
    src: ['bonnet2017', 'budney2003', 'allsop2011', 'lundahl2016'],
  },

  // ----- caused by regular use -----
  {
    id: 'heart', group: 'use', name: 'Racing heart', cat: 'body',
    cause: 'THC speeds the heart up by 20–50 beats a minute after each use.',
    onset: 0, peak: 0, resolve: 0.125, range: '2–3 hours',
    what: 'THC raises heart rate by roughly 20–50 beats per minute. The effect wears off within about 2–3 hours of the last use.',
    tips: [],
    src: ['jones2002'],
  },
  {
    id: 'co', group: 'use', name: 'Carbon monoxide in your blood', cat: 'lungs',
    cause: 'Smoke puts carbon monoxide in the blood, where it crowds out oxygen.',
    onset: 0, peak: 0, resolve: 1, range: 'about 1 day',
    what: 'Smoking cannabis loads the blood with carbon monoxide, more per puff than tobacco. Breathing normal air, carbon monoxide has a half-life of about 5 hours, so after a day it is essentially gone and your blood carries oxygen at full capacity.',
    tips: [],
    src: ['wu1988', 'weaver2009'],
  },
  {
    id: 'tolerance', group: 'use', name: 'Needing weed to feel normal', cat: 'mind',
    cause: 'Regular use makes the brain turn down its CB1 cannabinoid receptors.',
    onset: 0, peak: 0, resolve: 28, range: 'about 4 weeks',
    what: 'Daily use makes the brain reduce its CB1 cannabinoid receptors. That is tolerance: you need THC to feel normal, and ordinary things feel flatter without it. Brain imaging shows the receptors start coming back within 2 days of stopping and are at the same level as in non-users after about 4 weeks.',
    tips: [],
    src: ['hirvonen2012', 'dsouza2016'],
  },
  {
    id: 'fog', group: 'use', name: 'Foggy memory', cat: 'mind',
    cause: 'THC interferes with how the brain stores new memories.',
    onset: 0, peak: 0, resolve: 28, range: '1–4 weeks',
    what: 'Regular use impairs learning and memory. In a study of young regular users who stopped for a month, verbal learning and memory improved already in the first week. Attention did not measurably change in that study.',
    tips: [{ text: 'Write things down for now. Memory keeps improving over the first month.' }],
    src: ['schuster2018', 'volkow2016'],
  },
  {
    id: 'drive', group: 'use', name: 'Low drive, flat feeling', cat: 'mind',
    cause: 'Cannabis blunts the brain’s reward response and willingness to put in effort.',
    onset: 0, peak: 0, resolve: 28, range: 'about 4 weeks', estimate: true,
    what: 'While high, cannabis reduces people’s willingness to work for rewards. In the same study, regular users who were not high were no different from non-users, so in that study the low drive came from being high, not from the person. Heavy users also show a blunted dopamine response in the brain’s reward system, which is linked to negative mood. No study has timed its recovery precisely; this ring follows cannabinoid receptor recovery (about 4 weeks).',
    tips: [],
    src: ['lawn2016', 'volkow2014', 'volkow2016'],
  },
  {
    id: 'thc', group: 'use', name: 'THC stored in your body', cat: 'detox',
    cause: 'THC is stored in body fat and released slowly for weeks.',
    onset: 0, peak: 0, resolve: 30, range: '3–4 weeks (heavy use: longer)',
    what: 'THC is stored in fat and released slowly. In heavy users its half-life is about 4 days (range 3–13): half is gone after about 4 days and roughly 90% after 2 weeks. Many daily users test below the standard urine cutoff within 3–4 weeks; heavy long-term users can take longer (up to ~11 weeks in one study). This is an average, not a drug-test guarantee.',
    tips: [],
    src: ['johansson1989', 'goodwin2008', 'ellis1985', 'huestis2007'],
  },
  {
    id: 'fertility', group: 'use', sexes: ['unspecified'], name: 'THC effects on fertility', cat: 'fertility',
    cause: 'THC acts on reproductive hormones, and regular use is linked to lower sperm counts.',
    onset: 0, peak: 0, resolve: 77, range: 'about 11 weeks',
    what: 'THC interacts with the reproductive hormone system and can disturb ovulation and hormone levels. Regular use is linked to lower sperm counts. Sperm take about 11 weeks to develop, and after about 11 weeks without cannabis many cannabis-linked changes in sperm DNA methylation had diminished. Set your sex in Settings to see the item that applies to you.',
    tips: [],
    src: ['schrott2021', 'payne2019', 'ryan2021', 'cameron2025'],
  },
  {
    id: 'sperm', group: 'use', sexes: ['male'], name: 'THC effects on sperm', cat: 'fertility',
    cause: 'Regular use is linked to lower sperm counts and changes in sperm DNA.',
    onset: 0, peak: 0, resolve: 77, range: 'about 11 weeks',
    what: 'Regular cannabis use is linked to lower sperm concentration and count. Sperm take about 11 weeks to develop, and in men who stopped for about 11 weeks, many cannabis-linked changes in sperm DNA methylation had diminished.',
    tips: [],
    src: ['schrott2021', 'payne2019', 'cameron2025'],
  },
  {
    id: 'hormones', group: 'use', sexes: ['female'], name: 'THC effects on hormones & cycle', cat: 'fertility',
    cause: 'THC acts on the reproductive hormones that control ovulation.',
    onset: 0, peak: 0, resolve: 30, range: 'about one cycle', estimate: true,
    what: 'THC interacts with the reproductive hormone system and can disturb ovulation and cycle hormones. How quickly this normalises after quitting has not been measured precisely; this ring uses one menstrual cycle (about a month). Clinicians recommend stopping before trying to conceive.',
    tips: [],
    src: ['ryan2021', 'cameron2025'],
  },
  {
    id: 'cough', group: 'use', name: 'Smoker’s cough & phlegm', cat: 'lungs',
    cause: 'Smoke irritates the airways and causes bronchitis-type symptoms.',
    onset: 0, peak: 0, resolve: 90, range: 'months', estimate: true,
    what: 'Smoking cannabis causes chronic bronchitis symptoms: cough, phlegm and wheeze. These improve after quitting, and people who quit report fewer respiratory symptoms than those who continue. In tobacco smokers, the airways clear mucus better within a month of quitting. No study has timed full recovery precisely; this ring uses 3 months.',
    tips: [],
    src: ['tashkin2013', 'hancox2015', 'utiyama2016'],
  },
];

// Dated events on the Timeline tab. `at` is in hours since the last use.
// Markers shown between the recovery items: moments worth knowing about that
// are not symptoms themselves. `at` is in hours since the last use.
export const TIMELINE = [
  { id: 'high', at: 6, cat: 'mind', title: 'No longer high',
    text: 'The acute effects of smoked cannabis fade within a few hours as THC moves out of the blood into tissues.', src: ['grotenhermen2003', 'huestis2007', 'chayasirisobhon2020'] },
  { id: 'onset', at: 24, cat: 'mind', title: 'Withdrawal usually starts',
    text: 'Withdrawal usually begins 1–3 days after the last use, as the brain starts adjusting to running without THC. Most symptoms peak between days 2 and 6.', src: ['budney2003', 'connor2022'] },
  { id: 'cb1start', at: 48, cat: 'mind', title: 'THC receptors start recovering',
    text: 'Brain imaging shows CB1 cannabinoid receptors, turned down by regular use, begin to come back within two days of stopping.', src: ['dsouza2016'] },
  { id: 'thchalf', at: 4 * 24, cat: 'detox', title: 'Half the stored THC is gone',
    text: 'THC is stored in fat and released slowly. In heavy users its half-life is about 4 days (range 3–13).', src: ['johansson1989', 'huestis2007'] },
  { id: 'pastpeak', at: 6 * 24, cat: 'mind', title: 'Withdrawal peak usually over',
    text: 'Withdrawal symptoms typically peak between days 2 and 6, then decline.', src: ['budney2003', 'connor2022'] },
  { id: 'memory', at: 7 * 24, cat: 'mind', title: 'Memory starts improving',
    text: 'In young regular users, verbal learning and memory improved within the first week of abstinence.', src: ['schuster2018'] },
  { id: 'mostgone', at: 14 * 24, cat: 'mind', title: 'Most withdrawal symptoms usually gone',
    text: 'Most withdrawal symptoms last 4–14 days. Sleep problems, dreams and cravings can last around 45 days; in heavy users some symptoms last 3 weeks or more.', src: ['budney2003', 'connor2022', 'bonnet2017'] },
  { id: 'thc90', at: 14 * 24, cat: 'detox', title: '90% of stored THC gone',
    text: 'After about three and a half half-lives, roughly 90% of the THC stored in your body has been eliminated.', src: ['johansson1989'] },
  { id: 'habit', at: 66 * 24, cat: 'mind', title: 'Not using usually feels automatic',
    text: 'On average it takes about 66 days of repetition for a new behaviour to become automatic (range 18–254 days).', src: ['lally2010'] },
];

// Timeline groups: an event belongs to the last group whose start it has passed.
export const GROUPS = [
  { at: 0, label: 'First day' },
  { at: 24, label: 'Day 1' },
  { at: 3 * 24, label: 'Day 3' },
  { at: 7 * 24, label: 'Week 1' },
  { at: 14 * 24, label: 'Week 2' },
  { at: 28 * 24, label: 'Week 4' },
  { at: 60 * 24, label: 'Month 2' },
  { at: 90 * 24, label: 'Month 3' },
];
