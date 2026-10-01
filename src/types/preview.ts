export type PreviewConfig =
  | {
      renderer: "react";
      source: string;
    }
  | {
      renderer: "image";
      src: string;
      alt: string;
    }
  | {
      renderer: "video";
      src: string;
      poster?: string;
    }
  | {
      renderer: "svg";
      source: string;
    }
  | {
      renderer: "easing";
      source: string;
    }
  | {
      renderer: "code";
      file: string;
      language: string;
    }
  | {
      renderer: "none";
    };
