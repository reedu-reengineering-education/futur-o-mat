import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { useWimmelbildState } from "@/hooks/useWimmelbildState";
import Layout from "../layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import AvatarCanvas from "../avatar/AvatarCanvas";
import { DownloadIcon, Share2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { useShare } from "@/hooks/useShare";
import { useQuizState } from "@/hooks/useQuizState";
import useAvatarState from "@/hooks/useAvatarState";
import { useAvatarDownload } from "@/hooks/useAvatarDownload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function Share() {
  const { avatarConfig } = useAvatarState();
  const { result } = useQuizState();
  const { image: wimmelbild } = useWimmelbildState();
  const { handleDownload } = useAvatarDownload();

  const [showUrlDialog, setShowUrlDialog] = useState(false);

  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const onCopyLink = () => {
    setShowTooltip(true);
    navigator.clipboard.writeText(
      `${window.location.origin}/share/${encodeState({
        avatar: avatarConfig!,
        result: result!,
        wimmelbild: wimmelbild!,
      })}`
    );
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const ref = useRef<HTMLCanvasElement>(null);

  const { encodeState } = useShare();

  const onDownload = () => {
    if (ref.current) {
      handleDownload(ref.current);
    }
  };

  return (
    <Layout>
      {showUrlDialog && (
        <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Teilen Link</DialogTitle>
              <DialogDescription>
                Kopiere den folgenden Link, um deinen Avatar zu teilen:
              </DialogDescription>
            </DialogHeader>
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/share/${encodeState({
                avatar: avatarConfig!,
                result: result!,
                wimmelbild: wimmelbild!,
              })}`}
              className="w-full p-2 border rounded"
              onFocus={(e) => e.target.select()}
            />
            <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
              <TooltipTrigger className="h-0"></TooltipTrigger>
              <Button
                onClick={() => {
                  onCopyLink();
                }}
                onMouseOver={() => {
                  setShowTooltip(false);
                }}
              >
                Link kopieren
              </Button>
              <TooltipContent>
                Den Link wurde in die Zwischenablage kopiert.
              </TooltipContent>
            </Tooltip>
          </DialogContent>
        </Dialog>
      )}
      <Card className="w-md relative overflow-hidden">
        {/* Wimmelbild als Hintergrund */}
        {wimmelbild && (
          <div className="absolute inset-0">
            <img
              src={wimmelbild.source}
              alt="Wimmelbild Hintergrund"
              className="w-full h-full object-cover opacity-15 select-none pointer-events-none"
            />
          </div>
        )}
        <CardContent className="grid gap-4 z-1">
          <CardHeader>
            <CardTitle>Dein Ergebnis teilen</CardTitle>
            <CardDescription>
              Teile deinen Avatar und entdecke weitere Möglichkeiten
            </CardDescription>
          </CardHeader>

          {/* Avatar */}
          {avatarConfig && (
            <AvatarCanvas
              avatarConfig={avatarConfig}
              quizResult={result ?? undefined}
              className="w-60 mx-auto"
              showStrengh
              showValue
              ref={ref}
            />
          )}

          {/* Buttons Grid - Mobile optimiert */}
          <div className="grid grid-cols-2 gap-3 relative z-10">
            {/* Teilen Button */}
            <Button
              onClick={() => {
                const encodedState = encodeState({
                  avatar: avatarConfig,
                  result: result!,
                  wimmelbild: wimmelbild!,
                });
                const shareUrl = `${window.location.origin}/share/${encodedState}`;

                if (navigator.share) {
                  navigator
                    .share({
                      title: "Mein Futur-o-mat Avatar",
                      text: "Schau dir meinen Avatar an und entdecke mehr über Nachhaltigkeit!",
                      url: shareUrl,
                    })
                    .catch((error) => console.error("Error sharing", error));
                } else {
                  setShowUrlDialog(true);
                }
              }}
            >
              <Share2Icon />
              Teilen
            </Button>

            {/* Download Button */}
            <Button onClick={onDownload}>
              <DownloadIcon />
              Download
            </Button>

            {/* Weitere Buttons... */}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              to="https://www.germanwatch.org/de/das-sdg-wimmelbild-zukunft"
              className="w-full"
            >
              <Button className="w-full">Wimmelbild Zukunft</Button>
            </Link>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              to="https://www.handabdruck.eu/"
              className="w-full"
            >
              <Button className="w-full">Handabdruck-Test</Button>
            </Link>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              to="https://www.germanwatch.org/de"
              className="w-full"
            >
              <Button className="w-full">Mehr zu Germanwatch</Button>
            </Link>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              to="https://www.germanwatch.org/de/handabdruck"
              className="w-full"
            >
              <Button className="w-full">Mehr zum Handabdruck</Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-4 text-gray-600 text-sm relative z-10">
            <p>Entdecke mehr über Nachhaltigkeit und deine Möglichkeiten</p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
