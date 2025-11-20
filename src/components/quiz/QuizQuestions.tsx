import { useState, useEffect, useRef } from "react";
import { Star, InfoIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import rawQuizData from "./quizData.json";
import { VALUE_TO_PART_ID, STRENGTH_TO_PART_ID } from "./Values";
import allParts from "@/assets/avatar_parts_manifest.json";
import { Button } from "../ui/button";
import { AvatarManager } from "../avatar/avatarManager";
import { useAvatarState } from "@/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import Layout from "../layout";

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

export default function Quiz() {
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
          useEffect(() => {
            if (!hasSetResults.current && quizResults) {
              saveResults(quizResults);
              hasSetResults.current = true;
            }
          }, [quizResults, saveResults]);

          return (
            <Layout>
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Quiz abgeschlossen!</CardTitle>
                  <CardDescription>Hier sind deine Ergebnisse</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center gap-6">
                    {/* Avatar ohne Kreise */}
                    <div className="flex justify-center">
                      {avatarBody && (
                        <img
                          src={avatarBody}
                          alt="Avatar"
                          className="w-40 h-40 object-cover rounded-2xl"
                        />
                      )}
                    </div>

                    {/* Ergebnisse ohne Kasten */}
                    <div className="text-center space-y-4">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Dein Wert:
                        </p>
                        <p className="text-lg text-purple-600">
                          {quizResults.valueKey}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Deine Stärke:
                        </p>
                        <p className="text-lg text-purple-600">
                          {quizResults.strengthKey}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Link to="/quiz/result">
                    <Button>Weiter zum Ergebnis</Button>
                  </Link>
                </CardFooter>
              </Card>
            </Layout>
          );
        }}
      </AvatarManager>
    );
  }

  // QUIZ-ANSICHT
  return (
    <Layout>
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size={"icon"}>
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogDescription>
                  Ergänze die Sätze mit dem Satzende, das am besten zu dir
                  passt. Du kannst nur eine der Antwort-Möglichkeiten auswählen.
                  Überlege nicht zu lange, entscheide aus dem Bauch heraus. Auch
                  wenn alle Antworten zu dir passen oder keine ganz zutrifft,
                  wähle das aus, was dich am meisten anspricht.
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 min-h-[500px] flex flex-col">
          {/* Avatar Gesicht - Feste Position */}
          <div className="flex justify-center shrink-0">
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

          {/* Frage - Feste Höhe */}
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm flex items-center justify-center min-h-[120px] max-h-[120px] overflow-y-auto shrink-0">
            <p className="text-lg font-medium text-center text-gray-800">
              {question.question}
            </p>
          </div>

          {/* Antworten - Flexible Höhe */}
          <div className="flex flex-col gap-4 flex-1">
            {question.answers.map((answer, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`flex justify-between items-center text-left p-4 rounded-2xl border-2 transition-all text-base sm:text-lg ${
                    isSelected
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 bg-white hover:border-purple-300"
                  }`}
                >
                  <span className="text-gray-700">{answer.text}</span>
                  <span
                    className={`w-6 h-6 rounded-full border-2 shrink-0 ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-gray-300 bg-white"
                    }`}
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

          {/* Fortschritts-Sterne - Feste Position */}
          <div className="flex justify-center flex-wrap gap-1 shrink-0">
            {Array.from({ length: 10 }).map((_, i) => {
              const filledStars = Math.floor((currentQuestion + 1) / 2);
              return (
                <Star
                  key={i}
                  size={22}
                  className={`transition-colors ${
                    i < filledStars
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="justify-end shrink-0">
          <Button onClick={handleNext} disabled={selected === null}>
            {!isLastQuestion ? "Nächste Frage" : "Zum Ergebnis ✓"}
          </Button>
        </CardFooter>
      </Card>
    </Layout>
  );
}
