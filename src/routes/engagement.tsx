import Engagement from "@/components/engagement/engagement";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/engagement")({
  component: Engagement,
});
