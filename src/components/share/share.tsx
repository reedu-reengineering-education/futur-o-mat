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
import { useCallback, useRef } from "react";
import { useShare } from "@/hooks/useShare";
import { useQuizState } from "@/hooks/useQuizState";
import useAvatarState from "@/hooks/useAvatarState";
// ENTFERNEN: import { useAvatarDownload } from "@/hooks/useAvatarDownload"; // Dieser Hook existiert nicht
import { STRENGTH_SHARE, VALUE_SHARE } from "./shareText";

export default function Share() {
  const { avatarConfig } = useAvatarState();
  const { result } = useQuizState();
  const { image: wimmelbild } = useWimmelbildState();

  const valueKey = result?.valueKey;
  const strengthKey = result?.strengthKey;

  const valueShare = valueKey ? VALUE_SHARE[valueKey] : null;
  const strengthShare = strengthKey ? STRENGTH_SHARE[strengthKey] : null;

  // ENTFERNEN: const { downloadCanvas } = useAvatarDownload(); // Nicht vorhanden
  const ref = useRef<HTMLCanvasElement>(null);

  const { encodeState } = useShare();

  // Erweiterte Download-Funktion
  const handleDownload = useCallback(() => {
    if (!ref.current) return;

    // Neuen Canvas für erweiterten Download erstellen
    const downloadCanvas = document.createElement("canvas");
    const ctx = downloadCanvas.getContext("2d");
    if (!ctx) return;

    // Layout für Download - breiter für Text neben Avatar
    downloadCanvas.width = 1000; // Breiter für Text + Avatar
    downloadCanvas.height = 800;

    // Weißer Hintergrund
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

    // Avatar auf der linken Seite
    const avatarWidth = 400;
    const avatarHeight = 480;
    const avatarX = 50;
    const avatarY = 100;

    ctx.drawImage(ref.current, avatarX, avatarY, avatarWidth, avatarHeight);

    // Text auf der rechten Seite
    const textX = 500; // Start nach dem Avatar
    const textY = 120;
    const maxWidth = 400; // Maximale Textbreite

    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 20px Arial"; // Etwas kleiner
    ctx.textAlign = "left";

    const titleLines = [
      "Meine Werte und Stärken sind meine",
      "Superkräfte. Mach mit und teile",
      "deine Ergebnisse - gemeinsam sind",
      "wir noch stärker!",
    ];

    let currentY = textY;
    titleLines.forEach((line) => {
      ctx.fillText(line, textX, currentY);
      currentY += 28; // Zeilenabstand
    });

    // Value Text
    if (valueShare?.description) {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#4b5563";
      wrapText(ctx, valueShare.description, textX, textY + 40, maxWidth, 20);
    }

    // Trennlinie zeichnen
    const lineY = textY + 180;
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(textX, lineY);
    ctx.lineTo(textX + maxWidth, lineY);
    ctx.stroke();

    // Strength Text unter der Linie
    if (strengthShare?.description) {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#4b5563";
      wrapText(ctx, strengthShare.description, textX, lineY + 30, maxWidth, 20);
    }

    // Wimmelbild unten
    if (wimmelbild && "source" in wimmelbild) {
      const wimmelImg = new Image();
      wimmelImg.crossOrigin = "anonymous";
      wimmelImg.onload = () => {
        const wimmelHeight = 150;
        const wimmelY = downloadCanvas.height - wimmelHeight - 30;

        ctx.globalAlpha = 0.2;
        ctx.drawImage(
          wimmelImg,
          50,
          wimmelY,
          downloadCanvas.width - 100,
          wimmelHeight
        );
        ctx.globalAlpha = 1.0;

        // Download auslösen
        const link = document.createElement("a");
        link.download = `mein-futur-o-mat-${Date.now()}.png`;
        link.href = downloadCanvas.toDataURL("image/png");
        link.click();
      };
      wimmelImg.src = wimmelbild.source;
    } else {
      // Fallback falls kein Wimmelbild
      const link = document.createElement("a");
      link.download = `mein-futur-o-mat-${Date.now()}.png`;
      link.href = downloadCanvas.toDataURL("image/png");
      link.click();
    }
  }, [wimmelbild, valueShare, strengthShare]);

  // Hilfsfunktion für Textumbruch
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  return (
    <Layout>
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
                  // TODO: create dialog with shareUrl to copy
                }
              }}
            >
              <Share2Icon />
              Teilen
            </Button>

            {/* Download Button */}
            <Button onClick={handleDownload}>
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
