/**
 * ColorSelector Component
 *
 * Provides skin tone and hair color selection interface
 * Displays color options with visual selection states and hover effects
 */

import { SKIN_TONES, HAIR_COLORS } from "@/data/categories";

interface ColorSelectorProps {
  type: "skin" | "hair";
  selectedColor: string;
  onColorChange: (color: string) => void;
  visible?: boolean;
}

export function ColorSelector({
  type,
  selectedColor,
  onColorChange,
  visible = true,
}: ColorSelectorProps) {
  if (!visible) return null;

  const colors = type === "skin" ? SKIN_TONES : HAIR_COLORS;
  const label = type === "skin" ? "Hautfarbe" : "Haarfarbe";

  return (
    <div className="w-full bg-white border-b border-border">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="max-w-2xl mx-auto">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
            {label}
          </label>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
            {colors.map((colorOption) => {
              const isSelected = selectedColor === colorOption.id;

              return (
                <button
                  key={colorOption.id}
                  onClick={() => onColorChange(colorOption.id)}
                  className={`
                    relative group flex flex-col items-center gap-1.5 sm:gap-2
                    transition-all duration-200
                    touch-manipulation
                    min-w-[60px] sm:min-w-[70px]
                    ${isSelected ? "scale-110" : "active:scale-105"}
                  `}
                  aria-label={`${label}: ${colorOption.id}`}
                  aria-pressed={isSelected}
                >
                  {/* Color circle - larger touch target on mobile */}
                  <div
                    className={`
                      w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 transition-all duration-200
                      ${
                        isSelected
                          ? "border-brand-primary shadow-lg"
                          : "border-gray-300 active:border-brand-primary/50"
                      }
                    `}
                    style={{ backgroundColor: colorOption.color }}
                  />

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-4 sm:h-4 bg-brand-accent rounded-full border-2 border-white flex items-center justify-center">
                      <svg
                        className="w-3 h-3 sm:w-2.5 sm:h-2.5 text-white"
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
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
