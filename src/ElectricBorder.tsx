import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import './ElectricBorder.css';

type ElectricBorderProps = {
  children: ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?: number;
  className?: string;
  style?: CSSProperties;
};

function ElectricBorder({
  children,
  color = '#b8ff4d',
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  className = '',
  style,
}: ElectricBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const random = useCallback((x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1, []);

  const noise2D = useCallback(
    (x: number, y: number) => {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const fx = x - i;
      const fy = y - j;
      const a = random(i + j * 57);
      const b = random(i + 1 + j * 57);
      const c = random(i + (j + 1) * 57);
      const d = random(i + 1 + (j + 1) * 57);
      const ux = fx * fx * (3 - 2 * fx);
      const uy = fy * fy * (3 - 2 * fy);
      return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    },
    [random],
  );

  const octavedNoise = useCallback(
    (x: number, octaves: number, lacunarity: number, gain: number, baseAmplitude: number, baseFrequency: number, time: number, seed: number) => {
      let y = 0;
      let amplitude = baseAmplitude;
      let frequency = baseFrequency;
      for (let i = 0; i < octaves; i += 1) {
        y += amplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
        frequency *= lacunarity;
        amplitude *= gain;
      }
      return y;
    },
    [noise2D],
  );

  const getCornerPoint = useCallback((centerX: number, centerY: number, radius: number, startAngle: number, arcLength: number, progress: number) => {
    const angle = startAngle + progress * arcLength;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  }, []);

  const getRoundedRectPoint = useCallback(
    (t: number, left: number, top: number, width: number, height: number, radius: number) => {
      const straightWidth = width - 2 * radius;
      const straightHeight = height - 2 * radius;
      const cornerArc = (Math.PI * radius) / 2;
      const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
      const distance = t * totalPerimeter;
      let accumulated = 0;

      if (distance <= accumulated + straightWidth) return { x: left + radius + ((distance - accumulated) / straightWidth) * straightWidth, y: top };
      accumulated += straightWidth;
      if (distance <= accumulated + cornerArc) return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
      accumulated += cornerArc;
      if (distance <= accumulated + straightHeight) return { x: left + width, y: top + radius + ((distance - accumulated) / straightHeight) * straightHeight };
      accumulated += straightHeight;
      if (distance <= accumulated + cornerArc) return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, (distance - accumulated) / cornerArc);
      accumulated += cornerArc;
      if (distance <= accumulated + straightWidth) return { x: left + width - radius - ((distance - accumulated) / straightWidth) * straightWidth, y: top + height };
      accumulated += straightWidth;
      if (distance <= accumulated + cornerArc) return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
      accumulated += cornerArc;
      if (distance <= accumulated + straightHeight) return { x: left, y: top + height - radius - ((distance - accumulated) / straightHeight) * straightHeight };
      return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, (distance - accumulated) / cornerArc);
    },
    [getCornerPoint],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !container || !ctx) return undefined;

    const borderOffset = 60;
    const displacement = 60;
    let lastDpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + borderOffset * 2;
      const height = rect.height + borderOffset * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { width, height };
    };

    let { width, height } = updateSize();

    const draw = (currentTime: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (dpr !== lastDpr) {
        lastDpr = dpr;
        ({ width, height } = updateSize());
      }

      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += deltaTime * speed;
      lastFrameTimeRef.current = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const left = borderOffset;
      const top = borderOffset;
      const borderWidth = width - borderOffset * 2;
      const borderHeight = height - borderOffset * 2;
      const radius = Math.min(borderRadius, Math.min(borderWidth, borderHeight) / 2);
      const perimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
      const sampleCount = Math.max(120, Math.floor(perimeter / 2));

      ctx.beginPath();
      for (let i = 0; i <= sampleCount; i += 1) {
        const progress = i / sampleCount;
        const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);
        const xNoise = octavedNoise(progress * 8, 8, 1.6, 0.7, chaos, 10, timeRef.current, 0);
        const yNoise = octavedNoise(progress * 8, 8, 1.6, 0.7, chaos, 10, timeRef.current, 1);
        const x = point.x + xNoise * displacement;
        const y = point.y + yNoise * displacement;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(() => {
      ({ width, height } = updateSize());
    });
    resizeObserver.observe(container);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [borderRadius, chaos, color, getRoundedRectPoint, octavedNoise, speed]);

  return (
    <div ref={containerRef} className={`electric-border ${className}`} style={{ '--electric-border-color': color, borderRadius, ...style } as CSSProperties}>
      <div className="eb-canvas-container">
        <canvas ref={canvasRef} className="eb-canvas" />
      </div>
      <div className="eb-layers">
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  );
}

export default ElectricBorder;
