// components/quiz/Quiz.tsx
import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import rawQuizData from "./quizData.json";
import { VALUE_TO_PART_ID, STRENGTH_TO_PART_ID } from "./Values";
import allParts from "@/assets/avatar_parts_manifest.json";
import { Button } from "../ui/button";
import { AvatarManager } from "../avatar/avatarManager";
import { useAvatarState } from "@/hooks";

interface QuizAnswer {
  value: string;
  strength: string;
}

interface Answer {
  text: string;
  value: string;
  strength: string;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

interface QuizData {
  questions: Question[];
}

export default function QuizQuestions() {
  const [quizData] = useState<QuizData>(rawQuizData as unknown as QuizData);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [avatarFace, setAvatarFace] = useState<string>("");
  const [avatarBody, setAvatarBody] = useState<string>("");
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const hasSetResults = useRef(false);

  const { avatarConfig } = useAvatarState();

  useEffect(() => {
    const savedFace = localStorage.getItem("avatarFaceImage");
    const savedBody = localStorage.getItem("avatarImage");
    if (savedFace) setAvatarFace(savedFace);
    if (savedBody) setAvatarBody(savedBody);

    const savedAnswers = localStorage.getItem("quizAnswers");
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
  }, []);

  const question = quizData.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;

  const handleNext = () => {
    if (selected !== null) {
      const answer: QuizAnswer = {
        value: question.answers[selected].value,
        strength: question.answers[selected].strength,
      };
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = answer;
      setAnswers(updatedAnswers);
      localStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));

      if (!isLastQuestion) {
        setCurrentQuestion(currentQuestion + 1);
        setSelected(null);
      } else {
        calculateAndSaveResults(updatedAnswers);
      }
    }
  };

  const calculateAndSaveResults = (allAnswers: QuizAnswer[]) => {
    const valueCount: Record<string, number> = {};
    const strengthCount: Record<string, number> = {};

    allAnswers.forEach((a) => {
      valueCount[a.value] = (valueCount[a.value] || 0) + 1;
      strengthCount[a.strength] = (strengthCount[a.strength] || 0) + 1;
    });

    const maxValueCount = Math.max(...Object.values(valueCount));
    const topValues = Object.keys(valueCount).filter(
      (v) => valueCount[v] === maxValueCount
    );

    const maxStrengthCount = Math.max(...Object.values(strengthCount));
    const topStrengths = Object.keys(strengthCount).filter(
      (s) => strengthCount[s] === maxStrengthCount
    );

    const selectedValue =
      topValues[Math.floor(Math.random() * topValues.length)];
    const selectedStrength =
      topStrengths[Math.floor(Math.random() * topStrengths.length)];

    const valuePartId = VALUE_TO_PART_ID[selectedValue];
    const strengthPartId = STRENGTH_TO_PART_ID[selectedStrength];

    const valuePart = allParts.find((p) => p.id === valuePartId) || null;
    const strengthPart = allParts.find((p) => p.id === strengthPartId) || null;

    const results = {
      valueKey: selectedValue,
      strengthKey: selectedStrength,
      valuePart,
      strengthPart,
    };

    localStorage.setItem("quizResults", JSON.stringify(results));
    setQuizResults(results);
    setShowResult(true);
  };

  // ERGEBNIS-ANSICHT
  if (showResult && quizResults) {
    return (
      <AvatarManager avatarConfig={avatarConfig}>
        {({
          setQuizResults: saveResults,
        }: {
          setQuizResults: (results: any) => void;
        }) => {
          // ✅ useEffect verwenden um Endlosschleife zu vermeiden
          useEffect(() => {
            if (!hasSetResults.current && quizResults) {
              saveResults(quizResults);
              hasSetResults.current = true;
            }
          }, [quizResults, saveResults]);

          return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
              <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
                <div className="relative w-full max-w-[520px] bg-white rounded-3xl shadow-xl overflow-hidden p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1 text-gray-700 leading-relaxed space-y-4 text-base">
                      <p>
                        <strong>{quizResults.valueKey}</strong>: Dein
                        ausgewählter Wert
                      </p>
                      <p>
                        <strong>{quizResults.strengthKey}</strong>: Deine
                        ausgewählte Stärke
                      </p>
                    </div>

                    <div className="relative flex justify-center">
                      {avatarBody && (
                        <div className="relative">
                          <img
                            src={avatarBody}
                            alt="Avatar"
                            className="w-40 h-40 object-cover rounded-2xl border-2 border-purple-300"
                          />

                          {quizResults.valuePart && (
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-primary overflow-hidden flex items-center justify-center">
                              <img
                                src={"/" + quizResults.valuePart.src}
                                alt="Value Badge"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {quizResults.strengthPart && (
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-primary overflow-hidden flex items-center justify-center">
                              <img
                                src={"/" + quizResults.strengthPart.src}
                                alt="Strength Badge"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Link to="/quiz-result">
                      <Button>Weiter zum Ergebnis</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </AvatarManager>
    );
  }

  // QUIZ-ANSICHT
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-[520px] bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 flex flex-col justify-between min-h-[850px]">
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 rounded-full bg-gray-100 shadow-md flex items-center justify-center">
                {avatarFace ? (
                  <img
                    src={avatarFace}
                    alt="Avatar Gesicht"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-5xl">🙂</span>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm mb-6 flex items-center justify-center min-h-[120px]">
              <p className="text-lg font-medium text-center text-gray-800">
                {question.question}
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              {question.answers.map((answer, i) => {
                const isSelected = selected === i;
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`flex justify-between items-center text-left p-4 rounded-2xl border-2 transition-all text-base sm:text-lg ${isSelected ? "border-purple-600 bg-purple-50" : "border-gray-200 bg-white hover:border-purple-300"}`}
                  >
                    <span className="text-gray-700">{answer.text}</span>
                    <span
                      className={`w-6 h-6 rounded-full border-2 shrink-0 ${isSelected ? "bg-primary border-primary" : "border-gray-300 bg-white"}`}
                    >
                      {isSelected && (
                        <svg
                          className="w-full h-full text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mb-6 flex justify-center flex-wrap gap-1">
              {Array.from({ length: 10 }).map((_, i) => {
                const filledStars = Math.floor((currentQuestion + 1) / 2);
                return (
                  <Star
                    key={i}
                    size={22}
                    className={`transition-colors ${i < filledStars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                );
              })}
            </div>

            <Button onClick={handleNext} disabled={selected === null}>
              {!isLastQuestion ? "Nächste Frage" : "Zum Ergebnis ✓"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
