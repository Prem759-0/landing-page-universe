"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingTemplate() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and side projects.",
      priceMonthly: 15,
      priceAnnual: 12,
      features: ["1 Workspace", "Basic Analytics", "24-hour Support Response", "Community Access"],
      highlight: false,
    },
    {
      name: "Pro",
      description: "For professionals building at scale.",
      priceMonthly: 49,
      priceAnnual: 39,
      features: ["Unlimited Workspaces", "Advanced Analytics", "1-hour Support Response", "Custom Domains", "Team Collaboration"],
      highlight: true,
    },
    {
      name: "Enterprise",
      description: "Advanced security and custom support.",
      priceMonthly: 99,
      priceAnnual: 89,
      features: ["Everything in Pro", "SSO Authentication", "Dedicated Account Manager", "Uptime SLA", "Custom Contracts"],
      highlight: false,
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-500 mb-8">
            Choose the perfect plan for your needs. Always know what you'll pay.
          </p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={cn("text-sm font-medium", !isAnnual ? "text-slate-900 dark:text-white" : "text-slate-500")}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-800 p-1 relative transition-colors flex items-center"
            >
              <motion.div 
                className="w-5 h-5 bg-green-500 rounded-full shadow-sm"
                animate={{ x: isAnnual ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={cn("text-sm font-medium flex items-center gap-2", isAnnual ? "text-slate-900 dark:text-white" : "text-slate-500")}>
              Annually <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={cn(
                "relative p-8 rounded-3xl border transition-all duration-200",
                plan.highlight 
                  ? "bg-slate-900 dark:bg-slate-900 border-slate-900 text-white shadow-2xl scale-100 md:scale-105 z-10" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={cn("text-sm mb-6", plan.highlight ? "text-slate-300" : "text-slate-500")}>{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold">${isAnnual ? plan.priceAnnual : plan.priceMonthly}</span>
                <span className={cn("text-sm", plan.highlight ? "text-slate-300" : "text-slate-500")}>/month</span>
              </div>
              
              <button 
                className={cn(
                  "w-full py-3 px-6 rounded-xl font-bold transition-all mb-8",
                  plan.highlight 
                    ? "bg-green-500 hover:bg-green-600 text-white" 
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                Get Started
              </button>

              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-wider">What's included</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <Check className={cn("w-5 h-5 shrink-0", plan.highlight ? "text-green-400" : "text-green-500")} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
