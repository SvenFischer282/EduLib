import { Button } from "../../ui/Button";
import { BASE_URL } from "../../lib/api";

export type BookItemProps = {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  grade?: number | string;
  subject?: string;
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
  subject,
  availableCopies,
  totalCopies,
  canDelete,
  onDelete,
}: BookItemProps) {
  const coverUrl = `${BASE_URL}/books/${id}/cover`;
  const fallbackUrl =
    "/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg";

  function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (img.src.endsWith(fallbackUrl)) return;
    img.src = fallbackUrl;
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-3">
        <img
          src={coverUrl}
          alt={title}
          onError={handleImgError}
          className="h-20 w-15 rounded object-cover"
        />
        <div>
          <div className="font-semibold">{title}</div>
          <div className="mt-0.5 text-xs text-gray-500">
            {author} • ISBN {isbn || "—"} • Grade {grade} • {subject || "—"} •
            Avail {availableCopies}/{totalCopies}
          </div>
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
