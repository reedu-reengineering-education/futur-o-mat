/**
 * Category configuration constants for avatar customization
 */

import type { Category } from "@/types/avatar";
import texts from "@/assets/app-texts.json";

/**
 * Body customization categories for "Wer bist du?" (Who are you?) step
 */
export const BODY_CATEGORIES: Category[] = [
  { id: "head", name: texts.avatar.categories.head, multiSelect: false },
  { id: "face", name: texts.avatar.categories.face, multiSelect: true },
  { id: "hair", name: texts.avatar.categories.hair, multiSelect: false },
  {
    id: "bodytype",
    name: texts.avatar.categories.bodytype,
    multiSelect: false,
  },
  { id: "clothes", name: texts.avatar.categories.clothes, multiSelect: true },
  { id: "shoes", name: texts.avatar.categories.shoes, multiSelect: false },
  {
    id: "accessoires",
    name: texts.avatar.categories.accessoires,
    multiSelect: true,
  },
  { id: "handicap", name: texts.avatar.categories.handicap, multiSelect: true },
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
  { id: "Hell", color: "#f5d5c0" },
  { id: "Braun", color: "#c68642" },
  { id: "Dunkel", color: "#8d5524" },
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
  skinTone: "Dunkel",
  hairColor: "brunette",
  brustAnsatz: false,
};

/**
 * Rendering order for avatar layers (bottom to top)
 */
export const RENDER_ORDER = [
  "skintones",
  "bodytype",
  "head",
  "face",
  "hair",
  "shoes",
  "clothes",
  "handicap",
] as const;

export const LAST_RENDER = ["brust", "accessoires", "skintones"] as const;

/**
 * Subcategory render order for clothes (bottom to top)
 */
export const CLOTHES_RENDER_ORDER = ["bottom", "top", "onepiece"] as const;
