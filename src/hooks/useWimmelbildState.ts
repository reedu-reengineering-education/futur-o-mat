// create a zustand store for quiz state management
// expose existing questions
// expose quiz answers
// expose functions to set answers
// expose function to reset quiz state

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface WimmelbildImage {
  id: string;
  source: string;
  title: string;
  description: string;
}

interface UseWimmelbildStateReturn {
  image: WimmelbildImage | null;
  setImage: (image: WimmelbildImage | null) => void;
}

export const useWimmelbildState = create<UseWimmelbildStateReturn>()(
  devtools<UseWimmelbildStateReturn>((set) => ({
    image: null,
    setImage: (image) => set({ image }),
  }))
);
