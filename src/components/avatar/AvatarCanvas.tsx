import {
  useEffect,
  useRef,
  useCallback,
  type CanvasHTMLAttributes,
} from "react";
import type { AvatarConfig } from "../../types";
import { RENDER_ORDER } from "../../data/categories";
import { useAvatarParts } from "../../hooks/useAvatarParts";

interface AvatarCanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  avatarConfig: AvatarConfig;
}

/**
 * AvatarCanvas component renders the composed avatar using HTML5 Canvas
 * Handles image loading, layer composition, and proper rendering order
 */
export default function AvatarCanvas({
  avatarConfig,
  width = 800,
  height = 1200,
  className = "",
}: AvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const renderRequestRef = useRef<number>(0);
  // const { generateFilename, downloadCanvas } = useAvatarDownload();
  const { allParts } = useAvatarParts();

  /**
   * Load a single image and cache it
   */
  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      // Check cache first
      if (imageCache.current.has(src)) {
        resolve(imageCache.current.get(src)!);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        imageCache.current.set(src, img);
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }, []);

  /**
   * Get all image sources that need to be rendered based on avatar config
   */
  const getImageSources = useCallback((): string[] => {
    const sources: string[] = [];

    // Create a map of part IDs to their src paths
    const partMap = new Map<string, string>();
    allParts.forEach((part) => {
      partMap.set(part.id, part.src);
    });

    // Add selected parts in render order
    for (const category of RENDER_ORDER) {
      const partId = avatarConfig.selectedParts[category];
      if (partId) {
        const src = partMap.get(partId);
        if (src) {
          sources.push(src);
        }
      }
    }

    // Add multi-select items (accessories, face features, etc.)
    for (const itemId of avatarConfig.selectedItems) {
      const src = partMap.get(itemId);
      if (src) {
        sources.push(src);
      }
    }

    return sources;
  }, [avatarConfig, allParts]);

  /**
   * Render the avatar on the canvas
   */
  const renderAvatar = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      const error = new Error("Failed to get canvas context");
      console.error("Avatar render error:", error);
      return;
    }

    const currentRequest = ++renderRequestRef.current;

    try {
      // Clear canvas
      ctx.clearRect(0, 0, +width, +height);

      // Get all image sources to render
      const imageSources = getImageSources();

      if (imageSources.length === 0) {
        return;
      }

      // Load all images
      const images = await Promise.all(
        imageSources.map((src) => loadImage(src))
      );

      // Check if this render request is still current
      if (currentRequest !== renderRequestRef.current) {
        return; // A newer render request has been made
      }

      // Draw images in order
      for (const img of images) {
        ctx.drawImage(img, 0, 0, +width, +height);
      }
    } catch (error) {
      // Only report error if this is still the current request
      if (currentRequest === renderRequestRef.current) {
        const err =
          error instanceof Error ? error : new Error("Failed to render avatar");
        console.error("Avatar render error:", err);
      }
    }
  }, [width, height, getImageSources, loadImage]);

  // /**
  //  * Download the canvas as a PNG image with proper filename
  //  */
  // const downloadImage = useCallback(
  //   (filename?: string) => {
  //     const canvas = canvasRef.current;
  //     if (!canvas) {
  //       console.error("Canvas not available for download");
  //       return;
  //     }

  //     try {
  //       // Generate filename if not provided
  //       const finalFilename = filename || generateFilename(avatarConfig);
  //       downloadCanvas(canvas, finalFilename);
  //     } catch (error) {
  //       console.error("Failed to download image:", error);
  //       onRenderError?.(
  //         error instanceof Error ? error : new Error("Download failed")
  //       );
  //     }
  //   },
  //   [avatarConfig, generateFilename, downloadCanvas, onRenderError]
  // );

  // /**
  //  * Get canvas data URL for sharing or preview
  //  */
  // const getCanvasDataUrl = useCallback((): string | null => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return null;

  //   try {
  //     return canvas.toDataURL("image/png");
  //   } catch (error) {
  //     console.error("Failed to get canvas data URL:", error);
  //     return null;
  //   }
  // }, []);

  // /**
  //  * Get the canvas element directly
  //  */
  // const getCanvas = useCallback((): HTMLCanvasElement | null => {
  //   return canvasRef.current;
  // }, []);

  // Re-render when avatar config changes
  useEffect(() => {
    renderAvatar();
  }, [renderAvatar]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}
