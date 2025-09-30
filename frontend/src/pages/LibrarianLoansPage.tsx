import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { LoanList } from "../features/loans/LoanList";
import { LoanListItem, Loan } from "../features/loans/LoanListItem";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import { useDebounce } from "../ui/useDebounce";

export function LibrarianLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [status, setStatus] = useState<string>("");
  const [teacher, setTeacher] = useState<string>("");
  const [query, setQuery] = useState("");
  const debouncedTeacher = useDebounce(teacher, 600);
  const debouncedQuery = useDebounce(query, 600);

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

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const t = debouncedTeacher.trim().toLowerCase();
    return loans.filter((l) => {
      const statusOk = !status || l.status === status;
      const teacherOk = !t || (l.teacherName || "").toLowerCase().includes(t);
      const title = l.loanItems[0]?.title || "";
      const textOk = !q || title.toLowerCase().includes(q);
      return statusOk && teacherOk && textOk;
    });
  }, [loans, status, debouncedTeacher, debouncedQuery]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Librarian Loans</h1>

      <div className="mb-3 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="Requested">Requested</option>
          <option value="Active">Active</option>
          <option value="Overdue">Overdue</option>
          <option value="Closed">Closed</option>
        </Select>
        <Input
          placeholder="Filter by teacher"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
        />
        <Input
          placeholder="Filter by title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <LoanList>
        {filtered.map((l) => (
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
