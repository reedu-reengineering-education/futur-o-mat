/**
 * ColorSelector Component
 *
 * Provides skin tone and hair color selection interface
 * Displays color options with visual selection states and hover effects
 */

import { SKIN_TONES, HAIR_COLORS } from "@/data/categories";
import { Transgender } from "lucide-react";

interface ColorSelectorProps {
  type: "skin" | "hair";
  selectedColor: string;
  onColorChange: (color: string) => void;
  visible?: boolean;
  showBrustansatz?: boolean;
  onBrustansatzToggle?: () => void;
  isBrustansatzActive?: boolean;
}

export function ColorSelector({
  type,
  selectedColor,
  onColorChange,
  visible = true,
  showBrustansatz = false,
  onBrustansatzToggle,
  isBrustansatzActive = false,
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

          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start">
            {/* Farbkreise */}
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
                    min-w-10 sm:min-w-12
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
                </button>
              );
            })}

            {/* Brustansatz Button als Farbkreis */}
            {showBrustansatz && onBrustansatzToggle && (
              <button
                onClick={onBrustansatzToggle}
                className={`
                  relative group flex flex-col items-center gap-1.5 sm:gap-2
                  transition-all duration-200
                  touch-manipulation
                  min-w-10 sm:min-w-12
                  ${isBrustansatzActive ? "scale-110" : "active:scale-105"}
                `}
                aria-label="Brustansatz umschalten"
                aria-pressed={isBrustansatzActive}
                title="Brustansatz"
              >
                {/* Symbol Kreis - gleiche Größe wie Farbkreise */}
                <div
                  className={`
                    w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 transition-all duration-200
                    flex items-center justify-center
                    ${
                      isBrustansatzActive
                        ? "border-brand-primary shadow-lg bg-brand-primary/10"
                        : "border-gray-300 bg-gray-100 active:border-brand-primary/50"
                    }
                  `}
                >
                  <span
                    className={`
                      text-xl font-bold transition-colors duration-200
                      ${isBrustansatzActive ? "text-brand-primary" : "text-gray-500"}
                    `}
                  >
                    <Transgender />
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
