import { Outlet, Link, useLocation } from "react-router-dom";
import { RoleSwitcher } from "./RoleSwitcher";

export function AppLayout() {
  const loc = useLocation();
  return (
    <div>
      <header className="app-header">
        <div className="brand">CLMS</div>
        <nav className="nav">
          <Link className={loc.pathname === "/" ? "active" : ""} to="/">
            Books
          </Link>
          <Link
            className={loc.pathname.startsWith("/teacher") ? "active" : ""}
            to="/teacher/loans"
          >
            Teacher Loans
          </Link>
          <Link
            className={loc.pathname.startsWith("/librarian") ? "active" : ""}
            to="/librarian/loans"
          >
            Librarian Loans
          </Link>
        </nav>
        <RoleSwitcher />
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
