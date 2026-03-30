const Event = require('../models/Event')

// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query

    const query = {}

    if (category) query.category = category
    if (search) query.title = { $regex: search, $options: 'i' }

    const total = await Event.countDocuments(query)

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    return res.json({
      events,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      total
    })

  } catch (error) {
    console.log('Get events error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    return res.json(event)

  } catch (error) {
    console.log('Get event error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route   POST /api/events
// @access  Admin only
const createEvent = async (req, res) => {
  try {
    const {
      title, description, date, time,
      location, category, price, capacity
    } = req.body

    const image = req.file ? req.file.filename : ''

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      price,
      capacity,
      seatsLeft: capacity,
      image,
      createdBy: req.user._id
    })

    return res.status(201).json(event)

  } catch (error) {
    console.log('Create event error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route   PUT /api/events/:id
// @access  Admin only
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const {
      title, description, date, time,
      location, category, price, capacity, status
    } = req.body

    event.title = title || event.title
    event.description = description || event.description
    event.date = date || event.date
    event.time = time || event.time
    event.location = location || event.location
    event.category = category || event.category
    event.price = price ?? event.price
    event.capacity = capacity || event.capacity
    event.status = status || event.status

    if (req.file) {
      event.image = req.file.filename
    }

    const updatedEvent = await event.save()
    return res.json(updatedEvent)

  } catch (error) {
    console.log('Update event error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @route   DELETE /api/events/:id
// @access  Admin only
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    await event.deleteOne()
    return res.json({ message: 'Event deleted successfully' })

  } catch (error) {
    console.log('Delete event error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent }