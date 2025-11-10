/**
 * Mobile optimization utilities
 * Provides helpers for detecting mobile devices, network conditions, and performance optimization
 */

/**
 * Detect if the user is on a mobile device
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Detect if the user is on a touch device
 */
export function isTouchDevice(): boolean {
  interface NavigatorWithMsMaxTouchPoints extends Navigator {
    msMaxTouchPoints?: number;
  }
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    ((navigator as NavigatorWithMsMaxTouchPoints).msMaxTouchPoints ?? 0) > 0
  );
}

/**
 * Get the effective network connection type
 */
export function getNetworkType(): string {
  interface NavigatorConnection {
    effectiveType?: string;
    saveData?: boolean;
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

  return connection?.effectiveType || "4g";
}

/**
 * Check if the user is on a slow network
 */
export function isSlowNetwork(): boolean {
  const networkType = getNetworkType();
  return networkType === "slow-2g" || networkType === "2g";
}

/**
 * Check if the user has enabled data saver mode
 */
export function isDataSaverEnabled(): boolean {
  interface NavigatorConnection {
    effectiveType?: string;
    saveData?: boolean;
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

  return connection?.saveData === true;
}

/**
 * Get optimal image quality based on network and device
 */
export function getOptimalImageQuality(): "low" | "medium" | "high" {
  if (isDataSaverEnabled() || isSlowNetwork()) {
    return "low";
  }

  const networkType = getNetworkType();
  if (networkType === "3g") {
    return "medium";
  }

  return "high";
}

/**
 * Debounce function for performance optimization
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request idle callback with fallback for browsers that don't support it
 */
export function requestIdleCallback(
  callback: () => void,
  options?: { timeout?: number }
): number {
  if ("requestIdleCallback" in window) {
    return (
      window as Window & {
        requestIdleCallback: (
          callback: () => void,
          options?: { timeout?: number }
        ) => number;
      }
    ).requestIdleCallback(callback, options);
  }

  // Fallback for browsers that don't support requestIdleCallback
  return setTimeout(callback, 1);
}

/**
 * Cancel idle callback with fallback
 */
export function cancelIdleCallback(id: number): void {
  if ("cancelIdleCallback" in window) {
    (
      window as Window & { cancelIdleCallback: (id: number) => void }
    ).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Preload image with priority hints for modern browsers
 */
export function preloadImageWithPriority(
  src: string,
  priority: "high" | "low" | "auto" = "auto"
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Set fetchpriority for modern browsers
    if ("fetchPriority" in img) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (img as any).fetchPriority = priority;
    }

    // Enable lazy loading for low priority images
    if (priority === "low") {
      img.loading = "lazy";
    }

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));

    img.src = src;
  });
}

/**
 * Check if the device has a high pixel density display
 */
export function isHighDensityDisplay(): boolean {
  return window.devicePixelRatio > 1;
}

/**
 * Get the device pixel ratio
 */
export function getDevicePixelRatio(): number {
  return window.devicePixelRatio || 1;
}

/**
 * Detect if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Add haptic feedback for supported devices
 */
export function triggerHapticFeedback(
  style: "light" | "medium" | "heavy" = "light"
): void {
  // Check if the Vibration API is supported
  if ("vibrate" in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    };

    navigator.vibrate(patterns[style]);
  }
}

/**
 * Optimize scroll performance by using passive event listeners
 */
export function addPassiveScrollListener(
  element: HTMLElement | Window,
  handler: EventListener
): () => void {
  const options = { passive: true };
  element.addEventListener("scroll", handler, options);

  return () => {
    element.removeEventListener("scroll", handler);
  };
}

/**
 * Get viewport dimensions accounting for mobile browser chrome
 */
export function getViewportDimensions(): { width: number; height: number } {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
}

/**
 * Check if the device is in landscape orientation
 */
export function isLandscape(): boolean {
  return window.innerWidth > window.innerHeight;
}

/**
 * Check if the device is in portrait orientation
 */
export function isPortrait(): boolean {
  return window.innerHeight > window.innerWidth;
}
