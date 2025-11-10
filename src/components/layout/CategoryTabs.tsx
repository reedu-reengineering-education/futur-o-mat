/**
 * CategoryTabs Component
 *
 * Displays scrollable category tabs with progress tracking and fade indicators
 * Tracks visited categories and shows visual progress
 */

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  visitedCategories: Set<string>;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  visitedCategories,
}: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  // Calculate progress percentage
  const progress = Math.round(
    (visitedCategories.size / categories.length) * 100
  );

  // Check scroll position to show/hide fade indicators
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftFade(scrollLeft > 10);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [categories]);

  // Scroll active category into view
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeButton = container.querySelector(
      `[data-category="${activeCategory}"]`
    );
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategory]);

  return (
    <div className="w-full bg-white border-b border-border">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        {/* Progress indicator */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              Fortschritt
            </span>
            <span className="text-xs sm:text-sm font-semibold text-brand-primary">
              {progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Scrollable tabs with fade indicators */}
        <div className="relative -mx-2 sm:mx-0">
          {/* Left fade indicator - hidden on mobile for edge-to-edge scroll */}
          {showLeftFade && (
            <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          )}

          {/* Tabs container with momentum scrolling */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-2 px-2 sm:px-0 touch-scroll snap-x snap-proximity"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              const isVisited = visitedCategories.has(category.id);

              return (
                <Button
                  key={category.id}
                  data-category={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  variant={isActive ? "default" : "outline"}
                  className={`
                    relative flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-2 
                    text-xs sm:text-sm font-medium
                    transition-all duration-200
                    min-h-[44px] snap-start
                    touch-manipulation
                    ${
                      isActive
                        ? "bg-brand-primary text-white shadow-md scale-105 sm:scale-100"
                        : isVisited
                        ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary active:bg-brand-primary/20"
                        : "bg-white active:bg-gray-50"
                    }
                  `}
                >
                  {category.name}
                  {isVisited && !isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-accent rounded-full" />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Right fade indicator - hidden on mobile for edge-to-edge scroll */}
          {showRightFade && (
            <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}
