/**
 * ModeTabs Component
 *
 * Provides inline tab buttons for switching between "Wer bist du?" (Who are you?)
 * and "Wie bist du?" (How are you?) modes.
 * Designed for the centered card layout with purple theme.
 */

import type { Step } from "@/types";

interface ModeTabsProps {
  currentMode: Step;
  onModeChange: (mode: Step) => void;
}

const MODES = [
  {
    id: "body" as Step,
    label: "Wer bist du?",
  },
  {
    id: "values" as Step,
    label: "Wie bist du?",
  },
];

export function ModeTabs({ currentMode, onModeChange }: ModeTabsProps) {
  return (
    <div className="flex gap-2 px-4 py-3">
      {MODES.map((mode) => {
        const isActive = currentMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              flex-1 h-12 rounded-xl font-semibold text-base
              transition-all duration-200
              touch-manipulation
              ${
                isActive
                  ? "bg-purple-600 text-white shadow-md hover:bg-purple-700"
                  : "bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50"
              }
            `}
            aria-pressed={isActive}
            aria-label={`${mode.label} ${isActive ? "(aktiv)" : ""}`}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
