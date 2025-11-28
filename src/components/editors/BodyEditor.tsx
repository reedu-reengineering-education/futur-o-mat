/**
 * BodyEditor Component
 *
 * Complete body customization interface for "Wer bist du?" (Who are you?) step
 * Integrates category tabs, color selectors, and parts grid
 * Handles category switching and part selection
 */

import { useState, useCallback, useMemo } from "react";
import { BODY_CATEGORIES } from "@/data/categories";
import { CategoryTabs } from "./CategoryTabs";
import { ColorSelector } from "./ColorSelector";
import { PartsGrid } from "./PartsGrid";
import type { AvatarConfig, AvatarPart } from "@/types/avatar";
import { useAvatarParts } from "@/hooks/useAvatarParts";

interface BodyEditorProps {
  avatarConfig: AvatarConfig;
  allParts: AvatarPart[];
  onUpdatePart: (part: AvatarPart) => void;
  onToggleItem: (part: AvatarPart) => void;
  onSetSkinTone: (skinTone: string) => void;
  onSetHairColor: (hairColor: string) => void;
  onSetBreastOption: (enabled: boolean) => void;
  onRemoveHair: () => void;
  onRemoveBrust: () => void;
}

export function BodyEditor({
  avatarConfig,
  allParts,
  onUpdatePart,
  onToggleItem,
  onSetSkinTone,
  onSetHairColor,
  onSetBreastOption,
  onRemoveBrust,
}: BodyEditorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("head");
  const [visitedCategories, setVisitedCategories] = useState<Set<string>>(
    new Set(["head"])
  );

  // Extract body type from selected bodytype part
  const bodyType = useMemo(() => {
    if (!avatarConfig.selectedParts.bodytype) return "Normal";

    const bodytypePart = allParts.find(
      (p) => p.id === avatarConfig.selectedParts.bodytype
    );

    if (!bodytypePart) return "Normal";

    const bodyTypes = ["Breit", "Eng", "Normal", "Betont"];
    for (const type of bodyTypes) {
      if (bodytypePart.id.includes(type) || bodytypePart.src.includes(type)) {
        return type;
      }
    }

    return "Normal";
  }, [avatarConfig.selectedParts.bodytype, allParts]);

  // Get filtered parts for current category
  const { parts: filteredParts } = useAvatarParts({
    category: activeCategory,
    skinTone: avatarConfig.skinTone,
    hairColor: avatarConfig.hairColor,
    bodyType,
  });

  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setVisitedCategories((prev) => new Set([...prev, category]));
  }, []);

  // Handle part selection
  const handlePartSelect = useCallback(
    (part: AvatarPart) => {
      const category = BODY_CATEGORIES.find((c) => c.id === part.category);

      if (category?.multiSelect) {
        onToggleItem(part);
      } else {
        onUpdatePart(part);
      }
    },
    [onUpdatePart, onToggleItem]
  );

  const handleBrustansatzToggle = useCallback(() => {
    const newBrustansatzState = !avatarConfig.brustAnsatz;

    onSetBreastOption(newBrustansatzState);

    if (newBrustansatzState) {
      const brustPart = allParts.find((p) => p.category === "brust");
      if (brustPart) {
        onUpdatePart(brustPart);
      } else {
        console.warn("Brust-Part nicht gefunden");
      }
    } else {
      onRemoveBrust();
    }
  }, [
    allParts,
    avatarConfig.brustAnsatz,
    onSetBreastOption,
    onUpdatePart,
    onRemoveBrust,
  ]);

  // Determine if current category is multi-select
  const isMultiSelect = useMemo(() => {
    const category = BODY_CATEGORIES.find((c) => c.id === activeCategory);
    return category?.multiSelect ?? false;
  }, [activeCategory]);

  // Show color selectors for head and hair categories
  const showSkinToneSelector = activeCategory === "bodytype";
  const showHairColorSelector = activeCategory === "hair";

  return (
    <div className="space-y-0">
      {/* Category Tabs */}
      <CategoryTabs
        categories={BODY_CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        visitedCategories={visitedCategories}
      />

      {/* Color Selectors */}
      {showSkinToneSelector && (
        <ColorSelector
          type="skin"
          selectedColor={avatarConfig.skinTone}
          onColorChange={onSetSkinTone}
          visible={true}
          showBrustansatz={true}
          onBrustansatzToggle={handleBrustansatzToggle}
          isBrustansatzActive={avatarConfig.brustAnsatz || false}
        />
      )}

      {showHairColorSelector && (
        <ColorSelector
          type="hair"
          selectedColor={avatarConfig.hairColor}
          onColorChange={onSetHairColor}
          visible={true}
          showBrustansatz={false}
        />
      )}

      {/* Parts Grid */}
      <PartsGrid
        parts={filteredParts}
        selectedParts={avatarConfig.selectedParts}
        selectedItems={avatarConfig.selectedItems}
        onPartSelect={handlePartSelect}
        multiSelect={isMultiSelect}
        category={activeCategory}
      />
    </div>
  );
}
