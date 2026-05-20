"use client";

import { useState, useCallback, useRef } from "react";
import { Play, RotateCcw, Map as MapIcon, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ROWS = 15;
const COLS = 20;
const START = { r: 7, c: 3 };
const END = { r: 7, c: 16 };

type NodeState = "empty" | "wall" | "start" | "end" | "visited" | "path";
type Grid = NodeState[][];

const createEmptyGrid = (): Grid => {
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => {
      if (r === START.r && c === START.c) return "start";
      if (r === END.r && c === END.c) return "end";
      return "empty";
    })
  );
};

export default function Pathfinder() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const handleMouseDown = (r: number, c: number) => {
    if (isVisualizing || grid[r][c] === "start" || grid[r][c] === "end") return;
    setIsDrawing(true);
    toggleWall(r, c);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (!isDrawing || isVisualizing || grid[r][c] === "start" || grid[r][c] === "end") return;
    toggleWall(r, c);
  };

  const toggleWall = (r: number, c: number) => {
    setGrid(prev => {
      const next = [...prev.map(row => [...row])];
      next[r][c] = next[r][c] === "wall" ? "empty" : "wall";
      return next;
    });
  };

  const resetGrid = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setGrid(createEmptyGrid());
    setIsVisualizing(false);
  };

  const visualizeBFS = () => {
    if (isVisualizing) return;
    setIsVisualizing(true);
    
    // Clear previous visited/path
    setGrid(prev => prev.map(row => row.map(cell => (cell === "visited" || cell === "path") ? "empty" : cell)));

    const queue = [START];
    const visited = new Set([`${START.r},${START.c}`]);
    const parentMap = new Map<string, {r: number, c: number}>();
    const visitedNodes: {r: number, c: number}[] = [];
    
    let found = false;

    // BFS execution (logical)
    while (queue.length > 0) {
      const current = queue.shift()!;
      visitedNodes.push(current);

      if (current.r === END.r && current.c === END.c) {
        found = true;
        break;
      }

      const neighbors = [
        { r: current.r - 1, c: current.c },
        { r: current.r + 1, c: current.c },
        { r: current.r, c: current.c - 1 },
        { r: current.r, c: current.c + 1 }
      ];

      for (const n of neighbors) {
        if (n.r >= 0 && n.r < ROWS && n.c >= 0 && n.c < COLS) {
          const key = `${n.r},${n.c}`;
          if (!visited.has(key) && grid[n.r][n.c] !== "wall") {
            visited.add(key);
            parentMap.set(key, current);
            queue.push(n);
          }
        }
      }
    }

    // Animation Execution
    visitedNodes.forEach((node, i) => {
      const timer = setTimeout(() => {
        setGrid(prev => {
          const next = [...prev.map(row => [...row])];
          if (next[node.r][node.c] !== "start" && next[node.r][node.c] !== "end") {
            next[node.r][node.c] = "visited";
          }
          return next;
        });
      }, i * 20);
      timeoutsRef.current.push(timer);
    });

    if (found) {
      const pathTimer = setTimeout(() => {
        const path = [];
        let curr = END;
        while (parentMap.has(`${curr.r},${curr.c}`)) {
          curr = parentMap.get(`${curr.r},${curr.c}`)!;
          path.push(curr);
        }
        path.reverse();

        path.forEach((node, i) => {
          const pTimer = setTimeout(() => {
            setGrid(prev => {
              const next = [...prev.map(row => [...row])];
              if (next[node.r][node.c] !== "start" && next[node.r][node.c] !== "end") {
                next[node.r][node.c] = "path";
              }
              return next;
            });
          }, i * 50);
          timeoutsRef.current.push(pTimer);
        });
      }, visitedNodes.length * 20);
      timeoutsRef.current.push(pathTimer);
    }
  };

  const getCellColor = (state: NodeState) => {
    switch (state) {
      case "start": return "bg-emerald-500 scale-110 z-10 shadow-lg rounded-md";
      case "end": return "bg-rose-500 scale-110 z-10 shadow-lg rounded-md";
      case "wall": return "bg-slate-800 dark:bg-slate-300 scale-100 rounded-sm";
      case "visited": return "bg-violet-200 dark:bg-violet-900/50 scale-100 transition-all duration-300";
      case "path": return "bg-violet-500 shadow-md scale-110 transition-all duration-200 z-10 rounded-sm";
      default: return "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800";
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <MapIcon className="w-8 h-8 text-violet-500" /> Pathfinding Algorithm
          </h1>
          <p className="text-slate-500 flex items-center gap-1">
            <MousePointer2 className="w-4 h-4" /> Click and drag to draw walls, then run BFS.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={resetGrid}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Clear
          </button>
          <button 
            onClick={visualizeBFS}
            disabled={isVisualizing}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg shadow-violet-500/20"
          >
            <Play className="w-4 h-4" /> Visualize BFS
          </button>
        </div>
      </div>

      <div 
        className="flex-1 w-full flex items-center justify-center overflow-x-auto select-none"
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
      >
        <div className="inline-grid gap-0.5 p-4 bg-slate-200 dark:bg-slate-800 rounded-xl">
          {grid.map((row, r) => (
            <div key={r} className="flex gap-0.5">
              {row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  onMouseDown={() => handleMouseDown(r, c)}
                  onMouseEnter={() => handleMouseEnter(r, c)}
                  className={cn(
                    "w-6 h-6 md:w-8 md:h-8 cursor-pointer transition-colors duration-200",
                    getCellColor(cell)
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
