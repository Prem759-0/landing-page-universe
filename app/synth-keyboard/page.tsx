"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Music, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Frequencies for one octave (C4 to B4) plus black keys
const NOTES = [
  { note: "C", key: "A", freq: 261.63, isBlack: false },
  { note: "C#", key: "W", freq: 277.18, isBlack: true },
  { note: "D", key: "S", freq: 293.66, isBlack: false },
  { note: "D#", key: "E", freq: 311.13, isBlack: true },
  { note: "E", key: "D", freq: 329.63, isBlack: false },
  { note: "F", key: "F", freq: 349.23, isBlack: false },
  { note: "F#", key: "T", freq: 369.99, isBlack: true },
  { note: "G", key: "G", freq: 392.00, isBlack: false },
  { note: "G#", key: "Y", freq: 415.30, isBlack: true },
  { note: "A", key: "H", freq: 440.00, isBlack: false },
  { note: "A#", key: "U", freq: 466.16, isBlack: true },
  { note: "B", key: "J", freq: 493.88, isBlack: false },
  { note: "C5", key: "K", freq: 523.25, isBlack: false },
];

type Waveform = "sine" | "square" | "sawtooth" | "triangle";

export default function SynthKeyboard() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [waveform, setWaveform] = useState<Waveform>("sawtooth");
  const [isReady, setIsReady] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, { osc: OscillatorNode, gain: GainNode }>>(new Map());

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      setIsReady(true);
    }
  }, []);

  const playNote = useCallback((key: string, freq: number) => {
    if (!audioCtxRef.current) return;
    if (oscillatorsRef.current.has(key)) return;

    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveform;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Attack & Release envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    oscillatorsRef.current.set(key, { osc, gain });
    setActiveKeys(prev => new Set(prev).add(key));
  }, [waveform]);

  const stopNote = useCallback((key: string) => {
    const active = oscillatorsRef.current.get(key);
    if (active && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      active.gain.gain.setValueAtTime(active.gain.gain.value, ctx.currentTime);
      active.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      active.osc.stop(ctx.currentTime + 0.3);
      oscillatorsRef.current.delete(key);
    }
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toUpperCase();
      const note = NOTES.find(n => n.key === key);
      if (note) playNote(key, note.freq);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      stopNote(key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playNote, stopNote]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-950 min-h-screen">
      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        
        {/* Synth Control Panel */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center text-fuchsia-500">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Web Synth JS</h1>
              <p className="text-zinc-400 text-xs uppercase tracking-widest">Polyphonic Audio Engine</p>
            </div>
          </div>

          {!isReady ? (
            <button 
              onClick={initAudio}
              className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-fuchsia-900/50 animate-pulse"
            >
              Initialize Audio
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                {(["sine", "square", "sawtooth", "triangle"] as Waveform[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWaveform(w)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors",
                      waveform === w ? "bg-fuchsia-600 text-white" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <Volume2 className="w-5 h-5 text-zinc-500" />
            </div>
          )}
        </div>

        {/* Piano Keys */}
        <div className="relative h-64 md:h-80 flex justify-center isolate pointer-events-auto">
          {/* Render White Keys First */}
          {NOTES.filter(n => !n.isBlack).map((n) => (
            <div
              key={n.key}
              onMouseDown={() => { initAudio(); playNote(n.key, n.freq); }}
              onMouseUp={() => stopNote(n.key)}
              onMouseLeave={() => stopNote(n.key)}
              className={cn(
                "w-12 md:w-16 h-full border border-zinc-300 rounded-b-xl flex items-end justify-center pb-4 transition-all mx-[1px] select-none cursor-pointer",
                activeKeys.has(n.key) ? "bg-zinc-200 shadow-inner translate-y-1" : "bg-white hover:bg-zinc-100 shadow-sm"
              )}
            >
              <div className="flex flex-col items-center">
                <span className="text-zinc-400 text-xs mb-1 font-mono">{n.note}</span>
                <span className="w-6 h-6 border border-zinc-200 rounded text-zinc-800 text-xs font-bold flex items-center justify-center">{n.key}</span>
              </div>
            </div>
          ))}

          {/* Render Black Keys Absolutely positioned */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-center pointer-events-none">
            <div className="relative w-[360px] md:w-[480px] h-[60%] flex">
              {NOTES.map((n, i) => {
                if (!n.isBlack) return null;
                // Complex manual spacing based on array index to overlay correctly on white keys.
                // Simplified for this layout by checking standard piano layout positions
                let leftOffset = "0%";
                if (n.note === "C#") leftOffset = "9%";
                if (n.note === "D#") leftOffset = "23.5%";
                if (n.note === "F#") leftOffset = "52%";
                if (n.note === "G#") leftOffset = "66%";
                if (n.note === "A#") leftOffset = "80.5%";

                return (
                  <div
                    key={n.key}
                    onMouseDown={() => { initAudio(); playNote(n.key, n.freq); }}
                    onMouseUp={() => stopNote(n.key)}
                    onMouseLeave={() => stopNote(n.key)}
                    style={{ left: leftOffset }}
                    className={cn(
                      "absolute top-0 w-8 md:w-10 h-full rounded-b-xl flex items-end justify-center pb-4 transition-all select-none cursor-pointer z-10 pointer-events-auto shadow-2xl",
                      activeKeys.has(n.key) ? "bg-zinc-800 translate-y-1" : "bg-zinc-900 border border-zinc-950"
                    )}
                  >
                    <span className="w-5 h-5 border border-zinc-700 bg-zinc-800 rounded text-white text-[10px] font-bold flex items-center justify-center">{n.key}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
