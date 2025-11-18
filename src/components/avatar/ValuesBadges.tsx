/**
 * ValuesBadges Component
 *
 * Displays selected values and strengths as floating badges above the avatar
 * Uses absolute positioning relative to the avatar container
 */

import { useMemo } from "react";
import type { AvatarConfig, AvatarPart } from "@/types";

interface ValuesBadgesProps {
  avatarConfig: AvatarConfig;
  allParts: AvatarPart[];
  className?: string;
}

export function ValuesBadges({
  avatarConfig,
  allParts,
  className = "",
}: ValuesBadgesProps) {
  // Get selected values and strengths parts
  const selectedBadges = useMemo(() => {
    const badges: Array<{
      id: string;
      src: string;
      type: "value" | "strength";
    }> = [];

    // Get selected value
    const valueId = avatarConfig.selectedParts.values;
    if (valueId) {
      const valuePart = allParts.find((p) => p.id === valueId);
      if (valuePart) {
        badges.push({ id: valuePart.id, src: valuePart.src, type: "value" });
      }
    }

    // Get selected strength
    const strengthId = avatarConfig.selectedParts.strengths;
    if (strengthId) {
      const strengthPart = allParts.find((p) => p.id === strengthId);
      if (strengthPart) {
        badges.push({
          id: strengthPart.id,
          src: strengthPart.src,
          type: "strength",
        });
      }
    }

    return badges;
  }, [avatarConfig.selectedParts, allParts]);

  // Don't render if no badges selected
  if (selectedBadges.length === 0) {
    return null;
  }

  return (
    <div
      className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 z-10 transition-all duration-300 ${className}`}
    >
      {selectedBadges.map((badge) => (
        <div
          key={badge.id}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-lg border-2 border-primary overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-110"
          title={badge.type === "value" ? "Wert" : "Stärke"}
        >
          <img
            src={badge.src}
            alt={badge.type === "value" ? "Wert" : "Stärke"}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
