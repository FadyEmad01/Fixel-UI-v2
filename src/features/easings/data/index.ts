import type { Easing } from "../lib/types";

export const easings: Easing[] = [
  {
    slug: "swift-out",
    name: "Swift Out",
    description: "A crisp, snappy cubic bezier with a quick exit.",
    points: [0.76, 0, 0.24, 1],
  },
  {
    slug: "swift-out2",
    name: "Swift Out2",
    description: "A crisp, snappy cubic bezier with a quick exit.",
    points: [1.00, -0.40, 0.35, 0.95],
  },
];

export function getEasing(slug: string): Easing | undefined {
  return easings.find((easing) => easing.slug === slug);
}

export function allEasings(): Easing[] {
  return easings;
}
