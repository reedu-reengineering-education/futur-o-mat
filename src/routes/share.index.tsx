import Share from "@/components/share/share";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/share/")({
  component: Share,
});
