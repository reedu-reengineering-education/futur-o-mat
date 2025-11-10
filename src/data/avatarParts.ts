import type { AvatarPart } from "@/types/avatar";

/**
 * Load avatar parts manifest from public directory
 */
export async function loadAvatarParts(): Promise<AvatarPart[]> {
  try {
    const response = await fetch("/avatar_parts_manifest.json");
    if (!response.ok) {
      throw new Error(`Failed to load avatar parts: ${response.statusText}`);
    }
    const parts = await response.json();

    // Ensure all src paths start with / for proper loading
    return parts.map((part: AvatarPart) => ({
      ...part,
      src: part.src.startsWith("/") ? part.src : `/${part.src}`,
    }));
  } catch (error) {
    console.error("Error loading avatar parts manifest:", error);
    throw error;
  }
}

/**
 * Filter avatar parts by category
 */
export function filterPartsByCategory(
  parts: AvatarPart[],
  category: string
): AvatarPart[] {
  return parts.filter((part) => part.category === category);
}

/**
 * Get all unique categories from avatar parts
 */
export function getCategories(parts: AvatarPart[]): string[] {
  const categories = new Set(parts.map((part) => part.category));
  return Array.from(categories);
}
