import CommitmentCall from "@/components/commitmentCall/commitmentCall";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/commitment/call")({
  component: CommitmentCall,
});
