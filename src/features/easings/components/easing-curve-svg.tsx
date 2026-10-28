// // "use client";

// // import { useEffect, useState } from "react";
// // import type { CubicBezierPoints } from "../lib/types";

// // interface EasingCurveSvgProps {
// //   points: CubicBezierPoints;
// //   width?: number;
// //   height?: number;
// //   padding?: number;
// //   showGrid?: boolean;
// //   animate?: boolean;
// //   duration?: number;
// //   pauseDuration?: number;
// //   showEndedCircle?: boolean;
// // }

// // function useAnimationKey(duration: number, pauseDuration: number) {
// //   const [key, setKey] = useState(0);

// //   useEffect(() => {
// //     if (duration <= 0) return;
// //     const timer = setInterval(
// //       () => {
// //         setKey((prevKey) => prevKey + 1);
// //       },
// //       (duration + pauseDuration) * 1000,
// //     );

// //     return () => clearInterval(timer);
// //   }, [duration, pauseDuration]);

// //   return key;
// // }

// // export function EasingCurveSvg({
// //   points,
// //   width = 140,
// //   height = 140,
// //   padding = 20,
// //   showGrid = true,
// //   animate = true,
// //   duration = 1,
// //   pauseDuration = 1,
// //   showEndedCircle = false,
// // }: EasingCurveSvgProps) {
// //   const plotSize = width - 2 * padding;
// //   const key = useAnimationKey(duration, pauseDuration);

// //   return (
// //     <svg
// //       aria-label="Easing curve"
// //       role="img"
// //       className="w-full h-full"
// //       height={height}
// //       viewBox={`0 0 ${width} ${height}`}
// //       width={width}
// //     >
// //       {showGrid && (
// //         <>
// //           {/* <rect
// //             className="fill-none stroke-muted-foreground/20"
// //             height={plotSize}
// //             strokeWidth="1"
// //             width={plotSize}
// //             x={padding}
// //             y={padding}
// //           /> */}
// //           <line
// //             className="stroke-muted-foreground/20"
// //             strokeWidth="1"
// //             strokeDasharray="4 4"
// //             x1={padding}
// //             x2={width - padding}
// //             y1={height - padding}
// //             y2={padding}
// //           />
// //         </>
// //       )}

// //       <path
// //         className="stroke-muted-foreground"
// //         d={`M${padding},${height - padding} C${padding + points[0] * plotSize},${height - padding - points[1] * plotSize} ${padding + points[2] * plotSize},${height - padding - points[3] * plotSize} ${padding + plotSize},${height - padding - plotSize}`}
// //         fill="none"
// //         strokeWidth="2"
// //         strokeLinecap="round"
// //       />

// //       {showEndedCircle && (
// //         <>
// //           <circle
// //             className="fill-muted-foreground"
// //             cx={padding}
// //             cy={height - padding}
// //             r="4"
// //           />
// //           <circle
// //             className="fill-muted-foreground"
// //             cx={width - padding}
// //             cy={padding}
// //             r="4"
// //           />
// //         </>

// //       )}

// //       {animate && duration > 0 && (
// //         <g
// //           className="animated-circle"
// //           key={`${key}-${duration}-${pauseDuration}`}
// //           style={{
// //             animationDuration: `${duration}s`,
// //             animationFillMode: "forwards",
// //             animationIterationCount: "1",
// //             animationName: "moveCircleVertically",
// //             animationTimingFunction: `cubic-bezier(${points.join(",")})`,
// //           }}
// //         >
// //           <circle
// //             className="fill-my-secondary"
// //             cx={padding}
// //             cy={height - padding}
// //             r="4"
// //             style={{
// //               animationDuration: `${duration}s`,
// //               animationFillMode: "forwards",
// //               animationIterationCount: "1",
// //               animationName: "moveCircleHorizontally",
// //               animationTimingFunction: "linear",
// //             }}
// //           />
// //         </g>
// //       )}
// //       <style jsx>{`
// //         @keyframes moveCircleHorizontally {
// //           0% {
// //             transform: translateX(0);
// //           }
// //           100% {
// //             transform: translateX(${plotSize}px);
// //           }
// //         }
// //         @keyframes moveCircleVertically {
// //           0% {
// //             transform: translateY(0);
// //           }
// //           100% {
// //             transform: translateY(-${plotSize}px);
// //           }
// //         }
// //       `}</style>
// //     </svg>
// //   );
// // }


// "use client";

// import {
//   useEffect,
//   useState,
//   type CSSProperties,
// } from "react";
// import type { CubicBezierPoints } from "../lib/types";

// interface EasingCurveSvgProps {
//   points: CubicBezierPoints;
//   width?: number;
//   height?: number;
//   padding?: number;
//   showGrid?: boolean;
//   animate?: boolean;
//   duration?: number;
//   pauseDuration?: number;
//   showEndedCircle?: boolean;
// }

// function useAnimationKey(duration: number, pauseDuration: number) {
//   const [key, setKey] = useState(0);

//   useEffect(() => {
//     if (duration <= 0) return;

//     const timer = setInterval(() => {
//       setKey((prevKey) => prevKey + 1);
//     }, (duration + pauseDuration) * 1000);

//     return () => clearInterval(timer);
//   }, [duration, pauseDuration]);

//   return key;
// }

