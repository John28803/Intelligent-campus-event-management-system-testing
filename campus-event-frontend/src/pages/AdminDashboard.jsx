import DashboardLayout from "../layouts/Dashboardlayout";
import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCode, setNewCode] = useState(null);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const resp = await api.get("admin/invite-codes/");
      setCodes(resp.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load invite codes.");
    } finally {
      setLoading(false);
    }
  };

  const createCode = async () => {
    try {
      const resp = await api.post("admin/invite-codes/");
      setNewCode(resp.data.code);
      // prepend to list
      setCodes((c) => [resp.data, ...c]);
    } catch (err) {
      console.error(err);
      alert("Failed to create invite code.");
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor users, events, and platform activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-blue-600">User Accounts</h2>
          <p className="text-gray-600 mt-2">Manage students, organizers, and administrators.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-green-600">Pending Approvals</h2>
          <p className="text-gray-600 mt-2">Review event submissions and new registrations.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-purple-600">Platform Reports</h2>
          <p className="text-gray-600 mt-2">Track engagement and attendance across the system.</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Organizer Invite Codes</h2>
          <div>
            <button
              onClick={createCode}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
              Generate Code
            </button>
          </div>
        </div>

        {newCode && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <strong>New code:</strong> {newCode}
            <button
              onClick={() => navigator.clipboard?.writeText(newCode)}
              className="ml-3 px-2 py-1 bg-gray-200 rounded"
            >
              Copy
            </button>
          </div>
        )}

        {loading ? (
          <p>Loading codes...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border px-3 py-2">Code</th>
                <th className="border px-3 py-2">Used</th>
                <th className="border px-3 py-2">Used By</th>
                <th className="border px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id}>
                  <td className="border px-3 py-2 monospace">{c.code}</td>
                  <td className="border px-3 py-2">{c.used ? 'Yes' : 'No'}</td>
                  <td className="border px-3 py-2">{c.used_by_id || '-'}</td>
                  <td className="border px-3 py-2">{new Date(c.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
