"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { Button } from "@mui/material";
import { Caveat } from "next/font/google";

function quadraticAt(p0: number, p1: number, p2: number, t: number) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

export default function page() {
  const canvas = useRef<HTMLCanvasElement>(null);
 
    const canvasEl = canvas.current!;


  let animationFrameId: number | null = null;
  let startTime = 0;
  let running = false;

  useEffect(() => {
    const canvasEl = canvas.current!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvasEl.getBoundingClientRect();

    canvasEl.width = rect.width * dpr;
    canvasEl.height = rect.height * dpr;

    const ctx = canvasEl.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ---- base points ----
    const start = { x: 10, y: 390 };
    const baseControl = { x: 300, y: 350 };
    const baseEnd = { x: 450, y: 100 };

    const DRAW_DURATION = 10_000; // 10s
    const FLOAT_STAGE = 2_000; // 2s per direction
    const Y_AMPLITUDE = 50;
    const X_AMPLITUDE = 20;
    const RESOLUTION = 1000;

    const startTime = performance.now();

    // ---- image ----
    const tipImage = new Image();
    tipImage.src = "/icons/plane-00.svg"; // your image
    const TIP_SIZE = 32;

    function quadraticAt(p0: number, p1: number, p2: number, t: number) {
      return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    }

    function draw(
      progress: number,
      control: { x: number; y: number },
      end: { x: number; y: number },
      tip: { x: number; y: number }
    ) {
      ctx.clearRect(0, 0, rect.width, rect.height);

      const maxIndex = Math.floor(progress * RESOLUTION);

      // ---- fill ----
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
      gradient.addColorStop(0, "rgba(220, 38, 38, 0.8)");
      gradient.addColorStop(0.5, "rgba(220, 38, 38, 0.5)");
      gradient.addColorStop(1, "rgba(220, 38, 38, 0.1)");

      ctx.fillStyle = gradient;
      ctx.fill();

      // ---- stroke ----
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

      // ---- image at current curve tip ----
      if (tipImage.complete) {
        ctx.drawImage(
          tipImage,
          tip.x - TIP_SIZE / 2 + 10,
          tip.y - TIP_SIZE / 2 - 30,
          TIP_SIZE + 50,
          TIP_SIZE + 20
        );
      }
    }

    function animate(now: number) {
      const elapsed = now - startTime;

      // ---- phase 1 progress ----
      const progress = Math.min(elapsed / DRAW_DURATION, 1);

      let xOffset = 0;
      let yOffset = 0;

      if (progress === 1) {
        const t = (elapsed - DRAW_DURATION) / FLOAT_STAGE;
        const wave = Math.sin(t * Math.PI); // smooth, no jump

        yOffset = wave * Y_AMPLITUDE;
        xOffset = wave * X_AMPLITUDE;
      }

      // animated control & end (only deform in phase 2)
      const animatedEnd = {
        x: baseEnd.x + xOffset,
        y: baseEnd.y + yOffset,
      };

      const animatedControl = {
        x: baseControl.x + xOffset * 0.6,
        y: baseControl.y + yOffset * 0.6,
      };

      // ---- CURRENT TIP POSITION ----
      const tip = {
        x: quadraticAt(start.x, animatedControl.x, animatedEnd.x, progress),
        y: quadraticAt(start.y, animatedControl.y, animatedEnd.y, progress),
      };

      draw(progress, animatedControl, animatedEnd, tip);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, []);

  function startAnimation() {
    if (!canvasEl) return ;
    if (running) return;

    running = true;
    startTime = performance.now();

    const dpr = window.devicePixelRatio || 1;
    const rect = canvasEl.getBoundingClientRect();

    canvasEl.width = rect.width * dpr;
    canvasEl.height = rect.height * dpr;

    const ctx = canvasEl.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ---- base points ----
    const start = { x: 10, y: 390 };
    const baseControl = { x: 300, y: 350 };
    const baseEnd = { x: 450, y: 100 };

    const DRAW_DURATION = 10_000;
    const FLOAT_STAGE = 2_000;
    const Y_AMPLITUDE = 50;
    const X_AMPLITUDE = 20;
    const RESOLUTION = 1000;

    const tipImage = new Image();
    tipImage.src = "/tip.png";
    const TIP_SIZE = 32;

    function draw(
      progress: number,
      control: { x: number; y: number },
      end: { x: number; y: number },
      tip: { x: number; y: number }
    ) {
      ctx.clearRect(0, 0, rect.width, rect.height);

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

      // tip image
      if (tipImage.complete) {
        ctx.drawImage(
          tipImage,
          tip.x - TIP_SIZE / 2,
          tip.y - TIP_SIZE / 2,
          TIP_SIZE,
          TIP_SIZE
        );
      }
    }

    function loop(now: number) {
      if (!running) return;

      const elapsed = now - startTime;
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

      draw(progress, animatedControl, animatedEnd, tip);
      animationFrameId = requestAnimationFrame(loop);
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  function stopAnimation() {
    if (!canvasEl) return ;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    running = false;
  }

  function clearCanvas() {
    if (!canvasEl) return ;
    stopAnimation();
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }

  function restartAnimation() {
    clearCanvas();
    startAnimation();
  }

  return (
    <div>
      <h1>Canvas</h1>
      <canvas ref={canvas} className={styles.canvas}></canvas>
      <Button variant="contained" color="success" onClick={startAnimation} > start Animation</Button>
      <Button variant="contained" color="secondary" onClick={stopAnimation} > stop Animation</Button>
      <Button variant="contained" color="warning" onClick={restartAnimation} > reStart Animation</Button>
      <Button variant="contained" color="error" onClick={clearCanvas} > clear Canvas</Button>
    </div>
  );
}
