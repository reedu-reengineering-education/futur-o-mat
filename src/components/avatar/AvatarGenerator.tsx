/**
 * Main App Component
 *
 * Root application component managing global state and layout
 * Implements responsive design for mobile and desktop
 * Handles step navigation between body and values editors
 */

import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAvatarState, useAvatarParts, useUrlState, useToast } from "@/hooks";
import { AvatarCanvas, type AvatarCanvasRef } from "@/components/avatar";
import { BodyEditor } from "@/components/editors/BodyEditor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ToastContainer } from "@/components/Toast";
import { Link } from "@tanstack/react-router";

function AvatarGenerator() {
  // Global state management
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
  const { decodeState } = useUrlState();

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

    generateRandom(allParts);
  }, [allParts, decodeState, setAvatarConfig, generateRandom]);

  const saveAvatarFace = useCallback(() => {
    if (avatarCanvasRef.current) {
      const canvas = avatarCanvasRef.current.getCanvas();
      if (canvas) {
        const faceCanvas = document.createElement("canvas");
        const faceCtx = faceCanvas.getContext("2d");

        faceCanvas.width = 200;
        faceCanvas.height = 200;

        if (faceCtx) {
          faceCtx.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height * 0.5,
            0,
            0,
            200,
            200
          );

          const faceImage = faceCanvas.toDataURL("image/png");
          localStorage.setItem("avatarFaceImage", faceImage);
        }
      }
    }
  }, []);

  const saveAvatarBody = useCallback(() => {
    if (avatarCanvasRef.current) {
      const canvas = avatarCanvasRef.current.getCanvas();
      if (canvas) {
        const bodyCanvas = document.createElement("canvas");
        const bodyCtx = bodyCanvas.getContext("2d");

        bodyCanvas.width = 200;
        bodyCanvas.height = 200;

        if (bodyCtx) {
          bodyCtx.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height * 1.6,
            0,
            0,
            200,
            300
          );

          const bodyImage = bodyCanvas.toDataURL("image/png");
          localStorage.setItem("avatarImage", bodyImage);
        }
      }
    }
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

  // --- Auskommentiert: Zufallsknopf ---
  const handleSurprise = useCallback(() => {
    if (allParts.length > 0) {
      generateRandom(allParts);
    }
  }, [allParts, generateRandom]);

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
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Futur-O-Mat
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Mach dir die Zukunft, wie sie dir gefällt!
              </p>
              {/* Hier Platz Info button */}
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

            {/* Editor Area */}
            <div className="mb-6">
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
            </div>

            <div className="bg-white rounded-2xl p-1 relative absolute bottom-4 right-4 flex gap-65">
              <Button variant="outline" onClick={handleSurprise}>
                Zufall
              </Button>

              <Link
                to={`/quiz/informations`}
                onClick={() => {
                  saveAvatarFace();
                  saveAvatarBody();
                }}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-sm font-medium px-6 py-2 shadow-lg transition-all"
              >
                Weiter zum Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default AvatarGenerator;
