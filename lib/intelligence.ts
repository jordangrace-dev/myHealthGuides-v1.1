export type SleepValue = 'restful' | 'ok' | 'poor' | null;
export type MoodValue = 'good' | 'neutral' | 'low' | null;
export type ActivityValue = 'active' | 'light' | 'sedentary' | null;

export interface Signals {
  sleep: SleepValue;
  mood: MoodValue;
  activity: ActivityValue;
}

export type DoseStatus = 'pending' | 'taken' | 'delayed' | 'skipped';

export interface MedAction {
  name: string;
  instruction: string;
  doseTime: string;
  status: DoseStatus;
}

export interface PatternInsight {
  observation: string;
  meaning: string;
  experiment: string;
  source: 'signals' | 'medications' | 'combined';
}

export interface VisitQuestion {
  text: string;
  source: 'signals' | 'medications' | 'combined';
}

export interface IntelligenceResult {
  insight: PatternInsight | null;
  recentlyText: string | null;
  visitQuestions: VisitQuestion[];
}

function isMorningDose(doseTime: string): boolean {
  const hour = parseInt(doseTime.split(':')[0], 10);
  const isPM = doseTime.includes('PM');
  const h24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;
  return h24 >= 5 && h24 < 12;
}

function hasSymptom(symptoms: string[], name: string): boolean {
  return symptoms.some((s) => s.toLowerCase() === name.toLowerCase());
}

function hasMedWithInstruction(meds: MedAction[], keyword: string): boolean {
  return meds.some((m) => m.instruction.toLowerCase().includes(keyword.toLowerCase()));
}

