import { useEffect, useState } from "react";
import { Star, InfoIcon, CheckCircle, Circle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Layout from "../layout";
import AvatarCanvas from "../avatar/AvatarCanvas";
import { useQuizState, type QuizAnswer } from "@/hooks/useQuizState";
import useAvatarState from "@/hooks/useAvatarState";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const { avatarConfig } = useAvatarState();

  const {
    getCurrentQuestion,
    isLastQuestion: getIsLastQuestion,
    answers,
    setAnswers,
    resetQuiz,
  } = useQuizState();

  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);

  const isLastQuestion = getIsLastQuestion(currentQuestion);

  const question = getCurrentQuestion(currentQuestion);

  const handleNext = () => {
    if (selected !== null) {
      const answer: QuizAnswer = {
        value: question.answers[selected].value,
        strength: question.answers[selected].strength,
      };
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = answer;
      setAnswers(updatedAnswers);

      if (!isLastQuestion) {
        setCurrentQuestion(currentQuestion + 1);
        setSelected(null);
      }
    }
  };

  // QUIZ-ANSICHT
  return (
    <Layout>
      <Card className="sm:min-w-md max-w-md">
        <CardHeader>
          <div className="flex w-full justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size={"icon"}>
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                Ergänze die Sätze mit dem Satzende, das am besten zu dir passt.
                Du kannst nur eine der Antwort-Möglichkeiten auswählen. Überlege
                nicht zu lange, entscheide aus dem Bauch heraus. Auch wenn alle
                Antworten zu dir passen oder keine ganz zutrifft, wähle das aus,
                was dich am meisten anspricht.
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 min-h-[500px] flex flex-col">
          {/* Avatar Gesicht - Feste Position */}
          <div className="flex justify-center shrink-0">
            <div className="relative w-24 h-24 rounded-full bg-gray-100 shadow-md flex items-center justify-center overflow-hidden">
              <AvatarCanvas
                avatarConfig={avatarConfig}
                className="w-[300%] max-w-none -ml-[100%] -mt-[50%] absolute top-0 left-0 right-0"
              />
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
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 bg-white hover:border-primary/50"
                  }`}
                >
                  <span className="text-gray-700">{answer.text}</span>
                  {isSelected ? (
                    <CheckCircle className="text-primary" />
                  ) : (
                    <Circle className="text-gray-200" />
                  )}
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
          {!isLastQuestion && (
            <Button onClick={handleNext} disabled={selected === null}>
              Nächste Frage
            </Button>
          )}
          {isLastQuestion && (
            <Link to={"/quiz/result"}>
              <Button onClick={handleNext} disabled={selected === null}>
                Zum Ergebnis
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </Layout>
  );
}
