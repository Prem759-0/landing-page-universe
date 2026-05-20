"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Network, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Node = { id: string; x: number; y: number; label: string };
type Edge = { id: string; from: string; to: string };

export default function FlowBuilder() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", x: 100, y: 150, label: "Trigger: Webhook" },
    { id: "2", x: 400, y: 150, label: "Action: Send Email" }
  ]);
  const [edges, setEdges] = useState<Edge[]>([{ id: "e1", from: "1", to: "2" }]);
  
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (draggingNode) {
      setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x: x - 75, y: y - 25 } : n));
    }
  };

  const handlePointerUp = () => {
    setDraggingNode(null);
    // If we dropped the connection line in empty space, cancel it
    if (connectingFrom) {
      setConnectingFrom(null);
    }
  };

  const addNode = () => {
    const id = Math.random().toString(36).substring(7);
    setNodes([...nodes, { id, x: 200, y: 200, label: "New Step" }]);
  };

  const deleteNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes(nodes.filter(n => n.id !== id));
    setEdges(edges.filter(edge => edge.from !== id && edge.to !== id));
  };

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectingFrom) {
      if (connectingFrom !== id) {
        // Prevent duplicate edges
        if (!edges.find(e => e.from === connectingFrom && e.to === id)) {
          setEdges([...edges, { id: Math.random().toString(36), from: connectingFrom, to: id }]);
        }
      }
      setConnectingFrom(null);
    } else {
      setConnectingFrom(id);
    }
  };

  const renderBezier = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1) * 0.5;
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Network className="w-8 h-8 text-purple-500" /> Flow Builder
          </h1>
          <p className="text-slate-500 text-sm">Click a node, then click another to connect. Drag to move.</p>
        </div>
        <button 
          onClick={addNode}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Node
        </button>
      </div>

      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="flex-1 bg-slate-50 dark:bg-[#0f172a] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 relative overflow-hidden"
      >
        {/* SVG Edges Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            return (
              <path 
                key={edge.id}
                d={renderBezier(fromNode.x + 150, fromNode.y + 25, toNode.x, toNode.y + 25)}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-purple-400 dark:text-purple-600"
              />
            );
          })}
          {connectingFrom && (
            <path 
              d={renderBezier(
                (nodes.find(n => n.id === connectingFrom)?.x || 0) + 150, 
                (nodes.find(n => n.id === connectingFrom)?.y || 0) + 25, 
                mousePos.x, mousePos.y
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="text-purple-400 dark:text-purple-600 opacity-50"
            />
          )}
        </svg>

        {/* DOM Nodes Layer */}
        {nodes.map(node => (
          <div
            key={node.id}
            onPointerDown={(e) => { e.stopPropagation(); setDraggingNode(node.id); }}
            onClick={(e) => handleNodeClick(node.id, e)}
            style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
            className={cn(
              "absolute top-0 left-0 w-[150px] h-[50px] bg-white dark:bg-slate-900 border-2 rounded-xl shadow-lg flex items-center justify-between px-3 cursor-pointer select-none transition-colors",
              connectingFrom === node.id ? "border-purple-500 shadow-purple-500/20" : "border-slate-200 dark:border-slate-700 hover:border-purple-300",
              draggingNode === node.id ? "z-50 scale-105" : "z-10"
            )}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{node.label}</span>
            <button 
              onClick={(e) => deleteNode(node.id, e)}
              className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            {/* Connection dots */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 rounded-full" />
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-purple-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
