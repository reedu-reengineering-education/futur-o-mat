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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "../ui/card";
import { InfoIcon, Sparkles } from "lucide-react";
import Layout from "../layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AvatarManager } from "./avatarManager";

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
    localStorage.clear();

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
          <Button onClick={() => window.location.reload()} variant="outline">
            Neu laden
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AvatarManager avatarConfig={avatarConfig}>
      {({ saveAvatarFace, saveAvatarBody }) => (
        <Layout>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Futur-O-Mat</CardTitle>
              <CardDescription>
                Mach dir die Zukunft, wie sie dir gefällt!
              </CardDescription>
              <CardAction>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size={"icon"}>
                      <InfoIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Deine Zukunft, in deinem Style! </DialogTitle>
                    <DialogDescription>
                      Mit dem Futur-O-Mat kannst du deinen Avatar bauen und die
                      Welt nach deinen Vorstellungen gestalten. Probier's aus
                      und finde raus, was du bewegen kannst! Die Webseite
                      basiert auf der Idee des Handabdrucks von Germanwatch.
                      Mehr Infos zum Futur-O-Mat findest du hier.
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* Avatar Display */}
              <div className="mb-6 flex flex-col items-center">
                {renderError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full">
                    <p className="text-sm text-red-600">
                      ⚠️ Fehler beim Rendern: {renderError.message}
                    </p>
                  </div>
                )}

                <div className="w-full max-w-sm mx-auto relative pt-8">
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
              <Button size={"sm"} onClick={handleSurprise}>
                <Sparkles /> Zufall
              </Button>
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
            </CardContent>
            <CardFooter className="justify-end">
              <Link
                to={`/quiz/information`}
                onClick={() => {
                  saveAvatarFace();
                  saveAvatarBody();
                }}
              >
                <Button>Weiter zum Quiz</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Toast Notifications */}
          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </Layout>
      )}
    </AvatarManager>
  );
}

export default AvatarGenerator;
