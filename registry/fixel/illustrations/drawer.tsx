import { cn } from "@/lib/utils";
import { Card, CardPanel } from "./kit";

export function DrawerIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-1 flex-col justify-end gap-2",
        className,
      )}
    >
      <div className="flex-1 rounded-xl border border-input border-dashed" />
      <Card className="max-w-none shrink-0">
        <CardPanel className="pt-1 pb-12">
          <div className="flex justify-center py-2">
            <div className="h-1 w-12 rounded-full bg-muted-foreground/30" />
          </div>
        </CardPanel>
      </Card>
    </div>
  );
}

export default DrawerIllustration;
