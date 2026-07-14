import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/Dashboardlayout";
import QRCodeCard from "../components/QRCodeCard";
import api from "../services/api";

function Dashboard() {
  const [registeredCount, setRegisteredCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [recommendedCount, setRecommendedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCounts = async () => {
    try {
      setLoading(true);
      const [regsRes, recRes] = await Promise.all([
        api.get("events/registrations/"),
        api.get("recommendations/"),
      ]);

      const registrations = regsRes.data || [];
      const recommendations = recRes.data || [];

      setRegisteredCount(registrations.length);
      setCompletedCount(
        registrations.filter((reg) => reg.checked_in).length
      );
      setRecommendedCount(recommendations.length);
      setError(null);
    } catch (err) {
      setError("Unable to load dashboard counts. Refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-8">Student Dashboard</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-3xl font-bold text-blue-600">
            {loading ? "..." : registeredCount}
          </h2>
          <p className="text-gray-600">Registered Events</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-3xl font-bold text-green-600">
            {loading ? "..." : completedCount}
          </h2>
          <p className="text-gray-600">Completed Events</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-3xl font-bold text-purple-600">
            {loading ? "..." : recommendedCount}
          </h2>
          <p className="text-gray-600">Recommended Events</p>
        </div>

        <div className="mt-10">
          <QRCodeCard />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;