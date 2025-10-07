import { useState } from "react";
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

type BookFormErrors = {
  title?: string;
  author?: string;
  isbn?: string;
  subject?: string;
  totalCopies?: string;
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
  const [errors, setErrors] = useState<BookFormErrors>({});

  const validate = (): BookFormErrors => {
    const newErrors: BookFormErrors = {};
    if (!values.title) {
      newErrors.title = "Title is required";
    }
    if (!values.author) {
      newErrors.author = "Author is required";
    }
    if (values.isbn && !/^\d{10}(\d{3})?$/.test(values.isbn)) {
      newErrors.isbn = "ISBN must be 10 or 13 digits";
    }
    if (!values.subject) {
      newErrors.subject = "Subject is required";
    }
    if (!values.totalCopies || values.totalCopies <= 0) {
      newErrors.totalCopies = "Total copies must be a positive number";
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">Add Book</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <div>
          <Input
            placeholder="Title"
            value={values.title}
            onChange={(e) => onChange({ ...values, title: e.target.value })}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <div>
          <Input
            placeholder="Author"
            value={values.author}
            onChange={(e) => onChange({ ...values, author: e.target.value })}
            className={errors.author ? "border-red-500" : ""}
          />
          {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
        </div>
        <div>
          <Input
            placeholder="ISBN"
            value={values.isbn || ""}
            onChange={(e) => onChange({ ...values, isbn: e.target.value })}
            className={errors.isbn ? "border-red-500" : ""}
          />
          {errors.isbn && <p className="text-red-500 text-xs mt-1">{errors.isbn}</p>}
        </div>
        <Input
          placeholder="Grade"
          value={values.grade || ""}
          onChange={(e) => onChange({ ...values, grade: e.target.value })}
        />
        <div>
          <Input
            placeholder="Subject (e.g., Biology, Physics)"
            value={values.subject || ""}
            onChange={(e) => onChange({ ...values, subject: e.target.value })}
            className={errors.subject ? "border-red-500" : ""}
          />
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
        </div>
        <div>
          <Input
            placeholder="Total Copies"
            type="number"
            value={values.totalCopies}
            onChange={(e) =>
              onChange({ ...values, totalCopies: Number(e.target.value) })
            }
            className={errors.totalCopies ? "border-red-500" : ""}
          />
          {errors.totalCopies && <p className="text-red-500 text-xs mt-1">{errors.totalCopies}</p>}
        </div>
      </div>
      <Button className="mt-3" onClick={handleSubmit}>
        Create
      </Button>
    </div>
  );
}
