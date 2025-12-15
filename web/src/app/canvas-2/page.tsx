"use client";
import React, { useEffect, useRef } from "react";
import styles from "./page.module.css";
import { Button } from "@mui/material";

function quadraticAt(p0: number, p1: number, p2: number, t: number) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ✅ persistent animation state
  // const animationFrameId = useRef<number | null>(null);
  // const startTime = useRef<number>(0);
  // const running = useRef<boolean>(false);

  // ---- base points ----
  const start = { x: 10, y: 390 };
  const baseControl = { x: 300, y: 350 };
  const baseEnd = { x: 450, y: 100 };

  const DRAW_DURATION = 10_000;
  const FLOAT_STAGE = 2_000;
  const Y_AMPLITUDE = 50;
  const X_AMPLITUDE = 20;
  const RESOLUTION = 1000;

  const animationFrameId = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const pausedElapsed = useRef<number>(0);
  const running = useRef<boolean>(false);

  const tipImage = useRef<HTMLImageElement | null>(null);

  // ---- setup canvas once ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const img = new Image();
    img.src = "/icons/plane-00.svg";
    tipImage.current = img;

    img.onload = () => {
      drawInitialFrame(); // 👈 draw plane immediately
    };
  }, []);

  function draw(
    ctx: CanvasRenderingContext2D,
    progress: number,
    control: { x: number; y: number },
    end: { x: number; y: number },
    tip: { x: number; y: number }
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

    const gradient = ctx.createLinearGradient(0, 100, 0, 390);
    gradient.addColorStop(0, "rgba(220,38,38,0.8)");
    gradient.addColorStop(0.5, "rgba(220,38,38,0.5)");
    gradient.addColorStop(1, "rgba(220,38,38,0.1)");

    ctx.fillStyle = gradient;
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

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.stroke();

    // image at tip
    const img = tipImage.current;
    if (img && img.complete) {
      ctx.drawImage(img, tip.x - 12, tip.y - 45, 90, 50);
    }
  }

  function drawInitialFrame() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const progress = 0;

    const control = baseControl;
    const end = baseEnd;

    const tip = {
      x: start.x,
      y: start.y,
    };

    draw(ctx, progress, control, end, tip);
  }

  function loop(now: number) {
    if (!running.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const elapsed = now - startTime.current + pausedElapsed.current;
    const progress = Math.min(elapsed / DRAW_DURATION, 1);

    let xOffset = 0;
    let yOffset = 0;

    if (progress === 1) {
      const t = (elapsed - DRAW_DURATION) / FLOAT_STAGE;
      const wave = Math.sin(t * Math.PI);
      yOffset = wave * Y_AMPLITUDE;
      xOffset = wave * X_AMPLITUDE;
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

    draw(ctx, progress, animatedControl, animatedEnd, tip);
    animationFrameId.current = requestAnimationFrame(loop);
  }

  // function loop(now: number) {
  //   if (!running.current) return;

  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   const elapsed = now - startTime.current;
  //   const progress = Math.min(elapsed / DRAW_DURATION, 1);

  //   let xOffset = 0;
  //   let yOffset = 0;

  //   if (progress === 1) {
  //     const t = (elapsed - DRAW_DURATION) / FLOAT_STAGE;
  //     const wave = Math.sin(t * Math.PI);
  //     yOffset = wave * Y_AMPLITUDE;
  //     xOffset = wave * X_AMPLITUDE;
  //   }

  //   const animatedEnd = {
  //     x: baseEnd.x + xOffset,
  //     y: baseEnd.y + yOffset,
  //   };

  //   const animatedControl = {
  //     x: baseControl.x + xOffset * 0.6,
  //     y: baseControl.y + yOffset * 0.6,
  //   };

  //   const tip = {
  //     x: quadraticAt(start.x, animatedControl.x, animatedEnd.x, progress),
  //     y: quadraticAt(start.y, animatedControl.y, animatedEnd.y, progress),
  //   };

  //   draw(ctx, progress, animatedControl, animatedEnd, tip);
  //   animationFrameId.current = requestAnimationFrame(loop);
  // }

  // ---- controls ----

  // function startAnimation() {
  //   if (running.current) return;
  //   running.current = true;
  //   startTime.current = performance.now();
  //   animationFrameId.current = requestAnimationFrame(loop);
  // }

  function startAnimation() {
    if (running.current) return;

    running.current = true;
    startTime.current = performance.now();
    animationFrameId.current = requestAnimationFrame(loop);
  }

  // function stopAnimation() {
  //   running.current = false;
  //   if (animationFrameId.current !== null) {
  //     cancelAnimationFrame(animationFrameId.current);
  //     animationFrameId.current = null;
  //   }
  // }

  function stopAnimation() {
    if (!running.current) return;

    running.current = false;

    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    pausedElapsed.current += performance.now() - startTime.current;
  }

  // function clearCanvas() {
  //   stopAnimation();
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  // }

  function clearCanvas() {
    stopAnimation();
    pausedElapsed.current = 0;
    drawInitialFrame();

    // const canvas = canvasRef.current;
    // if (!canvas) return;
    // const ctx = canvas.getContext("2d");
    // if (!ctx) return;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // function restartAnimation() {
  //   clearCanvas();
  //   startAnimation();
  // }

  function restartAnimation() {
    pausedElapsed.current = 0;
    startAnimation();
  }

  return (
    <div>
      <h1>Canvas</h1>
      <canvas ref={canvasRef} className={styles.canvas} />

      <Button onClick={startAnimation} variant="contained" color="success">
        Start
      </Button>
      <Button onClick={stopAnimation} variant="contained" color="secondary">
        Stop
      </Button>
      <Button onClick={restartAnimation} variant="contained" color="warning">
        Restart
      </Button>
      <Button onClick={clearCanvas} variant="contained" color="error">
        Clear
      </Button>
    </div>
  );
}
