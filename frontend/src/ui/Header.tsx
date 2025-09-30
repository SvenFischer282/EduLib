import { Link, useLocation } from "react-router-dom";
import { RoleSwitcher } from "./RoleSwitcher";

export function Header() {
  const loc = useLocation();
  const active = "underline";
  const idle = "opacity-90 hover:opacity-100";
  return (
    <header className="flex items-center justify-between bg-orange-500 px-5 py-3 text-white">
      <div className="text-lg font-bold">EduLib</div>
      <nav className="flex items-center gap-4">
        <Link className={loc.pathname === "/" ? active : idle} to="/">
          Books
        </Link>
        <Link
          className={loc.pathname.startsWith("/teacher") ? active : idle}
          to="/teacher/loans"
        >
          Teacher Loans
        </Link>
        <Link
          className={loc.pathname.startsWith("/librarian") ? active : idle}
          to="/librarian/loans"
        >
          Librarian Loans
        </Link>
      </nav>
      <RoleSwitcher />
    </header>
  );
}
