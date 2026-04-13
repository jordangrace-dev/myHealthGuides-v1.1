import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  Animated,
  Image,
} from 'react-native';
import {
  computeIntelligence,
  DEFAULT_INSIGHT,
  FALLBACK_INSIGHTS,
  type PatternInsight,
  type VisitQuestion,
  type MedAction,
} from '../lib/intelligence';
import Header from "./components/Header";
import HomeScreenNew from "./Screens/HomeScreen";
import SignalsScreen from "./Screens/SignalsScreen";
import InsightScreenNew from "./Screens/InsightScreen";
import MedicationScreenNew from "./Screens/MedicationScreen";
import VisitScreenNew from "./Screens/VisitScreen";
import TabBar from "./components/TabBar";
import { DEFAULT_MEDS } from '../lib/defaultMeds';
import { BASE_VISIT_QUESTIONS } from '../lib/visitQuestions';
import { COLORS } from '../lib/colors';
import { Screen, MedState, MedGroup, MedItem} from "../types";



type TabItem = { key: Screen; label: string };
const TABS: TabItem[] = [
  { key: 'home', label: 'Home' },
  { key: 'signals', label: 'Signals' },
  { key: 'insight', label: 'Insight' },
  { key: 'medications', label: 'Meds' },
  { key: 'visit', label: 'Visit' },
];


function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[cardStyles.card, style]}>{children}</View>;
}
const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
});

function SectionHeader({ title }: { title: string }) {
  return <Text style={sharedStyles.sectionHeader}>{title}</Text>;
}

function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <View style={[badgeStyles.badge, { backgroundColor: color ?? COLORS.sageLt }]}>
      <Text style={[badgeStyles.text, { color: color ? COLORS.white : COLORS.mossDark }]}>
        {label}
      </Text>
    </View>
  );
}
const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});



const homeStyles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.warmWhite },
  scrollContent: { padding: 24, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: { fontSize: 14, color: COLORS.warmGrey400, fontWeight: '400' },
  name: { fontSize: 28, color: COLORS.warmGrey800, fontWeight: '700', letterSpacing: -0.5 },
  tagline: { fontSize: 12, color: COLORS.warmGrey400, fontWeight: '700', fontStyle: 'italic', marginTop: 2, marginBottom: 12 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.sageLt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, color: COLORS.mossDark, fontWeight: '700' },
  dateLabel: { fontSize: 13, color: COLORS.warmGrey400, marginBottom: 32 },
  mainCard: {
    backgroundColor: COLORS.moss,
    borderRadius: 20,
    padding: 24,
    marginBottom: 36,
  },
  mainCardEyebrow: {
    fontSize: 11,
    color: COLORS.sageLt,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  mainCardMessage: {
    fontSize: 19,
    color: COLORS.white,
    fontWeight: '400',
    lineHeight: 29,
    marginBottom: 24,
  },
  mainCardBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  mainCardBtnText: { fontSize: 15, color: COLORS.white, fontWeight: '600' },
  recentlyLabel: {
    fontSize: 12,
    color: COLORS.warmGrey400,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  recentlyCard: {
    backgroundColor: COLORS.warmGrey100,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 32,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.sageLt,
  },
  recentlyText: {
    fontSize: 15,
    color: COLORS.warmGrey600,
    lineHeight: 23,
    fontStyle: 'italic',
  },
  quickActionsLabel: {
    fontSize: 12,
    color: COLORS.warmGrey400,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  actionList: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 17,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.warmGrey100,
    marginLeft: 66,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconGlyph: { fontSize: 16, color: COLORS.mossDark },
  actionLabel: { flex: 1, fontSize: 15, color: COLORS.warmGrey800, fontWeight: '500' },
  actionChevron: { fontSize: 22, color: COLORS.warmGrey200 },
});

type SignalOption = { label: string; value: string };

const SIGNAL_ROWS: { key: string; label: string; options: SignalOption[] }[] = [
  {
    key: 'sleep',
    label: 'Sleep',
    options: [
      { label: 'Restful', value: 'restful' },
      { label: 'OK', value: 'ok' },
      { label: 'Poor', value: 'poor' },
    ],
  },
  {
    key: 'mood',
    label: 'Mood',
    options: [
      { label: 'Good', value: 'good' },
      { label: 'Neutral', value: 'neutral' },
      { label: 'Low', value: 'low' },
    ],
  },
  {
    key: 'activity',
    label: 'Activity',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Light', value: 'light' },
      { label: 'Sedentary', value: 'sedentary' },
    ],
  },
];

const SYMPTOM_TAGS = ['Headache', 'Fatigue', 'Nausea', 'Dizziness', 'Shortness of breath', 'Swelling', 'None'];



const signalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.warmWhite,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.warmGrey800,
    letterSpacing: -0.5,
  },
  progressBadge: {
    backgroundColor: COLORS.warmGrey100,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  progressBadgeDone: {
    backgroundColor: COLORS.sageLt,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.warmGrey400,
  },
  progressTextDone: {
    color: COLORS.mossDark,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.warmGrey400,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  rows: {
    gap: 10,
    marginBottom: 20,
  },
  row: {
    gap: 6,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: COLORS.warmGrey200,
  },
  rowSaved: {
    borderColor: COLORS.sage,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.warmGrey800,
  },
  savedBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.sageMd,
  },
  pillGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.warmGrey200,
    backgroundColor: COLORS.warmWhite,
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.moss,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.warmGrey600,
  },
  pillTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.warmGrey200,
    backgroundColor: COLORS.white,
  },
  tagActive: {
    backgroundColor: COLORS.sageLt,
    borderColor: COLORS.sage,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.warmGrey600,
    fontWeight: '500',
  },
  tagTextActive: {
    color: COLORS.mossDark,
    fontWeight: '600',
  },
});



