import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  radius: number;
}

const COLORS = [
  "#ff4757",
  "#ffa502",
  "#2ed573",
  "#1e90ff",
  "#ff6b81",
  "#eccc68",
  "#70a1ff",
  "#ff6348",
  "#a29bfe",
  "#fd79a8",
];

function makeParticle(cx: number, cy: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 2 + Math.random() * 6;
  const life = 60 + Math.random() * 60;

  return {
    x: cx,
    y: cy,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 3,
    life,
    maxLife: life,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    radius: 2 + Math.random() * 4,
  };
}

interface FireworksProps {
  active: boolean;
  /** duration in ms before auto-stopping */
  durationMs?: number;
}

export function Fireworks({ active, durationMs = 3000 }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const burstRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);

      if (burstRef.current) {
        clearInterval(burstRef.current);
      }

      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    window.addEventListener("resize", resize);

    const burst = () => {
      const cx = 100 + Math.random() * (canvas.width - 200);
      const cy = 80 + Math.random() * (canvas.height * 0.5);

      for (let i = 0; i < 60; i++) {
        particlesRef.current.push(makeParticle(cx, cy));
      }
    };

    // Initial bursts
    burst();
    burst();

    burstRef.current = setInterval(burst, 400);

    setTimeout(() => {
      if (burstRef.current) {
        clearInterval(burstRef.current);
      }
    }, durationMs - 400);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      for (const p of particlesRef.current) {
        // Movement
        p.x += p.vx;
        p.y += p.vy;

        // Physics
        p.vy += 0.18;
        p.vx *= 0.98;

        // Safe alpha
        const alpha = Math.max(0, p.life / p.maxLife);

        // Prevent negative radius crash
        const radius = Math.max(0.01, p.radius * alpha);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);

        ctx.fill();

        // Decrease life AFTER drawing
        p.life--;
      }

      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);

      if (burstRef.current) {
        clearInterval(burstRef.current);
      }

      window.removeEventListener("resize", resize);
    };
  }, [active, durationMs]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
