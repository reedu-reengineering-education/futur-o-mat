import { useState, useEffect, useMemo } from "react";
import type { AvatarPart } from "@/types/avatar";
import { loadAvatarParts } from "@/data/avatarParts";

interface UseAvatarPartsOptions {
  category?: string;
  skinTone?: string;
  hairColor?: string;
  bodyType?: string;
}

interface UseAvatarPartsReturn {
  parts: AvatarPart[];
  allParts: AvatarPart[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to load and filter avatar parts manifest
 * Handles loading states, error conditions, and filtering by various criteria
 */
export function useAvatarParts(
  options: UseAvatarPartsOptions = {},
): UseAvatarPartsReturn {
  const { category, skinTone, hairColor, bodyType } = options;

  const [allParts, setAllParts] = useState<AvatarPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load avatar parts on mount
  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      const parts = await loadAvatarParts();
      setAllParts(parts);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to load avatar parts");
      setError(error);
      console.error("Error loading avatar parts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  // Filter parts based on provided options
  const parts = useMemo(() => {
    let filtered = allParts;

    // Filter by category
    if (category) {
      filtered = filtered.filter((part) => part.category === category);
    }

    // Filter by skin tone for categories that have skin tone variations
    const skinToneCategories = ["bodytype", "head"];
    if (category && skinToneCategories.includes(category) && skinTone) {
      filtered = filtered.filter((part) => {
        const matchesSkinTone =
          part.id.includes(skinTone) || part.src.includes(skinTone);
        return matchesSkinTone;
      });
    }

    // Filter by hair color for hair category
    if (category === "hair" && hairColor) {
      const hairColors = ["black", "blonde", "brunette", "red", "white"];

      filtered = filtered.filter((part) => {
        // Check if part matches the selected hair color
        const matchesHairColor =
          part.id.includes(hairColor) || part.src.includes(hairColor);

        // Check if part has no hair color indicator (universal items like Käppi, Kopftuch, Beanie)
        const hasNoHairColorIndicator = !hairColors.some(
          (color) => part.id.includes(color) || part.src.includes(color),
        );

        return matchesHairColor || hasNoHairColorIndicator;
      });
    }

    // Filter by body type for clothes and accessories
    const bodyTypeCategories = ["clothes", "accessoires"];
    if (category && bodyTypeCategories.includes(category) && bodyType) {
      const bodyTypes = ["Breit", "Eng", "Normal", "Betont"];

      filtered = filtered.filter((part) => {
        // Include parts that match the body type OR parts that don't have any body type indicator
        const matchesBodyType =
          part.id.toLowerCase().includes(bodyType.toLowerCase()) ||
          part.src.toLowerCase().includes(bodyType.toLowerCase());

        const hasNoBodyTypeIndicator = !bodyTypes.some(
          (type) =>
            part.id.toLowerCase().includes(type.toLowerCase()) ||
            part.src.toLowerCase().includes(type.toLowerCase()),
        );

        return matchesBodyType || hasNoBodyTypeIndicator;
      });
    }

    return filtered;
  }, [allParts, category, skinTone, hairColor, bodyType]);

  return {
    parts,
    allParts,
    loading,
    error,
    refetch: fetchParts,
  };
}
