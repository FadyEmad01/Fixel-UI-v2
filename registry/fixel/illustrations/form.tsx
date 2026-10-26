import { cn } from "@/lib/utils";
import { Card, CardPanel, FormField } from "./kit";

export function FormIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex max-w-50 flex-1 flex-col gap-4", className)}>
      <FormField />
      <Card
        className="border-none bg-linear-to-b from-primary/90 to-primary"
        withGradient={false}
      >
        <CardPanel className="py-3.5" />
      </Card>
    </div>
  );
}

export default FormIllustration;
