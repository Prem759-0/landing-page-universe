import { Component, Gamepad2, BookOpen, LayoutTemplate } from "lucide-react";

export const categories = [
  "All",
  "UI Components",
  "Games",
  "Story Teller",
  "Landing Pages",
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
    id: "reaction-timer",
    title: "Reaction Timer",
    description: "Test your reflexes in this lightning-fast mini-game.",
    category: "Games",
    icon: Gamepad2,
    href: "/reaction-timer",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
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
  {
    id: "saas-landing",
    title: "Nexus SaaS",
    description: "A premium, conversion-optimized landing page template.",
    category: "Landing Pages",
    icon: LayoutTemplate,
    href: "/saas-landing",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
];
