import React from 'react';
// Note the lowercase 'l' in Dashboardlayout to match your file structure perfectly!
import DashboardLayout from '../layouts/Dashboardlayout'; 

function Analytics() {
  // This data array must be defined so your .map() loop doesn't crash the browser!
  const analyticsData = [
    { id: 1, event: "AI Summit", actual: 200, predicted: 210 },
    { id: 2, event: "Career Fair", actual: 150, predicted: 145 },
    { id: 3, event: "Workshop", actual: 95, predicted: 100 },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Event Attendance Metrics</h2>
        <p className="text-sm text-gray-500 mb-6">Historical, Predicted, and Actual Attendance tracking.</p>

        {/* Comparative data table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600 font-semibold text-sm">
                <th className="py-3">Event</th>
                <th className="py-3">Actual</th>
                <th className="py-3">Predicted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
              {analyticsData.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-gray-900">{data.event}</td>
                  <td className="py-4 text-green-600 font-semibold">{data.actual}</td>
                  <td className="py-4 text-blue-600 font-semibold">{data.predicted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;