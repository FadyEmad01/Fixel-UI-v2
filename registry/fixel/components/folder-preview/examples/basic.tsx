import FolderPreview from "../folder-preview";

export default function FolderPreviewBasic() {
  return (
    <FolderPreview
      image={{
        src: "/components/folder-preview/preview.webp",
        alt: "A folder lifted open to show its cover image",
      }}
      width={150}
    />
  );
}
