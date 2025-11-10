import { useState, useCallback, useRef, useEffect } from "react";

interface UseImageCacheReturn {
  cachedImages: Map<string, HTMLImageElement>;
  preloadImages: (imageSrcs: string[]) => Promise<void>;
  isLoading: boolean;
  loadingProgress: number;
  error: Error | null;
  clearCache: () => void;
}

/**
 * Custom hook to preload and cache avatar part images
 * Handles loading progress, error states, and memory optimization
 */
export function useImageCache(): UseImageCacheReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to maintain cache across renders without causing re-renders
  const cacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  /**
   * Preload a single image and add it to cache
   */
  const preloadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      // Check if image is already cached
      if (cacheRef.current.has(src)) {
        resolve(cacheRef.current.get(src)!);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous"; // Handle CORS if needed

      img.onload = () => {
        cacheRef.current.set(src, img);
        resolve(img);
      };

      img.onerror = () => {
        const error = new Error(`Failed to load image: ${src}`);
        reject(error);
      };

      img.src = src;
    });
  }, []);

  /**
   * Preload multiple images with progress tracking
   * Optimized for mobile networks with adaptive batch sizing
   */
  const preloadImages = useCallback(
    async (imageSrcs: string[]) => {
      if (imageSrcs.length === 0) {
        return;
      }

      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);

      try {
        let loadedCount = 0;
        const total = imageSrcs.length;

        // Detect connection type and adjust batch size for mobile optimization
        interface NavigatorConnection {
          effectiveType?: string;
        }
        interface NavigatorWithConnection extends Navigator {
          connection?: NavigatorConnection;
          mozConnection?: NavigatorConnection;
          webkitConnection?: NavigatorConnection;
        }
        const connection =
          (navigator as NavigatorWithConnection).connection ||
          (navigator as NavigatorWithConnection).mozConnection ||
          (navigator as NavigatorWithConnection).webkitConnection;
        const effectiveType = connection?.effectiveType || "4g";

        // Adaptive batch sizing based on network speed
        let batchSize = 10; // Default for fast connections
        if (effectiveType === "slow-2g" || effectiveType === "2g") {
          batchSize = 2; // Very small batches for slow connections
        } else if (effectiveType === "3g") {
          batchSize = 5; // Medium batches for 3G
        }

        // Reduce batch size on mobile devices
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
        if (isMobile && batchSize > 5) {
          batchSize = 5;
        }

        // Load images in batches to avoid overwhelming the browser
        for (let i = 0; i < imageSrcs.length; i += batchSize) {
          const batch = imageSrcs.slice(i, i + batchSize);

          await Promise.allSettled(
            batch.map(async (src) => {
              try {
                await preloadImage(src);
                loadedCount++;
                setLoadingProgress((loadedCount / total) * 100);
              } catch (err) {
                console.warn(`Failed to preload image: ${src}`, err);
                // Continue loading other images even if one fails
                loadedCount++;
                setLoadingProgress((loadedCount / total) * 100);
              }
            })
          );

          // Add small delay between batches on slow connections
          if (effectiveType === "slow-2g" || effectiveType === "2g") {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }

        setLoadingProgress(100);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to preload images");
        setError(error);
        console.error("Error preloading images:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [preloadImage]
  );

  /**
   * Clear the image cache to free memory
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    setLoadingProgress(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const cache = cacheRef.current;
    return () => {
      // Clear cache when component unmounts to prevent memory leaks
      cache.clear();
    };
  }, []);

  return {
    cachedImages: cacheRef.current,
    preloadImages,
    isLoading,
    loadingProgress,
    error,
    clearCache,
  };
}
