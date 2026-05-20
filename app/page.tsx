"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { experiences, categories } from "@/data/experiences";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

export default function PortalHome() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites, isHydrated] = useLocalStorage<string[]>("universe-favorites", []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fid) => fid !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch = exp.title.toLowerCase().includes(search.toLowerCase()) || 
                          exp.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || exp.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          Explore the <span className="text-indigo-500">Universe</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
        >
          A playground of interactive mini-apps, landing pages, and UI experiments. Select an experience below to dive in.
        </motion.p>
      </div>

      {/* Controls: Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search experiences..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
          />
        </div>
        
        <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto gap-2 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeCategory === cat 
                  ? "bg-indigo-500 text-white" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredExperiences.map((exp) => (
            <motion.div
              key={exp.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={exp.href} className="block h-full">
                <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-full transition-all hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500/30 cursor-pointer overflow-hidden">
                  
                  {/* Favorite Button */}
                  {isHydrated && (
                    <button
                      onClick={(e) => toggleFavorite(e, exp.id)}
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 z-10 transition-colors"
                    >
                      <Star 
                        className={cn("w-5 h-5 transition-colors", favorites.includes(exp.id) ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600")} 
                      />
                    </button>
                  )}

                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", exp.color)}>
                    <exp.icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-500 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                    {exp.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {exp.category}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredExperiences.length === 0 && (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">
          No experiences found matching your search.
        </div>
      )}
    </div>
  );
}
