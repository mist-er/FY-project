const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const User = require('../models/User');

class BookingController {
  // Create a new booking
  static async createBooking(req, res) {
    try {
      const {
        venue_id,
        organizer_id,
        event_name,
        event_date,
        start_time,
        end_time,
        notes
      } = req.body;

      // Check if venue exists and is active
      const venue = await Venue.findById(venue_id);
      if (!venue) {
        return res.status(404).json({
          message: 'Venue not found'
        });
      }

      if (!venue.isActive) {
        return res.status(400).json({
          message: 'Venue is not available for booking'
        });
      }

      // Check if organizer exists
      const organizer = await User.findById(organizer_id);
      if (!organizer) {
        return res.status(404).json({
          message: 'Organizer not found'
        });
      }

      // Check if organizer has 'organizer' role
      if (organizer.role !== 'organizer') {
        return res.status(403).json({
          message: 'Only organizers can create bookings'
        });
      }

      // Check if venue is available for the requested date
      const isAvailable = await venue.isAvailableForDate(event_date);
      if (!isAvailable) {
        return res.status(400).json({
          message: 'Venue is not available for the selected date'
        });
      }

      // Calculate total cost
      const totalCost = venue.price;

      // Create booking data
      const bookingData = {
        venue: venue_id,
        organizer: organizer_id,
        eventName: event_name,
        eventDate: new Date(event_date),
        startTime: start_time,
        endTime: end_time,
        totalCost: totalCost,
        notes: notes || ''
      };

      // Create booking
      const booking = await Booking.create(bookingData);
      await booking.populate([
        { path: 'venue', select: 'name location capacity price owner' },
        { path: 'organizer', select: 'name email role' }
      ]);

      res.status(201).json({
        message: 'Booking created successfully',
        booking: booking
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors
        });
      }

      res.status(500).json({
        message: 'Error creating booking',
        error: error.message
      });
    }
  }

  // Get all bookings with optional filters
  static async getAllBookings(req, res) {
    try {
      const {
        venue_id,
        organizer_id,
        status,
        event_date,
        limit = 20,
        offset = 0
      } = req.query;

      const query = {};
      
      if (venue_id) query.venue = venue_id;
      if (organizer_id) query.organizer = organizer_id;
      if (status) query.status = status;
      if (event_date) {
        const date = new Date(event_date);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        query.eventDate = { $gte: date, $lt: nextDay };
      }

      const bookings = await Booking.find(query)
        .populate('venue', 'name location capacity price')
        .populate('organizer', 'name email role')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset));

      res.json({
        message: 'Bookings retrieved successfully',
        bookings: bookings,
        count: bookings.length,
        filters: query
      });
    } catch (error) {
      console.error('Error getting bookings:', error);
      res.status(500).json({
        message: 'Error retrieving bookings',
        error: error.message
      });
    }
  }

  // Get booking by ID
  static async getBookingById(req, res) {
    try {
      const { id } = req.params;
      const booking = await Booking.findById(id)
        .populate('venue', 'name location capacity price owner')
        .populate('organizer', 'name email role');

      if (!booking) {
        return res.status(404).json({
          message: 'Booking not found'
        });
      }

      res.json({
        message: 'Booking retrieved successfully',
        booking: booking
      });
    } catch (error) {
      console.error('Error getting booking:', error);
      res.status(500).json({
        message: 'Error retrieving booking',
        error: error.message
      });
    }
  }

  // Update booking status
  static async updateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Check if booking exists
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({
          message: 'Booking not found'
        });
      }

      // Validate status
      const validStatuses = ['pending', 'confirmed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status. Must be one of: pending, confirmed, cancelled'
        });
      }

      // Update booking status
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { status: status },
        { new: true, runValidators: true }
      ).populate([
        { path: 'venue', select: 'name location capacity price owner' },
        { path: 'organizer', select: 'name email role' }
      ]);

      res.json({
        message: 'Booking status updated successfully',
        booking: updatedBooking
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({
        message: 'Error updating booking status',
        error: error.message
      });
    }
  }

  // Update booking details
  static async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const {
        event_name,
        event_date,
        start_time,
        end_time,
        notes
      } = req.body;

      // Check if booking exists
      const existingBooking = await Booking.findById(id);
      if (!existingBooking) {
        return res.status(404).json({
          message: 'Booking not found'
        });
      }

      // Check if booking can be modified (only pending bookings)
      if (existingBooking.status !== 'pending') {
        return res.status(400).json({
          message: 'Only pending bookings can be modified'
        });
      }

      // If date is being changed, check availability
      if (event_date && event_date !== existingBooking.eventDate.toISOString().split('T')[0]) {
        const venue = await Venue.findById(existingBooking.venue);
        const isAvailable = await venue.isAvailableForDate(event_date);
        if (!isAvailable) {
          return res.status(400).json({
            message: 'Venue is not available for the selected date'
          });
        }
      }

      // Prepare update data
      const updateData = {
        eventName: event_name || existingBooking.eventName,
        eventDate: event_date ? new Date(event_date) : existingBooking.eventDate,
        startTime: start_time || existingBooking.startTime,
        endTime: end_time || existingBooking.endTime,
        notes: notes !== undefined ? notes : existingBooking.notes
      };

      // Update booking
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate([
        { path: 'venue', select: 'name location capacity price owner' },
        { path: 'organizer', select: 'name email role' }
      ]);

      res.json({
        message: 'Booking updated successfully',
        booking: updatedBooking
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors
        });
      }

      res.status(500).json({
        message: 'Error updating booking',
        error: error.message
      });
    }
  }

  // Delete booking
  static async deleteBooking(req, res) {
    try {
      const { id } = req.params;
      
      // Check if booking exists
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({
          message: 'Booking not found'
        });
      }

      // Check if booking can be deleted (only pending bookings)
      if (booking.status !== 'pending') {
        return res.status(400).json({
          message: 'Only pending bookings can be deleted'
        });
      }

      // Delete booking
      await Booking.findByIdAndDelete(id);

      res.json({
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({
        message: 'Error deleting booking',
        error: error.message
      });
    }
  }

  // Get bookings by organizer
  static async getBookingsByOrganizer(req, res) {
    try {
      const { organizerId } = req.params;
      
      // Check if organizer exists
      const organizer = await User.findById(organizerId);
      if (!organizer) {
        return res.status(404).json({
          message: 'Organizer not found'
        });
      }

      const bookings = await Booking.find({ organizer: organizerId })
        .populate('venue', 'name location capacity price')
        .sort({ createdAt: -1 });

      res.json({
        message: 'Organizer bookings retrieved successfully',
        organizer: organizer,
        bookings: bookings,
        count: bookings.length
      });
    } catch (error) {
      console.error('Error getting organizer bookings:', error);
      res.status(500).json({
        message: 'Error retrieving organizer bookings',
        error: error.message
      });
    }
  }

  // Get bookings by venue
  static async getBookingsByVenue(req, res) {
    try {
      const { venueId } = req.params;
      
      // Check if venue exists
      const venue = await Venue.findById(venueId);
      if (!venue) {
        return res.status(404).json({
          message: 'Venue not found'
        });
      }

      const bookings = await Booking.find({ venue: venueId })
        .populate('organizer', 'name email role')
        .sort({ eventDate: 1, startTime: 1 });

      res.json({
        message: 'Venue bookings retrieved successfully',
        venue: venue,
        bookings: bookings,
        count: bookings.length
      });
    } catch (error) {
      console.error('Error getting venue bookings:', error);
      res.status(500).json({
        message: 'Error retrieving venue bookings',
        error: error.message
      });
    }
  }

  // Get booking statistics
  static async getBookingStats(req, res) {
    try {
      const { id } = req.params;
      
      // Check if booking exists
      const booking = await Booking.findById(id)
        .populate('venue', 'name location capacity price')
        .populate('organizer', 'name email role');
      
      if (!booking) {
        return res.status(404).json({
          message: 'Booking not found'
        });
      }

      // Get additional statistics
      const stats = {
        booking: booking,
        daysUntilEvent: Math.ceil((booking.eventDate - new Date()) / (1000 * 60 * 60 * 24)),
        isUpcoming: booking.eventDate > new Date(),
        isPast: booking.eventDate < new Date(),
        duration: this.calculateDuration(booking.startTime, booking.endTime)
      };

      res.json({
        message: 'Booking statistics retrieved successfully',
        statistics: stats
      });
    } catch (error) {
      console.error('Error getting booking stats:', error);
      res.status(500).json({
        message: 'Error retrieving booking statistics',
        error: error.message
      });
    }
  }

  // Check venue availability for a date range
  static async checkVenueAvailability(req, res) {
    try {
      const { venueId } = req.params;
      const { date, start_time, end_time } = req.query;

      if (!date) {
        return res.status(400).json({
          message: 'Date is required'
        });
      }

      // Check if venue exists
      const venue = await Venue.findById(venueId);
      if (!venue) {
        return res.status(404).json({
          message: 'Venue not found'
        });
      }

      // Check for existing bookings on the same date
      const existingBookings = await Booking.find({
        venue: venueId,
        eventDate: new Date(date),
        status: { $in: ['pending', 'confirmed'] }
      });

      let isAvailable = true;
      let conflictingBookings = [];

      if (start_time && end_time) {
        // Check for time conflicts
        conflictingBookings = existingBookings.filter(booking => {
          return this.isTimeConflict(
            start_time, end_time,
            booking.startTime, booking.endTime
          );
        });
        isAvailable = conflictingBookings.length === 0;
      } else {
        // Just check if any booking exists on this date
        isAvailable = existingBookings.length === 0;
      }

      res.json({
        message: 'Availability checked successfully',
        venue_id: venueId,
        date: date,
        available: isAvailable,
        conflicting_bookings: conflictingBookings,
        total_bookings_on_date: existingBookings.length
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({
        message: 'Error checking venue availability',
        error: error.message
      });
    }
  }

  // Helper method to calculate duration between two times
  static calculateDuration(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  }

  // Helper method to check for time conflicts
  static isTimeConflict(start1, end1, start2, end2) {
    const s1 = new Date(`2000-01-01T${start1}:00`);
    const e1 = new Date(`2000-01-01T${end1}:00`);
    const s2 = new Date(`2000-01-01T${start2}:00`);
    const e2 = new Date(`2000-01-01T${end2}:00`);
    
    return (s1 < e2 && e1 > s2);
  }
}

module.exports = BookingController;
