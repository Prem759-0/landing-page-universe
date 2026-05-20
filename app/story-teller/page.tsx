"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type StoryNode = {
  id: string;
  text: string;
  choices: { text: string; nextNode: string }[];
};

const storyData: Record<string, StoryNode> = {
  start: {
    id: "start",
    text: "You awaken in the cryo-chamber of the starship 'Odyssey'. Warning lights blink red. The AI voice echoes: 'Hull breach detected in sector 4.'",
    choices: [
      { text: "Investigate sector 4", nextNode: "sector4" },
      { text: "Head to the escape pods", nextNode: "pods" }
    ]
  },
  sector4: {
    id: "sector4",
    text: "You grab a plasma torch and head to sector 4. A massive alien parasite is clinging to the hull, dissolving the metal.",
    choices: [
      { text: "Shoot it with the plasma torch", nextNode: "shoot" },
      { text: "Seal the blast doors and vent the sector", nextNode: "vent" }
    ]
  },
  pods: {
    id: "pods",
    text: "You rush to the escape pods. Pod 1 is damaged, but Pod 2 seems operational. However, launching means abandoning the ship entirely.",
    choices: [
      { text: "Launch Pod 2", nextNode: "launch" },
      { text: "Wait, I should try to save the ship", nextNode: "start" }
    ]
  },
  shoot: {
    id: "shoot",
    text: "You blast the creature. It shrieks and releases acidic sap, damaging your suit before floating into space. You saved the ship, but you're badly injured.",
    choices: [{ text: "Play Again", nextNode: "start" }]
  },
  vent: {
    id: "vent",
    text: "You trap the creature and open the airlock. It gets sucked into the vacuum of space. The ship is safe, and you are unharmed. A hero!",
    choices: [{ text: "Play Again", nextNode: "start" }]
  },
  launch: {
    id: "launch",
    text: "You eject safely into the void. As you drift, you watch the Odyssey explode silently in the distance. You are alive, but alone.",
    choices: [{ text: "Play Again", nextNode: "start" }]
  }
};

export default function StoryTeller() {
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const node = storyData[currentNodeId];

  return (
    <div className="flex-1 bg-slate-950 text-slate-200 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black tracking-widest uppercase text-purple-400">Space Explorer</h1>
          <p className="text-slate-500 mt-2">An interactive micro-story</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <p className="text-xl md:text-2xl leading-relaxed mb-10 text-slate-100">
                {node.text}
              </p>
              
              <div className="mt-auto flex flex-col gap-3">
                {node.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentNodeId(choice.nextNode)}
                    className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-purple-600 transition-colors border border-slate-700 hover:border-purple-500 group"
                  >
                    <span className="text-slate-400 group-hover:text-purple-200 mr-4 font-mono text-sm">
                      0{idx + 1}
                    </span>
                    <span className="font-medium text-white">{choice.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
