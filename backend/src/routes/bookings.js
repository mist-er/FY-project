const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');
const { validateBooking, validateBookingUpdate, validateBookingStatus } = require('../middleware/validation');
const verifyFirebaseIdToken = require('../middleware/firebaseAuth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public (for now, will add auth later)
router.post('/', verifyFirebaseIdToken, validateBooking, BookingController.createBooking);

// @route   GET /api/bookings
// @desc    Get all bookings with optional filters
// @access  Public
router.get('/', BookingController.getAllBookings);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Public
router.get('/:id', BookingController.getBookingById);

// @route   PUT /api/bookings/:id
// @desc    Update booking details
// @access  Public (for now, will add auth later)
router.put('/:id', verifyFirebaseIdToken, validateBookingUpdate, BookingController.updateBooking);

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status
// @access  Public (for now, will add auth later)
router.patch('/:id/status', verifyFirebaseIdToken, validateBookingStatus, BookingController.updateBookingStatus);

// @route   PATCH /api/bookings/:id/pay
// @desc    Mark booking as paid
// @access  Public (for now)
router.patch('/:id/pay', verifyFirebaseIdToken, BookingController.payForBooking);

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Public (for now, will add auth later)
router.delete('/:id', verifyFirebaseIdToken, BookingController.deleteBooking);

// @route   GET /api/bookings/organizer/:organizerId
// @desc    Get all bookings by organizer
// @access  Public
router.get('/organizer/:organizerId', BookingController.getBookingsByOrganizer);

// @route   GET /api/bookings/owner/:ownerId
// @desc    Get all bookings for venues owned by an owner
// @access  Public
router.get('/owner/:ownerId', BookingController.getBookingsByOwner);

// @route   GET /api/bookings/venue/:venueId
// @desc    Get all bookings by venue
// @access  Public
router.get('/venue/:venueId', BookingController.getBookingsByVenue);

// @route   GET /api/bookings/:id/stats
// @desc    Get booking statistics
// @access  Public
router.get('/:id/stats', BookingController.getBookingStats);

// @route   GET /api/bookings/venue/:venueId/availability
// @desc    Check venue availability for a date/time range
// @access  Public
router.get('/venue/:venueId/availability', BookingController.checkVenueAvailability);

module.exports = router;
