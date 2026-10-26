import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function ButtonIllustration({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "max-w-24 border-none bg-linear-to-b from-primary/90 to-primary",
        className,
      )}
      withGradient={false}
    >
      <CardPanel className="px-6 py-4">
        <Text className="bg-primary-foreground/40" />
      </CardPanel>
    </Card>
  );
}

export default ButtonIllustration;
