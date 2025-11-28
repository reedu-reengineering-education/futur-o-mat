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
import { useEffect, useRef, useState } from "react";
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
import { isMobileDevice } from "@/utils/mobileOptimizations";
import { useTexts } from "@/hooks/useTexts";

export default function Share() {
  const texts = useTexts();
  const { avatarConfig } = useAvatarState();
  const { result } = useQuizState();
  const { image: wimmelbild } = useWimmelbildState();
  const { handleDownload } = useAvatarDownload();
  const { encodeState } = useShare();

  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const [shareUrl, setShareUrl] = useState<string>("");

  useEffect(() => {
    if (avatarConfig && result && wimmelbild) {
      const encodedState = encodeState({
        avatar: avatarConfig,
        result: result,
        wimmelbild: wimmelbild,
      });
      setShareUrl(`${window.location.origin}/share/${encodedState}`);
    }
  }, [avatarConfig, encodeState, result, wimmelbild]);

  const onCopyLink = () => {
    setShowTooltip(true);
    navigator.clipboard.writeText(shareUrl);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const ref = useRef<HTMLCanvasElement>(null);

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
              <DialogTitle>{texts.share.shareDialog.title}</DialogTitle>
              <DialogDescription>
                {texts.share.shareDialog.description}
              </DialogDescription>
            </DialogHeader>
            <input
              type="text"
              readOnly
              value={shareUrl}
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
                {texts.share.shareDialog.copyButton}
              </Button>
              <TooltipContent>
                {texts.share.shareDialog.copiedTooltip}
              </TooltipContent>
            </Tooltip>
          </DialogContent>
        </Dialog>
      )}
      <Card className="max-w-md relative overflow-hidden">
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
        <CardHeader>
          <CardTitle>{texts.share.title}</CardTitle>
          <CardDescription>{texts.share.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 z-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
            {/* Teilen Button */}
            <Button
              onClick={() => {
                if (!shareUrl) return;

                if (isMobileDevice() && navigator.share) {
                  navigator
                    .share({
                      title: texts.share.nativeShare.title,
                      text: texts.share.nativeShare.text,
                      url: shareUrl,
                    })
                    .catch((error) => console.error("Error sharing", error));
                } else {
                  setShowUrlDialog(true);
                }
              }}
            >
              <Share2Icon />
              {texts.share.buttons.share}
            </Button>

            {/* Download Button */}
            <Button onClick={onDownload}>
              <DownloadIcon />
              {texts.share.buttons.download}
            </Button>

            {/* Weitere Buttons... */}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={texts.share.externalLinks.wimmelbildZukunft}
              className="w-full"
            >
              <Button className="w-full">
                {texts.share.buttons.wimmelbildZukunft}
              </Button>
            </Link>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={texts.share.externalLinks.handabdruckTest}
              className="w-full"
            >
              <Button className="w-full">
                {texts.share.buttons.handabdruckTest}
              </Button>
            </Link>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={texts.share.externalLinks.germanwatch}
              className="w-full"
            >
              <Button className="w-full">
                {texts.share.buttons.moreGermanwatch}
              </Button>
            </Link>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={texts.share.externalLinks.handabdruck}
              className="w-full"
            >
              <Button className="w-full">
                {texts.share.buttons.moreHandabdruck}
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-4 text-gray-600 text-sm relative z-10">
            <p>{texts.share.additionalInfo}</p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
