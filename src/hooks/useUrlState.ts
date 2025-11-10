import { useCallback, useEffect, useState } from "react";
import type { AvatarConfig, UrlState } from "@/types/avatar";

interface UseUrlStateReturn {
  encodeState: (config: AvatarConfig) => string;
  decodeState: (encodedState: string) => AvatarConfig | null;
  shareUrl: string;
  updateUrl: (config: AvatarConfig) => void;
  getInitialState: () => AvatarConfig | null;
}

/**
 * Custom hook to manage avatar state persistence in URL
 * Handles encoding/decoding avatar configuration for sharing
 */
export function useUrlState(): UseUrlStateReturn {
  const [shareUrl, setShareUrl] = useState("");

  /**
   * Encode avatar configuration to base64 string
   */
  const encodeState = useCallback((config: AvatarConfig): string => {
    try {
      const urlState: UrlState = {
        selectedParts: config.selectedParts,
        selectedItems: config.selectedItems,
        skinTone: config.skinTone,
        hairColor: config.hairColor,
        brustAnsatz: config.brustAnsatz,
      };

      const jsonString = JSON.stringify(urlState);
      const base64 = btoa(jsonString);
      return base64;
    } catch (error) {
      console.error("Error encoding avatar state:", error);
      return "";
    }
  }, []);

  /**
   * Decode base64 string to avatar configuration
   */
  const decodeState = useCallback(
    (encodedState: string): AvatarConfig | null => {
      try {
        const jsonString = atob(encodedState);
        const urlState: UrlState = JSON.parse(jsonString);

        // Validate the decoded state
        if (
          !urlState ||
          typeof urlState !== "object" ||
          !urlState.selectedParts ||
          !Array.isArray(urlState.selectedItems)
        ) {
          console.warn("Invalid avatar state structure");
          return null;
        }

        const config: AvatarConfig = {
          selectedParts: urlState.selectedParts || {},
          selectedItems: urlState.selectedItems || [],
          skinTone: urlState.skinTone || "Hell",
          hairColor: urlState.hairColor || "brunette",
          brustAnsatz: urlState.brustAnsatz || false,
        };

        return config;
      } catch (error) {
        console.error("Error decoding avatar state:", error);
        return null;
      }
    },
    []
  );

  /**
   * Update URL with current avatar configuration
   */
  const updateUrl = useCallback(
    (config: AvatarConfig) => {
      try {
        const encodedState = encodeState(config);
        if (!encodedState) {
          return;
        }

        // Create URL with encoded state
        const url = new URL(window.location.href);
        url.searchParams.set("avatar_state", encodedState);

        // Update browser URL without reload
        window.history.replaceState({}, "", url.toString());

        // Update share URL
        setShareUrl(url.toString());
      } catch (error) {
        console.error("Error updating URL:", error);
      }
    },
    [encodeState]
  );

  /**
   * Get initial avatar state from URL on mount
   */
  const getInitialState = useCallback((): AvatarConfig | null => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedState = urlParams.get("avatar_state");

      if (!encodedState) {
        return null;
      }

      return decodeState(encodedState);
    } catch (error) {
      console.error("Error getting initial state from URL:", error);
      return null;
    }
  }, [decodeState]);

  // Initialize share URL on mount
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  return {
    encodeState,
    decodeState,
    shareUrl,
    updateUrl,
    getInitialState,
  };
}
