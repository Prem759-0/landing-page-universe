"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

type GameState = "idle" | "waiting" | "ready" | "finished";

export default function ReactionTimer() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [message, setMessage] = useState("Click anywhere to start");
  
  const [highScore, setHighScore, isHydrated] = useLocalStorage<number | null>("reaction-highscore", null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (gameState === "idle" || gameState === "finished") {
      startWaiting();
    } else if (gameState === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState("finished");
      setMessage("Too soon! Click to try again.");
      setReactionTime(null);
    } else if (gameState === "ready") {
      const end = Date.now();
      const time = end - startTime;
      setReactionTime(time);
      setGameState("finished");
      setMessage("Click to play again");
      
      if (!highScore || time < highScore) {
        setHighScore(time);
      }
    }
  };

  const startWaiting = () => {
    setGameState("waiting");
    setMessage("Wait for green...");
    setReactionTime(null);
    
    const randomDelay = Math.floor(Math.random() * 3000) + 1500;
    
    timeoutRef.current = setTimeout(() => {
      setGameState("ready");
      setMessage("CLICK!");
      setStartTime(Date.now());
    }, randomDelay);
  };

  const getBackgroundColor = () => {
    switch (gameState) {
      case "idle": return "bg-slate-100 dark:bg-slate-800";
      case "waiting": return "bg-rose-500 text-white";
      case "ready": return "bg-emerald-500 text-white";
      case "finished": return "bg-indigo-500 text-white";
      default: return "bg-slate-100";
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-12">
      <div className="max-w-2xl mx-auto w-full flex justify-between items-end mb-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" /> Reaction Timer
          </h1>
        </div>
        {isHydrated && highScore && (
          <div className="text-right">
            <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">High Score</p>
            <p className="text-2xl font-black text-indigo-500">{highScore}ms</p>
          </div>
        )}
      </div>

      <motion.div 
        className={cn(
          "flex-1 rounded-3xl cursor-pointer flex flex-col items-center justify-center transition-colors duration-200 select-none",
          getBackgroundColor()
        )}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
      >
        <div className="text-center p-6">
          <h2 className={cn("text-4xl md:text-6xl font-black mb-4 tracking-tight", 
            gameState === "idle" ? "text-slate-900 dark:text-white" : "text-white"
          )}>
            {reactionTime ? `${reactionTime} ms` : message}
          </h2>
          {gameState === "finished" && reactionTime && (
            <p className="text-white/80 text-xl font-medium">
              {reactionTime < 200 ? "Lightning fast! ⚡️" : 
               reactionTime < 300 ? "Good reflexes! 🏃" : 
               "You can do better! 🐢"}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
