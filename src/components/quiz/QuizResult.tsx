// components/quiz/QuizResult.tsx
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { AvatarManager } from "../avatar/avatarManager";
import { useAvatarState } from "@/hooks";

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
          <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <div className="w-full max-w-[520px] bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Dein Ergebnis
              </h2>

              <div className="relative flex justify-center mb-8">
                {finalAvatar ? (
                  <div className="relative inline-block">
                    <img
                      src={finalAvatar}
                      alt="Avatar mit Werten und Stärken"
                      className="w-60 h-60 object-cover rounded-2xl"
                    />
                  </div>
                ) : (
                  <div className="w-60 h-60 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-8xl">🙂</span>
                  </div>
                )}
              </div>

              <div className="text-center text-gray-600 mb-6">
                <p>Deine Werte und Stärken sind jetzt Teil deines Avatars!</p>
                {results && (
                  <div className="mt-4 text-sm">
                    <p>
                      <strong>Dein Wert:</strong> {results.valueKey}
                    </p>
                    <p>
                      <strong>Deine Stärke:</strong> {results.strengthKey}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-8">
                <Link to="/wimmelbild">
                  <Button>Zum Wimmelbild</Button>
                </Link>
              </div>
            </div>
          </div>
        );
      }}
    </AvatarManager>
  );
}
