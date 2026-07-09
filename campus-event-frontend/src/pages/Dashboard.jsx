import DashboardLayout from "../layouts/Dashboardlayout";
import QRCodeCard from "../components/QRCodeCard";

function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-8">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-3xl font-bold text-blue-600">12</h2>
          <p className="text-gray-600">Registered Events</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-3xl font-bold text-green-600">8</h2>
          <p className="text-gray-600">Completed Events</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-3xl font-bold text-purple-600">5</h2>
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