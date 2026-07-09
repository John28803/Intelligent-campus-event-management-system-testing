import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AttendanceChart() {

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],

    datasets: [
      {
        label: "Attendance",
        data: [120, 190, 300, 250, 400],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-4">
        Attendance Analytics
      </h2>

      <Bar data={data} />

    </div>
  );
}

export default AttendanceChart;