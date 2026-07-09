function EventCard({ event, isRegistered, onRegister, onUnregister }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
      <p className="text-blue-600 mb-2 capitalize">{event.category}</p>
      <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</p>
      <p className="text-gray-600">Time: {event.time}</p>
      <p className="text-gray-600">Venue: {event.venue}</p>
      <p className="text-gray-600">Capacity: {event.capacity}</p>
      <p className="text-gray-700 mt-3">{event.description}</p>
      <button
        onClick={isRegistered ? onUnregister : onRegister}
        className={`mt-4 px-4 py-2 rounded-lg text-white ${isRegistered ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isRegistered ? 'Unregister' : 'Register'}
      </button>
    </div>
  );
}

export default EventCard;