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
} from "@/components/avatar/AvatarCanvas";
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
    <div className="min-h-screen bg-background-primary flex flex-col">
      {/* Header with title */}
      <header className="bg-brand-primary text-white py-4 sm:py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
            Futur-O-Mat
          </h1>
          <p className="text-sm sm:text-base text-white/90 text-center mt-1">
            Erstelle deinen persönlichen Avatar
          </p>
        </div>
      </header>

      {/* Step Navigation */}
      <StepNavigation
        currentStep={currentStep}
        onStepChange={handleStepChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Avatar Preview - Left side on desktop, top on mobile */}
            <div className="order-1 lg:order-1">
              <div className="lg:sticky lg:top-6">
                <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4">
                  {renderError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">
                        ⚠️ Fehler beim Rendern: {renderError.message}
                      </p>
                    </div>
                  )}
                  <AvatarCanvas
                    ref={avatarCanvasRef}
                    avatarConfig={avatarConfig}
                    width={500}
                    height={600}
                    className="w-full h-auto"
                    onRenderComplete={handleRenderComplete}
                    onRenderError={handleRenderError}
                  />
                </div>
              </div>
            </div>

            {/* Editor Area - Right side on desktop, bottom on mobile */}
            <div className="order-2 lg:order-2">
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
          </div>
        </div>
      </main>

      {/* Action Buttons - Fixed at bottom */}
      <ActionButtons
        onSurprise={handleSurprise}
        onDownload={handleDownload}
        onShare={handleShare}
        isDownloading={isDownloading}
        isSharing={isSharing}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
