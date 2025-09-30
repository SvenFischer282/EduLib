import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const basePrimary =
    "inline-flex items-center justify-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-50";
  const baseGhost =
    "inline-flex items-center justify-center rounded-md border border-orange-500 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 disabled:opacity-50";
  const base = variant === "ghost" ? baseGhost : basePrimary;
  return <button className={`${base} ${className}`} {...props} />;
}
