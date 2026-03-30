const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  category: {
    type: String,
    enum: ['conference', 'workshop', 'concert', 'sports', 'festival', 'other'],
    default: 'other'
  },
  price: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required']
  },
  seatsLeft: {
    type: Number
  },
  image: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)