import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import Layout from "../layout";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

export function QuizInformation() {
  const [avatarBody, setAvatarBody] = useState<string>("");

  useEffect(() => {
    const savedBody = localStorage.getItem("avatarImage");
    if (savedBody) setAvatarBody(savedBody);
  }, []);

  return (
    <Layout>
      <Card className="max-w-md">
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1 text-gray-700 leading-relaxed space-y-4 text-base">
              <p>
                Finde jetzt heraus, was dir richtig gut liegt und was dir
                wirklich wichtig ist. Dafür gibt es ein kurzes Quiz mit 20
                Fragen. Am Ende ist dein Avatar mit deinen Stärken und Werten
                ausgestattet und bereit die Welt zu gestalten.
              </p>
            </div>
            {avatarBody && (
              <div className="flex justify-center md:justify-end">
                <img
                  src={avatarBody}
                  alt="Avatar"
                  className="w-60 h-50 object-cover"
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to={`/quiz/questions`}>
            <Button>Weiter zum Quiz</Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}
