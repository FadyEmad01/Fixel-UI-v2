import FolderPreview from "../folder-preview";

export default function FolderPreviewMinimal() {
  return (
    <FolderPreview
      image={{
        src: "/components/folder-preview/preview.webp",
        alt: "A folder lifted open to show its cover image",
      }}
      showLabel={false}
      animation={{ enabled: false }}
      width={150}
    />
  );
}
