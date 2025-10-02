import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { BookForm, BookFormValues } from "../features/books/BookForm";
import { BookListItem } from "../features/books/BookListItem";
import { BookList } from "../features/books/BookList";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Spinner } from "../ui/Spinner";
import { useDebounce } from "../ui/useDebounce";

export type Book = {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  grade?: number;
  subject?: string;
  totalCopies: number;
  availableCopies: number;
};

export function BooksPage() {
  const [items, setItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  // Request modal state
  const [requestModal, setRequestModal] = useState<{
    isOpen: boolean;
    bookId: string;
    title: string;
    availableCopies: number;
  }>({
    isOpen: false,
    bookId: "",
    title: "",
    availableCopies: 0,
  });
  const [requestQuantity, setRequestQuantity] = useState(1);

  // Advanced filters
  const [titleQ, setTitleQ] = useState("");
  const [authorQ, setAuthorQ] = useState("");
  const [isbnQ, setIsbnQ] = useState("");
  const [gradeQ, setGradeQ] = useState<string>("");
  const [subjectQ, setSubjectQ] = useState("");

  const dTitle = useDebounce(titleQ, 600);
  const dAuthor = useDebounce(authorQ, 600);
  const dIsbn = useDebounce(isbnQ, 600);
  const dGrade = useDebounce(gradeQ, 600);
  const dSubject = useDebounce(subjectQ, 600);

  const [form, setForm] = useState<BookFormValues>({
    title: "",
    author: "",
    isbn: "",
    grade: "",
    subject: "",
    totalCopies: 10,
  });
  const role = (localStorage.getItem("role") || "Teacher") as
    | "Teacher"
    | "Librarian";

  async function load() {
    setLoading(true);
    const res = await api.get<Book[]>("/books");
    setItems(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createBook() {
    await api.post("/books", {
      ...form,
      totalCopies: Number(form.totalCopies),
    });
    setForm({
      title: "",
      author: "",
      isbn: "",
      grade: "",
      subject: "",
      totalCopies: 10,
    });
    load();
  }

  async function remove(id: string) {
    await api.delete(`/books/${id}`);
    load();
  }

  function openRequestModal(
    id: string,
    title: string,
    availableCopies: number
  ) {
    setRequestModal({
      isOpen: true,
      bookId: id,
      title,
      availableCopies,
    });
    setRequestQuantity(1);
  }

  function closeRequestModal() {
    setRequestModal({
      isOpen: false,
      bookId: "",
      title: "",
      availableCopies: 0,
    });
  }

  async function submitRequest() {
    await api.post("/loans", {
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      loanItems: [
        {
          bookId: requestModal.bookId,
          title: requestModal.title,
          quantityBorrowed: requestQuantity,
        },
      ],
    });
    closeRequestModal();
    load();
  }

  const gradeOptions = useMemo(() => {
    const set = new Set<number>();
    items.forEach((b) => {
      if (typeof b.grade === "number") set.add(b.grade);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [items]);

  const filtered = useMemo(() => {
    const t = dTitle.trim().toLowerCase();
    const a = dAuthor.trim().toLowerCase();
    const i = dIsbn.trim().toLowerCase();
    const g = dGrade.trim();
    const s = dSubject.trim().toLowerCase();
    return items.filter((b) => {
      const titleOk = !t || b.title.toLowerCase().includes(t);
      const authorOk = !a || b.author.toLowerCase().includes(a);
      const isbnOk = !i || (b.isbn || "").toLowerCase().includes(i);
      const gradeOk = !g || String(b.grade ?? "") === g;
      const subjectOk = !s || (b.subject || "").toLowerCase().includes(s);
      return titleOk && authorOk && isbnOk && gradeOk && subjectOk;
    });
  }, [items, dTitle, dAuthor, dIsbn, dGrade, dSubject]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Books</h1>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <Input
          placeholder="Filter by title"
          value={titleQ}
          onChange={(e) => setTitleQ(e.target.value)}
        />
        <Input
          placeholder="Filter by author"
          value={authorQ}
          onChange={(e) => setAuthorQ(e.target.value)}
        />
        <Input
          placeholder="Filter by ISBN"
          value={isbnQ}
          onChange={(e) => setIsbnQ(e.target.value)}
        />
        <Select value={gradeQ} onChange={(e) => setGradeQ(e.target.value)}>
          <option value="">All grades</option>
          {gradeOptions.map((g) => (
            <option key={g} value={String(g)}>
              Grade {g}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Filter by subject"
          value={subjectQ}
          onChange={(e) => setSubjectQ(e.target.value)}
        />
      </div>

      {role === "Librarian" && (
        <BookForm values={form} onChange={setForm} onSubmit={createBook} />
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner />
          <span className="ml-2 text-gray-600">Loading books...</span>
        </div>
      ) : (
        <BookList>
          {filtered.map((b) => (
            <BookListItem
              key={b._id}
              id={b._id}
              title={b.title}
              author={b.author}
              isbn={b.isbn}
              grade={b.grade}
              subject={b.subject}
              availableCopies={b.availableCopies}
              totalCopies={b.totalCopies}
              canDelete={role === "Librarian"}
              canRequest={role === "Teacher"}
              onDelete={remove}
              onRequest={(id, title) => {
                const book = items.find((b) => b._id === id);
                if (book) openRequestModal(id, title, book.availableCopies);
              }}
            />
          ))}
        </BookList>
      )}

      {/* Request Modal */}
      <Modal
        isOpen={requestModal.isOpen}
        onClose={closeRequestModal}
        title={`Request: ${requestModal.title}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <Input
              type="number"
              min={1}
              max={requestModal.availableCopies}
              value={requestQuantity}
              onChange={(e) => setRequestQuantity(Number(e.target.value))}
            />
            <p className="text-xs text-gray-500 mt-1">
              Available: {requestModal.availableCopies} copies
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={closeRequestModal}>
              Cancel
            </Button>
            <Button
              onClick={submitRequest}
              disabled={
                requestQuantity < 1 ||
                requestQuantity > requestModal.availableCopies
              }
            >
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BooksPage;
