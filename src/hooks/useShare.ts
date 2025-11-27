import { useCallback } from "react";
import type { AvatarConfig } from "@/types/avatar";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import type { QuizResult } from "./useQuizState";
import type { WimmelbildImage } from "./useWimmelbildState";
import wimmelbilder from "@/assets/wimmelbilder.json";

export interface ShareParams {
  avatar: AvatarConfig;
  result: QuizResult;
  wimmelbild: WimmelbildImage;
}

interface UseShareReturn {
  encodeState: (params: ShareParams) => string;
  decodeState: (encodedState: string) => ShareParams | null;
}

/**
 * Custom hook to manage avatar state persistence in URL
 * Handles encoding/decoding avatar configuration for sharing
 */
export function useShare(): UseShareReturn {
  /**
   * Encode avatar configuration to base64 string
   */
  const encodeState = useCallback((params: ShareParams): string => {
    try {
      // simplify keys for smaller size
      const simplifiedParams = {
        sP: params.avatar.selectedParts,
        sI: params.avatar.selectedItems,
        sT: params.avatar.skinTone,
        hC: params.avatar.hairColor,
        bO: params.avatar.brustAnsatz,
        vK: params.result.valueKey,
        sK: params.result.strengthKey,
        w: params.wimmelbild.id,
      };

      return compressToEncodedURIComponent(JSON.stringify(simplifiedParams));
    } catch (error) {
      console.error("Error encoding avatar state:", error);
      return "";
    }
  }, []);

  /**
   * Decode base64 string to avatar configuration
   */
  const decodeState = useCallback(
    (encodedState: string): ShareParams | null => {
      try {
        const jsonString = decompressFromEncodedURIComponent(encodedState);

        if (!jsonString) {
          console.warn("Decoded string is null or empty");
          return null;
        }

        const params = JSON.parse(jsonString);

        // Validate the decoded state
        if (!params || typeof params !== "object") {
          console.warn("Invalid share state structure");
          return null;
        }

        const wimmelbild =
          wimmelbilder.find((e) => e.id === params.w) || wimmelbilder[0];

        // reconstruct full keys
        const shareParams: ShareParams = {
          avatar: {
            selectedParts: params.sP,
            selectedItems: params.sI,
            skinTone: params.sT,
            hairColor: params.hC,
            brustAnsatz: params.bO,
          },
          result: {
            valueKey: params.vK,
            strengthKey: params.sK,
          },
          wimmelbild,
        };

        return shareParams;
      } catch (error) {
        console.error("Error decoding share state:", error);
        return null;
      }
    },
    []
  );

  return {
    encodeState,
    decodeState,
  };
}
