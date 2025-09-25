const mongoose = require('mongoose');

// Booking Schema
const bookingSchema = new mongoose.Schema({
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: [true, 'Venue is required']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required']
  },
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [100, 'Event name cannot exceed 100 characters']
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  totalCost: {
    type: Number,
    required: [true, 'Total cost is required'],
    min: [0, 'Total cost must be a positive number']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled'],
      message: 'Status must be pending, confirmed, or cancelled'
    },
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
bookingSchema.index({ venue: 1, eventDate: 1 });
bookingSchema.index({ organizer: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ eventDate: 1 });

// Virtual for venue information
bookingSchema.virtual('venueInfo', {
  ref: 'Venue',
  localField: 'venue',
  foreignField: '_id',
  justOne: true
});

// Virtual for organizer information
bookingSchema.virtual('organizerInfo', {
  ref: 'User',
  localField: 'organizer',
  foreignField: '_id',
  justOne: true
});

// Validation to ensure end time is after start time
bookingSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    const start = new Date(`2000-01-01T${this.startTime}:00`);
    const end = new Date(`2000-01-01T${this.endTime}:00`);
    
    if (end <= start) {
      return next(new Error('End time must be after start time'));
    }
  }
  next();
});

// Create and export the model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
