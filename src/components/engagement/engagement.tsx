import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { useAvatarState } from "@/hooks";
import { useWimmelbildState } from "@/hooks/useWimmelbildState";
import { Card, CardContent, CardFooter } from "../ui/card";
import Layout from "../layout";
import AvatarCanvas from "../avatar/AvatarCanvas";
import { useQuizState } from "@/hooks/useQuizState";

export function Engagement() {
  const { avatarConfig } = useAvatarState();
  const { image: wimmelbild } = useWimmelbildState();
  const { result: quizResult } = useQuizState();

  return (
    <Layout>
      <Card className="w-md">
        <CardContent className="grid gap-4">
          <div className="relative max-w-64 aspect-square rounded-2xl overflow-hidden ring-3 ring-primary ring-offset-2 flex items-center justify-center mx-auto">
            {wimmelbild && (
              <img
                src={wimmelbild.source}
                alt="Wimmelbild Hintergrund"
                className="w-full h-full object-cover inset-0"
              />
            )}
            {avatarConfig && (
              <AvatarCanvas
                avatarConfig={avatarConfig}
                quizResult={quizResult ?? undefined}
                className="h-full absolute"
                showStrengh
                showValue
              />
            )}
          </div>

          {/* Erster Text direkt daneben */}
          <div className="flex-1 text-gray-700 leading-relaxed space-y-4 text-base">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Was kannst DU tun:
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis
              porttitor lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* Durchgezogener dünner schwarzer Strich */}
          <div className="w-full border-t border-gray-300 my-2"></div>

          {/* Zweiter Text unter dem Strich */}
          <div className="text-gray-700 leading-relaxed space-y-4 text-base">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis
              porttitor lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sagittis porttitor lorem ipsum dolor sit amet.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis
              porttitor lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sagittis porttitor
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to="/share">
            <Button>weiter</Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}

export default Engagement;
