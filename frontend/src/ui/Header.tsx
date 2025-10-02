import { Link, useLocation } from "react-router-dom";
import { RoleSwitcher } from "./RoleSwitcher";
import { getCurrentUser, removeAuthToken, isAuthenticated } from "../lib/api";

export function Header() {
  const loc = useLocation();
  const active = "underline";
  const idle = "opacity-90 hover:opacity-100";
  const user = getCurrentUser();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    removeAuthToken();
    window.location.replace("/login");
  };

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
      <div className="flex items-center gap-4">
        {authenticated && user && (
          <div className="flex items-center gap-3">
            <span className="text-sm">
              Welcome, {user.username} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        )}
        <RoleSwitcher />
      </div>
    </header>
  );
}
