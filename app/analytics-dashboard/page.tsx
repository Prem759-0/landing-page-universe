"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users, ArrowUpRight, ArrowDownRight, Activity, DollarSign, Search, Bell } from "lucide-react";

const DATA = [40, 30, 60, 50, 80, 70, 95, 85, 110, 90, 120, 105];

export default function AnalyticsDashboard() {
  const maxData = Math.max(...DATA);

  return (
    <div className="flex-1 bg-[#09090b] text-zinc-100 font-sans min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-zinc-800/60 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5">
              <Search className="w-4 h-4 text-zinc-500 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-48 text-zinc-300" />
            </div>
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 cursor-pointer" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Revenue", value: "$45,231.89", trend: "+20.1%", icon: DollarSign, pos: true },
            { label: "Active Users", value: "2,350", trend: "+15.2%", icon: Users, pos: true },
            { label: "Bounce Rate", value: "24.5%", trend: "-4.3%", icon: Activity, pos: false },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-3xl backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-zinc-800/50 rounded-xl text-zinc-400">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.pos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.trend}
                  {stat.pos ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
              </div>
              <h3 className="text-zinc-500 font-medium text-sm mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-3xl backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold mb-6">Revenue Overview</h3>
            <div className="h-64 flex items-end gap-2 relative">
              {/* Y Axis lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map(line => (
                  <div key={line} className="w-full border-b border-zinc-800/50" />
                ))}
              </div>
              
              {/* Bars */}
              {DATA.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end items-center group relative z-10 h-full pb-0.5">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / maxData) * 100}%` }}
                    transition={{ duration: 1, type: "spring", bounce: 0.2 }}
                    className="w-full max-w-[40px] bg-blue-600 rounded-t-sm group-hover:bg-blue-500 transition-colors relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      ${val}k
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-medium text-zinc-500">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <span key={m} className="flex-1 text-center">{m}</span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-3xl backdrop-blur-sm flex flex-col"
          >
            <h3 className="text-lg font-bold mb-6">Recent Sales</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {[
                { name: "Olivia Martin", email: "olivia.m@email.com", amount: "+$1,999.00" },
                { name: "Jackson Lee", email: "jackson.l@email.com", amount: "+$39.00" },
                { name: "Isabella Nguyen", email: "isa.n@email.com", amount: "+$299.00" },
                { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
                { name: "Sofia Davis", email: "sofia.d@email.com", amount: "+$39.00" },
              ].map((sale, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-800/50 transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold">
                      {sale.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{sale.name}</p>
                      <p className="text-xs text-zinc-500">{sale.email}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-emerald-400">{sale.amount}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
