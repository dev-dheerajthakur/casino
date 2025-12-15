"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { Button } from "@mui/material";

function quadraticAt(p0: number, p1: number, p2: number, t: number) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const DRAW_DURATION = 5_000;
  const FLOAT_STAGE = 3_000;
  const Y_AMPLITUDE = 30;
  const X_AMPLITUDE = 20;
  const RESOLUTION = 1000;

  const animationFrameId = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const pausedElapsed = useRef<number>(0);
  const running = useRef<boolean>(false);
  const tipImage = useRef<HTMLImageElement | null>(null);

  // Responsive base points (will be scaled)
  const getScaledPoints = (width: number, height: number) => {
    // const scaleX = width / 460;
    const scaleY = height / 400;
    
    return {
      start: { x: 10, y: height - 10 * scaleY },
      baseControl: { x: width / 2, y: height - 100 * scaleY },
      baseEnd: { x: width * 0.75, y: 100 * scaleY },
    };
  };

  // Setup canvas with proper dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Setup canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const img = new Image();
    img.src = "/icons/plane-00.svg";
    tipImage.current = img;

    img.onload = () => {
      drawInitialFrame();
    };

    // Redraw if already running
    if (running.current) {
      drawInitialFrame();
    }
  }, [dimensions]);

  function draw(
    ctx: CanvasRenderingContext2D,
    progress: number,
    control: { x: number; y: number },
    end: { x: number; y: number },
    tip: { x: number; y: number },
    start: { x: number; y: number }
  ) {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxIndex = Math.floor(progress * RESOLUTION);

    // fill
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    for (let i = 0; i <= maxIndex; i++) {
      const t = i / RESOLUTION;
      ctx.lineTo(
        quadraticAt(start.x, control.x, end.x, t),
        quadraticAt(start.y, control.y, end.y, t)
      );
    }

    ctx.lineTo(
      quadraticAt(start.x, control.x, end.x, maxIndex / RESOLUTION),
      start.y
    );
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, end.y, 0, start.y);
    gradient.addColorStop(0, "rgba(220,38,38,0.8)");
    gradient.addColorStop(0.5, "rgba(220,38,38,0.5)");
    gradient.addColorStop(1, "rgba(220,38,38,0.1)");

    // ctx.fillStyle = gradient;
    ctx.fillStyle = "rgba(220,38,38,0.5)";
    ctx.fill();

    // stroke
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    for (let i = 0; i <= maxIndex; i++) {
      const t = i / RESOLUTION;
      ctx.lineTo(
        quadraticAt(start.x, control.x, end.x, t),
        quadraticAt(start.y, control.y, end.y, t)
      );
    }

    ctx.strokeStyle = "#ff0000ff";
    ctx.lineWidth = Math.max(2, dimensions.width / 150);
    ctx.stroke();

    // image at tip
    const img = tipImage.current;
    if (img && img.complete) {
      const scale = Math.min(dimensions.width / 460, dimensions.height / 400);
      const imgWidth = 90 * scale;
      const imgHeight = 50 * scale;
      ctx.drawImage(img, tip.x - imgWidth / 7, tip.y - imgHeight + 5, imgWidth, imgHeight);
    }
  }

  function drawInitialFrame() {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const progress = 0;
    const { start, baseControl, baseEnd } = getScaledPoints(dimensions.width, dimensions.height);

    const tip = {
      x: start.x,
      y: start.y,
    };

    draw(ctx, progress, baseControl, baseEnd, tip, start);
  }

  function loop(now: number) {
    if (!running.current) return;

    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const elapsed = now - startTime.current + pausedElapsed.current;
    const progress = Math.min(elapsed / DRAW_DURATION, 1);

    const { start, baseControl, baseEnd } = getScaledPoints(dimensions.width, dimensions.height);
    const scale = Math.min(dimensions.width / 460, dimensions.height / 400);

    let xOffset = 0;
    let yOffset = 0;

    if (progress === 1) {
      const t = (elapsed - DRAW_DURATION) / FLOAT_STAGE;
      const wave = Math.sin(t * Math.PI);
      yOffset = wave * Y_AMPLITUDE * scale;
      xOffset = wave * X_AMPLITUDE * scale;
    }

    const animatedEnd = {
      x: baseEnd.x + xOffset,
      y: baseEnd.y + yOffset,
    };

    const animatedControl = {
      x: baseControl.x + xOffset * 0.6,
      y: baseControl.y + yOffset * 0.6,
    };

    const tip = {
      x: quadraticAt(start.x, animatedControl.x, animatedEnd.x, progress),
      y: quadraticAt(start.y, animatedControl.y, animatedEnd.y, progress),
    };

    draw(ctx, progress, animatedControl, animatedEnd, tip, start);
    animationFrameId.current = requestAnimationFrame(loop);
  }

  function startAnimation() {
    if (running.current) return;

    running.current = true;
    startTime.current = performance.now();
    animationFrameId.current = requestAnimationFrame(loop);
  }

  function stopAnimation() {
    if (!running.current) return;

    running.current = false;

    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    pausedElapsed.current += performance.now() - startTime.current;
  }

  function clearCanvas() {
    stopAnimation();
    pausedElapsed.current = 0;
    drawInitialFrame();
  }

  function restartAnimation() {
    pausedElapsed.current = 0;
    startAnimation();
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Canvas Animation</h1>
      
      <div ref={containerRef} className={styles.canvasContainer}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={startAnimation} variant="contained" color="success" className={styles.button}>
          Start
        </Button>
        <Button onClick={stopAnimation} variant="contained" color="secondary" className={styles.button}>
          Stop
        </Button>
        <Button onClick={restartAnimation} variant="contained" color="warning" className={styles.button}>
          Restart
        </Button>
        <Button onClick={clearCanvas} variant="contained" color="error" className={styles.button}>
          Clear
        </Button>
      </div>
    </div>
  );
}