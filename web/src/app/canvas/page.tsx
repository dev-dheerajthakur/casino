"use client";
import React, { useEffect, useRef } from "react";
import styles from "./page.module.css";

function quadraticAt(p0: number, p1: number, p2: number, t: number) {
  return (1 - t) * (1 - t) * p0 +
         2 * (1 - t) * t * p1 +
         t * t * p2;
}


export default function page() {
  const canvas = useRef<HTMLCanvasElement>(null);

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

  const DRAW_DURATION = 5_000; // 10s
  const FLOAT_STAGE = 3_000;    // 2s per direction
  const Y_AMPLITUDE = 30;       // px
  const X_AMPLITUDE = 30;       // px
  const RESOLUTION = 1000;

  const startTime = performance.now();

  function quadraticAt(p0: number, p1: number, p2: number, t: number) {
    return (
      (1 - t) * (1 - t) * p0 +
      2 * (1 - t) * t * p1 +
      t * t * p2
    );
  }

  function draw(
    progress: number,
    control: { x: number; y: number },
    end: { x: number; y: number }
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
  }

  function animate(now: number) {
    const elapsed = now - startTime;

    // ---- phase 1: reveal ----
    const progress = Math.min(elapsed / DRAW_DURATION, 1);

    // ---- phase 2: smooth endpoint motion (NO JUMP) ----
    let yOffset = 0;
    let xOffset = 0;

    if (progress === 1) {
      const t = (elapsed - DRAW_DURATION) / FLOAT_STAGE;

      // sin(0) = 0 → starts exactly where it ended
      const wave = Math.sin(t * Math.PI);

      // down when positive, up when negative
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

    draw(progress, animatedControl, animatedEnd);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}, []);


// useEffect(() => {
//   const canvasEl = canvas.current!;
//   const dpr = window.devicePixelRatio || 1;
//   const rect = canvasEl.getBoundingClientRect();

//   canvasEl.width = rect.width * dpr;
//   canvasEl.height = rect.height * dpr;

//   const ctx = canvasEl.getContext("2d")!;
//   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

//   // ---- base points ----
//   const start = { x: 10, y: 390 };
//   const baseControl = { x: 300, y: 350 };
//   const baseEnd = { x: 450, y: 100 };

//   const DRAW_DURATION = 5_000; // 10s
//   const FLOAT_STAGE = 2_000;    // 2s per direction
//   const Y_AMPLITUDE = 30;       // px
//   const X_AMPLITUDE = 30;       // px
//   const RESOLUTION = 1000;

//   const startTime = performance.now();

//   function quadraticAt(p0: number, p1: number, p2: number, t: number) {
//     return (
//       (1 - t) * (1 - t) * p0 +
//       2 * (1 - t) * t * p1 +
//       t * t * p2
//     );
//   }

//   function draw(
//     progress: number,
//     control: { x: number; y: number },
//     end: { x: number; y: number }
//   ) {
//     ctx.clearRect(0, 0, rect.width, rect.height);

//     const maxIndex = Math.floor(progress * RESOLUTION);

//     // ---- fill ----
//     ctx.beginPath();
//     ctx.moveTo(start.x, start.y);

//     for (let i = 0; i <= maxIndex; i++) {
//       const t = i / RESOLUTION;
//       ctx.lineTo(
//         quadraticAt(start.x, control.x, end.x, t),
//         quadraticAt(start.y, control.y, end.y, t)
//       );
//     }

//     ctx.lineTo(
//       quadraticAt(start.x, control.x, end.x, maxIndex / RESOLUTION),
//       start.y
//     );
//     ctx.closePath();

//     const gradient = ctx.createLinearGradient(0, 100, 0, 390);
//     gradient.addColorStop(0, "rgba(220, 38, 38, 0.8)");
//     gradient.addColorStop(0.5, "rgba(220, 38, 38, 0.5)");
//     gradient.addColorStop(1, "rgba(220, 38, 38, 0.1)");

//     ctx.fillStyle = gradient;
//     ctx.fill();

//     // ---- stroke ----
//     ctx.beginPath();
//     ctx.moveTo(start.x, start.y);

//     for (let i = 0; i <= maxIndex; i++) {
//       const t = i / RESOLUTION;
//       ctx.lineTo(
//         quadraticAt(start.x, control.x, end.x, t),
//         quadraticAt(start.y, control.y, end.y, t)
//       );
//     }

//     ctx.strokeStyle = "#000";
//     ctx.lineWidth = 4;
//     ctx.stroke();
//   }

//   function animate(now: number) {
//     const elapsed = now - startTime;

//     // ---- phase 1: reveal ----
//     const progress = Math.min(elapsed / DRAW_DURATION, 1);

//     // ---- phase 2: endpoint motion ----
//     let yOffset = 0;
//     let xOffset = 0;

//     if (progress === 1) {
//       const t =
//         ((elapsed - DRAW_DURATION) % (FLOAT_STAGE * 2)) / FLOAT_STAGE;

//       // triangle wave 0 → 1 → 0
//       const phase = t < 1 ? t : 2 - t;

//       // vertical: up/down
//       yOffset = (phase * 2 - 1) * Y_AMPLITUDE;

//       // horizontal: forward on down, backward on up
//       xOffset = (phase * 2 - 1) * X_AMPLITUDE;
//     }

//     const animatedEnd = {
//       x: baseEnd.x + xOffset,
//       y: baseEnd.y + yOffset,
//     };

//     const animatedControl = {
//       x: baseControl.x + xOffset * 0.6,
//       y: baseControl.y + yOffset * 0.6,
//     };

//     draw(progress, animatedControl, animatedEnd);
//     requestAnimationFrame(animate);
//   }

//   requestAnimationFrame(animate);
// }, []);








//   useEffect(() => {
//   const canvasEl = canvas.current!;
//   const dpr = window.devicePixelRatio || 1;
//   const rect = canvasEl.getBoundingClientRect();

//   canvasEl.width = rect.width * dpr;
//   canvasEl.height = rect.height * dpr;

//   const ctx = canvasEl.getContext("2d")!;
//   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

//   const start = { x: 10, y: 390 };
//   const control = { x: 300, y: 350 };
//   const end = { x: 450, y: 100 };

//   const duration = 10_000; // 10 seconds
//   const startTime = performance.now();


//   const RESOLUTION = 1000;

// function draw(progress: number) {
//   ctx.clearRect(0, 0, rect.width, rect.height);

//   const maxIndex = Math.floor(progress * RESOLUTION);

//   // ---- fill ----
//   ctx.beginPath();
//   ctx.moveTo(start.x, start.y);

//   for (let i = 0; i <= maxIndex; i++) {
//     const t = i / RESOLUTION;
//     const x = quadraticAt(start.x, control.x, end.x, t);
//     const y = quadraticAt(start.y, control.y, end.y, t);
//     ctx.lineTo(x, y);
//   }

//   ctx.lineTo(
//     quadraticAt(start.x, control.x, end.x, maxIndex / RESOLUTION),
//     start.y
//   );
//   ctx.closePath();


//     const gradient = ctx.createLinearGradient(0, 100, 0, 390);
//     gradient.addColorStop(0, "rgba(220, 38, 38, 0.8)");
//     gradient.addColorStop(0.5, "rgba(220, 38, 38, 0.5)");
//     gradient.addColorStop(1, "rgba(220, 38, 38, 0.1)");

//   ctx.fillStyle = gradient;
//   ctx.fill();

//   // ---- stroke ----
//   ctx.beginPath();
//   ctx.moveTo(start.x, start.y);

//   for (let i = 0; i <= maxIndex; i++) {
//     const t = i / RESOLUTION;
//     const x = quadraticAt(start.x, control.x, end.x, t);
//     const y = quadraticAt(start.y, control.y, end.y, t);
//     ctx.lineTo(x, y);
//   }


//     ctx.strokeStyle = "#000000ff";
//     ctx.lineWidth = 4;

//   ctx.stroke();
// }


//   function animate(now: number) {
//     const elapsed = now - startTime;
//     const progress = Math.min(elapsed / duration, 1);

//     draw(progress);

//     if (progress < 1) {
//       requestAnimationFrame(animate);
//     }
//   }

//   requestAnimationFrame(animate);
// }, []);




  // useEffect(() => {
  //   const dpr = window.devicePixelRatio || 1;

  //   const canvass = canvas.current!;
  //   const rect = canvass.getBoundingClientRect();
  //   canvass.width = rect.width * dpr;
  //   canvass.height = rect.height * dpr;

  //   const ctx = canvass.getContext("2d");
  //   ctx?.scale(dpr, dpr);
  //   if (!ctx) return;
  //   // ctx?.beginPath()
  //   // ctx?.moveTo(10, 100)
  //   // ctx?.quadraticCurveTo(100, 100, 200, 10)
  //   // ctx?.stroke()

  //   ctx.beginPath();
  //   ctx.moveTo(10, 390);
  //   // ctx?.quadraticCurveTo(210, 350, 300, 270);
  //   ctx?.quadraticCurveTo(300, 350, 450, 100);
  //   ctx.lineTo(450, 390);
  //   // ctx.lineTo(0, 200);
  //   ctx.closePath();

  //   const gradient = ctx.createLinearGradient(0, 100, 0, 390);
  //   gradient.addColorStop(0, "rgba(220, 38, 38, 0.8)");
  //   gradient.addColorStop(0.5, "rgba(220, 38, 38, 0.5)");
  //   gradient.addColorStop(1, "rgba(220, 38, 38, 0.1)");

  //   ctx.fillStyle = gradient;
  //   ctx.fill();

  //   ctx.beginPath();
  //   ctx.moveTo(10, 390);
  //   ctx?.quadraticCurveTo(300, 350, 450, 100);

  //   // ctx?.quadraticCurveTo(210, 350, 300, 270);
  //   // ctx.lineTo(200, 100);

  //   // ctx.beginPath();
  //   // ctx.moveTo(points[0][0], points[0][1]);
  //   // for (let i = 1; i < points.length; i++) {
  //   //   ctx.lineTo(points[i][0], points[i][1]);
  //   // }
  //   ctx.strokeStyle = "#000000ff";
  //   ctx.lineWidth = 4;
  //   ctx.stroke();
  // }, []);

  return (
    <div>
      <h1>Canvas</h1>
      <canvas ref={canvas} className={styles.canvas}></canvas>
    </div>
  );
}
