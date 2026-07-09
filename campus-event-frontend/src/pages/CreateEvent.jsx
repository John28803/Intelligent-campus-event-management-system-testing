import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/Dashboardlayout";
import api from "../services/api";

function CreateEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("technology");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [error, setError] = useState(null);
  const [createdEvent, setCreatedEvent] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await api.post("events/", {
        title,
        description,
        category,
        venue,
        date,
        time,
        capacity,
      });
      setCreatedEvent(res.data);
      // give organizer immediate confirmation instead of redirecting
      console.log("Event created:", res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Unable to create event.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Create an Event</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Event Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Campus Tech Meetup"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="technology">Technology</option>
              <option value="career">Career</option>
              <option value="sports">Sports</option>
              <option value="education">Education</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Venue</label>
            <input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Engineering Block A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows="4"
              placeholder="Describe the event"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Publish Event
          </button>
        </form>
        {createdEvent && (
          <div className="mt-6 p-4 border rounded bg-green-50">
            <h3 className="font-semibold">Event created successfully</h3>
            <p>Event ID: {createdEvent.id}</p>
            <p className="text-sm text-gray-700">Title: {createdEvent.title}</p>
            <button
              className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => navigate('/organizer/dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CreateEvent;
