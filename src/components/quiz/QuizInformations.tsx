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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sagittis porttitor leo diam.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sagittis porttitor leo diam. Lorem ipsum dolor sit amet.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sagittis porttitor leo diam. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit.
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
          <Link to={`/quiz-questions`}>
            <Button>Weiter zum Quiz</Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}
