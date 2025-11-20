// components/avatar/avatarManager.tsx
import { useCallback, useEffect, useState } from "react";
import type { AvatarConfig, AvatarPart } from "@/types";

interface AvatarManagerProps {
  avatarConfig: AvatarConfig;
  children: (props: AvatarManagerChildrenProps) => React.ReactNode;
}

export interface AvatarManagerChildrenProps {
  saveAvatarFace: () => void;
  saveAvatarBody: () => void;
  saveFinalAvatar: (canvas: HTMLCanvasElement) => void;
  setQuizResults: (results: QuizResults) => void;
  getAvatarImage: () => string | null;
  getAvatarFace: () => string | null;
  getFinalAvatar: () => string | null;
  getQuizResults: () => QuizResults | null;
  hasCompletedQuiz: () => boolean;
}

export interface QuizResults {
  valueKey: string;
  strengthKey: string;
  valuePart: AvatarPart | null;
  strengthPart: AvatarPart | null;
}

export function AvatarManager({ avatarConfig, children }: AvatarManagerProps) {
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Prüfen ob Quiz bereits abgeschlossen
  useEffect(() => {
    const results = localStorage.getItem("quizResults");
    setQuizCompleted(!!results);
  }, []);

  // Avatar-Bild speichern (VOR dem Quiz)
  const saveAvatarImage = useCallback(
    (canvas: HTMLCanvasElement, key: string, type: "face" | "body") => {
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d");

      if (type === "face") {
        // Gesicht: Zentriert, quadratisch
        tempCanvas.width = 100;
        tempCanvas.height = 200;

        if (ctx) {
          // Gesicht in der Mitte des Canvas (ca. 30-40% von oben)
          const faceSize = 400; // Größe des Gesichtsbereichs
          const faceX = (canvas.width - faceSize) / 2; // Zentriert
          const faceY = canvas.height * 0.18; // 30% von oben

          ctx.drawImage(
            canvas,
            faceX,
            faceY, // Start im Original
            faceSize,
            faceSize, // Größe im Original
            0,
            50, // Start im Ziel
            100,
            200 // Größe im Ziel
          );
        }
      } else {
        // Ganzkörper: Mit etwas Rand
        tempCanvas.width = 225;
        tempCanvas.height = 285;

        if (ctx) {
          // Avatar mit Rand (ca. 10% Rand auf jeder Seite)
          const marginX = canvas.width * 0.05; // 10% Rand links/rechts
          const marginY = canvas.height * 0.05; // 5% Rand oben/unten
          const cropWidth = canvas.width - marginX * 2;
          const cropHeight = canvas.height - marginY * 2;

          ctx.drawImage(
            canvas,
            marginX,
            marginY, // Start mit Rand
            cropWidth,
            cropHeight, // Größe mit Rand
            0,
            20, // Start im Ziel
            210,
            210 // Ziel-Größe
          );
        }
      }

      if (ctx) {
        const image = tempCanvas.toDataURL("image/png");
        localStorage.setItem(key, image);
        return image;
      }
      return null;
    },
    []
  );

  const saveAvatarFace = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      return saveAvatarImage(canvas, "avatarFaceImage", "face");
    }
    return null;
  }, [saveAvatarImage]);

  const saveAvatarBody = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      return saveAvatarImage(canvas, "avatarImage", "body");
    }
    return null;
  }, [saveAvatarImage]);

  // FINALES Avatar-Bild speichern (NACH dem Quiz - mit Values/Strengths)
  const saveFinalAvatar = useCallback((canvas: HTMLCanvasElement) => {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const ctx = finalCanvas.getContext("2d");

    if (ctx) {
      // Komplettes Canvas kopieren (inklusive Values/Strengths)
      ctx.drawImage(canvas, 0, 0);

      const finalImage = finalCanvas.toDataURL("image/png");
      localStorage.setItem("finalAvatarImage", finalImage);
      return finalImage;
    }
    return null;
  }, []);

  // Quiz-Ergebnisse speichern und Avatar-Konfiguration updaten
  const setQuizResults = useCallback(
    (results: QuizResults) => {
      // Quiz-Ergebnisse speichern
      localStorage.setItem("quizResults", JSON.stringify(results));
      setQuizCompleted(true);

      // Avatar-Konfiguration mit Values/Strengths updaten
      const updatedConfig = {
        ...avatarConfig,
        selectedParts: {
          ...avatarConfig.selectedParts,
          values: results.valuePart?.id || null,
          strengths: results.strengthPart?.id || null,
        },
        quizResults: results,
      };

      localStorage.setItem("avatarConfig", JSON.stringify(updatedConfig));

      // Finales Avatar-Bild speichern (wenn Canvas verfügbar)
      setTimeout(() => {
        const canvas = document.querySelector("canvas");
        if (canvas) {
          saveFinalAvatar(canvas);
        }
      }, 100);
    },
    [avatarConfig, saveFinalAvatar]
  );

  // Getter-Funktionen
  const getAvatarImage = useCallback(() => {
    // Gibt das PRE-Quiz Bild zurück (ohne Values/Strengths)
    return localStorage.getItem("avatarImage");
  }, []);

  const getAvatarFace = useCallback(() => {
    return localStorage.getItem("avatarFaceImage");
  }, []);

  const getFinalAvatar = useCallback(() => {
    // Gibt das POST-Quiz Bild zurück (mit Values/Strengths)
    return (
      localStorage.getItem("finalAvatarImage") ||
      localStorage.getItem("avatarImage")
    );
  }, []);

  const getQuizResults = useCallback((): QuizResults | null => {
    const saved = localStorage.getItem("quizResults");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse quiz results:", error);
      }
    }
    return null;
  }, []);

  const hasCompletedQuiz = useCallback(() => {
    return quizCompleted;
  }, [quizCompleted]);

  // Avatar-Konfiguration speichern
  useEffect(() => {
    localStorage.setItem("avatarConfig", JSON.stringify(avatarConfig));
  }, [avatarConfig]);

  return children({
    saveAvatarFace,
    saveAvatarBody,
    saveFinalAvatar,
    setQuizResults,
    getAvatarImage,
    getAvatarFace,
    getFinalAvatar,
    getQuizResults,
    hasCompletedQuiz,
  });
}
