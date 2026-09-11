"use client";

import { useRef, useEffect, useCallback } from "react";

const C = {
  fileBg: "#ffffff",
  fileBorder: "rgba(0,0,0,0.12)",
  fileShadow: "rgba(0,0,0,0.12)",
  text: "rgba(0,0,0,0.4)",
  textStrong: "rgba(0,0,0,0.78)",
  txtBg: "#ffffff",
  txtBorder: "rgba(0,0,0,0.08)",
  txtHeaderBg: "#f5f5f0",
  glowCore: "#d97706",
  glowSoft: "rgba(217,119,6,0.07)",
  scanLine: "rgba(217,119,6,0.08)",
  highlightBg: "rgba(217,119,6,0.06)",
  highlightText: "#d97706",
  particleBase: "rgba(217,119,6,0.2)",
};

const FILE_TYPES = [
  { ext: "CASE", color: "#8B5A2B" },
  { ext: "DEED", color: "#D97706" },
  { ext: "ROLL", color: "#B45309" },
  { ext: "FORM", color: "#059669" },
  { ext: "FILE", color: "#475569" },
];

const TXT_LINES = [
  { type: "header", text: "archive.index" },
  { type: "blank" },
  { type: "section", text: "# Project summary" },
  { type: "blank" },
  { type: "kv", key: "engagement", value: "Tribal land records" },
  { type: "kv", key: "source_volume", value: "12 banker boxes" },
  { type: "kv", key: "pages_scanned", value: "4,812 pages" },
  { type: "kv", key: "format", value: "Searchable PDF/A" },
  { type: "blank" },
  { type: "section", text: "# Processing quality" },
  { type: "body", text: "OCR accuracy: 99.2%" },
  { type: "body", text: "Classified: 87 record types" },
  { type: "body", text: "Redacted: 341 PII fields" },
  { type: "blank" },
  { type: "section", text: "# Organization" },
  { type: "body", text: "Files renamed: 4,812" },
  { type: "body", text: "Folder hierarchy: 6-tier" },
  { type: "body", text: "Duplicates resolved: 128" },
  { type: "blank" },
  { type: "section", text: "# Handoff" },
  { type: "body", text: "SharePoint / Google Drive" },
  { type: "body", text: "Local network drive" },
  { type: "body", text: "AI tools (optional)" },
];

const AI_HIGHLIGHTS = [4, 5, 6, 9, 10, 11, 14, 15, 16, 19, 20, 21];

