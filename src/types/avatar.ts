/**
 * Core type definitions for the avatar generator
 */

/**
 * Represents a single avatar part (image layer)
 */
export interface AvatarPart {
  id: string;
  src: string;
  category: string;
  skinTone?: string;
  hairColor?: string;
  bodyType?: string;
}

/**
 * Avatar configuration state containing all selected parts and options
 */
export interface AvatarConfig {
  selectedParts: Record<string, string>; // category -> part id mapping
  selectedItems: string[]; // multi-select items (accessories, face features, etc.)
  skinTone: string;
  hairColor: string;
  brustAnsatz: boolean; // breast option
}

/**
 * Category definition for avatar customization
 */
export interface Category {
  id: string;
  name: string;
  multiSelect: boolean;
}

/**
 * Application step type
 */
export type Step = "body" | "values";

/**
 * Progress tracking state
 */
export interface ProgressState {
  visitedTabs: Set<string>;
  currentProgress: number;
}

/**
 * Avatar parts manifest structure
 */
export interface AvatarPartsManifest {
  parts: AvatarPart[];
}

/**
 * Skin tone options
 */
export type SkinTone = "Hell" | "Braun" | "Dunkel";

/**
 * Hair color options
 */
export type HairColor = "black" | "blonde" | "brunette" | "red" | "white";

/**
 * Body type options
 */
export type BodyType =
  | "Normal"
  | "Betont"
  | "Breit"
  | "Eng"
  | "AmputiertArm"
  | "AmputiertBein";

/**
 * URL state for sharing avatars
 */
export interface UrlState {
  selectedParts: Record<string, string>;
  selectedItems: string[];
  skinTone: string;
  hairColor: string;
  brustAnsatz: boolean;
}
