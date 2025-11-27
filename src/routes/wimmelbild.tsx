import Wimmelbild from "@/components/wimmelbild/wimmelbild";
import { createFileRoute } from "@tanstack/react-router";
import wimmelbilder from "@/assets/wimmelbilder.json";

export const Route = createFileRoute("/wimmelbild")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Wimmelbild images={wimmelbilder} />;
}
