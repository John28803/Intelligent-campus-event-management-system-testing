import DashboardLayout
from "../layouts/Dashboardlayout";

function Certificates() {

  return (

    <DashboardLayout>

      <h1
      className="text-4xl font-bold">
        My Certificates
      </h1>

      <div
      className="mt-6 bg-white p-6 rounded-xl shadow">

        <h2>
          AI Summit Certificate
        </h2>

        <button
        className="bg-blue-600 text-white px-4 py-2 rounded">

          Download PDF

        </button>

      </div>

    </DashboardLayout>

  );
}

export default Certificates;