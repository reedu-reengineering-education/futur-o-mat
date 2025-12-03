import { Link } from "@tanstack/react-router";

import Layout from "../layout";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import AvatarCanvas from "../avatar/AvatarCanvas";
import { ArrowRight } from "lucide-react";
import useAvatarState from "@/hooks/useAvatarState";
import { useTexts } from "@/hooks/useTexts";

export function QuizInformation() {
  const texts = useTexts();
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
          <p>{texts.quiz.information.description}</p>
          <p>{texts.quiz.questions.infoDialog}</p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to={`/quiz/questions`}>
            <Button>
              {texts.quiz.information.startButton} <ArrowRight />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}
