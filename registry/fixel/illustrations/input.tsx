import { Card, CardPanel, Text } from "./kit";

export function InputIllustration({ className }: { className?: string }) {
  return (
    <Card className={className} withGradient={false}>
      <CardPanel className="px-6 py-4">
        <Text className="w-[60%]" />
      </CardPanel>
    </Card>
  );
}

export default InputIllustration;
