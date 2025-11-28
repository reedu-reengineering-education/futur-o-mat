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
import { useState } from "react";
import { STRENGTH_INFO, VALUE_INFO } from "@/assets/strengths-values.json";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Arrow3 from "../icons/arrow-swirl-up";
import Arrow4 from "../icons/arrow-up-right";
import { useTexts } from "@/hooks/useTexts";

export default function ShareReceive() {
  const texts = useTexts();
  const [isStrengthDialogOpen, setIsStrengthDialogOpen] = useState(false);
  const [isValueDialogOpen, setIsValueDialogOpen] = useState(false);

  const { shareState } = useParams({ strict: false });
  const { decodeState } = useShare();
  const decoded = decodeState(shareState);

  if (!decoded) {
    return (
      <Layout>
        <Card className="max-w-md">
          <CardContent>{texts.shareReceive.invalidState}</CardContent>
        </Card>
      </Layout>
    );
  }

  const {
    avatar,
    result: { strengthKey, valueKey },
    wimmelbild,
  }: ShareParams = decoded;

  const strengthInfo = STRENGTH_INFO[strengthKey as keyof typeof STRENGTH_INFO];
  const valueInfo = VALUE_INFO[valueKey as keyof typeof VALUE_INFO];

  return (
    <Layout>
      <Dialog
        open={isStrengthDialogOpen}
        onOpenChange={setIsStrengthDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{strengthInfo?.title}</DialogTitle>
          </DialogHeader>
          {strengthInfo?.description}
        </DialogContent>
      </Dialog>

      <Dialog open={isValueDialogOpen} onOpenChange={setIsValueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{valueInfo?.title}</DialogTitle>
          </DialogHeader>
          {valueInfo?.description}
        </DialogContent>
      </Dialog>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{texts.shareReceive.title}</CardTitle>
          <CardDescription>{texts.shareReceive.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-12">
          <div className="flex flex-col">
            <p className="font-semibold ">{texts.shareReceive.valueLabel}</p>
            <p className="bg-primary rounded px-2 py-1 font-medium text-primary-foreground text-sm w-fit">
              {valueInfo?.title}
            </p>
          </div>
          {/* Avatar Bild */}
          <div className="flex justify-center relative">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden ring-3 ring-primary ring-offset-2 flex items-center justify-center mx-auto">
              {wimmelbild && (
                <img
                  src={wimmelbild.source}
                  alt={texts.shareReceive.wimmelbildAlt}
                  className="w-full h-full object-cover inset-0 opacity-30"
                />
              )}
              <AvatarCanvas
                avatarConfig={avatar}
                quizResult={{ strengthKey, valueKey }}
                showStrengh
                showValue
                onStrengthClick={() => setIsStrengthDialogOpen(true)}
                onValueClick={() => setIsValueDialogOpen(true)}
                className="h-full absolute"
              />
            </div>
            <Arrow4 className="absolute -top-6 -left-4 h-12 rotate-25 text-primary scale-y-[-1]" />

            <Arrow3 className="absolute bottom-0 right-0 h-20 text-primary -rotate-55" />
          </div>

          <div className="flex flex-col items-end">
            <p className="bg-primary rounded px-2 py-1 font-medium text-primary-foreground text-sm w-fit">
              {strengthInfo?.title}
            </p>
            <p className="font-semibold">{texts.shareReceive.strengthLabel}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Link to={"/"} className="w-full">
            <Button className="w-full">
              {texts.shareReceive.createOwnButton} <UserPlus />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}
