/**
 * Main App Component
 *
 * Root application component managing global state and layout
 * Implements responsive design for mobile and desktop
 * Handles step navigation between body and values editors
 */

import { Button } from "@/components/ui/button";
import { useEffect, useCallback } from "react";
import { useAvatarState, useAvatarParts, useUrlState, useToast } from "@/hooks";
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
import { ArrowRightIcon, InfoIcon, Sparkles } from "lucide-react";
import Layout from "../layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AvatarManager } from "./avatarManager";
import AvatarCanvas from "./AvatarCanvas";

function AvatarGenerator() {
  // Toast notifications
  const { toasts, removeToast } = useToast();

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
                <div className="w-full max-w-sm mx-auto relative pt-8">
                  <AvatarCanvas
                    avatarConfig={avatarConfig}
                    width={800}
                    height={960}
                    className="w-full h-auto rounded-lg"
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
                <Button>
                  Weiter zum Quiz <ArrowRightIcon />
                </Button>
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
