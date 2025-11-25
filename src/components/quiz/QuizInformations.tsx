import { Link } from "@tanstack/react-router";

import Layout from "../layout";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import AvatarCanvas from "../avatar/AvatarCanvas";
import { ArrowRight } from "lucide-react";
import useAvatarState from "@/hooks/useAvatarState";

export function QuizInformation() {
  const { avatarConfig } = useAvatarState();
  return (
    <Layout>
      <Card className="max-w-md">
        <CardContent className="grid gap-4">
          {avatarConfig && (
            <div className="flex justify-center">
              <AvatarCanvas avatarConfig={avatarConfig} className="w-60" />
            </div>
          )}
          <p>
            Finde jetzt heraus, was dir richtig gut liegt und was dir wirklich
            wichtig ist. Dafür gibt es ein kurzes Quiz mit 20 Fragen. Am Ende
            ist dein Avatar mit deinen Stärken und Werten ausgestattet und
            bereit die Welt zu gestalten.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to={`/quiz/questions`}>
            <Button>
              Finde heraus, was du gut kannst <ArrowRight />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}
