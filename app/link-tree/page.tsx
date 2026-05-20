"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Instagram, Linkedin, Globe, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { title: "Personal Website", url: "#", icon: Globe },
  { title: "Read my latest blog post", url: "#", icon: Globe, highlight: true },
  { title: "GitHub Portfolio", url: "#", icon: Github },
  { title: "Connect on LinkedIn", url: "#", icon: Linkedin },
];

export default function LinkTree() {
  return (
    <div className="flex-1 min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex justify-center py-20 px-4 relative overflow-hidden">
      
      {/* Decorative blurred blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-lime-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="max-w-md w-full relative z-10 flex flex-col items-center text-center">
        
        {/* Avatar */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-28 h-28 rounded-full bg-gradient-to-tr from-lime-400 to-emerald-600 p-1 mb-6 shadow-xl"
        >
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center font-bold text-3xl text-slate-800 dark:text-white">
            SJ
          </div>
        </motion.div>

        {/* Bio */}
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-black text-slate-900 dark:text-white mb-2"
        >
          Sam Johnson
        </motion.h1>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-400 mb-2 font-medium"
        >
          Frontend Engineer & Digital Creator
        </motion.p>
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-1 text-sm text-slate-500 dark:text-slate-500 mb-8"
        >
          <MapPin className="w-4 h-4" /> San Francisco, CA
        </motion.div>

        {/* Links */}
        <div className="w-full space-y-4 mb-10">
          {LINKS.map((link, i) => (
            <motion.a
              key={i}
              href={link.url}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full p-4 rounded-2xl border font-bold flex items-center justify-between group transition-all",
                link.highlight 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg shadow-slate-900/20 dark:shadow-white/10" 
                  : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <div className="flex items-center gap-3">
                <link.icon className="w-5 h-5" />
                <span>{link.title}</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Social Icons Bottom Row */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-6"
        >
          {[Twitter, Instagram, Mail].map((Icon, i) => (
            <a key={i} href="#" className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:scale-110 transition-all shadow-sm">
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
