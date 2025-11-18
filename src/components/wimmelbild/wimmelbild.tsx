// wimmelbild.tsx

import { Link } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";

interface WimmelbildImage {
  id: string;
  source: string;
  title: string;
  description: string;
}

interface WimmelbildProps {
  images: WimmelbildImage[];
}

const Wimmelbild: React.FC<WimmelbildProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<WimmelbildImage | null>(
    null
  );
  const [savedImageId, setSavedImageId] = useState<string | null>(null);

  // Beim Laden gespeicherte Auswahl aus localStorage laden oder erstes Bild als Default
  useEffect(() => {
    const saved = localStorage.getItem("selectedWimmelbild");
    if (saved) {
      setSavedImageId(saved);
      const savedImage = images.find((img) => img.id === saved);
      if (savedImage) {
        setSelectedImage(savedImage);
      }
    } else if (images.length > 0) {
      // Erstes Bild als Default setzen
      setSelectedImage(images[0]);
    }
  }, [images]);

  const handleImageSelect = (image: WimmelbildImage) => {
    setSelectedImage(image);
  };

  const handleSaveSelection = () => {
    if (selectedImage) {
      localStorage.setItem("selectedWimmelbild", selectedImage.id);
      setSavedImageId(selectedImage.id);

      // Optional: Erfolgsmeldung anzeigen
      alert(`${selectedImage.title} wurde ausgewählt!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center p-4">
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden p-8">
          {/* Hauptinhalt */}
          <div className="flex flex-col gap-8">
            {selectedImage && (
              <div className="flex flex-col items-center gap-6">
                {/* Beschreibung oben - mit fester Höhe */}
                <div className="text-center min-h-20 flex items-center justify-center w-full">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {selectedImage.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed max-w-2xl">
                      {selectedImage.description}
                    </p>
                  </div>
                </div>
                <div className="w-80 h-80 rounded-xl overflow-hidden shadow-2xl border-4 border-purple-500">
                  <img
                    src={selectedImage.source}
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Untere Vorschau */}
            <div className="bg-gray-100 rounded-xl p-6 mt-4">
              <p className="text-sm text-gray-600 mb-4 text-center font-medium">
                Verfügbare Wimmelbilder:
              </p>
              <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
                {images.map((image) => (
                  <button
                    key={image.id}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage?.id === image.id
                        ? "border-purple-500 ring-4 ring-purple-200 scale-110"
                        : savedImageId === image.id
                          ? "border-green-500 ring-2 ring-green-200"
                          : "border-gray-300 hover:border-purple-300 hover:scale-105"
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <img
                      src={image.source}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Auswählen Button */}
            {selectedImage && selectedImage.id !== savedImageId && (
              <Link
                to="/commitmentCall"
                onClick={handleSaveSelection}
                className="w-full bg-purple-500 text-white py-4 rounded-xl font-semibold hover:bg-purple-600 transition-colors text-lg shadow-lg mt-4"
              >
                Auswählen
              </Link>
            )}

            {selectedImage && selectedImage.id === savedImageId && (
              <div className="w-full bg-green-100 text-green-700 py-4 rounded-xl font-semibold text-center border border-green-200 text-lg mt-4">
                ✓ Aktuell ausgewählt
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wimmelbild;
