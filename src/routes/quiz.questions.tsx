import QuizQuestions from "@/components/quiz/QuizQuestions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quiz/questions")({
  component: QuizQuestions,
});
