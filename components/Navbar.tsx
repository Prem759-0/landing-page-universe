"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, ArrowLeft, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isHome = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHome ? (
            <Link 
              href="/"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Portal</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="p-1.5 bg-indigo-500 text-white rounded-lg">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              Universe
            </div>
          )}
        </div>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </nav>
  );
}
