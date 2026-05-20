"use client";

import { useState, useRef, useEffect } from "react";
import { PaintBucket, Download, Eraser, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const GRID_SIZE = 16;
const COLORS = ["#000000", "#FFFFFF", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#A855F7", "#EC4899"];

export default function PixelStudio() {
  const [pixels, setPixels] = useState<string[]>(Array(GRID_SIZE * GRID_SIZE).fill(""));
  const [color, setColor] = useState(COLORS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawPixel = (index: number) => {
    if (!isDrawing) return;
    setPixels(prev => {
      const next = [...prev];
      next[index] = color;
      return next;
    });
  };

  const handlePointerDown = (index: number) => {
    setIsDrawing(true);
    setPixels(prev => {
      const next = [...prev];
      next[index] = color;
      return next;
    });
  };

  const clearCanvas = () => setPixels(Array(GRID_SIZE * GRID_SIZE).fill(""));

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    // Draw background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 512, 512);
    
    // Draw pixels
    const pixelSize = 512 / GRID_SIZE;
    pixels.forEach((hex, i) => {
      if (hex) {
        ctx.fillStyle = hex;
        const x = (i % GRID_SIZE) * pixelSize;
        const y = Math.floor(i / GRID_SIZE) * pixelSize;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    });

    const url = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "pixel-art.png";
    link.href = url;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl flex flex-col md:flex-row gap-8">
        
        {/* Tools panel */}
        <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm w-full md:w-64">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
              <PaintBucket className="w-6 h-6 text-yellow-500" /> Pixel Studio
            </h1>
            <p className="text-slate-500 text-sm">Draw & export.</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">Palette</h3>
            <div className="grid grid-cols-3 gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-full aspect-square rounded-lg border-2 transition-transform active:scale-95",
                    color === c ? "border-slate-900 dark:border-white scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
              <button
                onClick={() => setColor("")}
                className={cn(
                  "w-full aspect-square rounded-lg border-2 flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-transform active:scale-95",
                  color === "" ? "border-slate-900 dark:border-white scale-110" : "border-transparent"
                )}
              >
                <Eraser className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <button onClick={clearCanvas} className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
              <RotateCcw className="w-4 h-4" /> Clear
            </button>
            <button onClick={downloadCanvas} className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
              <Download className="w-4 h-4" /> Export PNG
            </button>
          </div>
        </div>

        {/* Drawing Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div 
            className="w-full max-w-[512px] aspect-square bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 grid touch-none"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            onPointerUp={() => setIsDrawing(false)}
            onPointerLeave={() => setIsDrawing(false)}
          >
            {pixels.map((hex, i) => (
              <div
                key={i}
                onPointerDown={() => handlePointerDown(i)}
                onPointerEnter={() => drawPixel(i)}
                className="w-full h-full border-r border-b border-slate-200/50 dark:border-slate-700/50"
                style={{ backgroundColor: hex || "transparent" }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Hidden canvas for export */}
      <canvas ref={canvasRef} width={512} height={512} className="hidden" />
    </div>
  );
}
