"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Maximize } from "lucide-react";
import { useTheme } from "next-themes";

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.size = Math.random() * 3 + 1;
    this.density = (Math.random() * 30) + 1;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouse: { x: number; y: number; radius: number }) {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

export default function ParticleSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [particlesCount, setParticlesCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const particleColor = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(15, 23, 42, 0.8)";

    const mouse = {
      x: -1000, // starting off-screen
      y: -1000,
      radius: 120
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const init = () => {
      particlesArray = [];
      // Calculate amount of particles based on screen size (prevent extreme lag)
      const numberOfParticles = (canvas.width * canvas.height) / 9000;
      setParticlesCount(Math.floor(numberOfParticles));
      
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y, particleColor));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw(ctx);
        particlesArray[i].update(mouse);
      }
      requestAnimationFrame(animate);
    };

    // Initial setup
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [theme]);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8">
      <div className="flex justify-between items-end mb-4 max-w-6xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-orange-500" /> Particle Canvas
          </h1>
          <p className="text-slate-500">Move your mouse over the canvas to repel the particles.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-500">
          <Maximize className="w-4 h-4" /> {particlesCount} Particles
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm cursor-crosshair">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
