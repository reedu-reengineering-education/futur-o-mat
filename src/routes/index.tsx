// import AvatarGenerator from '@/components/avatar/AvatarGenerator'
import AvatarGenerator from "@/components/avatar/AvatarGenerator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: AvatarGenerator,
});
