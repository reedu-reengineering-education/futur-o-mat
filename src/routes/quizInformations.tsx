import { QuizInformation } from "@/components/quiz/QuizInformations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizInformations")({
  component: QuizInformation,
});