export function computeIntelligence(
  signals: Signals,
  symptoms: string[],
  medActions: MedAction[]
): IntelligenceResult {
  const insights: PatternInsight[] = [];
  const visitQuestions: VisitQuestion[] = [];
  const recentlyOptions: string[] = [];

  const skippedMeds = medActions.filter((m) => m.status === 'skipped');
  const delayedMeds = medActions.filter((m) => m.status === 'delayed');
  const skippedMorning = skippedMeds.filter((m) => isMorningDose(m.doseTime));

  // Rule 1: Sleep poor + Mood low
  if (signals.sleep === 'poor' && signals.mood === 'low') {
    insights.push({
      observation: 'Your sleep was poor and your mood feels low today.',
      meaning: 'Rest and how we feel through the day are often quietly linked.',
      experiment: 'Try a short wind-down routine tonight — even ten minutes — and notice how tomorrow morning feels.',
      source: 'signals',
    });
    recentlyOptions.push('On days when your sleep is poor, your mood tends to be lower.');
    visitQuestions.push({
      text: 'I\'ve noticed my mood feels lower on days when I don\'t sleep well — is there anything worth looking at here?',
      source: 'signals',
    });
  }

  // Rule 2: Activity active + Mood good
  if (signals.activity === 'active' && signals.mood === 'good') {
    insights.push({
      observation: 'You moved well today and your mood reflects it.',
      meaning: 'Physical activity often supports how we feel, even in small amounts.',
      experiment: 'Try keeping even a short movement window in your day for the next few days and see what you notice.',
      source: 'signals',
    });
    recentlyOptions.push('On days you stay active, your mood tends to feel better.');
  }

  // Rule 3: Morning medication skipped
  if (skippedMorning.length > 0) {
    const names = skippedMorning.map((m) => m.name).join(' and ');
    insights.push({
      observation: `Your morning dose of ${names} was skipped today.`,
      meaning: 'Morning medications often work best when taken consistently at the same time each day.',
      experiment: 'Try setting a gentle alarm for tomorrow morning to keep your routine steady.',
      source: 'medications',
    });
    recentlyOptions.push(`A morning medication was skipped today. Routines work best when they stay consistent.`);
    visitQuestions.push({
      text: `I missed my morning ${names} today — is there anything I should know about skipping doses occasionally?`,
      source: 'medications',
    });
  }

  // Rule 4: Any medication delayed
  if (delayedMeds.length > 0) {
    const names = delayedMeds.map((m) => m.name).join(' and ');
    insights.push({
      observation: `${names} was delayed today.`,
      meaning: 'Taking medications around the same time each day helps them work as intended.',
      experiment: 'A reminder set for the same window daily can make consistency easier to build.',
      source: 'medications',
    });
    recentlyOptions.push('A medication was delayed today. Timing consistency makes a quiet difference.');
  }

  // Rule 5: Fatigue symptom
  if (hasSymptom(symptoms, 'fatigue')) {
    visitQuestions.push({
      text: 'I\'ve been feeling more fatigued than usual — could this be connected to my medications or sleep patterns?',
      source: 'signals',
    });
    if (signals.sleep === 'poor') {
      insights.push({
        observation: 'Fatigue and poor sleep showed up together today.',
        meaning: 'When rest is disrupted, low energy during the day tends to follow.',
        experiment: 'Notice whether your fatigue feels worse at a particular time of day — that pattern is worth sharing with your doctor.',
        source: 'combined',
      });
    }
  }

  // Rule 6: Nausea + "Take with food" medication
  if (hasSymptom(symptoms, 'nausea') && hasMedWithInstruction(medActions, 'take with food')) {
    const foodMed = medActions.find((m) => m.instruction.toLowerCase().includes('take with food'));
    insights.push({
      observation: `You noted nausea today, and ${foodMed?.name ?? 'one of your medications'} is meant to be taken with food.`,
      meaning: 'Taking certain medications on an empty stomach can sometimes cause nausea.',
      experiment: 'Try having a small snack with your next dose and see whether that helps settle things.',
      source: 'combined',
    });
    recentlyOptions.push('Nausea appeared on a day a medication was meant to be taken with food.');
    visitQuestions.push({
      text: `I've been feeling nauseous — could it be related to how I'm taking ${foodMed?.name ?? 'my medication'}?`,
      source: 'combined',
    });
  }

  // Rule 7: Headache symptom
  if (hasSymptom(symptoms, 'headache')) {
    visitQuestions.push({
      text: 'I\'ve had headaches recently — is that something worth tracking alongside my current medications?',
      source: 'signals',
    });
  }

  // Rule 8: Dizziness
  if (hasSymptom(symptoms, 'dizziness')) {
    visitQuestions.push({
      text: 'I\'ve been feeling dizzy at times — could that be connected to any of my medications or blood pressure?',
      source: 'signals',
    });
  }

  // Rule 9: Sedentary + poor sleep
  if (signals.activity === 'sedentary' && signals.sleep === 'poor') {
    recentlyOptions.push('Low activity and poor sleep appeared on the same day — these sometimes reinforce each other.');
  }

  // Rule 10: All signals good, all meds taken
  const allTaken = medActions.length > 0 && medActions.every((m) => m.status === 'taken');
  if (signals.mood === 'good' && signals.sleep === 'restful' && allTaken) {
    insights.push({
      observation: 'Your sleep was restful, your mood is good, and your medications are on track.',
      meaning: 'Consistency in small daily habits tends to build quietly over time.',
      experiment: 'Notice what made today feel steady — that\'s worth holding onto.',
      source: 'combined',
    });
    recentlyOptions.push('A restful sleep, good mood, and consistent medications all appeared on the same day.');
  }

  const topInsight = insights[0] ?? null;
  const recentlyText = recentlyOptions[0] ?? null;

  return { insight: topInsight, recentlyText, visitQuestions };
}

export const DEFAULT_INSIGHT: PatternInsight = {
  observation: 'On days when your sleep is poor, your mood tends to be lower.',
  meaning: 'Sleep may be influencing how your day feels.',
  experiment: 'Try a short wind-down routine for a few nights and see how your mornings feel.',
  source: 'signals',
};

export const FALLBACK_INSIGHTS: PatternInsight[] = [
  {
    observation: 'When you move your body in the morning, your energy later in the day is often better.',
    meaning: 'A small amount of movement early on may set a gentler tone for the rest of the day.',
    experiment: 'Try a short walk after waking for three days and notice how your afternoons feel.',
    source: 'signals',
  },
  {
    observation: 'On days you log higher stress, your sleep tends to be shorter.',
    meaning: 'Stress and rest may be more connected than they seem.',
    experiment: 'Before bed tonight, write down one thing you can let go of until tomorrow.',
    source: 'signals',
  },
  {
    observation: 'Your mood has been fairly steady over the past few days.',
    meaning: 'Consistency in your routine may quietly be working in your favor.',
    experiment: 'Notice what felt easy this week and see if you can carry one of those things forward.',
    source: 'signals',
  },
];
