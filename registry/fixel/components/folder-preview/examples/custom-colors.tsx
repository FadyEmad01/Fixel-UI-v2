import FolderPreview from "../folder-preview";

export default function FolderPreviewCustomColors() {
  return (
    <FolderPreview
      image={{
        src: "/components/folder-preview/preview.webp",
        alt: "A folder lifted open to show its cover image",
      }}
      label="Brand kit"
      width={320}
      colors={{
        back: { from: "#F9A8D4", to: "#EC4899" },
        front: { from: "#FBCFE8", to: "#F472B6" },
        label: "#BE185D",
      }}
      imagePanel={{ height: "60%", hoverY: "-85%" }}
      animation={{
        hoverScale: 1.08,
        transition: { type: "spring", stiffness: 200, damping: 18 },
      }}
    />
  );
}
