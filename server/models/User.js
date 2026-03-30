const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
// ```

// **Save** with `Ctrl + S`

// ---

// Wait for nodemon to restart then check terminal shows:
// ```
// MongoDB connected
// Server running on port 5000