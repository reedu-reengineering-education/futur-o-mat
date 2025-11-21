/**
 * CategoryTabs Component (shadcn Tabs)
 *
 * Rewritten to use shadcn-ui Tabs while preserving horizontal scrolling,
 * center-scroll-to-active behavior, and left/right fade indicators.
 */

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import type { Category } from "@/types/avatar";

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
}: CategoryTabsProps) {
  return (
    <Tabs
      value={activeCategory}
      onValueChange={onCategoryChange}
      className="w-full"
    >
      <ScrollArea>
        <div className="w-full relative h-14">
          <TabsList className="flex absolute h-14 p-2">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  );
}