const insightStyles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.warmGrey800,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.warmGrey400,
    lineHeight: 20,
    marginBottom: 28,
    fontWeight: '400',
  },
  card: {
    backgroundColor: '#FDFAF6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E2D9',
    paddingHorizontal: 26,
    paddingTop: 28,
    paddingBottom: 30,
    shadowColor: '#7A6E62',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  section: {
    gap: 12,
  },
  accentBlock: {
    paddingLeft: 14,
    position: 'relative',
  },
  accentPill: {
    position: 'absolute',
    left: 0,
    top: 4,
    bottom: 4,
    width: 2,
    borderRadius: 2,
  },
  observationAccentPill: {
    backgroundColor: COLORS.sageLt,
  },
  meaningAccentPill: {
    backgroundColor: COLORS.sage,
  },
  experimentAccentPill: {
    backgroundColor: COLORS.sienna,
  },
  experimentSection: {
    backgroundColor: '#F7F4EE',
    marginHorizontal: -26,
    marginBottom: -30,
    paddingHorizontal: 26,
    paddingTop: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: COLORS.sage,
  },
  meaningLabel: {
    color: COLORS.sageMd,
  },
  experimentLabel: {
    color: COLORS.sienna,
  },
  body: {
    fontSize: 16,
    color: COLORS.warmGrey800,
    lineHeight: 26,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  experimentBody: {
    color: COLORS.warmGrey600,
    fontStyle: 'italic',
  },
  rule: {
    height: 1,
    backgroundColor: '#EAE4DC',
    marginVertical: 24,
  },
  nextBtn: {
    marginTop: 28,
    alignSelf: 'center',
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.sageLt,
    backgroundColor: '#FDFAF6',
  },
  nextBtnText: {
    fontSize: 13,
    color: COLORS.sageMd,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  sourceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.sageLt,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
  },
  sourceBadgeText: {
    fontSize: 11,
    color: COLORS.mossDark,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

type DoseStatus = 'pending' | 'taken' | 'delayed' | 'skipped';

const NOTE_CHIPS = ['Took with food', 'Took late', 'Missed meal', 'Felt nauseated', 'Felt tired', 'No issues'];

const STATUS_COLORS: Record<DoseStatus, string> = {
  pending: COLORS.warmGrey200,
  taken: COLORS.sage,
  delayed: '#D4A843',
  skipped: COLORS.sienna,
};

const STATUS_TEXT_COLORS: Record<DoseStatus, string> = {
  pending: COLORS.warmGrey600,
  taken: COLORS.white,
  delayed: COLORS.white,
  skipped: COLORS.white,
};

interface MedDose {
  time: string;
  status: DoseStatus;
  notes: string[];
  showNotes: boolean;
}

interface Med {
  name: string;
  dose: string;
  instruction: string;
  doses: MedDose[];
  reminderOn: boolean;
  reminderTime: string;
  showPreview: boolean;
}

const CONFIRM_MESSAGES: Record<DoseStatus, string> = {
  taken: 'Logged for today',
  skipped: 'Skipped for today',
  delayed: 'Reminder set',
  pending: '',
};



const visitStyles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.warmGrey100,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: COLORS.white, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabBtnText: { fontSize: 14, color: COLORS.warmGrey400, fontWeight: '600' },
  tabBtnTextActive: { color: COLORS.warmGrey800 },
  upcomingType: { fontSize: 12, color: COLORS.sageLt, fontWeight: '600', marginBottom: 6, letterSpacing: 0.5 },
  upcomingDate: { fontSize: 24, color: COLORS.white, fontWeight: '700' },
  upcomingTime: { fontSize: 16, color: COLORS.sageLt, marginBottom: 14 },
  upcomingDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 12 },
  upcomingDoctor: { fontSize: 14, color: COLORS.white, fontWeight: '600' },
  upcomingLocation: { fontSize: 13, color: COLORS.sageLt, marginTop: 2 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.warmGrey200,
    marginTop: 2,
  },
  checkText: { flex: 1, fontSize: 14, color: COLORS.warmGrey100 ?? COLORS.warmGrey600, lineHeight: 20 },
  questionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  questionNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.warmGrey100,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 13,
    color: COLORS.warmGrey600,
    fontWeight: '700',
  },
  questionText: { flex: 1, fontSize: 14, color: COLORS.warmGrey800, lineHeight: 20 },
  addQuestionBtn: { borderTopWidth: 1, borderTopColor: COLORS.warmGrey200, paddingTop: 12, marginTop: 2 },
  addQuestionText: { fontSize: 14, color: COLORS.sageMd, fontWeight: '600' },
  pastHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 8 },
  pastType: { fontSize: 15, color: COLORS.warmGrey800, fontWeight: '700', marginBottom: 2 },
  pastDate: { fontSize: 13, color: COLORS.warmGrey400 },
  pastDoctor: { fontSize: 12, color: COLORS.warmGrey400, marginTop: 2 },
  notesBox: {
    backgroundColor: COLORS.warmGrey100,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  notesLabel: { fontSize: 11, color: COLORS.warmGrey400, fontWeight: '600', marginBottom: 6, letterSpacing: 0.4 },
  notesText: { fontSize: 14, color: COLORS.warmGrey600, lineHeight: 20 },
  labsTitle: { fontSize: 12, color: COLORS.warmGrey600, fontWeight: '600', marginBottom: 8 },
  labsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  personalizedNote: {
    fontSize: 12,
    color: COLORS.sageMd,
    fontStyle: 'italic',
    marginBottom: 8,
    letterSpacing: 0.1,
  },
});

