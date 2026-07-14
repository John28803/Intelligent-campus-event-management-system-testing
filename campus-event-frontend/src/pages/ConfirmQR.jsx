import { useState, useCallback } from "react";
import { QrReader } from "react-qr-reader";
import DashboardLayout from "../layouts/Dashboardlayout";
import api from "../services/api";

function ConfirmQR() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event?.preventDefault?.();
    if (!token) {
      setError("Please scan or paste a valid QR token.");
      setMessage(null);
      return;
    }

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

  const handleScan = useCallback((result, error) => {
    if (result) {
      const scannedToken = result?.text || result;
      if (scannedToken && scannedToken !== token) {
        setToken(scannedToken);
        setMessage("QR code scanned. Press confirm to complete check-in.");
        setError(null);
      }
    }

    if (error) {
      // Ignore non-fatal scanning noise
    }
  }, [token]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Confirm Attendance</h1>
        <p className="text-gray-600 mb-6">
          Use the camera to scan a student QR code, or paste the token manually.
        </p>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-slate-50">
            <div className="bg-blue-600 text-white px-4 py-3">
              <h2 className="text-lg font-semibold">Scan QR Code</h2>
            </div>
            <div className="p-4">
              <div className="h-96 bg-black/5 rounded-lg overflow-hidden">
                <QrReader
                  constraints={{ facingMode: "environment" }}
                  onResult={handleScan}
                  videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
                  containerStyle={{ width: "100%", height: "100%" }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Allow camera access and hold the QR code in front of the lens. The token will be filled automatically.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Manual Check-In</h2>
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
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Confirming..." : "Confirm Attendance"}
              </button>
            </form>

            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ConfirmQR;
