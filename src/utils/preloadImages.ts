import avatarPartsManifest from "../assets/avatar_parts_manifest.json";

// Import the cache from PartsImage
// We'll export it so PartsImage can import it
export const croppedImageCache = new Map<string, string>();

interface AvatarPart {
  id: string;
  src: string;
  category: string;
  subcategory?: string;
}

function findVisibleBounds(
  imageData: ImageData
): { left: number; top: number; width: number; height: number } | null {
  const { width, height, data } = imageData;
  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;
  let foundVisible = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 10) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        foundVisible = true;
      }
    }
  }

  if (!foundVisible) return null;

  const padding = 2;
  return {
    left: Math.max(0, minX - padding),
    top: Math.max(0, minY - padding),
    width: Math.min(width, maxX - minX + 1 + padding * 2),
    height: Math.min(height, maxY - minY + 1 + padding * 2),
  };
}

async function processImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) {
          resolve();
          return;
        }

        tempCanvas.width = img.naturalWidth;
        tempCanvas.height = img.naturalHeight;
        tempCtx.drawImage(img, 0, 0);

        const imageData = tempCtx.getImageData(
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );
        const bounds = findVisibleBounds(imageData);

        if (bounds) {
          const croppedCanvas = document.createElement("canvas");
          croppedCanvas.width = bounds.width;
          croppedCanvas.height = bounds.height;
          const croppedCtx = croppedCanvas.getContext("2d");

          if (croppedCtx) {
            croppedCtx.drawImage(
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

            const croppedDataUrl = croppedCanvas.toDataURL("image/png");
            // Store with both path formats (with and without leading slash)
            croppedImageCache.set(src, croppedDataUrl);
            croppedImageCache.set(`/${src}`, croppedDataUrl);
          }
        }
      } catch (error) {
        console.warn(`Failed to process image: ${src}`, error);
      }
      resolve();
    };

    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      resolve();
    };

    img.src = src;
  });
}

export async function preloadAvatarImages(): Promise<void> {
  const parts = avatarPartsManifest as AvatarPart[];
  const imageSources = parts.map((part) => part.src);

  console.log(`Starting to preload ${imageSources.length} avatar images...`);
  console.log("Sample paths:", imageSources.slice(0, 3));

  // Process images in batches to avoid overwhelming the browser
  const batchSize = 10;
  for (let i = 0; i < imageSources.length; i += batchSize) {
    const batch = imageSources.slice(i, i + batchSize);
    await Promise.all(batch.map((src) => processImage(src)));

    // Log progress
    const processed = Math.min(i + batchSize, imageSources.length);
    console.log(
      `Preloaded ${processed}/${imageSources.length} images (${Math.round((processed / imageSources.length) * 100)}%)`
    );
  }

  console.log("All avatar images preloaded and cached!");
  console.log("Cache size:", croppedImageCache.size);
  console.log(
    "Sample cache keys:",
    Array.from(croppedImageCache.keys()).slice(0, 3)
  );
}