// export function EasingCurveSvg({
//   points,
//   width = 140,
//   height = 140,
//   padding = 20,
//   showGrid = true,
//   animate = true,
//   duration = 1,
//   pauseDuration = 1,
//   showEndedCircle = false,
// }: EasingCurveSvgProps) {
//   const plotSize = width - 2 * padding;
//   const key = useAnimationKey(duration, pauseDuration);

//   const animationStyle = {
//     "--easing-plot-size": `${plotSize}px`,
//     animationDuration: `${duration}s`,
//     animationFillMode: "forwards",
//     animationIterationCount: 1,
//     animationTimingFunction: `cubic-bezier(${points.join(",")})`,
//   } as CSSProperties & {
//     "--easing-plot-size": string;
//   };

//   return (
//     <svg
//       aria-label="Easing curve"
//       role="img"
//       className="h-full w-full"
//       height={height}
//       viewBox={`0 0 ${width} ${height}`}
//       width={width}
//     >
//       {showGrid && (
//         <line
//           className="stroke-muted-foreground/20"
//           strokeWidth="1"
//           strokeDasharray="4 4"
//           x1={padding}
//           x2={width - padding}
//           y1={height - padding}
//           y2={padding}
//         />
//       )}

//       <path
//         className="stroke-muted-foreground"
//         d={`M${padding},${height - padding} C${
//           padding + points[0] * plotSize
//         },${height - padding - points[1] * plotSize} ${
//           padding + points[2] * plotSize
//         },${height - padding - points[3] * plotSize} ${
//           padding + plotSize
//         },${height - padding - plotSize}`}
//         fill="none"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />

//       {showEndedCircle && (
//         <>
//           <circle
//             className="fill-muted-foreground"
//             cx={padding}
//             cy={height - padding}
//             r="4"
//           />

//           <circle
//             className="fill-muted-foreground"
//             cx={width - padding}
//             cy={padding}
//             r="4"
//           />
//         </>
//       )}

//       {animate && duration > 0 && (
//         <g
//           className="animated-circle easing-circle-vertical"
//           key={`${key}-${duration}-${pauseDuration}`}
//           style={animationStyle}
//         >
//           <circle
//             className="fill-my-secondary easing-circle-horizontal"
//             cx={padding}
//             cy={height - padding}
//             r="4"
//             style={{
//               animationDuration: `${duration}s`,
//               animationFillMode: "forwards",
//               animationIterationCount: 1,
//             }}
//           />
//         </g>
//       )}
//     </svg>
//   );
// }

"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { CubicBezierPoints } from "../lib/types";

interface EasingCurveSvgProps {
  points: CubicBezierPoints;
  width?: number;
  height?: number;
  padding?: number;
  showGrid?: boolean;
  animate?: boolean;
  duration?: number;
  pauseDuration?: number;
  showEndedCircle?: boolean;
}

function useAnimationKey(duration: number, pauseDuration: number) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setInterval(() => {
      setKey((previous) => previous + 1);
    }, (duration + pauseDuration) * 1000);

    return () => clearInterval(timer);
  }, [duration, pauseDuration]);

  return key;
}

export function EasingCurveSvg({
  points,
  width = 140,
  height = 140,
  padding = 20,
  showGrid = true,
  animate = true,
  duration = 1,
  pauseDuration = 1,
  showEndedCircle = false,
}: EasingCurveSvgProps) {
  const plotSize = width - 2 * padding;
  const key = useAnimationKey(duration, Math.max(0, pauseDuration));

  const animationDirection = key % 2 === 0 ? "normal" : "reverse";

  const animationStyle: CSSProperties & {
    "--easing-plot-size": string;
  } = {
    "--easing-plot-size": `${plotSize}px`,
    animationDuration: `${duration}s`,
    animationFillMode: "forwards",
    animationIterationCount: 1,
    animationDirection,
    animationTimingFunction: `cubic-bezier(${points.join(",")})`,
  };

  return (
    <svg
      aria-label="Easing curve"
      role="img"
      className="h-full w-full"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      {showGrid && (
        <line
          className="stroke-muted-foreground/20"
          strokeWidth="1"
          strokeDasharray="4 4"
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={padding}
        />
      )}

      <path
        className="stroke-muted-foreground"
        d={`M${padding},${height - padding} C${
          padding + points[0] * plotSize
        },${height - padding - points[1] * plotSize} ${
          padding + points[2] * plotSize
        },${height - padding - points[3] * plotSize} ${
          padding + plotSize
        },${height - padding - plotSize}`}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {showEndedCircle && (
        <>
          <circle
            className="fill-muted-foreground"
            cx={padding}
            cy={height - padding}
            r="4"
          />

          <circle
            className="fill-muted-foreground"
            cx={width - padding}
            cy={padding}
            r="4"
          />
        </>
      )}

      {animate && duration > 0 && (
        <g
          key={`${key}-${duration}-${pauseDuration}`}
          className="animated-circle easing-circle-vertical"
          style={animationStyle}
        >
          <circle
            className="fill-my-secondary easing-circle-horizontal"
            cx={padding}
            cy={height - padding}
            r="4"
            style={{
              animationDuration: `${duration}s`,
              animationFillMode: "forwards",
              animationIterationCount: 1,
              animationDirection,
            }}
          />
        </g>
      )}
    </svg>
  );
}