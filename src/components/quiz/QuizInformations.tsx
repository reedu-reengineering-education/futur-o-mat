import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import Layout from "../layout";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import AvatarCanvas from "../avatar/AvatarCanvas";
import type { AvatarConfig } from "@/types/avatar";
import { ArrowRight } from "lucide-react";

export function QuizInformation() {
  const [avatarBody, setAvatarBody] = useState<AvatarConfig>();

  useEffect(() => {
    const savedBody = localStorage.getItem("avatarConfig");
    if (savedBody) setAvatarBody(JSON.parse(savedBody));
  }, []);

  return (
    <Layout>
      <Card className="max-w-md">
        <CardContent className="grid gap-4">
          {avatarBody && (
            <div className="flex justify-center">
              <AvatarCanvas
                avatarConfig={avatarBody}
                width={240}
                height={300}
                className="w-60"
              />
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
              Weiter zum Quiz <ArrowRight />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}
