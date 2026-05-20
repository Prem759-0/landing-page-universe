import { 
  Component, Gamepad2, BookOpen, LayoutTemplate, 
  Brain, UserCircle, MousePointerClick, Palette 
} from "lucide-react";

export const categories = [
  "All",
  "UI Components",
  "Games",
  "Story Teller",
  "Landing Pages",
  "Visual Experiments",
  "Kids Friendly"
];

export const experiences = [
  {
    id: "ui-playground",
    title: "UI Playground",
    description: "Interactive components, buttons, inputs, and cards.",
    category: "UI Components",
    icon: Component,
    href: "/ui-playground",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "saas-landing",
    title: "Nexus SaaS",
    description: "A premium, conversion-optimized landing page template.",
    category: "Landing Pages",
    icon: LayoutTemplate,
    href: "/saas-landing",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    id: "portfolio-landing",
    title: "Minimal Portfolio",
    description: "A sleek, bento-box style portfolio for creatives.",
    category: "Landing Pages",
    icon: UserCircle,
    href: "/portfolio-landing",
    color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400",
  },
  {
    id: "reaction-timer",
    title: "Reaction Timer",
    description: "Test your reflexes in this lightning-fast mini-game.",
    category: "Games",
    icon: Gamepad2,
    href: "/reaction-timer",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    id: "memory-game",
    title: "Emoji Memory",
    description: "A classic card-matching memory game with a polished UI.",
    category: "Kids Friendly",
    icon: Brain,
    href: "/memory-game",
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  },
  {
    id: "tap-counter",
    title: "10-Second Tap Rush",
    description: "How many times can you click in 10 seconds? Break the high score.",
    category: "Games",
    icon: MousePointerClick,
    href: "/tap-counter",
    color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    id: "gradient-maker",
    title: "Mesh Gradients",
    description: "Generate and copy beautiful CSS background gradients.",
    category: "Visual Experiments",
    icon: Palette,
    href: "/gradient-maker",
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  {
    id: "story-teller",
    title: "Space Explorer",
    description: "An interactive choose-your-own-adventure story.",
    category: "Story Teller",
    icon: BookOpen,
    href: "/story-teller",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
];
