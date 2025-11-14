import { useState, useEffect } from "react";
import rawQuizData from "./quizData.json";
import { Star } from "lucide-react";

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
  const quizData: QuizData = rawQuizData;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [avatarFace, setAvatarFace] = useState<string>("");
  const [avatarBody, setAvatarBody] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Avatar-Gesicht aus localStorage laden
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
      // Antwort-Code speichern
      const answerValue = question.answers[selected].value;
      const answerStrength = question.answers[selected].strength;
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = answerStrength;
      updatedAnswers[currentQuestion] = answerValue;
      setAnswers(updatedAnswers);
      localStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));

      if (!isLastQuestion) {
        setCurrentQuestion(currentQuestion + 1);
        setSelected(null);
      } else {
        // Quiz beendet
        setShowResult(true);
      }
    }
  };

  const calculateResultValue = () => {
    const valueCount: { [key: string]: number } = {};
    answers.forEach((value) => {
      const prefix = value.split("-")[0];
      valueCount[prefix] = (valueCount[prefix] || 0) + 1;
    });
    let maxCount = 0;
    let topValue = "TEAMWORK";
    Object.entries(valueCount).forEach(([value, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topValue = value;
      }
    });
    return topValue;
  };

  const calculateResultStrength = () => {
    const strengthCount: { [key: string]: number } = {};
    answers.forEach((strength) => {
      const prefix = strength.split("-")[0];
      strengthCount[prefix] = (strengthCount[prefix] || 0) + 1;
    });
    let maxCount = 0;
    let topStrength = "TEAMWORK";
    Object.entries(strengthCount).forEach(([strength, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topStrength = strength;
      }
    });
    return topStrength;
  };

  if (showResult) {
    const result = calculateResultValue();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <div className="relative w-full max-w-[520px] bg-white rounded-3xl shadow-xl overflow-hidden p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1 text-gray-700 leading-relaxed space-y-4 text-base">
                <p>
                  <strong>{result}</strong>: Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Sagittis porttitor leo diam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sagittis porttitor leo diam. Lorem ipsum dolor sit amet.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sagittis porttitor leo diam. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit.
                </p>
              </div>
              {avatarBody && (
                <div className="flex justify-center md:justify-end">
                  <img
                    src={avatarBody}
                    alt="Avatar"
                    className="w-60 h-50 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Button unten rechts */}
            <div className="flex justify-end mt-8">
              <button className="bg-purple-600 text-white text-lg px-6 py-3 rounded-2xl font-semibold hover:bg-purple-700 transition-all shadow-lg flex items-center gap-2">
                Weiter zum Ergebnis{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-[520px] bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 flex flex-col justify-between min-h-[850px]">
            {/* Avatar-Kreis oben */}
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

            {/* Fragefeld – feste Höhe verhindert Springen */}
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm mb-6 flex items-center justify-center min-h-[120px]">
              <p className="text-lg font-medium text-center text-gray-800">
                {question.question}
              </p>
            </div>

            {/* Antworten */}
            <div className="flex flex-col gap-4 mb-8">
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
                      className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                        isSelected
                          ? "bg-purple-600 border-purple-600"
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

            {/* Fortschritt mit 10 Sternen */}
            <div className="mb-6 flex justify-center flex-wrap gap-1">
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

            {/* Weiter Button */}
            <button
              onClick={handleNext}
              disabled={selected === null}
              className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-2xl text-lg font-semibold transition-all ${
                selected !== null
                  ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {!isLastQuestion ? (
                <>
                  Nächste Frage <span className="text-2xl"></span>
                </>
              ) : (
                <>
                  Zum Ergebnis <span className="text-2xl">✓</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
