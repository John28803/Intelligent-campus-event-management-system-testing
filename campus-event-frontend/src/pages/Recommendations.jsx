import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import api from "../services/api";
import DashboardLayout from "../layouts/Dashboardlayout";

function Recommendations() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, regsRes] = await Promise.all([
        api.get("events/"),
        api.get("events/registrations/"),
      ]);

      const allEvents = eventsRes.data || [];
      const regs = regsRes.data || [];
      setEvents(allEvents);
      setRegistrations(regs);

      if (regs.length >= 10) {
        const recRes = await api.get("recommendations/");
        setRecommendations(recRes.data || []);
        setMessage(
          "Personalized recommendations are now available based on your event history."
        );
      } else {
        const registeredIds = regs.map((reg) => reg.event);
        const featuredEvents = allEvents.filter(
          (event) => !registeredIds.includes(event.id)
        );
        setRecommendations(featuredEvents.slice(0, 5));
        setMessage(
          `Register for ${10 - regs.length} more events to unlock personalized recommendations.`
        );
      }
      setError(null);
    } catch (err) {
      setError("Unable to load recommendations. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = async () => {
    await loadData();
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post("events/registrations/", { event: eventId });
      await refreshData();
      alert("You are registered for this event. Your QR code is now available.");
    } catch (err) {
      const message =
        err.response?.data?.detail || err.response?.data?.message || err.message;
      alert(`Registration failed: ${message}`);
    }
  };

  const handleUnregister = async (registrationId) => {
    try {
      await api.delete(`events/registrations/${registrationId}/`);
      await refreshData();
      alert("Your registration has been removed.");
    } catch (err) {
      alert("Unable to unregister. Please try again.");
    }
  };

  const getRegistration = (event) =>
    registrations.find((reg) => reg.event === event.id);

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Recommended Events
          </h1>
          <p className="text-sm text-gray-500 mb-2">
            {message || "Explore campus events selected for you."}
          </p>
          <p className="text-sm text-gray-500">
            Events shown here can still be viewed and registered normally.
          </p>
        </div>

        {loading && <p>Loading recommendations...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((event) => (
            <EventCard
              key={event.id}
              event={{
                ...event,
                description:
                  event.description ||
                  "Register to see full event details and secure your spot.",
              }}
              isRegistered={Boolean(getRegistration(event))}
              onRegister={() => handleRegister(event.id)}
              onUnregister={() => handleUnregister(getRegistration(event)?.id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Recommendations;