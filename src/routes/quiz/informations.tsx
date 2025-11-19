import { QuizInformation } from "@/components/quiz/QuizInformations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quiz/informations")({
  component: QuizInformation,
});
