import { ReactNode } from "react";

export function LoanList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function EmptyLoans({ text = "No loans yet." }: { text?: string }) {
  return <div className="text-sm text-gray-500">{text}</div>;
}
