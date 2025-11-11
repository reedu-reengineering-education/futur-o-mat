import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardHeaderProps {
  onInfoClick?: () => void;
}

export function CardHeader({ onInfoClick }: CardHeaderProps) {
  return (
    <div className="relative px-6 pt-6 pb-4">
      {/* Info button in top-right corner */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={onInfoClick}
        aria-label="Information"
      >
        <Info className="h-5 w-5" />
      </Button>

      {/* Title and tagline centered */}
      <div className="text-center">
        <h1 className="text-[28px] font-bold text-gray-800 leading-tight">
          Futur-O-Mat
        </h1>
        <p className="text-base text-gray-500 mt-1">
          Mach dir die Zukunft, wie sie dir gefällt!
        </p>
      </div>
    </div>
  );
}
