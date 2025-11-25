import wimmelbild from "@/components/wimmelbild/wimmelbild";
import { useCallback } from "react";

// In useAvatarDownload.ts oder direkt in Share.tsx
const downloadWithBackground = useCallback(
  async (canvas: HTMLCanvasElement) => {
    // Neuen Canvas für den kompletten Download erstellen
    const downloadCanvas = document.createElement("canvas");
    const ctx = downloadCanvas.getContext("2d");

    if (!ctx) return;

    // Größere Dimensionen für Text und Wimmelbild
    downloadCanvas.width = 800;
    downloadCanvas.height = 1000;

    // Hintergrund weiß füllen
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

    // 1. Titel Text oben
    ctx.fillStyle = "#1f2937"; // Dunkelgrau
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Mein Futur-O-Mat Avatar", downloadCanvas.width / 2, 60);

    // 2. Avatar in der Mitte (etwas kleiner)
    const avatarSize = 400;
    const avatarX = (downloadCanvas.width - avatarSize) / 2;
    const avatarY = 100;

    ctx.drawImage(canvas, avatarX, avatarY, avatarSize, avatarSize * 1.2);

    // 3. Wimmelbild unten (falls vorhanden)
    if (wimmelbild) {
      const wimmelbildHeight = 200;
      const wimmelbildY = downloadCanvas.height - wimmelbildHeight - 50;

      // Wimmelbild laden und zeichnen
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(
          img,
          50,
          wimmelbildY,
          downloadCanvas.width - 100,
          wimmelbildHeight
        );
        ctx.globalAlpha = 1.0;

        // Download auslösen
        triggerDownload(downloadCanvas);
      };
      img.src = wimmelbild.source;
    } else {
      triggerDownload(downloadCanvas);
    }

    function triggerDownload(canvas: HTMLCanvasElement) {
      const link = document.createElement("a");
      link.download = `futur-o-mat-avatar-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  },
  [wimmelbild]
);
