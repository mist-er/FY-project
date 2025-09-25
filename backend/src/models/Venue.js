const mongoose = require('mongoose');

// Venue Schema
const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Venue name is required'],
    trim: true,
    minlength: [2, 'Venue name must be at least 2 characters'],
    maxlength: [100, 'Venue name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [5, 'Location must be at least 5 characters'],
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [10000, 'Capacity cannot exceed 10,000']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contactPhone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  photoUrl: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
venueSchema.index({ name: 'text', description: 'text', location: 'text' });
venueSchema.index({ location: 1 });
venueSchema.index({ capacity: 1 });
venueSchema.index({ price: 1 });
venueSchema.index({ owner: 1 });
venueSchema.index({ isActive: 1 });

// Virtual for owner information
venueSchema.virtual('ownerInfo', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
  justOne: true
});

// Static method to find venues with filters
venueSchema.statics.findWithFilters = function(filters = {}) {
  const query = { isActive: true };
  
  // Add filters
  if (filters.location) {
    query.location = { $regex: filters.location, $options: 'i' };
  }
  
  if (filters.minCapacity) {
    query.capacity = { ...query.capacity, $gte: filters.minCapacity };
  }
  
  if (filters.maxCapacity) {
    query.capacity = { ...query.capacity, $lte: filters.maxCapacity };
  }
  
  if (filters.minPrice) {
    query.price = { ...query.price, $gte: filters.minPrice };
  }
  
  if (filters.maxPrice) {
    query.price = { ...query.price, $lte: filters.maxPrice };
  }
  
  if (filters.ownerId) {
    query.owner = filters.ownerId;
  }

  return this.find(query)
    .populate('owner', 'name email role')
    .sort({ createdAt: -1 })
    .limit(filters.limit || 20)
    .skip(filters.offset || 0);
};

// Static method to search venues
venueSchema.statics.searchVenues = function(searchTerm, filters = {}) {
  const query = {
    isActive: true,
    $text: { $search: searchTerm }
  };
  
  // Add additional filters
  if (filters.minCapacity) {
    query.capacity = { ...query.capacity, $gte: filters.minCapacity };
  }
  
  if (filters.maxPrice) {
    query.price = { ...query.price, $lte: filters.maxPrice };
  }

  return this.find(query)
    .populate('owner', 'name email role')
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .limit(filters.limit || 20);
};

// Instance method to check availability for a date
venueSchema.methods.isAvailableForDate = async function(date) {
  try {
    const Booking = mongoose.model('Booking');
    const booking = await Booking.findOne({
      venue: this._id,
      eventDate: new Date(date),
      status: 'confirmed'
    });
    return !booking;
  } catch (error) {
    throw new Error('Error checking venue availability');
  }
};

// Instance method to get venue statistics
venueSchema.methods.getStats = async function() {
  try {
    const Booking = mongoose.model('Booking');
    const stats = await Booking.aggregate([
      { $match: { venue: this._id } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          averageBookingValue: { $avg: '$totalCost' }
        }
      }
    ]);
    
    return stats[0] || {
      totalBookings: 0,
      confirmedBookings: 0,
      pendingBookings: 0,
      averageBookingValue: 0
    };
  } catch (error) {
    throw new Error('Error getting venue stats');
  }
};

// Instance method to soft delete
venueSchema.methods.softDelete = function() {
  this.isActive = false;
  return this.save();
};

// Create and export the model
const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;