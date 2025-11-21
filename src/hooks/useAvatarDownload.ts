import type { AvatarConfig } from "@/types/avatar";
import { useCallback } from "react";

interface UseAvatarDownloadReturn {
  generateFilename: (config: AvatarConfig) => string;
  downloadCanvas: (canvas: HTMLCanvasElement, filename?: string) => void;
}

/**
 * Custom hook for avatar download functionality
 * Handles PNG export with transparent background and proper filename generation
 */
export function useAvatarDownload(): UseAvatarDownloadReturn {
  /**
   * Generate a descriptive filename based on avatar configuration
   */
  const generateFilename = useCallback((config: AvatarConfig): string => {
    const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const skinTone = config.skinTone.toLowerCase();
    const hairColor = config.hairColor.toLowerCase();

    // Create a short descriptor based on selected parts
    const parts: string[] = [];

    if (config.selectedParts.bodytype) {
      parts.push(
        config.selectedParts.bodytype.split("_").pop()?.toLowerCase() || ""
      );
    }

    // Limit to 3-4 descriptive parts to keep filename reasonable
    const descriptor =
      parts.length > 0 ? `-${parts.slice(0, 3).join("-")}` : "";

    return `futur-o-mat-avatar-${skinTone}-${hairColor}${descriptor}-${timestamp}.png`;
  }, []);

  /**
   * Download canvas as PNG with transparent background
   */
  const downloadCanvas = useCallback(
    (canvas: HTMLCanvasElement, filename?: string) => {
      try {
        // Use toBlob for better browser compatibility and memory efficiency
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error("Failed to create image blob");
              return;
            }

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = filename || `futur-o-mat-avatar-${Date.now()}.png`;
            link.href = url;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          },
          "image/png",
          1.0 // Maximum quality
        );
      } catch (error) {
        console.error("Failed to download avatar:", error);
        throw new Error("Failed to download avatar image");
      }
    },
    []
  );

  return {
    generateFilename,
    downloadCanvas,
  };
}
