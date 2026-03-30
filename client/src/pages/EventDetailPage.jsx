import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEventByIdApi } from '../api/eventApi'
import { createBookingApi } from '../api/bookingApi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const EventDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [seats, setSeats] = useState(1)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEventByIdApi(id)
        setEvent(res.data)
      } catch (error) {
        toast.error('Event not found')
        navigate('/events')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book an event')
      navigate('/login')
      return
    }
    setBooking(true)
    try {
      await createBookingApi({ eventId: id, seats })
      toast.success(`Successfully booked ${seats} seat(s)!`)
      navigate('/my-bookings')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>
  if (!event) return null

  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Event Image */}
      {event.image ? (
        <img
          src={`http://localhost:5000/uploads/${event.image}`}
          alt={event.title}
          className="w-full h-72 object-cover rounded-2xl mb-6"
        />
      ) : (
        <div className="w-full h-72 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-6xl">🎉</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Event Info */}
        <div className="flex-1">
          <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full capitalize">
            {event.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-4">
            {event.title}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            {event.description}
          </p>

          <div className="space-y-3 text-gray-600">
            <p>📅 <span className="font-medium">{formattedDate}</span></p>
            <p>⏰ <span className="font-medium">{event.time}</span></p>
            <p>📍 <span className="font-medium">{event.location}</span></p>
            <p>🎟️ <span className="font-medium">{event.seatsLeft} seats remaining</span></p>
            <p>👤 Organized by <span className="font-medium">{event.createdBy?.name}</span></p>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:w-72">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {event.price === 0 ? 'Free' : `₹${event.price}`}
            </p>
            <p className="text-sm text-gray-400 mb-4">per seat</p>

            {event.seatsLeft === 0 ? (
              <p className="text-center text-red-500 font-semibold py-3">
                Sold Out
              </p>
            ) : (
              <>
                <label className="text-sm font-medium text-gray-600">
                  Number of seats
                </label>
                <input
                  type="number"
                  min="1"
                  max={event.seatsLeft}
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full mt-1 mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <p className="text-sm text-gray-500 mb-4">
                  Total: <span className="font-bold text-gray-800">
                    {event.price === 0 ? 'Free' : `₹${event.price * seats}`}
                  </span>
                </p>

                <button
                  onClick={handleBooking}
                  disabled={booking}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {booking ? 'Booking...' : 'Book Now'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage