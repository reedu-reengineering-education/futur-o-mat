import { useEffect, useRef, type ImgHTMLAttributes } from "react";
import { croppedImageCache } from "../../utils/preloadImages";

function findVisibleBounds(
  imageData: ImageData
): { left: number; top: number; width: number; height: number } | null {
  const { width, height, data } = imageData;
  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;
  let foundVisible = false;

  // Scan through all pixels to find the bounds of non-transparent ones
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3]; // Alpha channel
      if (alpha > 10) {
        // Using a threshold to account for very faint pixels
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        foundVisible = true;
      }
    }
  }

  if (!foundVisible) return null;

  // Add a small padding around the visible area
  const padding = 2;
  return {
    left: Math.max(0, minX - padding),
    top: Math.max(0, minY - padding),
    width: Math.min(width, maxX - minX + 1 + padding * 2),
    height: Math.min(height, maxY - minY + 1 + padding * 2),
  };
}

export default function PartsImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);
  const originalSrc = props.src as string;

  // Check cache and use cached version if available
  const cachedSrc = croppedImageCache.get(originalSrc);
  const srcToUse = cachedSrc || originalSrc;

  useEffect(() => {
    // If we already have a cached version, no need to process
    if (cachedSrc) return;

    const img = ref.current;
    if (!img || !originalSrc) return;

    const handleImageLoad = () => {
      // Create a temporary canvas to process the image
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      // Create a cropped version of the image
      tempCanvas.width = img.naturalWidth;
      tempCanvas.height = img.naturalHeight;
      tempCtx!.drawImage(img, 0, 0);

      // Find the bounds of non-transparent pixels
      const imageData = tempCtx!.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );
      const bounds = findVisibleBounds(imageData);

      if (bounds) {
        // Create a new canvas with just the visible part
        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = bounds.width;
        croppedCanvas.height = bounds.height;
        const croppedCtx = croppedCanvas.getContext("2d");

        // Draw only the visible part
        croppedCtx!.drawImage(
          img,
          bounds.left,
          bounds.top,
          bounds.width,
          bounds.height,
          0,
          0,
          bounds.width,
          bounds.height
        );

        // Replace image source with cropped image
        const croppedDataUrl = croppedCanvas.toDataURL("image/png");

        // Cache the result
        croppedImageCache.set(originalSrc, croppedDataUrl);

        img.src = croppedDataUrl;
      }
    };

    img.addEventListener("load", handleImageLoad);
    return () => {
      img.removeEventListener("load", handleImageLoad);
    };
  }, [originalSrc, cachedSrc]);

  return <img ref={ref} {...props} src={srcToUse} />;
}
