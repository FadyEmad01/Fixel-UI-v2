import type { CubicBezierPoints } from "./types";

export function cubicBezierString(points: CubicBezierPoints) {
  return `cubic-bezier(${points[0]}, ${points[1]}, ${points[2]}, ${points[3]})`;
}

export function cssEaseCode(points: CubicBezierPoints) {
  return `transition-timing-function: ${cubicBezierString(points)};\n/* or */\nanimation-timing-function: ${cubicBezierString(points)};`;
}

export function motionEaseCode(points: CubicBezierPoints) {
  return `import { motion } from "motion/react"\n\n<motion.div\n  animate={{ x: 100 }}\n  transition={{ duration: 0.6, ease: [${points[0]}, ${points[1]}, ${points[2]}, ${points[3]}] }}\n/>`;
}

export function gsapEaseCode(points: CubicBezierPoints) {
  return `gsap.to(".element", {\n  x: 100,\n  duration: 0.6,\n  ease: "${cubicBezierString(points)}"\n});`;
}

// export function rawEaseCode(points: CubicBezierPoints) {
//   return `const ease = [${points[0]}, ${points[1]}, ${points[2]}, ${points[3]}] as const;`;
// }
export function rawEaseCode(points: CubicBezierPoints) {
  return `[${points[0]}, ${points[1]}, ${points[2]}, ${points[3]}]`;
}
