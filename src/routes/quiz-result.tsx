import { QuizResult } from "@/components/quiz/QuizResult";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quiz-result")({
  component: QuizResult,
});
