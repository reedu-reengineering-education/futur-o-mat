/**
 * CategoryTabs Component
 *
 * Displays compact horizontal scrollable category tabs with bottom border indicators
 * Optimized for the centered card layout with fade indicators at edges
 */

import { useEffect, useRef, useState } from "react";
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
    <div className="w-full bg-white">
      {/* Scrollable tabs with fade indicators */}
      <div className="relative">
        {/* Left fade indicator */}
        {showLeftFade && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        )}

        {/* Tabs container with momentum scrolling */}
        <div
          ref={scrollContainerRef}
          className="flex gap-0 overflow-x-auto scrollbar-hide scroll-smooth"
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
              <button
                key={category.id}
                data-category={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  relative flex-shrink-0 px-3 h-10
                  text-sm font-medium
                  transition-all duration-200
                  touch-manipulation
                  border-b-3
                  ${
                    isActive
                      ? "text-purple-600 border-b-purple-600"
                      : isVisited
                      ? "text-gray-600 border-b-transparent hover:text-purple-500 hover:border-b-purple-300"
                      : "text-gray-500 border-b-transparent hover:text-gray-700 hover:border-b-gray-300"
                  }
                `}
                style={{
                  borderBottomWidth: "3px",
                }}
              >
                {category.name}
                {isVisited && !isActive && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right fade indicator */}
        {showRightFade && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
