import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

interface AvatarPart {
  id: string;
  src: string;
  category: string;
  name?: string;
}

interface Results {
  valueKey: string;
  strengthKey: string;
  valuePart: AvatarPart | null;
  strengthPart: AvatarPart | null;
}

interface Badge {
  type: "value" | "strength";
  key: string;
  part: AvatarPart | null;
}

// Dummy JSON Info, ersetze mit deinem echten VALUE_INFO / STRENGTH_INFO
const VALUE_INFO: Record<string, { title: string; description: string }> = {};
const STRENGTH_INFO: Record<string, { title: string; description: string }> =
  {};

export function QuizResult() {
  const [avatarBody, setAvatarBody] = useState<string>("");
  const [results, setResults] = useState<Results | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    // ✅ Avatar-Bild laden (Körper, nicht Gesicht)
    const savedBody = localStorage.getItem("avatarImage");
    if (savedBody) setAvatarBody(savedBody);

    // Quiz-Ergebnisse laden
    const savedResults = localStorage.getItem("quizResults");
    if (savedResults) {
      const parsed = JSON.parse(savedResults);
      setResults({
        valueKey: parsed.valueKey,
        strengthKey: parsed.strengthKey,
        valuePart: parsed.valuePart,
        strengthPart: parsed.strengthPart,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Dein Ergebnis
        </h2>

        <div className="relative flex justify-center mb-8">
          {avatarBody ? (
            <div className="relative inline-block">
              <img
                src={avatarBody}
                alt="Avatar"
                className="w-60 h-60 object-cover rounded-2xl"
              />

              {/* Value Badge Button */}
              {results?.valuePart && (
                <button
                  onClick={() =>
                    setSelectedBadge({
                      type: "value",
                      key: results.valueKey,
                      part: results.valuePart,
                    })
                  }
                  className="absolute -left-8 top-8 w-16 h-16 bg-white rounded-full shadow-xl hover:scale-110 transition-transform p-2 border-4 border-purple-300"
                  title="Klicke für mehr Infos"
                >
                  <img
                    src={results.valuePart.src}
                    alt="Dein Wert"
                    className="w-full h-full object-contain"
                  />
                </button>
              )}

              {/* Strength Badge Button */}
              {results?.strengthPart && (
                <button
                  onClick={() =>
                    setSelectedBadge({
                      type: "strength",
                      key: results.strengthKey,
                      part: results.strengthPart,
                    })
                  }
                  className="absolute -right-8 top-8 w-16 h-16 bg-white rounded-full shadow-xl hover:scale-110 transition-transform p-2 border-4 border-purple-300"
                  title="Klicke für mehr Infos"
                >
                  <img
                    src={results.strengthPart.src}
                    alt="Deine Stärke"
                    className="w-full h-full object-contain"
                  />
                </button>
              )}
            </div>
          ) : (
            <div className="w-60 h-60 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-8xl">🙂</span>
            </div>
          )}
        </div>

        {/* Info-Popup (bleibt gleich) */}
        {selectedBadge && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedBadge(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              {selectedBadge.part && (
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-purple-50 rounded-full p-3 border-2 border-purple-300">
                    <img
                      src={selectedBadge.part.src}
                      alt="Badge"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="text-center mb-3">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-2">
                  {selectedBadge.type === "value"
                    ? "Dein Wert"
                    : "Deine Stärke"}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
                {selectedBadge.type === "value"
                  ? VALUE_INFO[selectedBadge.key]?.title || selectedBadge.key
                  : STRENGTH_INFO[selectedBadge.key]?.title ||
                    selectedBadge.key}
              </h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                {selectedBadge.type === "value"
                  ? VALUE_INFO[selectedBadge.key]?.description ||
                    "Beschreibung folgt..."
                  : STRENGTH_INFO[selectedBadge.key]?.description ||
                    "Beschreibung folgt..."}
              </p>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2 font-medium transition-colors"
              >
                Verstanden
              </button>
            </div>
          </div>
        )}

        {/* Weiter-Button zum Wimmelbild */}
        <div className="flex justify-center mt-8">
          <Link
            to="/wimmelbild" // Später deine Wimmelbild-Route
            className="inline-block bg-green-600 hover:bg-green-700 text-white rounded-2xl text-sm font-medium px-6 py-2 shadow-lg transition-all"
          >
            Zum Wimmelbild
          </Link>
        </div>
      </div>
    </div>
  );
}