function seededRandom(seed: number) {
  let s = seed;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

interface FileData {
  type: { ext: string; color: string };
  chaosX: number;
  chaosY: number;
  chaosRot: number;
  chaosScale: number;
  driftSpeed: number;
  driftPhase: number;
  w: number;
  h: number;
}

interface Particle {
  angle: number;
  dist: number;
  speed: number;
  size: number;
  phase: number;
}

/**
 * Canvas animation driven by a `progress` prop (0-1).
 * Phases mapped to 3 steps:
 *   0-0.33   Discover (scattered records → scoped into a plan)
 *   0.33-0.66 Digitize (paper stack → digital document with OCR content)
 *   0.66-1.0  Deliver (scan → highlights → organized files)
 */
export function ProcessAnimation({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ W: 0, H: 0 });
  const timeRef = useRef(0);
  const progressRef = useRef(progress);
  const filesRef = useRef<FileData[] | null>(null);
  const particlesRef = useRef<Particle[] | null>(null);

  // Keep progress ref in sync
  progressRef.current = progress;

  const initData = useCallback(() => {
    if (filesRef.current) return;
    const rand = seededRandom(77);
    const NUM = 10;
    const files: FileData[] = [];
    for (let i = 0; i < NUM; i++) {
      const type = FILE_TYPES[i % FILE_TYPES.length];
      const angle = (i / NUM) * Math.PI * 2 + rand() * 0.6;
      const radius = 80 + rand() * 100;
      files.push({
        type,
        chaosX: Math.cos(angle) * radius + (rand() - 0.5) * 60,
        chaosY: Math.sin(angle) * radius + (rand() - 0.5) * 60,
        chaosRot: (rand() - 0.5) * 50,
        chaosScale: 0.75 + rand() * 0.45,
        driftSpeed: 0.25 + rand() * 0.6,
        driftPhase: rand() * Math.PI * 2,
        w: 68,
        h: 84,
      });
    }
    filesRef.current = files;

    const rand2 = seededRandom(99);
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        angle: rand2() * Math.PI * 2,
        dist: 100 + rand2() * 50,
        speed: 0.2 + rand2() * 0.4,
        size: 1 + rand2() * 2,
        phase: rand2() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    if (!filesRef.current || !particlesRef.current) return;
    const { W, H } = sizeRef.current;
    if (W === 0 || H === 0) return;

    ctx.clearRect(0, 0, W, H);

    const p = progressRef.current;

    // Remap to animation phases (3 steps)
    // Step 1 Select: 0-0.33 → gatherT 0-1
    // Step 2 Compress: 0.33-0.66 → compressT, txtRevealT
    // Step 3 Analyze: 0.66-1.0 → scanT, aiT
    const gatherT = clamp(p / 0.25, 0, 1);
    const compressT = clamp((p - 0.25) / 0.15, 0, 1);
    const txtRevealT = clamp((p - 0.38) / 0.18, 0, 1);
    const scanT = clamp((p - 0.60) / 0.15, 0, 1);
    const aiT = clamp((p - 0.75) / 0.2, 0, 1);

    const cx = W / 2;
    const cy = H * 0.47;
    const gE = ease(gatherT);
    const cE = ease(compressT);
    const NUM = filesRef.current.length;

    // File cards
    const fileOpacity = 1 - cE;
    if (fileOpacity > 0.01) {
      for (let i = 0; i < NUM; i++) {
        const f = filesRef.current[i];
        const drift =
          Math.sin(time * f.driftSpeed + f.driftPhase) * (1 - gE) * 10;
        const driftY =
          Math.cos(time * f.driftSpeed * 0.7 + f.driftPhase) * (1 - gE) * 8;

        const chX = cx + f.chaosX + drift;
        const chY = cy + f.chaosY + driftY;
        const x = lerp(chX, cx, gE);
        const y = lerp(chY, cy, gE);
        const rot = f.chaosRot * (1 - gE);
        const scale = lerp(f.chaosScale, 0.5 + (1 - cE) * 0.3, gE);
        const stackOffset = gE > 0.5 ? (i - NUM / 2) * lerp(6, 2, cE) : 0;

        // Draw file card
        ctx.save();
        ctx.globalAlpha = fileOpacity;
        ctx.translate(x + stackOffset * 0.3, y + stackOffset);
        ctx.rotate((rot * Math.PI) / 180);
        ctx.scale(scale * (1 - cE * 0.5), scale * (1 - cE * 0.5));

        const w = f.w, h = f.h;
        ctx.shadowColor = C.fileShadow;
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = C.fileBg;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, 6);
        ctx.fill();
        ctx.shadowColor = "transparent";

        ctx.strokeStyle = C.fileBorder;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, 6);
        ctx.stroke();

        ctx.fillStyle = f.type.color + "15";
        ctx.beginPath();
        ctx.moveTo(w / 2 - 13, -h / 2);
        ctx.lineTo(w / 2, -h / 2 + 13);
        ctx.lineTo(w / 2, -h / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = f.type.color;
        ctx.font = "600 10px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(f.type.ext, 0, -h / 2 + 26);

        for (let j = 0; j < 4; j++) {
          const lw = 30 + (j === 0 ? 10 : -j * 5);
          ctx.fillStyle = C.fileBorder;
          ctx.fillRect(-lw / 2, -h / 2 + 38 + j * 8, lw, 2.5);
        }
        ctx.restore();
      }
    }

    // Text document
    const txtOpacity = clamp(cE * 2, 0, 1);
    if (txtOpacity > 0.01) {
      // Particles
      if (ease(aiT) > 0) {
        ctx.save();
        for (const pt of particlesRef.current) {
          const a = pt.angle + time * pt.speed * 0.3;
          const d = pt.dist + Math.sin(time * pt.speed + pt.phase) * 20;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, pt.size, 0, Math.PI * 2);
          ctx.fillStyle = C.particleBase;
          ctx.globalAlpha = ease(aiT) * 0.6 * (0.3 + 0.3 * Math.sin(time * 2 + pt.phase));
          ctx.fill();
        }
        ctx.restore();
      }

      // Document
      ctx.save();
      ctx.globalAlpha = txtOpacity;
      ctx.translate(cx, cy);

      const w = 260, h = 320, headerH = 30;
      const eAiT = ease(aiT);

      // Glow
      if (eAiT > 0) {
        const glowR = 40 + eAiT * 60;
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR + 100);
        grad.addColorStop(0, C.glowSoft);
        grad.addColorStop(0.5, C.glowSoft);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.globalAlpha = txtOpacity * eAiT * 0.6;
        ctx.fillRect(-w / 2 - 100, -h / 2 - 100, w + 200, h + 200);
        ctx.globalAlpha = txtOpacity;
      }

      // Card
      ctx.shadowColor = C.fileShadow;
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = C.txtBg;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 8);
      ctx.fill();
      ctx.shadowColor = "transparent";

      if (eAiT > 0) {
        ctx.strokeStyle = C.glowCore;
        ctx.globalAlpha = txtOpacity * eAiT * 0.4;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, 8);
        ctx.stroke();
        ctx.globalAlpha = txtOpacity;
      } else {
        ctx.strokeStyle = C.txtBorder;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, 8);
        ctx.stroke();
      }

      // Header
      ctx.fillStyle = C.txtHeaderBg;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 8, -h / 2);
      ctx.lineTo(w / 2 - 8, -h / 2);
      ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + 8);
      ctx.lineTo(w / 2, -h / 2 + headerH);
      ctx.lineTo(-w / 2, -h / 2 + headerH);
      ctx.lineTo(-w / 2, -h / 2 + 8);
      ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + 8, -h / 2);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = C.txtBorder;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-w / 2, -h / 2 + headerH);
      ctx.lineTo(w / 2, -h / 2 + headerH);
      ctx.stroke();

      const dotColors = ["#FF5F57", "#FFBD2E", "#28CA42"];
      for (let d = 0; d < 3; d++) {
        ctx.beginPath();
        ctx.arc(-w / 2 + 16 + d * 14, -h / 2 + headerH / 2, 4, 0, Math.PI * 2);
        ctx.fillStyle = dotColors[d];
        ctx.globalAlpha = txtOpacity * 0.7;
        ctx.fill();
        ctx.globalAlpha = txtOpacity;
      }

      // Content
      ctx.save();
      ctx.beginPath();
      ctx.rect(-w / 2, -h / 2 + headerH, w, h - headerH);
      ctx.clip();

      const startY = -h / 2 + headerH + 12;
      const lineH = 14;
      const padX = 14;
      const eTxtReveal = ease(txtRevealT);
      const visibleLines = Math.floor(eTxtReveal * TXT_LINES.length);

      for (let i = 0; i < visibleLines && i < TXT_LINES.length; i++) {
        const line = TXT_LINES[i];
        const ly = startY + i * lineH;
        if (ly > h / 2 - 8) break;
        const isHL = eAiT > 0 && AI_HIGHLIGHTS.includes(i);

        if (isHL) {
          const hlA = clamp(eAiT * 2 - AI_HIGHLIGHTS.indexOf(i) / AI_HIGHLIGHTS.length, 0, 1);
          ctx.fillStyle = C.highlightBg;
          ctx.globalAlpha = txtOpacity * hlA * 0.8;
          ctx.fillRect(-w / 2 + padX - 4, ly - 9, w - padX * 2 + 8, lineH);
          ctx.globalAlpha = txtOpacity;
        }

        if (line.type === "header") {
          ctx.font = "600 10px monospace";
          ctx.fillStyle = C.textStrong;
          ctx.textAlign = "right";
          ctx.fillText(line.text!, w / 2 - padX, -h / 2 + headerH / 2 + 3);
        } else if (line.type === "section") {
          ctx.font = "600 10px system-ui, sans-serif";
          ctx.fillStyle = isHL ? C.highlightText : C.textStrong;
          ctx.textAlign = "left";
          ctx.fillText(line.text!, -w / 2 + padX, ly);
        } else if (line.type === "kv") {
          ctx.font = "400 9px monospace";
          ctx.textAlign = "left";
          ctx.fillStyle = C.text;
          ctx.fillText((line as { key: string }).key + ":", -w / 2 + padX, ly);
          ctx.fillStyle = isHL ? C.highlightText : C.textStrong;
          ctx.textAlign = "right";
          ctx.fillText((line as { value: string }).value, w / 2 - padX, ly);
        } else if (line.type === "body") {
          ctx.font = "400 9px monospace";
          ctx.fillStyle = isHL ? C.highlightText : C.textStrong;
          ctx.textAlign = "left";
          ctx.fillText(line.text!, -w / 2 + padX + 8, ly);
        }
      }

      // Scan line
      if (scanT > 0 && scanT < 1) {
        const scanY = startY + scanT * TXT_LINES.length * lineH;
        ctx.strokeStyle = C.glowCore;
        ctx.globalAlpha = txtOpacity * 0.5;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-w / 2 + padX, scanY);
        ctx.lineTo(w / 2 - padX, scanY);
        ctx.stroke();

        const sg = ctx.createLinearGradient(0, scanY - 25, 0, scanY);
        sg.addColorStop(0, "transparent");
        sg.addColorStop(1, C.scanLine);
        ctx.fillStyle = sg;
        ctx.globalAlpha = txtOpacity * 0.4;
        ctx.fillRect(-w / 2 + padX, scanY - 25, w - padX * 2, 25);
        ctx.globalAlpha = txtOpacity;
      }


      ctx.restore();

      // Grey square halo around the document
      if (eAiT > 0.4) {
        const haloT = clamp((eAiT - 0.4) * 2.5, 0, 1);
        const eHalo = ease(haloT);
        const pad = 24;
        const haloW = w + pad * 2;
        const haloH = h + pad * 2;

        ctx.globalAlpha = txtOpacity * eHalo * 0.12;
        ctx.strokeStyle = C.textStrong;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-haloW / 2, -haloH / 2, haloW, haloH, 14);
        ctx.stroke();

        // Soft glow behind the border
        ctx.globalAlpha = txtOpacity * eHalo * 0.04;
        ctx.fillStyle = C.textStrong;
        ctx.beginPath();
        ctx.roundRect(-haloW / 2, -haloH / 2, haloW, haloH, 14);
        ctx.fill();

        ctx.globalAlpha = txtOpacity;
      }

      ctx.restore();
    }
  }, []);

  // Setup canvas, init data, and run continuous RAF loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    initData();

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const W = parent.clientWidth;
      const H = parent.clientHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { W, H };
    }

    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();
    let rafId: number;

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap delta to avoid jumps
      lastTime = now;
      timeRef.current += dt;
      draw(ctx!, timeRef.current);
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [initData, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
}
