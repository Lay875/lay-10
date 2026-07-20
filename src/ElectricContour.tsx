import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import './ElectricContour.css';

type ElectricContourProps = {
  children: ReactNode;
  imageSrc: string;
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  className?: string;
  style?: CSSProperties;
};

function ElectricContour({
  children,
  imageSrc,
  color = '#b8ff4d',
  speed = 1,
  chaos = 0.12,
  thickness = 1.5,
  className = '',
  style,
}: ElectricContourProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const colorMaskRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, pad: 44, dpr: 1 });

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
    (x: number, time: number, seed: number) => {
      let y = 0;
      let amplitude = chaos;
      let frequency = 10;
      for (let i = 0; i < 10; i += 1) {
        y += amplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
        frequency *= 1.6;
        amplitude *= 0.7;
      }
      return y;
    },
    [chaos, noise2D],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !container || !ctx) return undefined;

    let disposed = false;
    const image = new Image();
    image.decoding = 'async';
    image.src = imageSrc;

    const buildMasks = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pad = 44;
      const contentWidth = Math.max(1, Math.round(rect.width));
      const contentHeight = Math.max(1, Math.round(rect.height));
      const width = contentWidth + pad * 2;
      const height = contentHeight + pad * 2;

      sizeRef.current = { width, height, pad, dpr };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rawMask = document.createElement('canvas');
      rawMask.width = width;
      rawMask.height = height;
      const rawMaskCtx = rawMask.getContext('2d', { willReadFrequently: true });
      if (!rawMaskCtx) return;
      rawMaskCtx.clearRect(0, 0, width, height);
      rawMaskCtx.drawImage(image, pad, pad, contentWidth, contentHeight);

      const rawData = rawMaskCtx.getImageData(0, 0, width, height);
      const alphaThreshold = 18;
      const silhouette = document.createElement('canvas');
      silhouette.width = width;
      silhouette.height = height;
      const silhouetteCtx = silhouette.getContext('2d');
      if (!silhouetteCtx) return;
      silhouetteCtx.clearRect(0, 0, width, height);

      const exterior = new Uint8Array(width * height);
      const queue: number[] = [];
      const enqueue = (x: number, y: number) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        const index = y * width + x;
        if (exterior[index] || rawData.data[index * 4 + 3] > alphaThreshold) return;
        exterior[index] = 1;
        queue.push(index);
      };

      for (let x = 0; x < width; x += 1) {
        enqueue(x, 0);
        enqueue(x, height - 1);
      }
      for (let y = 0; y < height; y += 1) {
        enqueue(0, y);
        enqueue(width - 1, y);
      }

      for (let head = 0; head < queue.length; head += 1) {
        const index = queue[head];
        const x = index % width;
        const y = Math.floor(index / width);
        enqueue(x + 1, y);
        enqueue(x - 1, y);
        enqueue(x, y + 1);
        enqueue(x, y - 1);
      }

      const silhouetteData = silhouetteCtx.createImageData(width, height);
      for (let i = 0; i < width * height; i += 1) {
        const alpha = rawData.data[i * 4 + 3];
        if (alpha > alphaThreshold || !exterior[i]) {
          silhouetteData.data[i * 4] = 255;
          silhouetteData.data[i * 4 + 1] = 255;
          silhouetteData.data[i * 4 + 2] = 255;
          silhouetteData.data[i * 4 + 3] = 255;
        }
      }
      silhouetteCtx.putImageData(silhouetteData, 0, 0);

      maskRef.current = silhouette;

      const colorMask = document.createElement('canvas');
      colorMask.width = width;
      colorMask.height = height;
      const colorCtx = colorMask.getContext('2d');
      if (!colorCtx) return;
      colorCtx.clearRect(0, 0, width, height);
      colorCtx.drawImage(silhouette, 0, 0);
      colorCtx.globalCompositeOperation = 'source-in';
      colorCtx.fillStyle = color;
      colorCtx.fillRect(0, 0, width, height);
      colorMaskRef.current = colorMask;
    };

    const drawImageBand = (
      source: HTMLCanvasElement,
      x: number,
      y: number,
      height: number,
      dx: number,
      dy: number,
      alpha: number,
      blur: number,
    ) => {
      const { width } = sizeRef.current;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.drawImage(source, 0, y, width, height, dx, y + dy, width, height);
      ctx.restore();
    };

    const eraseBody = (strength = 1) => {
      const mask = maskRef.current;
      if (!mask) return;
      ctx.save();
      ctx.globalAlpha = strength;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(mask, 0, 0);
      ctx.restore();
    };

    const draw = (currentTime: number) => {
      if (disposed) return;
      const mask = maskRef.current;
      const colorMask = colorMaskRef.current;
      if (!mask || !colorMask) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const { width, height, dpr } = sizeRef.current;
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += deltaTime * speed;
      lastFrameTimeRef.current = currentTime;
      const time = timeRef.current;
      const energy = Math.max(0.85, Math.min(2.2, chaos * 12));

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      ctx.drawImage(colorMask, -thickness * 2, 0);
      ctx.drawImage(colorMask, thickness * 2, 0);
      ctx.drawImage(colorMask, 0, -thickness * 2);
      ctx.drawImage(colorMask, 0, thickness * 2);
      ctx.restore();
      eraseBody(0.96);

      ctx.save();
      ctx.globalAlpha = 0.62;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.drawImage(colorMask, -thickness, 0);
      ctx.drawImage(colorMask, thickness, 0);
      ctx.drawImage(colorMask, 0, -thickness);
      ctx.drawImage(colorMask, 0, thickness);
      ctx.restore();
      eraseBody(1);

      const bandCount = 28;
      const bandHeight = Math.max(8, Math.round(height / 26));
      for (let i = 0; i < bandCount; i += 1) {
        const progress = i / bandCount;
        const y = Math.round(progress * height);
        const n1 = octavedNoise(progress * 8, time, 0);
        const n2 = octavedNoise(progress * 8, time, 1);
        const dx = n1 * 30 * energy;
        const dy = n2 * 12 * energy;
        const pulse = 0.5 + Math.sin(time * 5.2 + i * 1.7) * 0.5;
        drawImageBand(colorMask, 0, y, bandHeight, dx, dy, 0.07 + pulse * 0.13, 8);
      }
      eraseBody(1);

      const sweep = (time * 0.22) % 1;
      for (let i = 0; i < 5; i += 1) {
        const progress = (sweep + i * 0.18) % 1;
        const y = Math.round(progress * height);
        const dx = octavedNoise(progress * 10, time, i + 5) * 42 * energy;
        drawImageBand(colorMask, 0, y, Math.max(12, bandHeight * 1.15), dx, 0, 0.24, 2.5);
      }
      eraseBody(1);

      animationRef.current = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (image.complete) buildMasks();
    });

    image.onload = () => {
      if (disposed) return;
      buildMasks();
      resizeObserver.observe(container);
      animationRef.current = requestAnimationFrame(draw);
    };

    if (image.complete) image.onload(null as unknown as Event);

    return () => {
      disposed = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [chaos, color, imageSrc, noise2D, octavedNoise, speed, thickness]);

  return (
    <div ref={containerRef} className={`electric-contour ${className}`} style={{ '--electric-contour-color': color, ...style } as CSSProperties}>
      <div className="ec-canvas-container">
        <canvas ref={canvasRef} className="ec-canvas" />
      </div>
      <div className="ec-content">{children}</div>
    </div>
  );
}

export default ElectricContour;
