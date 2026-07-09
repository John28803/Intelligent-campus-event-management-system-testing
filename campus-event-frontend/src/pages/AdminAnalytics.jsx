import { useEffect, useState }
from "react";

import api from "../services/api";

function AdminAnalytics() {

  const [prediction,
  setPrediction] =
  useState(null);

  useEffect(() => {

    api.get(
      "analytics/predict/1/"
    )
    .then((res) => {
      setPrediction(
        res.data
      );
    });

  }, []);

  return (

    <div className="p-8">

      <h1
      className="text-4xl font-bold mb-6">
        Attendance Forecast
      </h1>

      {prediction && (

        <div
        className="bg-white p-6 rounded-xl shadow">

          <h2>
            {prediction.event}
          </h2>

          <p>
            Capacity:
            {prediction.capacity}
          </p>

          <p>
            Predicted Attendance:
            {prediction.predicted_attendance}
          </p>

        </div>

      )}

    </div>
  );
}

export default AdminAnalytics;