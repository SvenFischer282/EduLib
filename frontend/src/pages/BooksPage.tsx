import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { BookForm, BookFormValues } from "../features/books/BookForm";
import { BookListItem } from "../features/books/BookListItem";
import { BookList } from "../features/books/BookList";

export type Book = {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  grade?: number;
  totalCopies: number;
  availableCopies: number;
};

export function BooksPage() {
  const [items, setItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<BookFormValues>({
    title: "",
    author: "",
    isbn: "",
    grade: "",
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
      totalCopies: 10,
    });
    load();
  }

  async function remove(id: string) {
    await api.delete(`/books/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Books</h1>
      {role === "Librarian" && (
        <BookForm values={form} onChange={setForm} onSubmit={createBook} />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <BookList>
          {items.map((b) => (
            <BookListItem
              key={b._id}
              id={b._id}
              title={b.title}
              author={b.author}
              isbn={b.isbn}
              grade={b.grade}
              availableCopies={b.availableCopies}
              totalCopies={b.totalCopies}
              canDelete={role === "Librarian"}
              onDelete={remove}
            />
          ))}
        </BookList>
      )}
    </div>
  );
}

export default BooksPage;
