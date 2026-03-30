import { Link } from 'react-router-dom'

const EventCard = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {event.image ? (
        <img
          src={`http://localhost:5000/uploads/${event.image}`}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-blue-100 flex items-center justify-center">
          <span className="text-blue-400 text-4xl">🎉</span>
        </div>
      )}

      <div className="p-4">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full capitalize">
          {event.category}
        </span>

        <h3 className="text-lg font-semibold mt-2 text-gray-800">
          {event.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          📅 {formattedDate} &nbsp;|&nbsp; ⏰ {event.time}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          📍 {event.location}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-blue-600 font-bold">
            {event.price === 0 ? 'Free' : `₹${event.price}`}
          </span>
          <span className="text-sm text-gray-400">
            {event.seatsLeft} seats left
          </span>
        </div>

        <Link
          to={`/events/${event._id}`}
          className="block mt-3 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default EventCard