// AvatarPreview.tsx
import { useRef, useEffect, useState } from "react";
import type { AvatarConfig } from "../../types";
import { Button } from "../ui/button";
import { AvatarCanvas, type AvatarCanvasRef } from "../avatar/AvatarCanvas";

interface AvatarPreviewProps {
  avatarConfig: AvatarConfig;
  width?: number;
  height?: number;
  showDownloadButton?: boolean;
  showShareButton?: boolean;
  onBack?: () => void;
  className?: string;
}

export function AvatarPreview({
  avatarConfig,
  width = 800,
  height = 1200,
  showDownloadButton = true,
  showShareButton = true,
  onBack,
  className = "",
}: AvatarPreviewProps) {
  const canvasRef = useRef<AvatarCanvasRef>(null);
  const [wimmelbild, setWimmelbild] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedWimmelbild = localStorage.getItem("selectedWimmelbild");
    if (savedWimmelbild) {
      const wimmelbildData = [
        { id: "1", source: "/assets/background/kindergarten.jpg" },
        // ... deine Wimmelbild-Daten
      ];
      const selectedWimmelbild = wimmelbildData.find(
        (img) => img.id === savedWimmelbild
      );
      if (selectedWimmelbild) setWimmelbild(selectedWimmelbild.source);
    }
  }, []);

  const handleDownload = () => {
    canvasRef.current?.downloadImage();
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?avatar=${encodeURIComponent(JSON.stringify(avatarConfig))}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-[520px] bg-white rounded-3xl shadow-xl overflow-hidden p-8">
          <div className="flex flex-col gap-6">
            {/* Back Button */}
            {onBack && (
              <button
                onClick={onBack}
                className="absolute top-4 left-4 z-20 text-gray-500 hover:text-gray-700"
              >
                ← Zurück
              </button>
            )}

            {/* Wimmelbild als Hintergrund */}
            {wimmelbild && (
              <div className="absolute inset-0 z-0">
                <img
                  src={wimmelbild}
                  alt="Wimmelbild"
                  className="w-full h-full object-cover opacity-10"
                />
              </div>
            )}

            {/* Header */}
            <div className="text-center relative z-10">
              <h1 className="text-2xl font-bold text-gray-800">Futur-O-Mat</h1>
              <p className="text-gray-600 mt-2">
                Mach dir die Zukunft, wie sie dir gefällt!
              </p>
            </div>

            {/* Avatar Preview */}
            <div className="flex justify-center relative z-10">
              <div
                className={`rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-500 ${className}`}
              >
                <AvatarCanvas
                  ref={canvasRef}
                  avatarConfig={avatarConfig}
                  width={width}
                  height={height}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Beschreibungstext */}
            <div className="text-center text-gray-700 leading-relaxed space-y-4 text-base relative z-10">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sagittis porttitor...
              </p>
              <p className="font-semibold text-purple-600">
                Erstelle jetzt deinen eigenen Avatar!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 relative z-10">
              {showDownloadButton && (
                <Button
                  onClick={handleDownload}
                  className="bg-white/80 hover:bg-purple-500 hover:text-white border border-gray-200 text-gray-700 rounded-xl py-3 font-semibold shadow-md transition-all duration-200"
                >
                  Download Avatar
                </Button>
              )}

              {showShareButton && (
                <Button
                  onClick={handleShare}
                  className="bg-white/80 hover:bg-purple-500 hover:text-white border border-gray-200 text-gray-700 rounded-xl py-3 font-semibold shadow-md transition-all duration-200"
                >
                  {copied ? "✓ Link kopiert!" : "Link teilen"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
