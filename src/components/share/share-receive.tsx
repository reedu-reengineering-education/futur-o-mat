import { Link, useParams } from "@tanstack/react-router";
import { useShare, type ShareParams } from "@/hooks/useShare";
import Layout from "../layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import AvatarCanvas from "../avatar/AvatarCanvas";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";

export default function ShareReceive() {
  const { shareState } = useParams({ strict: false });
  const { decodeState } = useShare();
  const decoded = decodeState(shareState);

  if (!decoded) {
    return (
      <Layout>
        <Card className="max-w-md">
          <CardContent>Ungültiger oder fehlender Share-Zustand.</CardContent>
        </Card>
      </Layout>
    );
  }

  const shareParams: ShareParams = decoded;

  return (
    <Layout>
      <Card className="max-w-md">
        <CardContent className="grid gap-6">
          <CardHeader>
            <CardTitle>Futur-O-Mat</CardTitle>
            <CardDescription>
              Mach dir die Zukunft, wie sie dir gefällt!
            </CardDescription>
          </CardHeader>
          <div className="relative max-w-64 aspect-square rounded-2xl overflow-hidden ring-3 ring-primary ring-offset-2 flex items-center justify-center mx-auto">
            {shareParams.wimmelbild && (
              <img
                src={shareParams.wimmelbild.source}
                alt="Wimmelbild Hintergrund"
                className="w-full h-full object-cover inset-0 opacity-90"
              />
            )}
            {shareParams.avatar && (
              <AvatarCanvas
                avatarConfig={shareParams.avatar}
                quizResult={shareParams.result}
                className="h-full absolute"
                showStrengh
                showValue
              />
            )}
          </div>
          <CardFooter>
            <Link to={"/"} className="w-full">
              <Button className="w-full">
                Erstelle deinen eigenen Avatar <UserPlus />
              </Button>
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    </Layout>
  );
}
