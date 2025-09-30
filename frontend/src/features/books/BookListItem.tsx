import { Button } from "../../ui/Button";

export type BookItemProps = {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  grade?: number | string;
  availableCopies: number;
  totalCopies: number;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
};

export function BookListItem({
  id,
  title,
  author,
  isbn,
  grade,
  availableCopies,
  totalCopies,
  canDelete,
  onDelete,
}: BookItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="mt-0.5 text-xs text-gray-500">
          {author} • ISBN {isbn || "—"} • Grade {grade} • Avail{" "}
          {availableCopies}/{totalCopies}
        </div>
      </div>
      {canDelete && onDelete && (
        <Button variant="ghost" onClick={() => onDelete(id)}>
          Delete
        </Button>
      )}
    </div>
  );
}
