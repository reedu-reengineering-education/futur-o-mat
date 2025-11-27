// components/quiz/QuizResult.tsx
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Layout from "../layout";
import { useQuizState } from "@/hooks/useQuizState";
import AvatarCanvas from "../avatar/AvatarCanvas";
import useAvatarState from "@/hooks/useAvatarState";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import confetti from "canvas-confetti";
import Arrow3 from "../icons/arrow-swirl-up";
import Arrow4 from "../icons/arrow-up-right";
import { STRENGTH_INFO, VALUE_INFO } from "./Values";

export function QuizResult() {
  const { avatarConfig } = useAvatarState();
  const { result } = useQuizState();

  const [isStrengthDialogOpen, setIsStrengthDialogOpen] = useState(false);
  const [isValueDialogOpen, setIsValueDialogOpen] = useState(false);

  // Play confetti on mount
  useEffect(() => {
    const playConfetti = async () => {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    };
    playConfetti();
  }, []);

  if (!result) {
    return (
      <Layout>
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Kein Ergebnis</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Es wurde kein Ergebnis gefunden. Bitte mache zuerst das Quiz.</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link to="/quiz/questions">
              <Button size="lg">Zum Quiz</Button>
            </Link>
          </CardFooter>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <Dialog
        open={isStrengthDialogOpen}
        onOpenChange={setIsStrengthDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{STRENGTH_INFO[result.strengthKey].title}</DialogTitle>
          </DialogHeader>
          {STRENGTH_INFO[result.strengthKey].description}
        </DialogContent>
      </Dialog>

      <Dialog open={isValueDialogOpen} onOpenChange={setIsValueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{VALUE_INFO[result.valueKey].title}</DialogTitle>
          </DialogHeader>
          {VALUE_INFO[result.valueKey].description}
        </DialogContent>
      </Dialog>
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Dein Ergebnis</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-12">
          <div className="flex flex-col">
            <p className="font-semibold ">Dein Wert</p>
            <p className="bg-primary rounded px-2 py-1 font-medium text-primary-foreground text-sm w-fit">
              {VALUE_INFO[result.valueKey].title}
            </p>
          </div>
          {/* Avatar Bild */}
          <div className="flex justify-center relative">
            <Arrow4 className="absolute -top-6 -left-4 h-12 rotate-25 text-primary scale-y-[-1]" />

            <AvatarCanvas
              avatarConfig={avatarConfig}
              quizResult={result ?? undefined}
              showStrengh
              showValue
              highlightStrengh
              highlightValue
              onStrengthClick={() => setIsStrengthDialogOpen(true)}
              onValueClick={() => setIsValueDialogOpen(true)}
              className="w-60"
            />

            <Arrow3 className="absolute bottom-0 right-0 h-20 text-primary -rotate-55" />
          </div>

          <div className="flex flex-col items-end">
            <p className="bg-primary rounded px-2 py-1 font-medium text-primary-foreground text-sm w-fit">
              {STRENGTH_INFO[result.strengthKey].title}
            </p>
            <p className="font-semibold">Deine Stärke</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to="/wimmelbild">
            <Button size="lg">Weiter zu deinem Herzensthema</Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}
