/**
 * Main App Component
 *
 * Root application component managing global state and layout
 * Implements responsive design for mobile and desktop
 * Handles step navigation between body and values editors
 */

import { Button } from "@/components/ui/button";
import { useEffect, useCallback } from "react";
import { BodyEditor } from "@/components/editors/BodyEditor";
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
import AvatarCanvas from "./AvatarCanvas";
import useAvatarState from "@/hooks/useAvatarState";
import { useAvatarParts } from "@/hooks/useAvatarParts";
import { useTexts } from "@/hooks/useTexts";

function AvatarGenerator() {
  const texts = useTexts();

  // Avatar state management
  const {
    avatarConfig,
    updatePart,
    toggleItem,
    setSkinTone,
    setHairColor,
    setBreastOption,
    removeBrust,
    removeHair,
    generateRandom,
    // setAvatarConfig,
  } = useAvatarState();

  // Load avatar parts
  const { allParts } = useAvatarParts();

  const handleSurprise = useCallback(() => {
    if (allParts.length > 0) {
      generateRandom(allParts);
    }
  }, [allParts, generateRandom]);

  /**
   * Generate a random avatar on initial load
   */
  useEffect(() => {
    handleSurprise();
  }, [handleSurprise]);

  return (
    <Layout>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{texts.avatar.title}</CardTitle>
          <CardDescription>{texts.avatar.description}</CardDescription>
          <CardAction className="z-10">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size={"icon"}>
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>{texts.avatar.infoDialog.title}</DialogTitle>
                <DialogDescription>
                  {texts.avatar.infoDialog.description}
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Avatar Display */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-full max-w-sm mx-auto relative -mt-20">
              <AvatarCanvas
                avatarConfig={avatarConfig}
                width={800}
                height={960}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Editor Area */}
          <Button size={"sm"} variant={"accent"} onClick={handleSurprise}>
            <Sparkles /> {texts.avatar.surpriseButton}
          </Button>
          <BodyEditor
            avatarConfig={avatarConfig}
            allParts={allParts}
            onUpdatePart={updatePart}
            // pass allParts through so toggle can resolve subcategory conflicts
            onToggleItem={(part) => toggleItem(part, allParts)}
            onSetSkinTone={setSkinTone}
            onSetHairColor={setHairColor}
            onSetBreastOption={setBreastOption}
            onRemoveBrust={removeBrust}
            onRemoveHair={removeHair}
          />
        </CardContent>
        <CardFooter className="justify-end">
          <Link to={`/quiz/information`}>
            <Button>
              {texts.avatar.nextButton} <ArrowRightIcon />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}

export default AvatarGenerator;
