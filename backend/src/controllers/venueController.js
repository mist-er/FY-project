const Venue = require('../models/Venue');
const User = require('../models/User');
const { deleteUploadedFile, getFileUrl } = require('../middleware/upload');
const path = require('path');

class VenueController {
  // Create a new venue
  static async createVenue(req, res) {
    try {
      const {
        name,
        description,
        location,
        capacity,
        price,
        contact_email,
        contact_phone,
        owner_id
      } = req.body;

      // Check if owner exists
      const owner = await User.findById(owner_id);
      if (!owner) {
        return res.status(404).json({
          message: 'Owner not found'
        });
      }

      // Check if owner has 'owner' role
      if (owner.role !== 'owner') {
        return res.status(403).json({
          message: 'Only venue owners can create venues'
        });
      }

      // Handle photo upload
      let photoUrl = null;
      if (req.file) {
        photoUrl = getFileUrl(req.file.filename);
      }

      // Create venue data
      const venueData = {
        name,
        description,
        location,
        capacity: parseInt(capacity),
        price: parseFloat(price),
        contactEmail: contact_email,
        contactPhone: contact_phone,
        photoUrl,
        owner: owner_id
      };

      // Create venue
      const venue = await Venue.create(venueData);
      await venue.populate('owner', 'name email role');

      res.status(201).json({
        message: 'Venue created successfully',
        venue: venue
      });
    } catch (error) {
      console.error('Error creating venue:', error);
      
      // Clean up uploaded file if venue creation failed
      if (req.file) {
        deleteUploadedFile(req.file.path);
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors
        });
      }

