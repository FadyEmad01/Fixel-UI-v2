import { Card, CardPanel, TableRow } from "./kit";

export function TableIllustration({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardPanel className="p-0">
        <div className="divide-y divide-border">
          <TableRow />
          <TableRow />
          <TableRow />
        </div>
      </CardPanel>
    </Card>
  );
}

export default TableIllustration;
