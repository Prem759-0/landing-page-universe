"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MousePointerClick, Trophy } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

export default function TapCounter() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const [highScore, setHighScore, isHydrated] = useLocalStorage<number>("tap-highscore", 0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setIsFinished(true);
      if (score > highScore) {
        setHighScore(score);
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, highScore, setHighScore]);

  const handleTap = () => {
    if (isFinished) return;
    if (!isPlaying) {
      setIsPlaying(true);
      setScore(1);
    } else {
      setScore((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsPlaying(false);
    setIsFinished(false);
  };

  const clicksPerSecond = isFinished ? (score / 10).toFixed(1) : "0.0";

  return (
    <div className="flex-1 flex flex-col p-4 md:p-12 items-center justify-center">
      <div className="max-w-md w-full text-center mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold flex justify-center items-center gap-2">
          <MousePointerClick className="w-8 h-8 text-red-500" /> Tap Rush
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Click as fast as you can for 10 seconds!</p>
        
        {isHydrated && highScore > 0 && (
          <div className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 px-4 py-1.5 rounded-full text-sm font-bold mt-4">
            <Trophy className="w-4 h-4" /> High Score: {highScore}
          </div>
        )}
      </div>

      <motion.button
        onClick={handleTap}
        disabled={isFinished}
        whileTap={!isFinished ? { scale: 0.95 } : {}}
        className={cn(
          "w-full max-w-sm aspect-square rounded-[3rem] shadow-xl flex flex-col items-center justify-center text-white transition-colors duration-300",
          !isPlaying && !isFinished ? "bg-red-500 hover:bg-red-400" :
          isPlaying ? "bg-indigo-500" : "bg-slate-800 dark:bg-slate-700"
        )}
      >
        {!isPlaying && !isFinished && (
          <span className="text-3xl font-black uppercase tracking-widest">Start Tapping</span>
        )}
        
        {isPlaying && (
          <>
            <span className="text-8xl font-black">{score}</span>
            <span className="text-xl font-medium opacity-80 mt-2">{timeLeft}s left</span>
          </>
        )}

        {isFinished && (
          <>
            <span className="text-6xl font-black mb-2">{score}</span>
            <span className="text-lg font-medium text-slate-300">Total Taps</span>
            <span className="text-sm font-bold text-slate-400 mt-4">{clicksPerSecond} clicks/sec</span>
          </>
        )}
      </motion.button>

      {isFinished && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={resetGame}
          className="mt-8 px-8 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform"
        >
          Try Again
        </motion.button>
      )}
    </div>
  );
}
