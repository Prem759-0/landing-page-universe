"use client";

import { useState } from "react";
import { Loader, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const loaders = [
  {
    name: "Classic Spin",
    code: `<div className="w-8 h-8 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin"></div>`,
    component: () => <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-teal-500 rounded-full animate-spin"></div>
  },
  {
    name: "Ping Pulse",
    code: `<div className="w-8 h-8 bg-teal-500 rounded-full animate-ping opacity-75"></div>`,
    component: () => <div className="w-8 h-8 bg-teal-500 rounded-full animate-ping opacity-75"></div>
  },
  {
    name: "Bouncing Dots",
    code: `<div className="flex space-x-2">
  <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"></div>
  <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
  <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
</div>`,
    component: () => (
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
    )
  },
  {
    name: "Double Ring",
    code: `<div className="relative w-10 h-10">
  <div className="absolute inset-0 border-4 border-teal-200 rounded-full animate-pulse"></div>
  <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
</div>`,
    component: () => (
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-4 border-teal-200 dark:border-teal-900 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
];

export default function CSSLoaders() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Loader className="w-8 h-8 text-teal-500 animate-spin-slow" /> Tailwind CSS Loaders
        </h1>
        <p className="text-slate-500">Pure Tailwind CSS loading animations. Click to copy the JSX code.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loaders.map((loader, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col group">
            
            {/* Visual Preview */}
            <div className="h-40 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center border-b border-slate-100 dark:border-slate-800 relative">
              <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase">{loader.name}</span>
              <loader.component />
            </div>

            {/* Code & Copy */}
            <div className="p-4 relative bg-slate-900">
              <pre className="text-xs text-slate-300 font-mono overflow-x-auto pb-2 custom-scrollbar">
                {loader.code}
              </pre>
              <button 
                onClick={() => copyToClipboard(loader.code, idx)}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
              >
                {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
