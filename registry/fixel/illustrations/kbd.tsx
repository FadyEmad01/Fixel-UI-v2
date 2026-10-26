import { cn } from "@/lib/utils";
import { Card, CardPanel } from "./kit";

export function KbdIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Card className="size-10">
        <CardPanel className="flex items-center justify-center p-0 text-muted-foreground/88 leading-none">
          ⌘
        </CardPanel>
      </Card>
      <Card className="size-10">
        <CardPanel className="flex items-center justify-center p-0 text-muted-foreground/88 leading-none">
          K
        </CardPanel>
      </Card>
    </div>
  );
}

export default KbdIllustration;
