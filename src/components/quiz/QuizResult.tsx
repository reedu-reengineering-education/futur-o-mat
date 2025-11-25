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

export function QuizResult() {
  const { avatarConfig } = useAvatarState();
  const { result } = useQuizState();

  return (
    <Layout>
      <Card className="w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Dein Ergebnis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Bild */}
          <div className="flex justify-center">
            <AvatarCanvas
              avatarConfig={avatarConfig}
              quizResult={result ?? undefined}
              showStrengh
              showValue
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
            <Button size="lg">Gehe weiter zu deinem Herzensthema</Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}
