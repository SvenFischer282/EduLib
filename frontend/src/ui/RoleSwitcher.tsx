import { useEffect, useState } from "react";

export type Role = "Teacher" | "Librarian";

export function getRoleHeader(role: Role) {
  return role === "Teacher" ? "teacher123" : "librarian456";
}

export function RoleSwitcher() {
  const [role, setRole] = useState<Role>(
    () => (localStorage.getItem("role") as Role) || "Teacher"
  );

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  return (
    <div className="role-switcher">
      <label>Role</label>
      <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
        <option value="Teacher">Teacher</option>
        <option value="Librarian">Librarian</option>
      </select>
    </div>
  );
}
