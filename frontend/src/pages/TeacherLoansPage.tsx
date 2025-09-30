import { useEffect, useState } from "react";
import { api } from "../lib/api";

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
  const [form, setForm] = useState<LoanItem>({
    bookId: "",
    title: "",
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

  function selectBook(id: string) {
    const b = books.find((x) => x._id === id);
    setForm({ ...form, bookId: id, title: b?.title || "" });
  }

  async function submitRequest() {
    await api.post("/loans", {
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      loanItems: [form],
    });
    setForm({ bookId: "", title: "", quantityBorrowed: 1 });
    load();
  }

  return (
    <div>
      <h1>Teacher Loans</h1>
      <div className="card">
        <h2>Request Class Loan</h2>
        <div className="grid">
          <select
            value={form.bookId}
            onChange={(e) => selectBook(e.target.value)}
          >
            <option value="">Select book…</option>
            {books.map((b) => (
              <option key={b._id} value={b._id}>
                {b.title}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={form.quantityBorrowed}
            onChange={(e) =>
              setForm({ ...form, quantityBorrowed: Number(e.target.value) })
            }
          />
        </div>
        <button className="btn" disabled={!form.bookId} onClick={submitRequest}>
          Submit Request
        </button>
      </div>

      <h2>My Loans</h2>
      <div className="list">
        {loans.map((l) => (
          <div key={l._id} className="item">
            <div>
              <div className="title">
                {l.loanItems[0]?.title} x {l.loanItems[0]?.quantityBorrowed}
              </div>
              <div className="meta">
                Status: {l.status} • Due:{" "}
                {new Date(l.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherLoansPage;
