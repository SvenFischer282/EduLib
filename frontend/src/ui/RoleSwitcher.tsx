import { useEffect, useState } from "react";
import { Select } from "./Select";

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
    <div className="flex items-center gap-2">
      <label className="text-sm">Role</label>
      <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
        <option value="Teacher">Teacher</option>
        <option value="Librarian">Librarian</option>
      </Select>
    </div>
  );
}
