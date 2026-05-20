"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE_TEXT = "const express = require('express'); const app = express(); app.get('/', (req, res) => { res.send('Hello World!'); }); app.listen(3000, () => console.log('Server running on port 3000'));";

export default function TypingTest() {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on load
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (input.length > 0 && !startTime) {
      setStartTime(Date.now());
    }

    if (input.length === SAMPLE_TEXT.length) {
      setIsFinished(true);
      const timeTaken = (Date.now() - (startTime || Date.now())) / 1000 / 60; // in minutes
      const words = SAMPLE_TEXT.length / 5; // standard WPM calculation
      setWpm(Math.round(words / timeTaken));
    }

    if (input.length > 0) {
      let correct = 0;
      for (let i = 0; i < input.length; i++) {
        if (input[i] === SAMPLE_TEXT[i]) correct++;
      }
      setAccuracy(Math.round((correct / input.length) * 100));
    } else {
      setAccuracy(100);
    }
  }, [input, startTime]);

  const reset = () => {
    setInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12">
      <div className="max-w-3xl w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
              <Keyboard className="w-8 h-8 text-indigo-500" /> Speed Typer
            </h1>
            <p className="text-slate-500">Type the code snippet below as fast as you can.</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">WPM</p>
              <p className="text-3xl font-black text-indigo-500">{wpm}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accuracy</p>
              <p className="text-3xl font-black text-emerald-500">{accuracy}%</p>
            </div>
          </div>
        </div>

        <div 
          className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl font-mono text-xl md:text-2xl leading-relaxed shadow-sm cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Invisible input to capture keystrokes */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              if (!isFinished && e.target.value.length <= SAMPLE_TEXT.length) {
                setInput(e.target.value);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          <div className="break-all whitespace-pre-wrap select-none pointer-events-none">
            {SAMPLE_TEXT.split("").map((char, index) => {
              let color = "text-slate-300 dark:text-slate-700"; // default
              let bg = "";
              
              if (index < input.length) {
                if (input[index] === char) {
                  color = "text-slate-900 dark:text-white"; // correct
                } else {
                  color = "text-rose-500"; // incorrect
                  bg = "bg-rose-500/20 rounded";
                }
              }

              // Cursor
              const isCursor = index === input.length && !isFinished;

              return (
                <span key={index} className={cn(color, bg, isCursor && "border-l-2 border-indigo-500 animate-pulse")}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {isFinished && (
          <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={reset}
              className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
