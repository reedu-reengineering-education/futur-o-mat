import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { useWimmelbildState } from "@/hooks/useWimmelbildState";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Layout from "../layout";
import AvatarCanvas from "../avatar/AvatarCanvas";
import { useQuizState } from "@/hooks/useQuizState";
import useAvatarState from "@/hooks/useAvatarState";
import {
  VALUE_ENGAGEMENT,
  STRENGTH_ENGAGEMENT,
} from "@/assets/engagement.json";
import { useTexts } from "@/hooks/useTexts";

export default function Engagement() {
  const texts = useTexts();
  const { avatarConfig } = useAvatarState();
  const { image: wimmelbild } = useWimmelbildState();
  const { result } = useQuizState();

  const valueKey = result?.valueKey;
  const strengthKey = result?.strengthKey;

  const valueEngagement =
    valueKey && valueKey in VALUE_ENGAGEMENT
      ? VALUE_ENGAGEMENT[valueKey as keyof typeof VALUE_ENGAGEMENT]
      : null;
  const strengthEngagement =
    strengthKey && strengthKey in STRENGTH_ENGAGEMENT
      ? STRENGTH_ENGAGEMENT[strengthKey as keyof typeof STRENGTH_ENGAGEMENT]
      : null;

  return (
    <Layout>
      <Card className="max-w-md">
        <CardHeader />
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
          <div className="flex-1 text-gray-700 leading-relaxed space-y-4">
            <h2 className="font-semibold text-gray-800 mb-4">
              {texts.engagement.heading}
            </h2>
            <p>{valueEngagement?.description}</p>
          </div>

          {/* Durchgezogener dünner schwarzer Strich */}
          <hr className="text-gray-300" />

          {/* Zweiter Text unter dem Strich */}
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>{strengthEngagement?.description}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to="/share">
            <Button>{texts.engagement.nextButton}</Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}
