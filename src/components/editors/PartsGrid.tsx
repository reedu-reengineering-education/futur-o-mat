/**
 * PartsGrid Component
 *
 * Displays avatar parts in a responsive grid with thumbnail generation
 * Handles single and multi-select part selection with visual feedback
 */

import { useState } from "react";
import type { AvatarPart } from "@/types";

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
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (partId: string) => {
    setLoadingImages((prev) => {
      const next = new Set(prev);
      next.delete(partId);
      return next;
    });
  };

  const handleImageError = (partId: string) => {
    setLoadingImages((prev) => {
      const next = new Set(prev);
      next.delete(partId);
      return next;
    });
    setErrorImages((prev) => new Set(prev).add(partId));
  };

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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {parts.map((part) => {
            const selected = isSelected(part);
            const isLoading = loadingImages.has(part.id);
            const hasError = errorImages.has(part.id);

            return (
              <button
                key={part.id}
                onClick={() => onPartSelect(part)}
                className={`
                  relative group aspect-square rounded-lg overflow-hidden
                  border-2 transition-all duration-200
                  min-h-[100px] sm:min-h-[120px]
                  touch-manipulation
                  active:scale-95
                  ${
                    selected
                      ? "border-brand-primary bg-brand-primary/5 shadow-lg scale-105"
                      : "border-gray-200 active:border-brand-primary/50 active:shadow-md"
                  }
                  ${hasError ? "bg-gray-100" : "bg-white"}
                `}
                aria-label={getPartName(part)}
                aria-pressed={selected}
              >
                {/* Image container with auto-crop */}
                <div className="w-full h-full flex items-center justify-center p-1.5 sm:p-2">
                  {!hasError ? (
                    <>
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                        </div>
                      )}
                      <img
                        src={part.src}
                        alt={getPartName(part)}
                        className={`
                          max-w-full max-h-full object-contain
                          transition-opacity duration-200
                          ${isLoading ? "opacity-0" : "opacity-100"}
                        `}
                        onLoad={() => handleImageLoad(part.id)}
                        onError={() => handleImageError(part.id)}
                        loading="lazy"
                        decoding="async"
                      />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-xs">Fehler</span>
                    </div>
                  )}
                </div>

                {/* Selection indicator */}
                {selected && (
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-brand-primary rounded-full flex items-center justify-center shadow-md">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Overlay with name - always visible on mobile when selected, hover on desktop */}
                <div
                  className={`
                    absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent
                    p-1.5 sm:p-2 transition-opacity duration-200
                    ${
                      selected
                        ? "opacity-100"
                        : "opacity-0 sm:group-hover:opacity-100 active:opacity-100"
                    }
                  `}
                >
                  <p className="text-white text-[10px] sm:text-xs font-medium text-center truncate">
                    {getPartName(part)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
