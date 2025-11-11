/**
 * Main App Component
 *
 * Root application component managing global state and layout
 * Implements responsive design for mobile and desktop
 * Handles step navigation between body and values editors
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Step } from "@/types";
import { useAvatarState, useAvatarParts, useUrlState, useToast } from "@/hooks";
import { StepNavigation, ActionButtons } from "@/components/layout";
import {
  AvatarCanvas,
  type AvatarCanvasRef,
  // ValuesBadges,
} from "@/components/avatar";
import { BodyEditor } from "@/components/editors/BodyEditor";
import { ValuesEditor } from "@/components/editors/ValuesEditor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ToastContainer } from "@/components/Toast";

function App() {
  // Global state management
  const [currentStep, setCurrentStep] = useState<Step>("body");
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [renderError, setRenderError] = useState<Error | null>(null);

  // Toast notifications
  const { toasts, showToast, removeToast } = useToast();

  // Ref for avatar canvas to trigger download
  const avatarCanvasRef = useRef<AvatarCanvasRef>(null);

  // Avatar state management
  const {
    avatarConfig,
    updatePart,
    toggleItem,
    setSkinTone,
    setHairColor,
    setBreastOption,
    removeHair,
    generateRandom,
    setAvatarConfig,
  } = useAvatarState();

  // Load avatar parts
  const {
    allParts,
    loading: partsLoading,
    error: partsError,
  } = useAvatarParts();

  // URL state management for sharing
  const { encodeState, decodeState } = useUrlState();

  // Load avatar from URL on mount or generate random avatar
  useEffect(() => {
    if (allParts.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get("state");

    if (stateParam) {
      try {
        const decodedConfig = decodeState(stateParam);
        if (decodedConfig) {
          setAvatarConfig(decodedConfig);
          return;
        }
      } catch (error) {
        console.error("Failed to decode URL state:", error);
      }
    }

    // Generate random avatar if no URL state or if decoding failed
    generateRandom(allParts);
  }, [allParts, decodeState, setAvatarConfig, generateRandom]);

  // Handle step change
  const handleStepChange = useCallback((step: Step) => {
    setCurrentStep(step);
  }, []);

  // Handle render error
  const handleRenderError = useCallback(
    (error: Error) => {
      console.error("Avatar render error:", error);
      setRenderError(error);
      showToast("Fehler beim Rendern des Avatars", "error");
    },
    [showToast]
  );

  // Handle render complete
  const handleRenderComplete = useCallback(() => {
    setRenderError(null);
  }, []);

  // Handle random avatar generation
  const handleSurprise = useCallback(() => {
    if (allParts.length > 0) {
      generateRandom(allParts);
    }
  }, [allParts, generateRandom]);

  // Handle avatar download
  const handleDownload = useCallback(() => {
    if (avatarCanvasRef.current) {
      setIsDownloading(true);
      setRenderError(null);
      try {
        avatarCanvasRef.current.downloadImage();
        showToast("Avatar erfolgreich heruntergeladen!", "success");
      } catch (error) {
        console.error("Failed to download avatar:", error);
        const err =
          error instanceof Error ? error : new Error("Download fehlgeschlagen");
        setRenderError(err);
        showToast(
          "Download fehlgeschlagen. Bitte versuche es erneut.",
          "error"
        );
      } finally {
        // Reset downloading state after a short delay
        setTimeout(() => setIsDownloading(false), 1000);
      }
    }
  }, [showToast]);

  // Handle avatar sharing
  const handleShare = useCallback(async () => {
    setIsSharing(true);
    setRenderError(null);
    try {
      const encodedState = encodeState(avatarConfig);
      const shareUrl = `${window.location.origin}${window.location.pathname}?state=${encodedState}`;

      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: "Mein Futur-O-Mat Avatar",
          text: "Schau dir meinen Avatar an!",
          url: shareUrl,
        });
        showToast("Avatar erfolgreich geteilt!", "success");
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        showToast("Link wurde in die Zwischenablage kopiert!", "success");
      }
    } catch (error) {
      console.error("Failed to share:", error);
      // Only show error if it's not a user cancellation
      if (error instanceof Error && error.name !== "AbortError") {
        setRenderError(error);
        showToast("Teilen fehlgeschlagen. Bitte versuche es erneut.", "error");
      }
    } finally {
      setIsSharing(false);
    }
  }, [avatarConfig, encodeState, showToast]);

  // Show loading state
  if (partsLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <LoadingSpinner size="lg" message="Lade Avatar-Teile..." />
      </div>
    );
  }

  // Show error state
  if (partsError) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-brand-primary">
            Fehler beim Laden
          </h1>
          <p className="text-muted-foreground">
            Die Avatar-Teile konnten nicht geladen werden. Bitte versuche es
            später erneut.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary-dark transition-colors"
          >
            Neu laden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-2 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-[520px] bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Card content will go here */}
          <div className="p-6 sm:p-8">
            {/* Temporary placeholder - will be replaced with CardHeader */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Futur-O-Mat
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Mach dir die Zukunft, wie sie dir gefällt!
              </p>
            </div>

            {/* Avatar Display */}
            <div className="mb-6 flex flex-col items-center">
              {renderError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full">
                  <p className="text-sm text-red-600">
                    ⚠️ Fehler beim Rendern: {renderError.message}
                  </p>
                </div>
              )}
              <div className="w-full max-w-[400px] mx-auto relative pt-8">
                {/* Floating Values/Strengths Badges */}
                {/* <ValuesBadges avatarConfig={avatarConfig} allParts={allParts} /> */}

                {/* Avatar Canvas */}
                <AvatarCanvas
                  ref={avatarCanvasRef}
                  avatarConfig={avatarConfig}
                  width={800}
                  height={960}
                  className="w-full h-auto rounded-lg"
                  onRenderComplete={handleRenderComplete}
                  onRenderError={handleRenderError}
                />
              </div>
            </div>

            {/* Step Navigation - Temporary, will be replaced with ModeTabs */}
            <div className="mb-6">
              <StepNavigation
                currentStep={currentStep}
                onStepChange={handleStepChange}
              />
            </div>

            {/* Editor Area */}
            <div className="mb-6">
              {currentStep === "body" ? (
                <BodyEditor
                  avatarConfig={avatarConfig}
                  allParts={allParts}
                  onUpdatePart={updatePart}
                  onToggleItem={toggleItem}
                  onSetSkinTone={setSkinTone}
                  onSetHairColor={setHairColor}
                  onSetBreastOption={setBreastOption}
                  onRemoveHair={removeHair}
                />
              ) : (
                <ValuesEditor
                  avatarConfig={avatarConfig}
                  allParts={allParts}
                  onUpdatePart={updatePart}
                />
              )}
            </div>

            {/* Action Buttons - Now inside card */}
            <div className="mt-6">
              <ActionButtons
                onSurprise={handleSurprise}
                onDownload={handleDownload}
                onShare={handleShare}
                isDownloading={isDownloading}
                isSharing={isSharing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
