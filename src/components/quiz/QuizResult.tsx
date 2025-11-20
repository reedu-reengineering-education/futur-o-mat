// components/quiz/QuizResult.tsx
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { AvatarManager } from "../avatar/avatarManager";
import { useAvatarState } from "@/hooks";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Layout from "../layout";

export function QuizResult() {
  const { avatarConfig } = useAvatarState();

  return (
    <AvatarManager avatarConfig={avatarConfig}>
      {({
        getFinalAvatar,
        getQuizResults,
      }: {
        getFinalAvatar: () => string | null;
        getQuizResults: () => any;
      }) => {
        const finalAvatar = getFinalAvatar();
        const results = getQuizResults();

        return (
          <Layout>
            <Card className="max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Dein Ergebnis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Bild */}
                <div className="flex justify-center">
                  {finalAvatar ? (
                    <img
                      src={finalAvatar}
                      alt="Avatar mit Werten und Stärken"
                      className="w-60 h-60 object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-60 h-60 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-8xl">🙂</span>
                    </div>
                  )}
                </div>

                {/* Ergebnisse */}
                {results && (
                  <div className="text-center space-y-4">
                    <div>
                      <p className="font-semibold text-gray-600 text-sm mb-1">
                        Dein Wert
                      </p>
                      <p className="text-lg font-medium text-purple-600">
                        {results.valueKey}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 text-sm mb-1">
                        Deine Stärke
                      </p>
                      <p className="text-lg font-medium text-purple-600">
                        {results.strengthKey}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-center">
                <Link to="/wimmelbild">
                  <Button size="lg">Zum Wimmelbild</Button>
                </Link>
              </CardFooter>
            </Card>
          </Layout>
        );
      }}
    </AvatarManager>
  );
}
