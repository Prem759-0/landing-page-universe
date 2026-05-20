"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, RotateCcw } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

const EMOJIS = ["🚀", "👾", "🌟", "🍕", "🎸", "🎈", "🎨", "🧩"];

export default function MemoryGame() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  
  const [bestScore, setBestScore, isHydrated] = useLocalStorage<number | null>("memory-best-score", null);

  const initializeGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setDisabled(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (solved.length === EMOJIS.length * 2 && solved.length > 0) {
      if (!bestScore || moves < bestScore) {
        setBestScore(moves);
      }
    }
  }, [solved, moves, bestScore, setBestScore]);

  const handleCardClick = (index: number) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves((m) => m + 1);
      
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setSolved([...solved, first, second]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center py-12 px-4 max-w-2xl mx-auto w-full">
      <div className="w-full flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Brain className="w-8 h-8 text-pink-500" /> Memory Game
          </h1>
          <p className="text-slate-500 font-medium">Moves: {moves}</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          {isHydrated && bestScore && (
            <div className="text-sm bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-3 py-1 rounded-full font-bold">
              Best: {bestScore} moves
            </div>
          )}
          <button 
            onClick={initializeGame}
            className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Restart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || solved.includes(index);
          return (
            <motion.div
              key={index}
              className={cn(
                "aspect-square rounded-2xl flex items-center justify-center text-4xl sm:text-5xl cursor-pointer shadow-sm border-2",
                isFlipped 
                  ? "bg-white dark:bg-slate-800 border-pink-200 dark:border-pink-900/50" 
                  : "bg-pink-500 border-pink-600 hover:bg-pink-400"
              )}
              onClick={() => handleCardClick(index)}
              whileHover={!isFlipped && !disabled ? { scale: 1.05 } : {}}
              whileTap={!isFlipped && !disabled ? { scale: 0.95 } : {}}
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div style={{ transform: isFlipped ? "rotateY(180deg)" : "none" }}>
                {isFlipped ? card : ""}
              </div>
            </motion.div>
          );
        })}
      </div>

      {solved.length === cards.length && cards.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">You did it in {moves} moves! 🎉</h2>
          <button 
            onClick={initializeGame}
            className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
