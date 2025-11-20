import { QuizInformation } from "@/components/quiz/QuizInformations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quiz/information")({
  component: RouteComponent,
});

function RouteComponent() {
  return <QuizInformation />;
}