      res.status(500).json({
        message: 'Error creating venue',
        error: error.message
      });
    }
  }

  // Get all venues with optional filters
  static async getAllVenues(req, res) {
    try {
      const {
        location,
        min_capacity,
        max_capacity,
        min_price,
        max_price,
        owner_id,
        limit = 20,
        offset = 0
      } = req.query;

      const filters = {};
      
      if (location) filters.location = location;
      if (min_capacity) filters.minCapacity = parseInt(min_capacity);
      if (max_capacity) filters.maxCapacity = parseInt(max_capacity);
      if (min_price) filters.minPrice = parseFloat(min_price);
      if (max_price) filters.maxPrice = parseFloat(max_price);
      if (owner_id) filters.ownerId = owner_id;
      
      filters.limit = parseInt(limit);
      filters.offset = parseInt(offset);

      const venues = await Venue.findWithFilters(filters);

      res.json({
        message: 'Venues retrieved successfully',
        venues: venues,
        count: venues.length,
        filters: filters
      });
    } catch (error) {
      console.error('Error getting venues:', error);
      res.status(500).json({
        message: 'Error retrieving venues',
        error: error.message
      });
    }
  }

  // Get venue by ID
  static async getVenueById(req, res) {
    try {
      const { id } = req.params;
      const venue = await Venue.findById(id).populate('owner', 'name email role');

      if (!venue) {
        return res.status(404).json({
          message: 'Venue not found'
        });
      }

      res.json({
        message: 'Venue retrieved successfully',
        venue: venue
      });
    } catch (error) {
      console.error('Error getting venue:', error);
      res.status(500).json({
        message: 'Error retrieving venue',
        error: error.message
      });
    }
  }

  // Search venues
  static async searchVenues(req, res) {
    try {
      const {
        search,
        min_capacity,
        max_price,
        limit = 20
      } = req.query;

      if (!search) {
        return res.status(400).json({
          message: 'Search term is required'
        });
      }

      const filters = {};
      if (min_capacity) filters.minCapacity = parseInt(min_capacity);
      if (max_price) filters.maxPrice = parseFloat(max_price);
      filters.limit = parseInt(limit);

      const venues = await Venue.searchVenues(search, filters);

      res.json({
        message: 'Search completed successfully',
        venues: venues,
        count: venues.length,
        search_term: search,
        filters: filters
      });
    } catch (error) {
      console.error('Error searching venues:', error);
      res.status(500).json({
        message: 'Error searching venues',
        error: error.message
      });
    }
  }

  // Update venue
  static async updateVenue(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        location,
        capacity,
        price,
        contact_email,
        contact_phone
      } = req.body;

      // Check if venue exists
      const existingVenue = await Venue.findById(id);
      if (!existingVenue) {
        return res.status(404).json({
          message: 'Venue not found'
        });
      }

      // Handle photo upload
      let photoUrl = existingVenue.photoUrl;
      if (req.file) {
        // Delete old photo if exists
        if (existingVenue.photoUrl) {
          const oldFilename = path.basename(existingVenue.photoUrl);
          const oldPath = path.join(__dirname, '../../uploads', oldFilename);
          deleteUploadedFile(oldPath);
        }
        
        // Set new photo URL
        photoUrl = getFileUrl(req.file.filename);
      }

      // Prepare update data
      const updateData = {
        name: name || existingVenue.name,
        description: description !== undefined ? description : existingVenue.description,
        location: location || existingVenue.location,
        capacity: capacity ? parseInt(capacity) : existingVenue.capacity,
        price: price ? parseFloat(price) : existingVenue.price,
        contactEmail: contact_email !== undefined ? contact_email : existingVenue.contactEmail,
        contactPhone: contact_phone !== undefined ? contact_phone : existingVenue.contactPhone,
        photoUrl
      };

      // Update venue
      const updatedVenue = await Venue.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('owner', 'name email role');

      res.json({
        message: 'Venue updated successfully',
        venue: updatedVenue
      });
    } catch (error) {
      console.error('Error updating venue:', error);
      
      // Clean up uploaded file if update failed
      if (req.file) {
        deleteUploadedFile(req.file.path);
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors
        });
      }

      res.status(500).json({
        message: 'Error updating venue',
        error: error.message
      });
    }
  }

  // Delete venue (soft delete)
  static async deleteVenue(req, res) {
    try {
      const { id } = req.params;
      
      // Check if venue exists
      const venue = await Venue.findById(id);
      if (!venue) {
        return res.status(404).json({
          message: 'Venue not found'
        });
      }

      // Soft delete venue
      await venue.softDelete();

      res.json({
        message: 'Venue deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting venue:', error);
      res.status(500).json({
        message: 'Error deleting venue',
        error: error.message
      });
    }
  }

  // Get venues by owner
  static async getVenuesByOwner(req, res) {
    try {
      const { ownerId } = req.params;
      
      // Check if owner exists
      const owner = await User.findById(ownerId);
      if (!owner) {
        return res.status(404).json({
          message: 'Owner not found'
        });
      }

      const venues = await Venue.findWithFilters({ ownerId: ownerId });

      res.json({
        message: 'Owner venues retrieved successfully',
        owner: owner,
        venues: venues,
        count: venues.length
      });
    } catch (error) {
      console.error('Error getting owner venues:', error);
      res.status(500).json({
        message: 'Error retrieving owner venues',
        error: error.message
      });
    }
  }

  // Get venue statistics
  static async getVenueStats(req, res) {
    try {
      const { id } = req.params;
      
      // Check if venue exists
      const venue = await Venue.findById(id).populate('owner', 'name email role');
      if (!venue) {
        return res.status(404).json({
          message: 'Venue not found'
        });
      }

      const stats = await venue.getStats();

      res.json({
        message: 'Venue statistics retrieved successfully',
        venue: venue,
        statistics: stats
      });
    } catch (error) {
      console.error('Error getting venue stats:', error);
      res.status(500).json({
        message: 'Error retrieving venue statistics',
        error: error.message
      });
    }
  }

  // Check venue availability for a date
  static async checkAvailability(req, res) {
    try {
      const { id } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          message: 'Date is required'
        });
      }

      // Check if venue exists
      const venue = await Venue.findById(id);
      if (!venue) {
        return res.status(404).json({
          message: 'Venue not found'
        });
      }

      const isAvailable = await venue.isAvailableForDate(date);

      res.json({
        message: 'Availability checked successfully',
        venue_id: id,
        date: date,
        available: isAvailable
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({
        message: 'Error checking venue availability',
        error: error.message
      });
    }
  }
}

module.exports = VenueController;