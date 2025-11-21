import ShareReceive from "@/components/share/share-receive";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/share/$shareState")({
  component: ShareReceive,
});
