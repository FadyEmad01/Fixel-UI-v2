import FolderPreview from "./folder-preview";

/**
 * Registry-only live-preview adapter.
 *
 * `FolderPreview` takes props, so the preview route cannot render the item file
 * directly. This file is never installed; it only exists so the site can show
 * the component in the catalog and on `/preview`.
 */
export default function FolderPreviewDemo() {
  return (
    <div className="flex w-full items-center justify-center p-10">
      <FolderPreview
        image={{
          src: "/components/folder-preview/preview.webp",
          alt: "A folder lifted open to show its cover image",
        }}
        label="Design assets"
      />
    </div>
  );
}
