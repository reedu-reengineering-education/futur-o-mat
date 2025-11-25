/**
 * PartsGrid Component
 *
 * Displays avatar parts in a responsive grid with thumbnail generation
 * Handles single and multi-select part selection with visual feedback
 */

import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import PartsImage from "./PartsImage";
import type { AvatarPart } from "@/types/avatar";

interface PartsGridProps {
  parts: AvatarPart[];
  selectedParts: Record<string, string>;
  selectedItems: string[];
  onPartSelect: (part: AvatarPart) => void;
  multiSelect: boolean;
  category: string;
}

export function PartsGrid({
  parts,
  selectedParts,
  selectedItems,
  onPartSelect,
  multiSelect,
  category,
}: PartsGridProps) {
  const isSelected = (part: AvatarPart): boolean => {
    if (multiSelect) {
      return selectedItems.includes(part.id);
    }
    return selectedParts[category] === part.id;
  };

  const getPartName = (part: AvatarPart): string => {
    // Extract readable name from filename
    const filename = part.src.split("/").pop() || "";
    const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg)$/i, "");

    // Remove prefix patterns like "Futur-O-Mat__0003s_0000_"
    const cleanName = nameWithoutExt.replace(/^.*?__\d+s?_\d+_/, "");

    // Replace hyphens and underscores with spaces
    return cleanName.replace(/[-_]/g, " ");
  };

  if (parts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-sm">
          Keine Optionen verfügbar
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 overflow-y-auto">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {parts.map((part) => {
            const selected = isSelected(part);

            return (
              <Card
                key={part.id}
                onClick={() => onPartSelect(part)}
                className={cn(
                  "aspect-square p-0 transition-all",
                  selected ? "ring-3  ring-offset-2 ring-primary" : ""
                )}
              >
                {/* Image container with auto-crop */}
                <div className="w-full h-full flex items-center justify-center">
                  <PartsImage
                    src={part.src}
                    alt={getPartName(part)}
                    className={`
                          max-w-full max-h-full object-contain
                          p-2
                        `}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
