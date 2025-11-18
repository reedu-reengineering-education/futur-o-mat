import Share from "@/components/Share/share";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/share")({
  component: Share,
});
