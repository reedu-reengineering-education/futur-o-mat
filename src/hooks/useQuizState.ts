// create a zustand store for quiz state management
// expose existing questions
// expose quiz answers
// expose functions to set answers
// expose function to reset quiz state

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import rawQuizData from "@/assets/quizData.json";
import rawQuizDataDebug from "@/assets/quizData.debug.json";

// Use debug data in development mode
const isDevelopment = import.meta.env.DEV;
// const isDevelopment = false;
const quizData = isDevelopment ? rawQuizDataDebug : rawQuizData;

export interface QuizAnswer {
  value?: string;
  strength?: string;
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

export interface QuizResult {
  valueKey: string;
  strengthKey: string;
}

interface UseQuizStateReturn {
  questions: QuizData["questions"];
  getCurrentQuestion: (index: number) => Question;
  isLastQuestion: (index: number) => boolean;
  quizLength?: number;
  answers: QuizAnswer[];
  setAnswers: (answers: QuizAnswer[]) => void;
  resetQuiz: () => void;
  result: QuizResult | null;
  setResult: (result: QuizResult) => void;
  calculateResult: () => void;
}

const calculateQuizResult = (allAnswers: QuizAnswer[]) => {
  const valueCount: Record<string, number> = {};
  const strengthCount: Record<string, number> = {};

  allAnswers.forEach((a) => {
    if (a.value) {
      valueCount[a.value] = (valueCount[a.value] || 0) + 1;
    }
    if (a.strength) {
      strengthCount[a.strength] = (strengthCount[a.strength] || 0) + 1;
    }
  });

  const maxValueCount = Math.max(...Object.values(valueCount));
  const topValues = Object.keys(valueCount).filter(
    (v) => valueCount[v] === maxValueCount
  );

  const maxStrengthCount = Math.max(...Object.values(strengthCount));
  const topStrengths = Object.keys(strengthCount).filter(
    (s) => strengthCount[s] === maxStrengthCount
  );

  const selectedValue = topValues[Math.floor(Math.random() * topValues.length)];
  const selectedStrength =
    topStrengths[Math.floor(Math.random() * topStrengths.length)];

  const results = {
    valueKey: selectedValue,
    strengthKey: selectedStrength,
  };

  return results;
};

export const useQuizState = create<UseQuizStateReturn>()(
  devtools<UseQuizStateReturn>((set) => ({
    questions: (quizData as unknown as QuizData).questions,
    getCurrentQuestion: (index: number) =>
      (quizData as unknown as QuizData).questions[index],
    isLastQuestion: (index: number) =>
      index === (quizData as unknown as QuizData).questions.length - 1,
    quizLength: (quizData as unknown as QuizData).questions.length,
    answers: [],
    setAnswers: (answers: QuizAnswer[]) =>
      set(() => ({
        answers,
        result: calculateQuizResult(answers),
      })),
    resetQuiz: () =>
      set(() => ({
        answers: [],
      })),
    result: null,
    setResult: (result: QuizResult) => set(() => ({ result })),
    calculateResult: () =>
      set(() => ({
        result: calculateQuizResult(useQuizState.getState().answers),
      })),
  }))
);
