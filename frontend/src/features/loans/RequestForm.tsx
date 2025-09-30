import { Button } from "../../ui/Button";
import { Select } from "../../ui/Select";
import { Input } from "../../ui/Input";

export type RequestFormValues = {
  bookId: string;
  quantityBorrowed: number;
};

type Book = { _id: string; title: string };

export function RequestForm({
  books,
  values,
  onChange,
  onSubmit,
}: {
  books: Book[];
  values: RequestFormValues;
  onChange: (values: RequestFormValues) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">Request Class Loan</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <Select
          value={values.bookId}
          onChange={(e) => onChange({ ...values, bookId: e.target.value })}
        >
          <option value="">Select book…</option>
          {books.map((b) => (
            <option key={b._id} value={b._id}>
              {b.title}
            </option>
          ))}
        </Select>
        <Input
          type="number"
          min={1}
          value={values.quantityBorrowed}
          onChange={(e) =>
            onChange({ ...values, quantityBorrowed: Number(e.target.value) })
          }
        />
      </div>
      <Button className="mt-3" disabled={!values.bookId} onClick={onSubmit}>
        Submit Request
      </Button>
    </div>
  );
}
