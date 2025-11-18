import AvatarGenerator from "@/components/avatar/AvatarGenerator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/avatar")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AvatarGenerator></AvatarGenerator>;
}
