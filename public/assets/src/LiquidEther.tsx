import { useEffect, useRef, type CSSProperties } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';

type LiquidEtherProps = {
  colors?: [string, string, string] | string[];
  mouseForce?: number;
  cursorSize?: number;
  resolution?: number;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  className?: string;
  style?: CSSProperties;
};

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec2 uTrail0;
uniform vec2 uTrail1;
uniform vec2 uTrail2;
uniform vec2 uTrail3;
uniform float uTrailPower;
uniform float uPointerForce;
uniform float uCursorSize;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.55;
  for (int i = 0; i < 6; i++) {
    value += amp * noise(p);
    p = mat2(1.48, 1.12, -1.12, 1.48) * p;
    amp *= 0.46;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 aspectUv = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  vec2 pointer = (uPointer - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  vec2 trail0 = (uTrail0 - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  vec2 trail1 = (uTrail1 - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  vec2 trail2 = (uTrail2 - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  vec2 trail3 = (uTrail3 - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float d = distance(aspectUv, pointer);
  float trailShape =
    smoothstep(uCursorSize * 2.8, 0.0, distance(aspectUv, trail0)) * 1.0 +
    smoothstep(uCursorSize * 3.4, 0.0, distance(aspectUv, trail1)) * 0.72 +
    smoothstep(uCursorSize * 4.1, 0.0, distance(aspectUv, trail2)) * 0.48 +
    smoothstep(uCursorSize * 4.9, 0.0, distance(aspectUv, trail3)) * 0.28;
  float brush = smoothstep(uCursorSize * 1.55, 0.0, d) * uPointerForce;
  float tail = clamp(trailShape * uTrailPower, 0.0, 1.0);

  vec2 flow = vec2(
    fbm(uv * 1.38 + vec2(uTime * 0.036, -uTime * 0.019)),
    fbm(uv * 1.54 + vec2(-uTime * 0.023, uTime * 0.032))
  );

  vec2 push = normalize(aspectUv - pointer + 0.001);
  uv += (flow - 0.5) * 0.28;
  uv += push * brush * 0.018;
  uv += normalize(aspectUv - trail1 + 0.001) * tail * 0.02;

  float liquid = fbm(uv * 1.76 + vec2(uTime * 0.018, 0.0));
  float cloud = fbm(uv * 0.88 + vec2(-uTime * 0.014, uTime * 0.012));
  float ribbon = sin((uv.x * 1.8 + uv.y * 1.1 + flow.y * 0.85) * 3.14159 + uTime * 0.28) * 0.5 + 0.5;
  float centerBloom = smoothstep(0.88, 0.05, distance(aspectUv, vec2(0.0, -0.02)));
  float edgeBloom = smoothstep(1.02, 0.2, length(vUv - 0.5));
  float cursorCore = smoothstep(uCursorSize * 1.1, 0.0, d);
  float cursorHalo = tail * (0.38 + flow.x * 0.22);
  float wake = smoothstep(0.54, 0.92, fbm((uv - trail2 * 0.08) * 1.65 + vec2(-uTime * 0.12, uTime * 0.035))) * tail;
  float energy = clamp(liquid * 0.18 + cloud * 0.22 + ribbon * 0.12 + centerBloom * 0.24 + cursorHalo * 0.78 + cursorCore * 0.24 + wake * 0.42, 0.0, 1.0);

  vec3 base = mix(uColor2, uColor1, smoothstep(0.08, 0.88, cloud));
  vec3 neon = mix(base, uColor0, smoothstep(0.42, 0.98, energy));
  float alpha = clamp((energy * 0.28 + cursorHalo * 0.46 + cursorCore * 0.2 + wake * 0.32) * edgeBloom, 0.0, 0.46);

  gl_FragColor = vec4(neon, alpha);
}
`;

function toColor(value: string | undefined, fallback: string) {
  return new THREE.Color(value || fallback);
}

export default function LiquidEther({
  colors = ['#b8ff4d', '#2f332f', '#050505'],
  mouseForce = 18,
  cursorSize = 56,
  resolution = 0.72,
  autoDemo = true,
  autoSpeed = 0.18,
  autoIntensity = 1.35,
  className = '',
  style = {},
}: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const pointer = new THREE.Vector2(0.5, 0.5);
    const target = new THREE.Vector2(0.5, 0.5);
    const trail = [
      new THREE.Vector2(0.5, 0.5),
      new THREE.Vector2(0.5, 0.5),
      new THREE.Vector2(0.5, 0.5),
      new THREE.Vector2(0.5, 0.5),
    ];
    const color0 = toColor(colors[0], '#b8ff4d');
    const color1 = toColor(colors[1], '#2f332f');
    const color2 = toColor(colors[2], '#050505');
    let frame = 0;
    let lastInteraction = 0;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: pointer },
      uTrail0: { value: trail[0] },
      uTrail1: { value: trail[1] },
      uTrail2: { value: trail[2] },
      uTrail3: { value: trail[3] },
      uTrailPower: { value: 0 },
      uPointerForce: { value: autoIntensity },
      uCursorSize: { value: 0.08 },
      uColor0: { value: color0 },
      uColor1: { value: color1 },
      uColor2: { value: color2 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    mount.prepend(renderer.domElement);

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * resolution));
      const height = Math.max(1, Math.floor(rect.height * resolution));
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
      uniforms.uResolution.value.set(width, height);
      uniforms.uCursorSize.value = cursorSize / Math.max(width, height);
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = mount.getBoundingClientRect();
      target.set((clientX - rect.left) / rect.width, 1 - (clientY - rect.top) / rect.height);
      uniforms.uPointerForce.value = mouseForce;
      lastInteraction = performance.now();
    };

    const onPointerMove = (event: PointerEvent) => updatePointer(event.clientX, event.clientY);
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      if (autoDemo && performance.now() - lastInteraction > 1200) {
        target.set(
          0.5 + Math.cos(elapsed * autoSpeed) * 0.22,
          0.52 + Math.sin(elapsed * autoSpeed * 1.3) * 0.18,
        );
        uniforms.uPointerForce.value = autoIntensity;
        uniforms.uTrailPower.value = THREE.MathUtils.lerp(uniforms.uTrailPower.value, 0.42, 0.025);
      } else {
        uniforms.uTrailPower.value = THREE.MathUtils.lerp(uniforms.uTrailPower.value, 1, 0.06);
      }

      pointer.lerp(target, 0.045);
      trail[0].lerp(pointer, 0.18);
      trail[1].lerp(trail[0], 0.12);
      trail[2].lerp(trail[1], 0.09);
      trail[3].lerp(trail[2], 0.065);
      uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [autoDemo, autoIntensity, autoSpeed, colors, cursorSize, mouseForce, resolution]);

  return <div ref={mountRef} className={`liquid-ether-container ${className}`} style={style} />;
}
