const express = require('express')
const router = express.Router()
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking
} = require('../controllers/bookingController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// All booking routes require login
router.post('/', protect, createBooking)
router.get('/my', protect, getMyBookings)
router.get('/all', protect, adminOnly, getAllBookings)
router.put('/:id/cancel', protect, cancelBooking)

module.exports = router