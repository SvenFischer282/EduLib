import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { LoanList } from "../features/loans/LoanList";
import { LoanListItem, Loan } from "../features/loans/LoanListItem";
import { Button } from "../ui/Button";

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
      <h1 className="mb-4 text-2xl font-bold">Librarian Loans</h1>
      <LoanList>
        {loans.map((l) => (
          <LoanListItem
            key={l._id}
            loan={l}
            showTeacher
            actions={
              <div className="flex items-center gap-2">
                {l.status === "Requested" && (
                  <>
                    <Button onClick={() => approve(l._id)}>Approve</Button>
                    <Button variant="ghost" onClick={() => reject(l._id)}>
                      Reject
                    </Button>
                  </>
                )}
                {(l.status === "Active" || l.status === "Overdue") && (
                  <Button onClick={() => markReturn(l._id)}>
                    Mark Returned
                  </Button>
                )}
              </div>
            }
          />
        ))}
      </LoanList>
    </div>
  );
}

export default LibrarianLoansPage;
