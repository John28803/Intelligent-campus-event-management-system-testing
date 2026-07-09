import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import EventCard from "../components/EventCard";
import api from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, regsRes] = await Promise.all([
        api.get("events/"),
        api.get("events/registrations/"),
      ]);
      setEvents(eventsRes.data);
      setRegistrations(regsRes.data);
      setError(null);
    } catch (err) {
      setError("Unable to load events. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await api.post("events/registrations/", { event: eventId });
      await loadData();
      alert("You are registered for this event. Your QR code is now available.");
    } catch (err) {
      const message = err.response?.data?.detail || err.response?.data?.message || err.message;
      alert(`Registration failed: ${message}`);
    }
  };

  const handleUnregister = async (registrationId) => {
    try {
      await api.delete(`events/registrations/${registrationId}/`);
      await loadData();
      alert("Your registration has been removed.");
    } catch (err) {
      alert("Unable to unregister. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Campus Events</h1>
          <p className="text-gray-600 mt-2">Register for events created by your organizers.</p>
        </div>
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => {
          const registration = registrations.find((reg) => reg.event === event.id);
          return (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={Boolean(registration)}
              onRegister={() => handleRegister(event.id)}
              onUnregister={() => handleUnregister(registration?.id)}
            />
          );
        })}
      </div>
    </DashboardLayout>
  );
}

export default Events;