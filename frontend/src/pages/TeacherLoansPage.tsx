import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { RequestForm, RequestFormValues } from "../features/loans/RequestForm";
import { LoanList } from "../features/loans/LoanList";
import { LoanListItem } from "../features/loans/LoanListItem";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";
import { useDebounce } from "../ui/useDebounce";

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
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RequestFormValues>({
    bookId: "",
    quantityBorrowed: 1,
  });
  const [status, setStatus] = useState<string>("");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 600);

  async function load() {
    setLoading(true);
    try {
      const [b, l] = await Promise.all([
        api.get<Book[]>("/books"),
        api.get<Loan[]>("/loans/my"),
      ]);
      setBooks(b.data);
      setLoans(l.data);
    } finally {
      setLoading(false);
    }
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

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return loans.filter((l) => {
      const statusOk = !status || l.status === status;
      const title = l.loanItems[0]?.title || "";
      const textOk = !q || title.toLowerCase().includes(q);
      return statusOk && textOk;
    });
  }, [loans, status, debouncedQuery]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Teacher Loans</h1>
      <RequestForm
        books={books}
        values={form}
        onChange={setForm}
        onSubmit={submitRequest}
      />

      <div className="mt-6 mb-3 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="Requested">Requested</option>
          <option value="Active">Active</option>
          <option value="Overdue">Overdue</option>
          <option value="Closed">Closed</option>
        </Select>
        <Input
          placeholder="Filter by title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <h2 className="mt-2 text-lg font-semibold">My Loans</h2>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner />
          <span className="ml-2 text-gray-600">Loading loans...</span>
        </div>
      ) : (
        <LoanList>
          {filtered.map((l) => (
            <LoanListItem key={l._id} loan={l} />
          ))}
        </LoanList>
      )}
    </div>
  );
}

export default TeacherLoansPage;
