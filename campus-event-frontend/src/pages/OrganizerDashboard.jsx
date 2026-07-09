import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/Dashboardlayout";

function OrganizerDashboard() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Organizer Dashboard</h1>
          <p className="text-gray-600 mt-2">Create and manage campus events from one place.</p>
        </div>
        <Link
          to="/organizer/create-event"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-blue-600">Upcoming Events</h2>
          <p className="text-gray-600 mt-2">You currently have 3 events scheduled for this week.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-green-600">Attendees</h2>
          <p className="text-gray-600 mt-2">Track event registrations and attendance in real time.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OrganizerDashboard;
