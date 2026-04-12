// Shared application types for myHealthGuides

// Navigation screens available in the app
export const screens = [
  "home",
  "signals",
  "insight",
  "medications",
  "visit",
] as const;

export type Screen = (typeof screens)[number];

// Possible states for a medication dose
export type MedState =
  | "due"
  | "logged"
  | "skipped"
  | "delayed"
  | "upcoming";

// Medication grouping by time of day
export type MedGroup = "Morning" | "Evening";

// Structure representing a medication item
export type MedItem = {
  id: number;
  name: string;
  dose: string;
  group: MedGroup;
  state: MedState;
  instructions?: string;
};