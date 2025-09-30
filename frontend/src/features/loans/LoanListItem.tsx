export type LoanItem = {
  bookId: string;
  title: string;
  quantityBorrowed: number;
};
export type Loan = {
  _id: string;
  status: string;
  dueDate: string;
  loanItems: LoanItem[];
  teacherName?: string;
};

type Props = {
  loan: Loan;
  actions?: React.ReactNode;
  showTeacher?: boolean;
};

export function LoanListItem({ loan, actions, showTeacher }: Props) {
  const first = loan.loanItems[0];
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
      <div>
        <div className="font-semibold">
          {showTeacher ? `${loan.teacherName} • ` : null}
          {first?.title} x {first?.quantityBorrowed}
        </div>
        <div className="mt-0.5 text-xs text-gray-500">
          Status: {loan.status} • Due:{" "}
          {new Date(loan.dueDate).toLocaleDateString()}
        </div>
      </div>
      {actions}
    </div>
  );
}
