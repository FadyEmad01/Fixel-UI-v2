import {
  SourceExplorer,
  type SourceExplorerFile,
} from "@/shared/components/docs/source-explorer";

/**
 * The manual file browser used by the Source section.
 *
 * Highlighted HTML is prepared once on the server, so the authored `<Source />`
 * and the appended default section share a single render.
 */
export function SourceBlock({ files }: { files: SourceExplorerFile[] }) {
  return <SourceExplorer files={files} />;
}
