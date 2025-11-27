import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { useWimmelbildState } from "@/hooks/useWimmelbildState";
import { Card, CardContent, CardFooter } from "../ui/card";
import Layout from "../layout";
import AvatarCanvas from "../avatar/AvatarCanvas";
import { useQuizState } from "@/hooks/useQuizState";
import useAvatarState from "@/hooks/useAvatarState";
import { STRENGTH_ENGAGEMENT, VALUE_ENGAGEMENT } from "./engagement_text";

export default function Engagement() {
  const { avatarConfig } = useAvatarState();
  const { image: wimmelbild } = useWimmelbildState();
  const { result } = useQuizState();

  const valueKey = result?.valueKey;
  const strengthKey = result?.strengthKey;

  const valueEngagement = valueKey ? VALUE_ENGAGEMENT[valueKey] : null;
  const strengthEngagement = strengthKey
    ? STRENGTH_ENGAGEMENT[strengthKey]
    : null;

  return (
    <Layout>
      <Card className="max-w-md">
        <CardContent className="grid gap-6">
          <div className="relative max-w-64 aspect-square rounded-2xl overflow-hidden ring-3 ring-primary ring-offset-2 flex items-center justify-center mx-auto">
            {wimmelbild && (
              <img
                src={wimmelbild.source}
                alt="Wimmelbild Hintergrund"
                className="w-full h-full object-cover inset-0 opacity-90"
              />
            )}
            {avatarConfig && (
              <AvatarCanvas
                avatarConfig={avatarConfig}
                quizResult={result ?? undefined}
                className="h-full absolute"
                showStrengh
                showValue
              />
            )}
          </div>

          {/* Erster Text direkt daneben */}
          <div className="flex-1 text-gray-700 leading-relaxed space-y-4 text-base">
            <h2 className="font-semibold text-gray-800 mb-4">
              Du hast deine Stärken und Werte erkannt und dein Herzensthema
              gefunden. Nun kannst du in die Welt tragen, was schon in dir
              steckt!
            </h2>
            <p>{valueEngagement?.description}</p>
          </div>

          {/* Durchgezogener dünner schwarzer Strich */}
          <hr className="text-gray-300" />

          {/* Zweiter Text unter dem Strich */}
          <div className="text-gray-700 leading-relaxed space-y-4 text-base">
            <p>{strengthEngagement?.description}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to="/share">
            <Button>Und nun?</Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}
