import { create } from "zustand";
import type { AvatarConfig, AvatarPart } from "@/types/avatar";
import { DEFAULT_AVATAR_CONFIG } from "@/data/categories";
import { devtools } from "zustand/middleware";

interface UseAvatarStateReturn {
  avatarConfig: AvatarConfig;
  updatePart: (part: AvatarPart) => void;
  toggleItem: (part: AvatarPart) => void;
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
        set((state) => ({
          avatarConfig: {
            ...state.avatarConfig,
            selectedParts: {
              ...state.avatarConfig.selectedParts,
              [part.category]: part.id,
            },
          },
        }));
      },

      toggleItem: (part: AvatarPart) => {
        set((state) => {
          const isSelected = state.avatarConfig.selectedItems.includes(part.id);
          return {
            avatarConfig: {
              ...state.avatarConfig,
              selectedItems: isSelected
                ? state.avatarConfig.selectedItems.filter(
                    (id) => id !== part.id
                  )
                : [...state.avatarConfig.selectedItems, part.id],
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

          const numItems = Math.floor(Math.random() * 4);
          const shuffled = [...categoryParts].sort(() => Math.random() - 0.5);
          const selectedItems = shuffled.slice(0, numItems);
          selectedItems.forEach((part) =>
            newConfig.selectedItems.push(part.id)
          );
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
