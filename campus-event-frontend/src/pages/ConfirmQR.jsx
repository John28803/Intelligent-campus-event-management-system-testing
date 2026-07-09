import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function ConfirmQR() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("attendance/checkin/", { token });
      setMessage(res.data.message || "Check-in confirmed.");
    } catch (err) {
      setMessage(null);
      setError(err.response?.data?.message || "Unable to confirm QR token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Confirm Attendance</h1>
        <p className="text-gray-600 mb-6">
          Paste the attendee QR token here to confirm their registration for your event.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">QR Token</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Paste the QR token here"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Confirming..." : "Confirm Attendance"}
          </button>
        </form>

        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </DashboardLayout>
  );
}

export default ConfirmQR;
