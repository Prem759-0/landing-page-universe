"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UIPlayground() {
  const [isLoading, setIsLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [activeTab, setActiveTab] = useState("buttons");

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4">UI Playground</h1>
        <p className="text-slate-500 text-lg">A collection of polished, reusable interface components.</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-px">
        {["buttons", "inputs", "cards"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 font-medium text-sm capitalize relative transition-colors",
              activeTab === tab ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm">
        {activeTab === "buttons" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Primary Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all active:scale-95 shadow-sm shadow-indigo-200 dark:shadow-none">
                  Default Button
                </button>
                <button 
                  onClick={simulateLoading}
                  disabled={isLoading}
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium transition-all active:scale-95 flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Loading State"}
                </button>
                <button className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium transition-all active:scale-95 shadow-sm">
                  Destructive
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Secondary & Ghost</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-all active:scale-95">
                  Secondary
                </button>
                <button className="px-6 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-all active:scale-95">
                  Ghost Button
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "inputs" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-semibold">Push Notifications</p>
                <p className="text-sm text-slate-500">Receive alerts on activity.</p>
              </div>
              <button 
                onClick={() => setToggle(!toggle)}
                className={cn("w-12 h-6 rounded-full transition-colors relative", toggle ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700")}
              >
                <motion.div 
                  layout 
                  className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"
                  animate={{ x: toggle ? 24 : 0 }}
                />
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "cards" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold mb-1">New Message Received</h4>
                <p className="text-sm text-slate-500">You have a new message from Sarah regarding the project update.</p>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-3">View Message</button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <h4 className="font-bold text-lg mb-2">Pro Plan</h4>
              <p className="text-indigo-100 text-sm mb-6">Unlock all premium features and components for your team.</p>
              <ul className="space-y-2 text-sm mb-6">
                {['Unlimited Projects', 'Custom Domains', '24/7 Support'].map(feature => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-200" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 bg-white text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
                Upgrade Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
