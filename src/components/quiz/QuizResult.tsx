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

  return (
    <Layout>
      <Dialog
        open={isStrengthDialogOpen}
        onOpenChange={setIsStrengthDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deine Stärke</DialogTitle>
          </DialogHeader>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia eos
          saepe suscipit dolor similique illo illum perferendis tenetur minima
          consequatur. Soluta ducimus iure itaque fugiat praesentium expedita
          sequi incidunt quidem!
        </DialogContent>
      </Dialog>

      <Dialog open={isValueDialogOpen} onOpenChange={setIsValueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dein Wert</DialogTitle>
          </DialogHeader>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia eos
          saepe suscipit dolor similique illo illum perferendis tenetur minima
          consequatur. Soluta ducimus iure itaque fugiat praesentium expedita
          sequi incidunt quidem!
        </DialogContent>
      </Dialog>
      <Card className="w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Dein Ergebnis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Bild */}
          <div className="flex justify-center relative">
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
          </div>

          {/* Ergebnisse */}
          {result && (
            <div className="text-center space-y-4">
              <div>
                <p className="font-semibold text-gray-600 text-sm mb-1">
                  Dein Wert
                </p>
                <p className="text-lg font-medium text-purple-600">
                  {result.valueKey}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 text-sm mb-1">
                  Deine Stärke
                </p>
                <p className="text-lg font-medium text-purple-600">
                  {result.strengthKey}
                </p>
              </div>
            </div>
          )}
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
