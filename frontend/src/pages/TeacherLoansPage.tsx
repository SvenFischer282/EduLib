import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { RequestForm, RequestFormValues } from "../features/loans/RequestForm";
import { LoanList } from "../features/loans/LoanList";
import { LoanListItem } from "../features/loans/LoanListItem";

type Book = { _id: string; title: string };

type LoanItem = { bookId: string; title: string; quantityBorrowed: number };

type Loan = {
  _id: string;
  status: string;
  dueDate: string;
  loanItems: LoanItem[];
};

export function TeacherLoansPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [form, setForm] = useState<RequestFormValues>({
    bookId: "",
    quantityBorrowed: 1,
  });

  async function load() {
    const [b, l] = await Promise.all([
      api.get<Book[]>("/books"),
      api.get<Loan[]>("/loans/my"),
    ]);
    setBooks(b.data);
    setLoans(l.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function submitRequest() {
    const selected = books.find((x) => x._id === form.bookId);
    const payload: LoanItem = {
      bookId: form.bookId,
      title: selected?.title || "",
      quantityBorrowed: form.quantityBorrowed,
    };
    await api.post("/loans", {
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      loanItems: [payload],
    });
    setForm({ bookId: "", quantityBorrowed: 1 });
    load();
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Teacher Loans</h1>
      <RequestForm
        books={books}
        values={form}
        onChange={setForm}
        onSubmit={submitRequest}
      />

      <h2 className="mt-6 text-lg font-semibold">My Loans</h2>
      <LoanList>
        {loans.map((l) => (
          <LoanListItem key={l._id} loan={l} />
        ))}
      </LoanList>
    </div>
  );
}

export default TeacherLoansPage;
