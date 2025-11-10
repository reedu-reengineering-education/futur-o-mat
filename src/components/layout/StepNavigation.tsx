/**
 * StepNavigation Component
 *
 * Provides navigation between "Wer bist du?" (Who are you?) and "Wie bist du?" (How are you?) steps
 * Implements responsive design with active step highlighting
 */

import { Button } from "@/components/ui/button";
import type { Step } from "@/types";

interface StepNavigationProps {
  currentStep: Step;
  onStepChange: (step: Step) => void;
}

const STEPS = [
  {
    id: "body" as Step,
    label: "Wer bist du?",
    description: "Gestalte deinen Avatar",
  },
  {
    id: "values" as Step,
    label: "Wie bist du?",
    description: "Wähle Werte & Stärken",
  },
];

export function StepNavigation({
  currentStep,
  onStepChange,
}: StepNavigationProps) {
  return (
    <div className="w-full bg-background-secondary border-b border-border">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 max-w-2xl mx-auto">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;

            return (
              <Button
                key={step.id}
                onClick={() => onStepChange(step.id)}
                variant={isActive ? "default" : "outline"}
                className={`
                  flex-1 h-auto py-2.5 sm:py-3 px-3 sm:px-4 flex flex-col items-start gap-0.5 sm:gap-1
                  transition-all duration-200
                  touch-manipulation
                  min-h-[60px] sm:min-h-[70px]
                  ${
                    isActive
                      ? "bg-brand-primary text-white shadow-md"
                      : "bg-white active:bg-brand-primary/5 active:border-brand-primary/30"
                  }
                `}
              >
                <span className="font-semibold text-sm sm:text-base md:text-lg">
                  {step.label}
                </span>
                <span
                  className={`
                  text-[10px] sm:text-xs md:text-sm font-normal
                  ${isActive ? "text-white/90" : "text-muted-foreground"}
                `}
                >
                  {step.description}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
