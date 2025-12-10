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
import Arrow3 from "../icons/arrow-swirl-up";
import Arrow4 from "../icons/arrow-up-right";
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
import { STRENGTH_INFO, VALUE_INFO } from "@/assets/strengths-values.json";

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

  const strengthInfo = result
    ? STRENGTH_INFO[result.strengthKey as keyof typeof STRENGTH_INFO]
    : null;
  const valueInfo = result
    ? VALUE_INFO[result.valueKey as keyof typeof VALUE_INFO]
    : null;

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

  useEffect(() => {
    const timer = setTimeout(() => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        ref.current = canvas as HTMLCanvasElement;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const onDownload = () => {
    if (ref.current) {
      handleDownload(ref.current);
    } else {
      console.log(ref.current);
      console.log("GEHT NICHT");
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
            <div>
              <div className="flex flex-col">
                <p className="font-semibold ">{texts.quiz.result.valueLabel}</p>
                <p className="bg-primary rounded px-2 py-1 font-medium text-primary-foreground text-sm w-fit">
                  {valueInfo?.title}
                </p>
              </div>

              <div className="flex justify-center relative">
                <Arrow4 className="absolute -left-4 h-10 rotate-25 text-primary scale-y-[-1]" />

                <AvatarCanvas
                  avatarConfig={avatarConfig}
                  quizResult={result ?? undefined}
                  showStrengh
                  showValue
                  className="w-60 avatar-for-downloade"
                />

                <Arrow3 className="absolute bottom-7 right-0 h-18 text-primary -rotate-70" />
              </div>

              <div className="flex flex-col items-end">
                <p className="bg-primary rounded px-2 py-1 font-medium text-primary-foreground text-sm w-fit">
                  {strengthInfo?.title}
                </p>
                <p className="font-semibold">
                  {texts.quiz.result.strengthLabel}
                </p>
              </div>
            </div>
          )}

          {/* Buttons Grid - Mobile optimiert */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
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

            <div className="text-center text-gray-600 text-sm py-1 md:col-span-2 ">
              <p>{texts.share.additionalInfo}</p>
            </div>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={texts.share.externalLinks.wimmelbildZukunft}
            >
              <Button className="w-full">
                {texts.share.buttons.wimmelbildZukunft}
              </Button>
            </Link>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={texts.share.externalLinks.handabdruckTest}
            >
              <Button className="w-full">
                {texts.share.buttons.handabdruckTest}
              </Button>
            </Link>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={texts.share.externalLinks.germanwatch}
            >
              <Button className="w-full">
                {texts.share.buttons.moreGermanwatch}
              </Button>
            </Link>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={texts.share.externalLinks.handabdruck}
            >
              <Button className="w-full">
                {texts.share.buttons.moreHandabdruck}
              </Button>
            </Link>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={texts.share.externalLinks.neuStart}
              className="md:col-span-2"
            >
              <Button className="w-full">{texts.share.buttons.newStart}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
