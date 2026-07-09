import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/Dashboardlayout";
import api from "../services/api";
import { QRCodeCanvas } from "qrcode.react";

function MyQRCode() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const res = await api.get("events/registrations/");
        setRegistrations(res.data);
        setError(null);
      } catch (err) {
        setError("Unable to load your QR codes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">My Event QR Codes</h1>

        {loading && <p>Loading your registered events...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {registrations.length === 0 && !loading && !error ? (
          <p className="text-gray-600">You have not registered for any events yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map((registration) => (
              <div key={registration.id} className="border rounded-xl p-5">
                <h2 className="text-xl font-semibold mb-2">{registration.event_title}</h2>
                <p className="text-gray-600 mb-2">
                  {registration.event_date} at {registration.event_time}
                </p>
                <p className="text-gray-600 mb-4">Registration ID: {registration.id}</p>
                {registration.qr_code ? (
                  registration.qr_code.startsWith("data:image") ? (
                    <div className="flex justify-center">
                      <img src={registration.qr_code} alt="Event QR" className="max-w-full" />
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <QRCodeCanvas value={registration.qr_code} size={220} />
                    </div>
                  )
                ) : (
                  <p className="text-gray-500">QR code not available yet.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyQRCode;
