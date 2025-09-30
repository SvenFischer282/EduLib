import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

export type BookFormValues = {
  title: string;
  author: string;
  isbn?: string;
  grade?: string;
  subject?: string;
  totalCopies: number;
};

export function BookForm({
  values,
  onChange,
  onSubmit,
}: {
  values: BookFormValues;
  onChange: (values: BookFormValues) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">Add Book</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <Input
          placeholder="Title"
          value={values.title}
          onChange={(e) => onChange({ ...values, title: e.target.value })}
        />
        <Input
          placeholder="Author"
          value={values.author}
          onChange={(e) => onChange({ ...values, author: e.target.value })}
        />
        <Input
          placeholder="ISBN"
          value={values.isbn || ""}
          onChange={(e) => onChange({ ...values, isbn: e.target.value })}
        />
        <Input
          placeholder="Grade"
          value={values.grade || ""}
          onChange={(e) => onChange({ ...values, grade: e.target.value })}
        />
        <Input
          placeholder="Subject (e.g., Biology, Physics)"
          value={values.subject || ""}
          onChange={(e) => onChange({ ...values, subject: e.target.value })}
        />
        <Input
          placeholder="Total Copies"
          type="number"
          value={values.totalCopies}
          onChange={(e) =>
            onChange({ ...values, totalCopies: Number(e.target.value) })
          }
        />
      </div>
      <Button className="mt-3" onClick={onSubmit}>
        Create
      </Button>
    </div>
  );
}
