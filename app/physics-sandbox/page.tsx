"use client";

import { useEffect, useRef } from "react";
import { Orbit, RefreshCw } from "lucide-react";

class Ball {
  x: number; y: number; vx: number; vy: number; radius: number; color: string;
  isDragging: boolean;
  
  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x; this.y = y; this.vx = (Math.random() - 0.5) * 10; this.vy = 0;
    this.radius = radius; this.color = color;
    this.isDragging = false;
  }

  update(width: number, height: number, gravity: number, friction: number) {
    if (!this.isDragging) {
      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;

      // Floor collision
      if (this.y + this.radius > height) {
        this.y = height - this.radius;
        this.vy *= -friction;
        this.vx *= 0.99; // Ground friction
      }
      // Wall collisions
      if (this.x + this.radius > width) {
        this.x = width - this.radius;
        this.vx *= -friction;
      } else if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.vx *= -friction;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export default function PhysicsSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationRef = useRef<number>();
  
  const mouse = useRef({ x: 0, y: 0, isDown: false, lastX: 0, lastY: 0, dragIndex: -1 });

  const initPhysics = () => {
    ballsRef.current = [];
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
    if (canvasRef.current) {
      const w = canvasRef.current.width;
      for(let i = 0; i < 15; i++) {
        ballsRef.current.push(new Ball(Math.random() * (w - 60) + 30, Math.random() * 200 + 50, Math.random() * 15 + 15, colors[i % colors.length]));
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    initPhysics();

    const gravity = 0.5;
    const friction = 0.8;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const balls = ballsRef.current;
      const m = mouse.current;

      // Handle drag physics
      if (m.isDown && m.dragIndex !== -1) {
        const ball = balls[m.dragIndex];
        ball.x = m.x;
        ball.y = m.y;
        ball.vx = m.x - m.lastX;
        ball.vy = m.y - m.lastY;
      }

      m.lastX = m.x;
      m.lastY = m.y;

      for (let ball of balls) {
        ball.update(canvas.width, canvas.height, gravity, friction);
        ball.draw(ctx);
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Mouse / Touch Event Handlers
  const getPos = (e: any) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if(!rect) return { x: 0, y: 0 };
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handlePointerDown = (e: any) => {
    const pos = getPos(e);
    mouse.current.x = pos.x;
    mouse.current.y = pos.y;
    mouse.current.lastX = pos.x;
    mouse.current.lastY = pos.y;
    mouse.current.isDown = true;

    // Check intersection
    for (let i = ballsRef.current.length - 1; i >= 0; i--) {
      const b = ballsRef.current[i];
      const dist = Math.hypot(b.x - pos.x, b.y - pos.y);
      if (dist < b.radius) {
        b.isDragging = true;
        mouse.current.dragIndex = i;
        break;
      }
    }
  };

  const handlePointerMove = (e: any) => {
    if (!mouse.current.isDown) return;
    const pos = getPos(e);
    mouse.current.x = pos.x;
    mouse.current.y = pos.y;
  };

  const handlePointerUp = () => {
    mouse.current.isDown = false;
    if (mouse.current.dragIndex !== -1) {
      ballsRef.current[mouse.current.dragIndex].isDragging = false;
      mouse.current.dragIndex = -1;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Orbit className="w-8 h-8 text-rose-500" /> Rigid Body Physics
          </h1>
          <p className="text-slate-500">Click and drag objects to throw them around.</p>
        </div>
        <button 
          onClick={initPhysics}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="flex-1 w-full bg-slate-100 dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="block w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />
      </div>
    </div>
  );
}
