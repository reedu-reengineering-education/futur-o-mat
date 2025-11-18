import CommitmentCall from "@/components/commitmentCall/commitmentCall";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/commitmentCall")({
  component: CommitmentCall,
});
