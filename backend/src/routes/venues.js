const express = require('express');
const router = express.Router();
const VenueController = require('../controllers/venueController');
const { validateVenue, validateVenueSearch } = require('../middleware/validation');
const { handleUpload } = require('../middleware/upload');

// @route   POST /api/venues
// @desc    Create a new venue
// @access  Public (for now, will add auth later)
router.post('/', validateVenue, handleUpload, VenueController.createVenue);

// @route   GET /api/venues
// @desc    Get all venues with optional filters
// @access  Public
router.get('/', validateVenueSearch, VenueController.getAllVenues);

// @route   GET /api/venues/search
// @desc    Search venues by name, location, or description
// @access  Public
router.get('/search', validateVenueSearch, VenueController.searchVenues);

// @route   GET /api/venues/:id
// @desc    Get venue by ID
// @access  Public
router.get('/:id', VenueController.getVenueById);

// @route   PUT /api/venues/:id
// @desc    Update venue
// @access  Public (for now, will add auth later)
router.put('/:id', validateVenue, handleUpload, VenueController.updateVenue);

// @route   DELETE /api/venues/:id
// @desc    Delete venue (soft delete)
// @access  Public (for now, will add auth later)
router.delete('/:id', VenueController.deleteVenue);

// @route   GET /api/venues/owner/:ownerId
// @desc    Get all venues by owner
// @access  Public
router.get('/owner/:ownerId', VenueController.getVenuesByOwner);

// @route   GET /api/venues/:id/stats
// @desc    Get venue statistics
// @access  Public
router.get('/:id/stats', VenueController.getVenueStats);

// @route   GET /api/venues/:id/availability
// @desc    Check venue availability for a specific date
// @access  Public
router.get('/:id/availability', VenueController.checkAvailability);

module.exports = router;
