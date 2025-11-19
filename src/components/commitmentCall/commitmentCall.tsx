import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function CommitmentCall() {
  const [avatarBody, setAvatarBody] = useState<string>("");
  const [wimmelbild, setWimmelbild] = useState<string>("");

  useEffect(() => {
    const savedBody = localStorage.getItem("avatarImage");
    const savedWimmelbild = localStorage.getItem("selectedWimmelbild");

    if (savedBody) setAvatarBody(savedBody);

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

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-[520px] bg-white rounded-3xl shadow-xl overflow-hidden p-8">
          <div className="flex flex-col gap-6">
            {/* Erste Zeile: Großer Avatar + Erster Text */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* VIEL größerer Avatar mit Hintergrund */}
              <div className="shrink-0">
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-4 border-primary shadow-lg ">
                  {wimmelbild && (
                    <img
                      src={wimmelbild}
                      alt="Wimmelbild Hintergrund"
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  )}
                  {avatarBody && (
                    <img
                      src={avatarBody}
                      alt="Avatar"
                      className="w-full h-full object-contain relative z-10"
                    />
                  )}
                </div>
              </div>

              {/* Erster Text direkt daneben */}
              <div className="flex-1 text-gray-700 leading-relaxed space-y-4 text-base">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Was kannst DU tun:
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sagittis porttitor lorem ipsum dolor sit amet, consectetur
                  adipiscing elit.
                </p>
              </div>
            </div>

            {/* Durchgezogener dünner schwarzer Strich */}
            <div className="w-full border-t border-gray-300 my-2"></div>

            {/* Zweiter Text unter dem Strich */}
            <div className="text-gray-700 leading-relaxed space-y-4 text-base">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sagittis porttitor lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sagittis porttitor lorem ipsum dolor sit amet.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sagittis porttitor lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sagittis porttitor
              </p>
            </div>
          </div>

          {/* Button unten rechts */}
          <div className="flex justify-end mt-8">
            <Link
              to="/share"
            >
              <Button>
              weiter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommitmentCall;
