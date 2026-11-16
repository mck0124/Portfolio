"use client";

import { useEffect, useRef } from "react";

const NEAR = 0.6;
const FAR = 20;
const DZ = 0.5;
const CAM = 1.7;

const trailX = (z: number) => Math.sin(z * 0.3) * 1.3;

function height(x: number, z: number) {
  const side = Math.min(1, ((x - trailX(z)) / 3.2) ** 2);
  return side * (Math.sin(x * 0.5 + z * 0.35) * 0.55 + Math.sin(x * 0.23 - z * 0.5) * 0.75 + Math.sin(z * 0.9 + x * 1.3) * 0.2 + 1.1);
}

// Wireframe terrain flying forward along a trail: a nod to the 3D race maps.
export default function Terrain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = true;
    let scroll = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      scroll += Math.min((now - last) / 1000, 0.05) * 1.1;
      last = now;

      const horizon = h * 0.4;
      const f = h * 0.85;
      const project = (x: number, y: number, vz: number): [number, number] => [w / 2 + (x * f) / vz, horizon + ((CAM - y) * f) / vz];

      const rows: number[] = [];
      for (let k = Math.floor((scroll + FAR) / DZ); k * DZ - scroll > NEAR; k--) rows.push(k * DZ);

      ctx.lineWidth = 1;
      for (const z of rows) {
        const vz = z - scroll;
        ctx.strokeStyle = `rgba(163, 230, 53, ${0.7 * (1 - vz / FAR) ** 1.6})`;
        ctx.beginPath();
        for (let x = -16; x <= 16; x += 0.8) ctx.lineTo(...project(x, height(x, z), vz));
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(163, 230, 53, 0.2)";
      for (let x = -16; x <= 16; x += 0.8) {
        ctx.beginPath();
        for (const z of rows) ctx.lineTo(...project(x, height(x, z), z - scroll));
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(163, 230, 53, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (const z of rows) ctx.lineTo(...project(trailX(z), 0, z - scroll));
      ctx.stroke();

      const [rx, ry] = project(trailX(scroll + 4), 0, 4);
      ctx.fillStyle = "#e8edf1";
      ctx.fillRect(rx - 4, ry - 8, 8, 8);

      if (!still && visible) frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={ref} className="terrain" aria-hidden="true" />;
}
