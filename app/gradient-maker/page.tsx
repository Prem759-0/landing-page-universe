"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCw, Palette, Check } from "lucide-react";

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function GradientMaker() {
  const [color1, setColor1] = useState("#4F46E5");
  const [color2, setColor2] = useState("#EC4899");
  const [angle, setAngle] = useState(45);
  const [copied, setCopied] = useState(false);

  const gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  const cssCode = `background: ${gradientString};`;

  const randomize = () => {
    setColor1(generateRandomColor());
    setColor2(generateRandomColor());
    setAngle(Math.floor(Math.random() * 360));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-12 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Palette className="w-8 h-8 text-cyan-500" /> CSS Gradient Generator
        </h1>
        <p className="text-slate-500">Create, tweak, and copy beautiful background gradients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Area */}
        <motion.div 
          className="aspect-video lg:aspect-square rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 w-full"
          style={{ background: gradientString }}
          layout
        />

        {/* Controls Area */}
        <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Colors</h3>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Color 1</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={color1} 
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={color1.toUpperCase()}
                    onChange={(e) => setColor1(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-lg text-sm font-mono border border-slate-200 dark:border-slate-800 uppercase"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Color 2</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={color2} 
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={color2.toUpperCase()}
                    onChange={(e) => setColor2(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-lg text-sm font-mono border border-slate-200 dark:border-slate-800 uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Angle</h3>
              <span className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{angle}°</span>
            </div>
            <input 
              type="range" 
              min="0" max="360" 
              value={angle} 
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <button 
              onClick={randomize}
              className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Randomize
            </button>
            
            <div className="relative group">
              <pre className="p-4 bg-slate-950 text-slate-300 rounded-xl text-sm font-mono overflow-x-auto">
                {cssCode}
              </pre>
              <button 
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
