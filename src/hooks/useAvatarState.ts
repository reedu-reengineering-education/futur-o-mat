import { create } from "zustand";
import type { AvatarConfig, AvatarPart } from "@/types/avatar";
import { DEFAULT_AVATAR_CONFIG } from "@/data/categories";
import { devtools } from "zustand/middleware";

interface UseAvatarStateReturn {
  avatarConfig: AvatarConfig;
  updatePart: (part: AvatarPart) => void;
  // toggleItem optionally accepts the full parts list to resolve subcategory conflicts
  toggleItem: (part: AvatarPart, allParts?: AvatarPart[]) => void;
  setSkinTone: (skinTone: string) => void;
  setHairColor: (hairColor: string) => void;
  setBreastOption: (enabled: boolean) => void;
  removeBrust: () => void;
  removeHair: () => void;
  generateRandom: (allParts: AvatarPart[]) => void;
  resetAvatar: () => void;
  setAvatarConfig: (config: AvatarConfig) => void;
}

const singleSelectCategories = ["head", "bodytype", "shoes", "brust", "hair"];
const multiSelectCategories = ["face", "clothes", "accessoires", "handicap"];

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

const useAvatarState = create<UseAvatarStateReturn>()(
  devtools<UseAvatarStateReturn>(
    (
      set: (
        partial:
          | Partial<UseAvatarStateReturn>
          | ((state: UseAvatarStateReturn) => Partial<UseAvatarStateReturn>)
      ) => void
    ) => ({
      avatarConfig: clone(DEFAULT_AVATAR_CONFIG) as AvatarConfig,

      updatePart: (part: AvatarPart) => {
        set((state) => {
          const newConfig = {
            ...state.avatarConfig,
            selectedParts: {
              ...state.avatarConfig.selectedParts,
              [part.category]: part.id,
            },
          };

          // If bodytype changed, swap clothes and accessories to match new body type
          if (part.category === "bodytype") {
            // Extract the new body type from the part ID
            const bodyTypes = ["Breit", "Eng", "Normal", "Betont"];
            let newBodyType = "Normal";

            for (const type of bodyTypes) {
              if (part.id.includes(type) || part.src.includes(type)) {
                newBodyType = type;
                break;
              }
            }

            // Swap selectedItems to match the new body type
            const swappedItems = state.avatarConfig.selectedItems.map(
              (itemId) => {
                // Check if this item has a body type indicator
                const hasBodyTypeIndicator = bodyTypes.some((type) =>
                  itemId.toLowerCase().includes(type.toLowerCase())
                );

                if (hasBodyTypeIndicator) {
                  // Replace the old body type with the new one
                  // Pattern: clothes_itemname_bodytype or accessoires_itemname_bodytype
                  let swappedId = itemId;
                  for (const oldType of bodyTypes) {
                    if (itemId.toLowerCase().includes(oldType.toLowerCase())) {
                      // Replace old body type with new one, using lowercase to match manifest naming
                      const regex = new RegExp(oldType, "i");
                      swappedId = itemId.replace(
                        regex,
                        newBodyType.toLowerCase()
                      );
                      break;
                    }
                  }
                  return swappedId;
                }

                // If no body type indicator, keep it unchanged (universal item)
                return itemId;
              }
            );

            newConfig.selectedItems = swappedItems;
          }

          return { avatarConfig: newConfig };
        });
      },

      toggleItem: (part: AvatarPart, allParts?: AvatarPart[]) => {
        set((state) => {
          const currentSelected = [...state.avatarConfig.selectedItems];
          const isSelected = currentSelected.includes(part.id);

          // If the part's category is multi-select but has a subcategory, ensure only one per subcategory
          if (!isSelected && multiSelectCategories.includes(part.category)) {
            const sub = part.subcategory;
            if (sub && allParts && allParts.length > 0) {
              // Build a map of id -> part for quick lookup
              const idToPart: Record<string, AvatarPart> = {};
              allParts.forEach((p) => (idToPart[p.id] = p));

              // Special-case: onepiece should remove tops and bottoms
              if (sub === "onepiece") {
                for (const selectedId of [...currentSelected]) {
                  const selPart = idToPart[selectedId];
                  if (!selPart) continue;
                  if (
                    selPart.category === part.category &&
                    (selPart.subcategory === "top" ||
                      selPart.subcategory === "bottom")
                  ) {
                    const idx = currentSelected.indexOf(selectedId);
                    if (idx >= 0) currentSelected.splice(idx, 1);
                  }
                }
              }

              // If selecting a top or bottom, remove existing onepiece
              if (sub === "top" || sub === "bottom") {
                for (const selectedId of [...currentSelected]) {
                  const selPart = idToPart[selectedId];
                  if (!selPart) continue;
                  if (
                    selPart.category === part.category &&
                    selPart.subcategory === "onepiece"
                  ) {
                    const idx = currentSelected.indexOf(selectedId);
                    if (idx >= 0) currentSelected.splice(idx, 1);
                  }
                }
              }

              // Remove existing selected items that belong to same category + same subcategory
              for (const selectedId of [...currentSelected]) {
                const selPart = idToPart[selectedId];
                if (!selPart) continue;
                if (
                  selPart.category === part.category &&
                  (selPart.subcategory || undefined) === sub
                ) {
                  const idx = currentSelected.indexOf(selectedId);
                  if (idx >= 0) currentSelected.splice(idx, 1);
                }
              }
            }
          }

          // Toggle the item: if selected remove, else add
          const newSelected = isSelected
            ? currentSelected.filter((id) => id !== part.id)
            : [...currentSelected, part.id];

          return {
            avatarConfig: {
              ...state.avatarConfig,
              selectedItems: newSelected,
            },
          };
        });
      },

      setSkinTone: (skinTone: string) => {
        set((state) => {
          const currentParts = state.avatarConfig.selectedParts;

          const newHead = currentParts.head
            ? currentParts.head
                .split("_")
                .map((part, index) =>
                  index === 1 ? skinTone.toLowerCase() : part
                )
                .join("_")
            : currentParts.head;

          const newBodytype = currentParts.bodytype
            ? currentParts.bodytype
                .split("_")
                .map((part, index) =>
                  index === 1 ? skinTone.toLowerCase() : part
                )
                .join("_")
            : currentParts.bodytype;

          return {
            avatarConfig: {
              ...state.avatarConfig,
              skinTone,
              selectedParts: {
                ...currentParts,
                head: newHead,
                bodytype: newBodytype,
              },
            },
          };
        });
      },

      setHairColor: (hairColor: string) => {
        set((state) => ({
          avatarConfig: {
            ...state.avatarConfig,
            hairColor,
          },
        }));
      },

      setBreastOption: (enabled: boolean) => {
        set((state) => ({
          avatarConfig: {
            ...state.avatarConfig,
            brustAnsatz: enabled,
          },
        }));
      },

      removeHair: () => {
        set((state) => {
          const newSelectedParts = { ...state.avatarConfig.selectedParts };
          delete newSelectedParts.hair;
          return {
            avatarConfig: {
              ...state.avatarConfig,
              selectedParts: newSelectedParts,
            },
          };
        });
      },

      removeBrust: () => {
        set((state) => {
          const newSelectedParts = { ...state.avatarConfig.selectedParts };
          delete newSelectedParts.brust;
          return {
            avatarConfig: {
              ...state.avatarConfig,
              selectedParts: newSelectedParts,
              brustAnsatz: false,
            },
          };
        });
      },

      generateRandom: (allParts: AvatarPart[]) => {
        const newConfig: AvatarConfig = {
          selectedParts: {},
          selectedItems: [],
          skinTone: "",
          hairColor: "",
          brustAnsatz: false,
        };

        const skinTones = ["Hell", "Braun", "Dunkel"];
        newConfig.skinTone =
          skinTones[Math.floor(Math.random() * skinTones.length)];

        const hairColors = ["black", "blonde", "brunette", "red", "white"];
        newConfig.hairColor =
          hairColors[Math.floor(Math.random() * hairColors.length)];

        newConfig.brustAnsatz = Math.random() > 0.5;

        singleSelectCategories.forEach((category) => {
          let categoryParts = allParts.filter(
            (part) => part.category === category
          );

          if (["bodytype", "head"].includes(category)) {
            categoryParts = categoryParts.filter(
              (part) =>
                part.id.includes(newConfig.skinTone) ||
                part.src.includes(newConfig.skinTone)
            );
          }

          if (category === "hair") {
            const hairColorsLocal = [
              "black",
              "blonde",
              "brunette",
              "red",
              "white",
            ];
            categoryParts = categoryParts.filter((part) => {
              const matchesHairColor =
                part.id.includes(newConfig.hairColor) ||
                part.src.includes(newConfig.hairColor);
              const hasNoHairColorIndicator = !hairColorsLocal.some(
                (color) => part.id.includes(color) || part.src.includes(color)
              );
              return matchesHairColor || hasNoHairColorIndicator;
            });
          }

          if (categoryParts.length > 0) {
            const randomPart =
              categoryParts[Math.floor(Math.random() * categoryParts.length)];
            newConfig.selectedParts[category] = randomPart.id;
          }
        });

        let bodyType = "Normal";
        if (newConfig.selectedParts.bodytype) {
          const bodytypePart = allParts.find(
            (p) => p.id === newConfig.selectedParts.bodytype
          );
          if (bodytypePart) {
            const bodyTypes = ["Breit", "Eng", "Normal", "Betont"];
            for (const type of bodyTypes) {
              if (
                bodytypePart.id.includes(type) ||
                bodytypePart.src.includes(type)
              ) {
                bodyType = type;
                break;
              }
            }
          }
        }

        multiSelectCategories.forEach((category) => {
          let categoryParts = allParts.filter(
            (part) => part.category === category
          );

          if (["clothes", "accessoires"].includes(category)) {
            const bodyTypes = ["Breit", "Eng", "Normal", "Betont"];
            categoryParts = categoryParts.filter((part) => {
              const matchesBodyType =
                part.id.toLowerCase().includes(bodyType.toLowerCase()) ||
                part.src.toLowerCase().includes(bodyType.toLowerCase());
              const hasNoBodyTypeIndicator = !bodyTypes.some(
                (type) =>
                  part.id.toLowerCase().includes(type.toLowerCase()) ||
                  part.src.toLowerCase().includes(type.toLowerCase())
              );
              return matchesBodyType || hasNoBodyTypeIndicator;
            });
          }

          const baseNumItems = Math.floor(Math.random() * 4);
          const shuffled = [...categoryParts].sort(() => Math.random() - 0.5);

          // Required subcategories for this category
          const requieredSubCategories = [
            "lip_shape",
            "nose",
            "eyebrows",
            "eye_color",
          ].filter((sub) =>
            // Prüfe ob diese subcategory in dieser Kategorie überhaupt vorkommt
            shuffled.some((p) => p.subcategory === sub)
          );

          const picked: AvatarPart[] = [];
          const seenSubcats = new Set<string>();
          let hasOnepiece = false;
          let hasTopOrBottom = false;

          // PHASE 1: Required subcategories GARANTIEREN (unabhängig von numItems)
          for (const requiredSub of requieredSubCategories) {
            if (seenSubcats.has(requiredSub)) continue;

            const requiredPart = shuffled.find(
              (p) => p.subcategory === requiredSub
            );
            if (requiredPart) {
              picked.push(requiredPart);
              seenSubcats.add(requiredSub);

              // Für clothes: spezielle Logik
              if (category === "clothes") {
                if (requiredSub === "onepiece") hasOnepiece = true;
                if (requiredSub === "top" || requiredSub === "bottom")
                  hasTopOrBottom = true;
              }
            }
          }

          // PHASE 2: Optionale Teile bis max numItems
          // Berechne wie viele optionale Teile noch möglich sind
          const remainingSlots = Math.max(0, baseNumItems - picked.length);

          if (remainingSlots > 0) {
            for (const p of shuffled) {
              if (picked.length >= baseNumItems) break;

              const sub = p.subcategory;
              if (sub) {
                // Skip if we already have this subcategory
                if (seenSubcats.has(sub)) continue;

                if (category === "clothes") {
                  // For clothes category, enforce onepiece vs top/bottom constraint
                  if (sub === "onepiece" && hasTopOrBottom) continue;
                  if ((sub === "top" || sub === "bottom") && hasOnepiece)
                    continue;
                }

                seenSubcats.add(sub);
                picked.push(p);

                // Track what we've picked for clothes
                if (category === "clothes") {
                  if (sub === "onepiece") hasOnepiece = true;
                  if (sub === "top" || sub === "bottom") hasTopOrBottom = true;
                }
              } else {
                // no subcategory; it's safe to pick
                picked.push(p);
              }
            }
          }
          picked.forEach((part) => newConfig.selectedItems.push(part.id));
        });

        set(() => ({ avatarConfig: newConfig }));
      },

      resetAvatar: () => {
        set(() => ({
          avatarConfig: clone(DEFAULT_AVATAR_CONFIG) as AvatarConfig,
        }));
      },

      setAvatarConfig: (config: AvatarConfig) => {
        set(() => ({ avatarConfig: clone(config) }));
      },
    })
  )
);

export default useAvatarState;
