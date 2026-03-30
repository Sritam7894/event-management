import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEventsApi } from '../api/eventApi'
import EventCard from '../components/EventCard'

const HomePage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getEventsApi({ limit: 3 })
        setEvents(res.data.events)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Discover Amazing Events
        </h1>
        <p className="text-blue-100 text-lg mb-8">
          Book tickets for conferences, concerts, workshops and more
        </p>
        <Link
          to="/events"
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
        >
          Browse All Events
        </Link>
      </div>

      {/* Categories */}
      <div className="py-10 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Browse by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['conference', 'workshop', 'concert', 'sports', 'festival', 'other'].map((cat) => (
            <Link
              key={cat}
              to={`/events?category=${cat}`}
              className="bg-white border border-blue-200 text-blue-600 px-5 py-2 rounded-full capitalize hover:bg-blue-600 hover:text-white transition text-sm font-medium"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="py-10 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Upcoming Events
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-400">No events found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/events" className="text-blue-600 font-medium hover:underline">
            View all events →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage