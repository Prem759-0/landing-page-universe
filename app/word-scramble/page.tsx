"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Keyboard, ArrowRight, RotateCcw } from "lucide-react";

const WORDS = [
  "REACT", "NEXTJS", "TAILWIND", "VERCEL", 
  "FRONTEND", "COMPONENT", "TYPESCRIPT", "JAVASCRIPT", 
  "ROUTER", "PROPS", "STATE", "HOOKS"
];

export default function WordScramble() {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");

  const initGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    let scrambled = randomWord.split('').sort(() => Math.random() - 0.5).join('');
    // Ensure it's actually scrambled
    while (scrambled === randomWord) {
      scrambled = randomWord.split('').sort(() => Math.random() - 0.5).join('');
    }
    setCurrentWord(randomWord);
    setScrambledWord(scrambled);
    setGuess("");
    setStatus("playing");
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess) return;

    if (guess.toUpperCase() === currentWord) {
      setStatus("correct");
      setScore(s => s + 10);
      setTimeout(() => initGame(), 1500);
    } else {
      setStatus("wrong");
      setTimeout(() => setStatus("playing"), 1000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
              <Keyboard className="w-8 h-8 text-indigo-500" /> Scramble
            </h1>
            <p className="text-slate-500">Unscramble the developer terms.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-400 uppercase">Score</p>
            <p className="text-3xl font-black text-indigo-500">{score}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Guess the word</p>
          
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {scrambledWord.split('').map((letter, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="w-12 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-2xl font-black text-slate-800 dark:text-white border-b-4 border-slate-200 dark:border-slate-700"
              >
                {letter}
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              disabled={status === "correct"}
              placeholder="Type your answer..."
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-center text-xl font-bold uppercase tracking-widest transition-colors"
            />
            <button 
              type="submit"
              disabled={status === "correct" || !guess}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="h-10 mt-4 flex items-center justify-center">
            {status === "correct" && <p className="text-emerald-500 font-bold animate-bounce">Correct! +10 Points</p>}
            {status === "wrong" && <p className="text-rose-500 font-bold">Try again!</p>}
          </div>
        </div>

        <button 
          onClick={() => { setScore(0); initGame(); }}
          className="mt-6 flex items-center justify-center gap-2 w-full text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset Game
        </button>
      </div>
    </div>
  );
}
