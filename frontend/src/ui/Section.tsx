import { HTMLAttributes } from "react";

export function Section({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <section className={`my-6 ${className}`} {...props} />;
}
