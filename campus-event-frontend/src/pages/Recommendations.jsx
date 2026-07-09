import React, { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

function Recommendations() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("recommendations/")
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.log("Backend offline or empty, using fallbacks:", err);
      });
  }, []);

  
  const displayEvents = events.length > 0 ? events : [
    {
      id: 1,
      title: "Advanced React & Vite Workshop",
      category: "Tech",
      score: "98% Match",
      description: "Based on your interest in front-end web app design layouts."
    },
    {
      id: 2,
      title: "UI/UX Design Systems Seminar",
      category: "Design",
      score: "92% Match",
      description: "Enhance your dashboard interfaces with elite styling tips."
    },
    {
      id: 3,
      title: "Campus Networking Mixer",
      category: "Social",
      score: "85% Match",
      description: "Connect with fellow developers, engineers, and project teams."
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Recommended Events
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          AI-driven event suggestions tailored to your student activity profile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider">
                    {event.category || "General"}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    {event.score || "Match Score"}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h2>
                
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {event.description || "No description provided for this campus event."}
                </p>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-auto shadow-sm">
                View Event Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Recommendations;