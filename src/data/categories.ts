/**
 * Category configuration constants for avatar customization
 */

import type { Category } from "../types";

/**
 * Body customization categories for "Wer bist du?" (Who are you?) step
 */
export const BODY_CATEGORIES: Category[] = [
  { id: "head", name: "Kopf", multiSelect: false },
  { id: "face", name: "Gesicht", multiSelect: true },
  { id: "hair", name: "Haare", multiSelect: false },
  { id: "bodytype", name: "Körper", multiSelect: false },
  { id: "clothes", name: "Kleidung", multiSelect: true },
  { id: "shoes", name: "Schuhe", multiSelect: false },
  { id: "accessoires", name: "Zubehör", multiSelect: true },
  { id: "handicap", name: "Hilfsmittel", multiSelect: true },
];

/**
 * Values and strengths categories for "Wie bist du?" (How are you?) step
 */
export const VALUES_CATEGORIES: Category[] = [
  { id: "values", name: "Das ist dir wichtig!", multiSelect: false },
  { id: "strengths", name: "Das kannst du gut!", multiSelect: false },
];

/**
 * All categories combined
 */
export const ALL_CATEGORIES: Category[] = [
  ...BODY_CATEGORIES,
  ...VALUES_CATEGORIES,
];

/**
 * Skin tone options with display names
 */
export const SKIN_TONES = [
  { id: "Hell", name: "Hell", color: "#f5d5c0" },
  { id: "Braun", name: "Braun", color: "#c68642" },
  { id: "Dunkel", name: "Dunkel", color: "#8d5524" },
] as const;

/**
 * Hair color options with display names
 */
export const HAIR_COLORS = [
  { id: "black", name: "Schwarz", color: "#2c2c2c" },
  { id: "blonde", name: "Blond", color: "#f5d76e" },
  { id: "brunette", name: "Braun", color: "#6b4423" },
  { id: "red", name: "Rot", color: "#c1502e" },
  { id: "white", name: "Weiß", color: "#e8e8e8" },
] as const;

/**
 * Body type options
 */
export const BODY_TYPES = [
  "Normal",
  "Betont",
  "Breit",
  "Eng",
  "AmputiertArm",
  "AmputiertBein",
] as const;

/**
 * Default avatar configuration
 */
export const DEFAULT_AVATAR_CONFIG = {
  selectedParts: {},
  selectedItems: [],
  skinTone: "Hell",
  hairColor: "brunette",
  brustAnsatz: false,
};

/**
 * Rendering order for avatar layers (bottom to top)
 */
export const RENDER_ORDER = [
  "bodytype",
  "brust",
  "head",
  "face",
  "hair",
  "clothes",
  "shoes",
  "accessoires",
  "handicap",
  "values",
  "strengths",
] as const;
