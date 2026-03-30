const Booking = require('../models/Booking')
const Event = require('../models/Event')

// @route   POST /api/bookings
// @access  Private (logged in users)
const createBooking = async (req, res) => {
  try {
    const { eventId, seats } = req.body

    // Find the event
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Check if enough seats are available
    if (event.seatsLeft < seats) {
      return res.status(400).json({
        message: `Only ${event.seatsLeft} seats left`
      })
    }

    // Check if user already booked this event
    const alreadyBooked = await Booking.findOne({
      event: eventId,
      user: req.user._id,
      status: 'confirmed'
    })
    if (alreadyBooked) {
      return res.status(400).json({ message: 'You have already booked this event' })
    }

    // Calculate total price
    const totalPrice = event.price * seats

    // Create booking
    const booking = await Booking.create({
      event: eventId,
      user: req.user._id,
      seats,
      totalPrice,
      status: 'confirmed'
    })

    // Decrease seats left on the event
    event.seatsLeft = event.seatsLeft - seats
    await event.save()

    // Return booking with event and user details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('event', 'title date time location price')
      .populate('user', 'name email')

    return res.status(201).json(populatedBooking)

  } catch (error) {
    console.log('Create booking error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route   GET /api/bookings/my
// @access  Private (logged in users)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date time location price image status')
      .sort({ createdAt: -1 })

    return res.json(bookings)

  } catch (error) {
    console.log('Get bookings error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route   GET /api/bookings/all
// @access  Admin only
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('event', 'title date location')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })

    return res.json(bookings)

  } catch (error) {
    console.log('Get all bookings error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route   PUT /api/bookings/:id/cancel
// @access  Private (logged in users)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Make sure the booking belongs to the logged in user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' })
    }

    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' })
    }

    // Cancel the booking
    booking.status = 'cancelled'
    await booking.save()

    // Give back the seats to the event
    const event = await Event.findById(booking.event)
    if (event) {
      event.seatsLeft = event.seatsLeft + booking.seats
      await event.save()
    }

    return res.json({ message: 'Booking cancelled successfully', booking })

  } catch (error) {
    console.log('Cancel booking error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { createBooking, getMyBookings, getAllBookings, cancelBooking }