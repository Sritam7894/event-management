import { useEffect, useState } from 'react'
import { getEventsApi, createEventApi, deleteEventApi } from '../api/eventApi'
import { getAllBookingsApi } from '../api/bookingApi'
import toast from 'react-hot-toast'

const AdminDashboardPage = () => {
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('events')
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '',
    location: '', category: 'conference', price: 0, capacity: 10
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        getEventsApi({ limit: 100 }),
        getAllBookingsApi()
      ])
      setEvents(eventsRes.data.events)
      setBookings(bookingsRes.data)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createEventApi(form)
      toast.success('Event created successfully!')
      setShowForm(false)
      setForm({
        title: '', description: '', date: '', time: '',
        location: '', category: 'conference', price: 0, capacity: 10
      })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await deleteEventApi(id)
      toast.success('Event deleted')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete event')
    }
  }

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{events.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Events</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{bookings.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Bookings</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">
            ₹{bookings.reduce((sum, b) => sum + b.totalPrice, 0)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 text-sm font-medium transition ${
            activeTab === 'events'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-medium transition ${
            activeTab === 'bookings'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Bookings
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            {showForm ? 'Cancel' : '+ Create New Event'}
          </button>

          {/* Create Event Form */}
          {showForm && (
            <form onSubmit={handleCreate} className="bg-gray-50 rounded-xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Title</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Event title" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <input name="location" value={form.location} onChange={handleChange} required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="City or venue" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-600">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Event description" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Time</label>
                <input type="text" name="time" value={form.time} onChange={handleChange} required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. 10:00 AM" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="concert">Concert</option>
                  <option value="sports">Sports</option>
                  <option value="festival">Festival</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Price (₹)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} min="0"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Capacity</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} min="1" required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  Create Event
                </button>
              </div>
            </form>
          )}

          {/* Events Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Seats Left</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{event.title}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(event.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-500">{event.category}</td>
                    <td className="px-4 py-3 text-gray-500">{event.seatsLeft}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {event.price === 0 ? 'Free' : `₹${event.price}`}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Seats</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{booking.user?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{booking.event?.title}</td>
                  <td className="px-4 py-3 text-gray-500">{booking.seats}</td>
                  <td className="px-4 py-3 text-gray-500">₹{booking.totalPrice}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-500'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage