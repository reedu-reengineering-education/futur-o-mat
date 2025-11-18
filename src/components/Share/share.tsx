import { useEffect, useState } from "react";
import { AvatarPreview } from "./AvatarPreview"; // Die neue Komponente
import type { AvatarConfig } from "../../types"; // Dein AvatarConfig Type
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

export function Share() {
  const [wimmelbild, setWimmelbild] = useState<string>("");
  const [avatarBody, setAvatarBody] = useState<string>("");
  const [currentView, setCurrentView] = useState<"main" | "download" | "share">(
    "main"
  );
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);

  useEffect(() => {
    const savedWimmelbild = localStorage.getItem("selectedWimmelbild");
    const savedAvatar = localStorage.getItem("avatarImage");
    const savedAvatarConfig = localStorage.getItem("avatarConfig");

    if (savedAvatar) setAvatarBody(savedAvatar);

    if (savedAvatarConfig) {
      try {
        setAvatarConfig(JSON.parse(savedAvatarConfig));
      } catch (error) {
        console.error("Failed to parse avatar config:", error);
      }
    }

    if (savedWimmelbild) {
      const wimmelbildData = [
        { id: "1", source: "/assets/background/kindergarten.jpg" },
        { id: "2", source: "/assets/background/forum.jpg" },
        { id: "3", source: "/assets/background/amphitheater.jpg" },
        { id: "4", source: "/assets/background/bahnhof.jpg" },
        { id: "5", source: "/assets/background/permakultur.jpg" },
        { id: "6", source: "/assets/background/feldarbeit.jpg" },
        { id: "7", source: "/assets/background/recycling.jpg" },
        { id: "8", source: "/assets/background/stadtfest.jpg" },
        { id: "9", source: "/assets/background/strand.jpg" },
        { id: "10", source: "/assets/background/wohnhaus.jpg" },
      ];

      const selectedWimmelbild = wimmelbildData.find(
        (img) => img.id === savedWimmelbild
      );
      if (selectedWimmelbild) {
        setWimmelbild(selectedWimmelbild.source);
      }
    }
  }, []);

  const handleShare = () => {
    setCurrentView("share");
  };

  const handleDownload = () => {
    setCurrentView("download");
  };

  const handleBack = () => {
    setCurrentView("main");
  };

  // Wenn wir in Download/Share-Ansicht sind, zeige AvatarPreview
  if ((currentView === "download" || currentView === "share") && avatarConfig) {
    return (
      <AvatarPreview
        avatarConfig={avatarConfig}
        showDownloadButton={currentView === "download"}
        showShareButton={currentView === "share"}
        onBack={handleBack} // Optional: Zurück-Button
      />
    );
  }

  // Haupt-Share-Seite mit 6 Buttons
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-[520px] bg-white rounded-3xl shadow-xl overflow-hidden p-8">
          <div className="flex flex-col gap-6">
            {/* Wimmelbild als Hintergrund */}
            {wimmelbild && (
              <div className="absolute inset-0 z-0">
                <img
                  src={wimmelbild}
                  alt="Wimmelbild Hintergrund"
                  className="w-full h-full object-cover opacity-15"
                />
              </div>
            )}

            {/* Header */}
            <div className="text-center relative z-10">
              <h1 className="text-2xl font-bold text-gray-800">
                Dein Ergebnis teilen
              </h1>
              <p className="text-gray-600 mt-2 text-sm">
                Teile deinen Avatar und entdecke weitere Möglichkeiten
              </p>
            </div>

            {/* Avatar */}
            {avatarBody && (
              <div className="flex justify-center relative z-10">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-500 shadow-lg">
                  <img
                    src={avatarBody}
                    alt="Avatar"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Buttons Grid - Mobile optimiert */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
              {/* Teilen Button */}
              <Button
                onClick={handleShare}
              >
               Teilen
              </Button>

              {/* Download Button */}
              <Button
                onClick={handleDownload}
              >Download
              </Button>

              {/* Weitere Quiz */}
              <Button>Weitere Quiz
              </Button>

              {/* SDG Wimmelbild */}
              <Link 
                target="_blank" 
                rel="noopener noreferrer" 
                to="https://www.germanwatch.org/de/das-sdg-wimmelbild-zukunft"
                className="w-full"
              >
                <Button className="w-full">SDG Wimmelbild</Button>
              </Link>

              {/* Handabdruck */}
              <Link 
                target="_blank" 
                rel="noopener noreferrer" 
                to="https://www.handabdruck.eu/"
                className="w-full"
              >
                <Button className="w-full">Handabdruck</Button>
              </Link>

              {/* Germanwatch */}
              <Link 
                target="_blank" 
                rel="noopener noreferrer" 
                to="https://www.germanwatch.org/de"
                className="w-full"
              >
                <Button className="w-full">Germanwatch</Button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-4 text-gray-600 text-sm relative z-10">
              <p>Entdecke mehr über Nachhaltigkeit und deine Möglichkeiten</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Share;
