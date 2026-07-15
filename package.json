import { useEffect, useRef, type CSSProperties } from 'react';
import './SplashCursor.css';

type SplashCursorProps = {
  COLOR?: string;
  className?: string;
  style?: CSSProperties;
  SPLAT_RADIUS?: number;
  DENSITY_DISSIPATION?: number;
};

type Splat = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
};

function SplashCursor({
  COLOR = '#b8ff4d',
  className = '',
  style,
  SPLAT_RADIUS = 0.2,
  DENSITY_DISSIPATION = 3.5,
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const splatsRef = useRef<Splat[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, px: 0, py: 0, active: false });
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const parent = canvas.parentElement;
    const resize = () => {
      const rect = parent?.getBoundingClientRect() ?? { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const addSplat = (x: number, y: number, force = 1) => {
      const rect = canvas.getBoundingClientRect();
      const base = Math.max(rect.width, rect.height) * SPLAT_RADIUS;
      for (let i = 0; i < 4; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (8 + Math.random() * 32) * force;
        splatsRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: base * (0.18 + Math.random() * 0.24),
          life: 0,
          maxLife: 1.25 + Math.random() * 1.2,
        });
      }
      splatsRef.current = splatsRef.current.slice(-90);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const pointer = pointerRef.current;
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distance = Math.hypot(dx, dy);
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
      if (distance > 6) addSplat(x, y, Math.min(distance / 34, 2.2));
    };

    const handlePointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      addSplat(event.clientX - rect.left, event.clientY - rect.top, 2.4);
    };

    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const dt = Math.min((now - lastRef.current) / 1000, 0.033);
      lastRef.current = now;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(Math.min(window.devicePixelRatio || 1, 2), 0, 0, Math.min(window.devicePixelRatio || 1, 2), 0, 0);
      ctx.globalCompositeOperation = 'lighter';

      const next: Splat[] = [];
      for (const splat of splatsRef.current) {
        splat.life += dt * (DENSITY_DISSIPATION * 0.42);
        if (splat.life >= splat.maxLife) continue;

        const t = splat.life / splat.maxLife;
        const alpha = (1 - t) * 0.22;
        splat.x += splat.vx * dt;
        splat.y += splat.vy * dt;
        splat.vx *= 0.975;
        splat.vy *= 0.975;
        const radius = splat.radius * (1 + t * 2.4);

        const gradient = ctx.createRadialGradient(splat.x, splat.y, 0, splat.x, splat.y, radius);
        gradient.addColorStop(0, `${COLOR}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.36, `${COLOR}${Math.round(alpha * 120).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${COLOR}00`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(splat.x, splat.y, radius, 0, Math.PI * 2);
        ctx.fill();
        next.push(splat);
      }

      splatsRef.current = next;

      const vignette = ctx.createRadialGradient(rect.width * 0.5, rect.height * 0.48, rect.width * 0.08, rect.width * 0.5, rect.height * 0.52, rect.width * 0.66);
      vignette.addColorStop(0, 'rgba(184, 255, 77, 0.035)');
      vignette.addColorStop(1, 'rgba(184, 255, 77, 0)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, rect.width, rect.height);

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    addSplat(window.innerWidth * 0.48, window.innerHeight * 0.36, 1.5);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [COLOR, DENSITY_DISSIPATION, SPLAT_RADIUS]);

  return (
    <div className={`splash-cursor ${className}`} style={style}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default SplashCursor;
