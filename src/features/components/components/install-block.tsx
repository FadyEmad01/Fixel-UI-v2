import { InstallTabs } from "@/shared/components/docs/install-tabs";
import {
  SourceExplorer,
  type SourceExplorerFile,
} from "@/shared/components/docs/source-explorer";
import { addCommands, dependencyCommands } from "@/shared/lib/registry/install";

/**
 * The install surface for one component: the `shadcn add` command, the
 * dependency command, and the manual file browser.
 *
 * Both the authored `<Install />` placeholder and the auto-appended
 * Installation section render this, so the two can never drift.
 */
export function InstallBlock({
  itemUrl,
  dependencies,
  files,
}: {
  itemUrl: string;
  dependencies: string[];
  files: SourceExplorerFile[];
}) {
  return (
    <InstallTabs
      automatic={addCommands(itemUrl)}
      dependencies={
        dependencies.length > 0 ? dependencyCommands(dependencies) : undefined
      }
      packages={dependencies}
    >
      <SourceExplorer files={files} />
    </InstallTabs>
  );
}
