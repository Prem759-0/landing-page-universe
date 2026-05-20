"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Timer as TimerIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function FocusStation() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === "focus") {
        setSessions((s) => s + 1);
        setMode("break");
        setTimeLeft(BREAK_TIME);
      } else {
        setMode("focus");
        setTimeLeft(FOCUS_TIME);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? FOCUS_TIME : BREAK_TIME);
  };

  const switchMode = (newMode: "focus" | "break") => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === "focus" ? FOCUS_TIME : BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const totalTime = mode === "focus" ? FOCUS_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  
  // SVG Circle calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0f172a]">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
        
        {/* Background ambient glow */}
        <div className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-3xl opacity-20 dark:opacity-10 pointer-events-none rounded-full transition-colors duration-1000",
          mode === "focus" ? "bg-rose-500" : "bg-teal-500"
        )} />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full mb-10">
            <button 
              onClick={() => switchMode("focus")}
              className={cn("px-6 py-2 rounded-full text-sm font-bold transition-colors", mode === "focus" ? "bg-white dark:bg-slate-950 text-rose-500 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white")}
            >
              Focus
            </button>
            <button 
              onClick={() => switchMode("break")}
              className={cn("px-6 py-2 rounded-full text-sm font-bold transition-colors", mode === "break" ? "bg-white dark:bg-slate-950 text-teal-500 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white")}
            >
              Break
            </button>
          </div>

          {/* Circular Timer */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-10">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="128" cy="128" r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-100 dark:text-slate-800"
              />
              <circle
                cx="128" cy="128" r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                style={{ strokeDasharray: circumference, strokeDashoffset, transition: "stroke-dashoffset 1s linear" }}
                className={cn("transition-colors duration-500", mode === "focus" ? "text-rose-500" : "text-teal-500")}
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black tabular-nums tracking-tighter text-slate-900 dark:text-white">
                {formatTime(timeLeft)}
              </span>
              <span className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-xs">
                {mode === "focus" ? "Stay Focused" : "Take a Breather"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTimer}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95",
                mode === "focus" ? "bg-rose-500 shadow-rose-500/30" : "bg-teal-500 shadow-teal-500/30"
              )}
            >
              {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
            <button 
              onClick={resetTimer}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/50 w-full">
            <p className="text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
              <TimerIcon className="w-4 h-4" /> Completed Sessions: <span className={cn(mode === "focus" ? "text-rose-500" : "text-teal-500")}>{sessions}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
