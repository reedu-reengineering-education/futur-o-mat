import { useState, useCallback, useMemo } from "react";
import type { AvatarConfig, AvatarPart } from "@/types/avatar";
import { DEFAULT_AVATAR_CONFIG } from "@/data/categories";

interface UseAvatarStateReturn {
  avatarConfig: AvatarConfig;
  updatePart: (part: AvatarPart) => void;
  toggleItem: (part: AvatarPart) => void;
  setSkinTone: (skinTone: string) => void;
  setHairColor: (hairColor: string) => void;
  setBreastOption: (enabled: boolean) => void;
  removeHair: () => void;
  generateRandom: (allParts: AvatarPart[]) => void;
  resetAvatar: () => void;
  setAvatarConfig: (config: AvatarConfig) => void;
}

/**
 * Custom hook to manage avatar configuration state
 * Handles part selection logic for single and multi-select categories
 */
export function useAvatarState(
  initialConfig: AvatarConfig = DEFAULT_AVATAR_CONFIG
): UseAvatarStateReturn {
  const [avatarConfig, setAvatarConfigState] =
    useState<AvatarConfig>(initialConfig);

  // Single-select categories (only one part can be selected)
  const singleSelectCategories = useMemo(
    () => ["head", "bodytype", "shoes", "brust", "hair", "values", "strengths"],
    []
  );

  // Multi-select categories (multiple parts can be selected)
  const multiSelectCategories = useMemo(
    () => ["face", "clothes", "accessoires", "handicap"],
    []
  );

  /**
   * Update a part in a single-select category
   */
  const updatePart = useCallback((part: AvatarPart) => {
    setAvatarConfigState((prev) => ({
      ...prev,
      selectedParts: {
        ...prev.selectedParts,
        [part.category]: part.id,
      },
    }));
  }, []);

  /**
   * Toggle an item in a multi-select category
   */
  const toggleItem = useCallback((part: AvatarPart) => {
    setAvatarConfigState((prev) => {
      const isSelected = prev.selectedItems.includes(part.id);

      return {
        ...prev,
        selectedItems: isSelected
          ? prev.selectedItems.filter((id) => id !== part.id)
          : [...prev.selectedItems, part.id],
      };
    });
  }, []);

  /**
   * Update skin tone and automatically update related body parts
   */
  const setSkinTone = useCallback((skinTone: string) => {
    setAvatarConfigState((prev) => ({
      ...prev,
      skinTone,
    }));
  }, []);

  /**
   * Update hair color
   */
  const setHairColor = useCallback((hairColor: string) => {
    setAvatarConfigState((prev) => ({
      ...prev,
      hairColor,
    }));
  }, []);

  /**
   * Toggle breast option
   */
  const setBreastOption = useCallback((enabled: boolean) => {
    setAvatarConfigState((prev) => ({
      ...prev,
      brustAnsatz: enabled,
    }));
  }, []);

  /**
   * Remove hair selection
   */
  const removeHair = useCallback(() => {
    setAvatarConfigState((prev) => {
      const newSelectedParts = { ...prev.selectedParts };
      delete newSelectedParts.hair;

      return {
        ...prev,
        selectedParts: newSelectedParts,
      };
    });
  }, []);

  /**
   * Generate a random avatar configuration
   */
  const generateRandom = useCallback(
    (allParts: AvatarPart[]) => {
      const newConfig: AvatarConfig = {
        selectedParts: {},
        selectedItems: [],
        skinTone: "",
        hairColor: "",
        brustAnsatz: false,
      };

      // Randomly select skin tone
      const skinTones = ["Hell", "Braun", "Dunkel"];
      newConfig.skinTone =
        skinTones[Math.floor(Math.random() * skinTones.length)];

      // Randomly select hair color
      const hairColors = ["black", "blonde", "brunette", "red", "white"];
      newConfig.hairColor =
        hairColors[Math.floor(Math.random() * hairColors.length)];

      // Randomly select breast option (50% chance)
      newConfig.brustAnsatz = Math.random() > 0.5;

      // For each single-select category, randomly select one part
      singleSelectCategories.forEach((category) => {
        // Filter parts by category and current selections
        let categoryParts = allParts.filter(
          (part) => part.category === category
        );

        // Apply skin tone filter for relevant categories
        if (["bodytype", "head"].includes(category)) {
          categoryParts = categoryParts.filter(
            (part) =>
              part.id.includes(newConfig.skinTone) ||
              part.src.includes(newConfig.skinTone)
          );
        }

        // Apply hair color filter for hair category
        if (category === "hair") {
          const hairColors = ["black", "blonde", "brunette", "red", "white"];
          categoryParts = categoryParts.filter((part) => {
            const matchesHairColor =
              part.id.includes(newConfig.hairColor) ||
              part.src.includes(newConfig.hairColor);
            const hasNoHairColorIndicator = !hairColors.some(
              (color) => part.id.includes(color) || part.src.includes(color)
            );
            return matchesHairColor || hasNoHairColorIndicator;
          });
        }

        // Randomly select a part from filtered options
        if (categoryParts.length > 0) {
          const randomPart =
            categoryParts[Math.floor(Math.random() * categoryParts.length)];
          newConfig.selectedParts[category] = randomPart.id;
        }
      });

      // Extract body type from selected bodytype part
      let bodyType = "Normal";
      if (newConfig.selectedParts.bodytype) {
        const bodytypePart = allParts.find(
          (p) => p.id === newConfig.selectedParts.bodytype
        );
        if (bodytypePart) {
          const bodyTypes = ["Breit", "Eng", "Normal", "Betont"];
          for (const type of bodyTypes) {
            if (
              bodytypePart.id.includes(type) ||
              bodytypePart.src.includes(type)
            ) {
              bodyType = type;
              break;
            }
          }
        }
      }

      // For multi-select categories, randomly select 0-3 items
      multiSelectCategories.forEach((category) => {
        let categoryParts = allParts.filter(
          (part) => part.category === category
        );

        // Apply body type filter for clothes and accessories
        if (["clothes", "accessoires"].includes(category)) {
          const bodyTypes = ["Breit", "Eng", "Normal", "Betont"];
          categoryParts = categoryParts.filter((part) => {
            const matchesBodyType =
              part.id.toLowerCase().includes(bodyType.toLowerCase()) ||
              part.src.toLowerCase().includes(bodyType.toLowerCase());
            const hasNoBodyTypeIndicator = !bodyTypes.some(
              (type) =>
                part.id.toLowerCase().includes(type.toLowerCase()) ||
                part.src.toLowerCase().includes(type.toLowerCase())
            );
            return matchesBodyType || hasNoBodyTypeIndicator;
          });
        }

        // Randomly select 0-3 items
        const numItems = Math.floor(Math.random() * 4); // 0, 1, 2, or 3
        const shuffled = [...categoryParts].sort(() => Math.random() - 0.5);
        const selectedItems = shuffled.slice(0, numItems);

        selectedItems.forEach((part) => {
          newConfig.selectedItems.push(part.id);
        });
      });

      setAvatarConfigState(newConfig);
    },
    [singleSelectCategories, multiSelectCategories]
  );

  /**
   * Reset avatar to default configuration
   */
  const resetAvatar = useCallback(() => {
    setAvatarConfigState(DEFAULT_AVATAR_CONFIG);
  }, []);

  /**
   * Set the entire avatar configuration (useful for loading from URL)
   */
  const setAvatarConfig = useCallback((config: AvatarConfig) => {
    setAvatarConfigState(config);
  }, []);

  return {
    avatarConfig,
    updatePart,
    toggleItem,
    setSkinTone,
    setHairColor,
    setBreastOption,
    removeHair,
    generateRandom,
    resetAvatar,
    setAvatarConfig,
  };
}
