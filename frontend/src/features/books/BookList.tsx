import { ReactNode } from "react";

export function BookList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function EmptyBooks({ text = "No books yet." }: { text?: string }) {
  return <div className="text-sm text-gray-500">{text}</div>;
}
