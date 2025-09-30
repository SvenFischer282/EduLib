import { useEffect, useState } from "react";
import { api } from "../lib/api";

type LoanItem = { bookId: string; title: string; quantityBorrowed: number };
type Loan = {
  _id: string;
  status: string;
  dueDate: string;
  loanItems: LoanItem[];
  teacherName: string;
};

export function LibrarianLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);

  async function load() {
    const res = await api.get<Loan[]>("/loans");
    setLoans(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    await api.put(`/loans/${id}/approve`);
    load();
  }
  async function reject(id: string) {
    await api.put(`/loans/${id}/reject`);
    load();
  }
  async function markReturn(id: string) {
    await api.put(`/loans/${id}/return`);
    load();
  }

  return (
    <div>
      <h1>Librarian Loans</h1>
      <div className="list">
        {loans.map((l) => (
          <div key={l._id} className="item">
            <div>
              <div className="title">
                {l.teacherName} • {l.loanItems[0]?.title} x{" "}
                {l.loanItems[0]?.quantityBorrowed}
              </div>
              <div className="meta">
                Status: {l.status} • Due:{" "}
                {new Date(l.dueDate).toLocaleDateString()}
              </div>
            </div>
            <div className="actions">
              {l.status === "Requested" && (
                <>
                  <button className="btn" onClick={() => approve(l._id)}>
                    Approve
                  </button>
                  <button className="btn ghost" onClick={() => reject(l._id)}>
                    Reject
                  </button>
                </>
              )}
              {(l.status === "Active" || l.status === "Overdue") && (
                <button className="btn" onClick={() => markReturn(l._id)}>
                  Mark Returned
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LibrarianLoansPage;