const sharedStyles = StyleSheet.create({
  screenTitle: {
    fontSize: 26,
    color: COLORS.warmGrey800,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 14,
    color: COLORS.warmGrey400,
    lineHeight: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    color: COLORS.warmGrey400,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 4,
  },
});


export default function MyMedGuide() {
  const [active, setActive] = React.useState<Screen>("home");
  const [signalsSaved, setSignalsSaved] = useState<Record<string, string>>({});
  const [symptoms, setSymptoms] = useState<Record<string, boolean>>({});
  const [meds, setMeds] = useState(DEFAULT_MEDS);

  const handleSignalSelect = (key: string, value: string) => {
    setSignalsSaved((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleSymptom = (tag: string) => {
    setSymptoms((prev) => ({ ...prev, [tag]: !prev[tag] }));
  };

  const intelligence = useMemo(() => {
    const signals = {
      sleep: (signalsSaved.sleep ?? null) as any,
      mood: (signalsSaved.mood ?? null) as any,
      activity: (signalsSaved.activity ?? null) as any,
    };
    const activeSymptoms = Object.keys(symptoms).filter((k) => symptoms[k]);
    const medActions: MedAction[] = meds.flatMap((m) =>
      m.doses.map((d) => ({
        name: m.name,
        instruction: m.instruction,
        doseTime: d.time,
        status: d.status as DoseStatus,
      }))
    );
    return computeIntelligence(signals, activeSymptoms, medActions);
  }, [signalsSaved, symptoms, meds]);

  const screens: Record<Screen, React.ReactNode> = {
    home: <HomeScreenNew />,
    signals: <SignalsScreen />,
   insight: <InsightScreenNew />,
    medications: <MedicationScreenNew meds={meds} />,
   visit: <VisitScreenNew />,
  };

  return (
    <SafeAreaView style={appStyles.container}>
     <Header />   


    <RNStatusBar barStyle="dark-content" />
    <View style={appStyles.content}>{screens[active]}</View>
    <TabBar active={active} onPress={setActive} tabs={TABS} />
  </SafeAreaView>
);
}
const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.warmWhite,
  },
  content: {
    flex: 1,
  },
});
