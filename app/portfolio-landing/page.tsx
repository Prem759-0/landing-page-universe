"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Twitter, Mail } from "lucide-react";

export default function PortfolioLanding() {
  return (
    <div className="flex-1 bg-[#0a0a0a] text-white selection:bg-zinc-800 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-20">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
              Alex <span className="text-zinc-500">Rivera</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-md leading-relaxed">
              Creative developer & frontend architect building digital experiences that feel human.
            </p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </motion.header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[240px]">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl p-8 border border-zinc-800/50 flex flex-col justify-between group hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-medium">Lumina AI</h3>
              <ArrowUpRight className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <p className="text-zinc-400">Designing the next generation of AI interfaces for creative professionals.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800/50 flex flex-col justify-center items-center text-center hover:bg-zinc-800/50 transition-colors"
          >
            <div className="text-4xl font-bold mb-2">5+</div>
            <div className="text-sm text-zinc-500 uppercase tracking-widest">Years Exp.</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800/50 flex flex-col justify-between group hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-medium">Fintech App</h3>
              <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <p className="text-zinc-500 text-sm">Mobile dashboard</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 bg-zinc-900 rounded-3xl p-8 border border-zinc-800/50 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            <h3 className="text-2xl font-medium mb-4 relative z-10">Selected Writing</h3>
            <ul className="space-y-4 relative z-10">
              <li className="flex justify-between text-zinc-400 hover:text-white cursor-pointer transition-colors border-b border-zinc-800 pb-2">
                <span>The Future of Micro-interactions</span>
                <span>2024</span>
              </li>
              <li className="flex justify-between text-zinc-400 hover:text-white cursor-pointer transition-colors">
                <span>Building with Tailwind & Framer</span>
                <span>2023</span>
              </li>
            </ul>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
