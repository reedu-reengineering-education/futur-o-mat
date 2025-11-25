import {
  useEffect,
  useRef,
  useCallback,
  type CanvasHTMLAttributes,
  useImperativeHandle,
  type Ref,
} from "react";
import { LAST_RENDER, RENDER_ORDER } from "../../data/categories";
import { useAvatarParts } from "../../hooks/useAvatarParts";
import { cn } from "@/lib/utils";
import { type QuizResult } from "@/hooks/useQuizState";
import { STRENGTH_TO_PART_ID, VALUE_TO_PART_ID } from "../quiz/Values";
import type { AvatarConfig } from "@/types/avatar";

const PULSE_DURATION = 2000; // Duration of one pulse cycle in milliseconds
const PULSE_MIN_OPACITY = 0.4; // Minimum opacity during pulse
const PULSE_MAX_OPACITY = 1.0; // Maximum opacity during pulse

const STRENGTH_BBOX = [0.65918, 0.16308, 0.95215, 0.91693];
const VALUE_BBOX = [0.35742, 0.00407, 0.65039, 0.18745];

interface AvatarCanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  avatarConfig: AvatarConfig;
  quizResult?: QuizResult;
  showStrengh?: boolean;
  showValue?: boolean;
  highlightStrengh?: boolean;
  highlightValue?: boolean;
  onStrengthClick?: () => void;
  onValueClick?: () => void;
  ref?: Ref<HTMLCanvasElement>; // ← expose ref to parent
}

export default function AvatarCanvas({
  ref: externalRef,
  avatarConfig,
  quizResult,
  showStrengh = false,
  showValue = false,
  highlightStrengh = false,
  highlightValue = false,
  onStrengthClick,
  onValueClick,
  width = 800,
  height = 960,
  className = "",
  ...props
}: AvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync internal ref → external ref
  useImperativeHandle(externalRef, () => canvasRef.current!, []);

  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const renderRequestRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const pulseOpacityRef = useRef<number>(1);
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

    for (const category of LAST_RENDER) {
      const partId = avatarConfig.selectedParts[category];
      if (partId) {
        const src = partMap.get(partId);
        if (src) {
          sources.push(src);
        }
      }
    }

    if (showValue && quizResult?.valueKey) {
      const partId = VALUE_TO_PART_ID[quizResult.valueKey];
      const src = partMap.get(partId);
      if (src) {
        sources.push(src);
      }
    }

    if (showStrengh && quizResult?.strengthKey) {
      const partId = STRENGTH_TO_PART_ID[quizResult.strengthKey];
      const src = partMap.get(partId);
      if (src) {
        sources.push(src);
      }
    }

    return sources;
  }, [avatarConfig, allParts, showStrengh, showValue, quizResult]);

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
      for (let i = 0; i < images.length; i++) {
        const img = images[i];

        // Determine if this image should be pulsating
        let shouldPulse = false;
        const imageSrc = imageSources[i];

        // Check if this is a strength part that should pulse
        if (highlightStrengh && showStrengh && quizResult?.strengthKey) {
          const partId = STRENGTH_TO_PART_ID[quizResult.strengthKey];
          const src = new Map<string, string>();
          allParts.forEach((part) => src.set(part.id, part.src));
          if (src.get(partId) === imageSrc) {
            shouldPulse = true;
          }
        }

        // Check if this is a value part that should pulse
        if (highlightValue && showValue && quizResult?.valueKey) {
          const partId = VALUE_TO_PART_ID[quizResult.valueKey];
          const src = new Map<string, string>();
          allParts.forEach((part) => src.set(part.id, part.src));
          if (src.get(partId) === imageSrc) {
            shouldPulse = true;
          }
        }

        // Apply pulsating effect if needed
        if (shouldPulse) {
          ctx.globalAlpha = pulseOpacityRef.current;
        }

        ctx.drawImage(img, 0, 0, +width, +height);

        // Reset opacity
        ctx.globalAlpha = 1;
      }
    } catch (error) {
      // Only report error if this is still the current request
      if (currentRequest === renderRequestRef.current) {
        const err =
          error instanceof Error ? error : new Error("Failed to render avatar");
        console.error("Avatar render error:", err);
      }
    }
  }, [
    width,
    height,
    getImageSources,
    loadImage,
    highlightStrengh,
    highlightValue,
    showStrengh,
    showValue,
    quizResult,
    allParts,
  ]);

  useEffect(() => {
    renderAvatar();
  }, [renderAvatar]);

  // Animation loop for pulsating effect
  useEffect(() => {
    const shouldAnimate =
      (highlightStrengh && showStrengh) || (highlightValue && showValue);

    if (!shouldAnimate) {
      pulseOpacityRef.current = 1;
      return;
    }

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cycle = (elapsed % PULSE_DURATION) / PULSE_DURATION; // pulse cycle

      // Pulsate from min to max opacity
      pulseOpacityRef.current =
        PULSE_MIN_OPACITY +
        ((Math.cos(cycle * Math.PI * 2) + 1) / 2) *
          (PULSE_MAX_OPACITY - PULSE_MIN_OPACITY);

      renderAvatar();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [highlightStrengh, highlightValue, showStrengh, showValue, renderAvatar]);

  // Handle canvas clicks for strength and value using bounding boxes
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Scale coordinates to canvas resolution
      const scaleX = +width / rect.width;
      const scaleY = +height / rect.height;
      const canvasX = Math.floor(x * scaleX);
      const canvasY = Math.floor(y * scaleY);

      const nx = canvasX / +width;
      const ny = canvasY / +height;

      // Check if click is on strength part (top priority)
      // Use fixed percentage bbox: [left, top, right, bottom]
      if (showStrengh && quizResult?.strengthKey) {
        if (
          nx >= STRENGTH_BBOX[0] &&
          nx <= STRENGTH_BBOX[2] &&
          ny >= STRENGTH_BBOX[1] &&
          ny <= STRENGTH_BBOX[3]
        ) {
          onStrengthClick?.();
          return;
        }
      }

      // Then check value part using percentage bbox
      if (showValue && quizResult?.valueKey) {
        if (
          nx >= VALUE_BBOX[0] &&
          nx <= VALUE_BBOX[2] &&
          ny >= VALUE_BBOX[1] &&
          ny <= VALUE_BBOX[3]
        ) {
          onValueClick?.();
          return;
        }
      }
    },
    [
      width,
      height,
      showStrengh,
      showValue,
      quizResult,
      onStrengthClick,
      onValueClick,
    ]
  );

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={cn("max-w-full h-auto cursor-pointer", className)}
      onClick={handleCanvasClick}
      {...props}
    />
  );
}
