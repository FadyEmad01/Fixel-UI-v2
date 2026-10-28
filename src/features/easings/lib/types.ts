export type CubicBezierPoints = [
  x1: number,
  y1: number,
  x2: number,
  y2: number,
];

export type Easing = {
  slug: string;
  name: string;
  description: string;
  points: CubicBezierPoints;
};

export type EasingSheetItem = {
  slug: string;
  name: string;
  description: string;
  points: CubicBezierPoints;
  href: string;
  viewerHref: string;
};
