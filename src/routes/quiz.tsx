import Quiz from "@/components/quiz/Quiz";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quiz")({
  component: Quiz,
});
