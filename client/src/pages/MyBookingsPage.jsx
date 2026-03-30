import { useEffect, useState } from 'react'
import { getMyBookingsApi, cancelBookingApi } from '../api/bookingApi'
import toast from 'react-hot-toast'

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await getMyBookingsApi()
      setBookings(res.data)
    } catch (error) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    try {
      await cancelBookingApi(id)
      toast.success('Booking cancelled successfully')
      fetchBookings()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancel failed')
    }
  }

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No bookings yet</p>
          <a href="/events" className="text-blue-600 hover:underline mt-2 block">
            Browse events →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {booking.event?.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  📅 {new Date(booking.event?.date).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  📍 {booking.event?.location}
                </p>
                <p className="text-sm text-gray-500">
                  🎟️ {booking.seats} seat(s) &nbsp;|&nbsp; Total: ₹{booking.totalPrice}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between gap-2">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-500'
                }`}>
                  {booking.status}
                </span>

                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookingsPage