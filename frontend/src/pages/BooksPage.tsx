import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Book = {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  callNumber?: string;
  totalCopies: number;
  availableCopies: number;
};

export function BooksPage() {
  const [items, setItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    callNumber: "",
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
      callNumber: "",
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
      <h1>Books</h1>
      {role === "Librarian" && (
        <div className="card">
          <h2>Add Book</h2>
          <div className="grid">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              placeholder="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
            <input
              placeholder="ISBN"
              value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })}
            />
            <input
              placeholder="Call Number"
              value={form.callNumber}
              onChange={(e) => setForm({ ...form, callNumber: e.target.value })}
            />
            <input
              placeholder="Total Copies"
              type="number"
              value={form.totalCopies}
              onChange={(e) =>
                setForm({ ...form, totalCopies: Number(e.target.value) })
              }
            />
          </div>
          <button className="btn" onClick={createBook}>
            Create
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="list">
          {items.map((b) => (
            <div key={b._id} className="item">
              <div>
                <div className="title">{b.title}</div>
                <div className="meta">
                  {b.author} • ISBN {b.isbn || "—"} • Avail {b.availableCopies}/
                  {b.totalCopies}
                </div>
              </div>
              {role === "Librarian" && (
                <button className="btn ghost" onClick={() => remove(b._id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BooksPage;
