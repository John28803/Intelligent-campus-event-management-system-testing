import { useEffect, useState } from "react";
import RequireAuth from "../components/RequireAuth";
import DashboardLayout from "../layouts/Dashboardlayout";
import api from "../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      try {
        const resp = await api.get("users/admin/users/");
        if (mounted) {
          setUsers(resp.data);
        }
      } catch (err) {
        setError(err.response?.data || { detail: "Failed to load" });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading users...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-600">Error: {JSON.stringify(error)}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Username</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Role</th>
              <th className="border px-3 py-2">Department</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border px-3 py-2">{u.id}</td>
                <td className="border px-3 py-2">{u.username}</td>
                <td className="border px-3 py-2">{u.email}</td>
                <td className="border px-3 py-2">{u.role}</td>
                <td className="border px-3 py-2">{u.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default function WrappedAdminUsers() {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <AdminUsers />
    </RequireAuth>
  );
}
