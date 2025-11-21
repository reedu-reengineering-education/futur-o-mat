/**
 * Mobile optimization utilities
 * Provides helpers for detecting mobile devices, network conditions, and performance optimization
 */

/**
 * Detect if the user is on a mobile device
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}
