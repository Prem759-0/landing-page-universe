"use client";

import { useState } from "react";
import { FileCode, Plus, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

type Note = { id: string; title: string; content: string; date: number };

// Extremely basic markdown parser for the live preview
const parseMarkdown = (text: string) => {
  let html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-extrabold mt-6 mb-4">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-slate-300 pl-4 italic my-2">$1</blockquote>')
    .replace(/\n$/gim, '<br />');
  
  return { __html: html };
};

export default function MarkdownBrain() {
  const [notes, setNotes, isHydrated] = useLocalStorage<Note[]>("universe-notes", [
    { id: "1", title: "Welcome to Brain", content: "# Hello World\n\nThis is a **local-first** markdown editor.\n\n### Features:\n- Live Preview\n- Auto-saves to LocalStorage\n- Fast & Minimal", date: Date.now() }
  ]);
  const [activeNoteId, setActiveNoteId] = useState<string>("1");

  if (!isHydrated) return null;

  const activeNote = notes.find(n => n.id === activeNoteId);

  const addNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substring(7),
      title: "Untitled Note",
      content: "",
      date: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated.length > 0 ? updated[0].id : "");
    }
  };

  const updateContent = (content: string) => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content, date: Date.now() } : n));
  };

  const updateTitle = (title: string) => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, title, date: Date.now() } : n));
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-50 dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
            <FileCode className="w-5 h-5 text-sky-500" /> Brain
          </div>
          <button onClick={addNote} className="p-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-md transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {notes.map(note => (
            <div 
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={cn(
                "p-3 rounded-xl cursor-pointer transition-colors group flex justify-between items-center",
                activeNoteId === note.id ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300" : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              )}
            >
              <div className="truncate text-sm font-medium pr-2">{note.title}</div>
              <button 
                onClick={(e) => deleteNote(note.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity shrink-0"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor & Preview Area */}
      {activeNote ? (
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          {/* Raw Editor */}
          <div className="flex-1 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-[#1e293b]">
            <input 
              type="text" 
              value={activeNote.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-transparent outline-none font-bold text-lg"
              placeholder="Note Title"
            />
            <textarea 
              value={activeNote.content}
              onChange={(e) => updateContent(e.target.value)}
              className="flex-1 p-6 bg-transparent outline-none resize-none font-mono text-sm text-slate-600 dark:text-slate-300 custom-scrollbar leading-relaxed"
              placeholder="Start typing markdown..."
            />
          </div>
          {/* Live Preview */}
          <div className="flex-1 bg-slate-50 dark:bg-[#0f172a] p-8 overflow-y-auto custom-scrollbar">
            <div 
              className="max-w-prose text-slate-800 dark:text-slate-200 space-y-2"
              dangerouslySetInnerHTML={parseMarkdown(activeNote.content)}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-[#0f172a]">
          Select or create a note to begin.
        </div>
      )}
    </div>
  );
}
