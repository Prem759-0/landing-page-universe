"use client";

import { useState } from "react";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";

type Status = "todo" | "in-progress" | "done";

type Task = {
  id: string;
  title: string;
  status: Status;
};

export default function KanbanBoard() {
  const [tasks, setTasks, isHydrated] = useLocalStorage<Task[]>("universe-kanban", [
    { id: "1", title: "Design homepage architecture", status: "done" },
    { id: "2", title: "Build advanced drag-and-drop", status: "in-progress" },
    { id: "3", title: "Write unit tests for UI", status: "todo" },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTo, setAddingTo] = useState<Status | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    // Required for Firefox
    e.dataTransfer.setData("text/plain", id); 
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    if (!draggedTaskId) return;
    setTasks(prev => prev.map(t => t.id === draggedTaskId ? { ...t, status } : t));
    setDraggedTaskId(null);
  };

  const addTask = (status: Status) => {
    if (!newTaskTitle.trim()) {
      setAddingTo(null);
      return;
    }
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title: newTaskTitle.trim(),
      status
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle("");
    setAddingTo(null);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const columns: { id: Status; title: string; color: string }[] = [
    { id: "todo", title: "To Do", color: "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300" },
    { id: "in-progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400" },
    { id: "done", title: "Done", color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400" }
  ];

  if (!isHydrated) return null; // Avoid hydration mismatch on initial render

  return (
    <div className="flex-1 bg-[#fbfbfb] dark:bg-[#0f0f11] p-4 md:p-8 font-sans h-full overflow-hidden flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kanban Flow</h1>
        <p className="text-slate-500">Manage your tasks. Drag and drop to update status. Auto-saved locally.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px]">
        {columns.map((col) => (
          <div 
            key={col.id}
            className="flex-1 flex flex-col bg-slate-100 dark:bg-[#18181b] rounded-2xl p-4 border border-slate-200 dark:border-slate-800/60 transition-colors"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${col.color}`}>
                {col.title} • {tasks.filter(t => t.status === col.id).length}
              </span>
              <button 
                onClick={() => setAddingTo(col.id)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                <Plus className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pb-4 custom-scrollbar">
              <AnimatePresence>
                {tasks.filter(t => t.status === col.id).map(task => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={task.id}
                    draggable
                    onDragStart={(e: any) => handleDragStart(e, task.id)}
                    className="group bg-white dark:bg-[#27272a] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing flex items-start gap-3"
                  >
                    <GripVertical className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5 cursor-grab" />
                    <p className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">{task.title}</p>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {addingTo === col.id && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#27272a] p-3 rounded-xl border border-blue-500 shadow-sm"
                >
                  <textarea
                    autoFocus
                    placeholder="Enter task title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        addTask(col.id);
                      }
                      if (e.key === "Escape") {
                        setAddingTo(null);
                        setNewTaskTitle("");
                      }
                    }}
                    className="w-full bg-transparent text-sm resize-none outline-none text-slate-700 dark:text-slate-200"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button 
                      onClick={() => { setAddingTo(null); setNewTaskTitle(""); }}
                      className="text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => addTask(col.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                    >
                      Add Task
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
