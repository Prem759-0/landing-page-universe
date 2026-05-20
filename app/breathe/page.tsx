"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wind, Play, Square } from "lucide-react";

type Phase = "idle" | "inhale" | "hold" | "exhale";

export default function Breathe() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (phase === "inhale") {
      setTimeLeft(4);
      timer = setTimeout(() => setPhase("hold"), 4000);
    } else if (phase === "hold") {
      setTimeLeft(7);
      timer = setTimeout(() => setPhase("exhale"), 7000);
    } else if (phase === "exhale") {
      setTimeLeft(8);
      timer = setTimeout(() => setPhase("inhale"), 8000);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (phase !== "idle" && timeLeft > 0) {
      countdown = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [timeLeft, phase]);

  const toggleBreathing = () => {
    if (phase === "idle") {
      setPhase("inhale");
    } else {
      setPhase("idle");
      setTimeLeft(0);
    }
  };

  const getInstruction = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      default: return "Ready to relax?";
    }
  };

  const getScale = () => {
    switch (phase) {
      case "inhale": return 1.5;
      case "hold": return 1.5;
      case "exhale": return 0.8;
      default: return 1;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[80vh]">
      <div className="absolute top-24 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2 text-slate-800 dark:text-slate-100">
          <Wind className="w-8 h-8 text-sky-500" /> 4-7-8 Relaxation
        </h1>
        <p className="text-slate-500">A simple breathing technique to calm the mind.</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-12 mt-20">
        <motion.div
          animate={{ scale: getScale() }}
          transition={{ 
            duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 1, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 bg-sky-200 dark:bg-sky-900/50 rounded-full opacity-50 blur-xl"
        />
        <motion.div
          animate={{ scale: getScale() }}
          transition={{ 
            duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 1, 
            ease: "easeInOut" 
          }}
          className="absolute inset-4 bg-sky-400 dark:bg-sky-600 rounded-full shadow-2xl flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-1">{getInstruction()}</h2>
            {phase !== "idle" && (
              <span className="text-4xl font-black text-white/80">{timeLeft}</span>
            )}
          </div>
        </motion.div>
      </div>

      <button
        onClick={toggleBreathing}
        className="flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform"
      >
        {phase === "idle" ? (
          <><Play className="w-5 h-5 fill-current" /> Start Breathing</>
        ) : (
          <><Square className="w-5 h-5 fill-current" /> Stop</>
        )}
      </button>
    </div>
  );
}
