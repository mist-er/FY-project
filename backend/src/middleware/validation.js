const { body, validationResult } = require('express-validator');

// Validation middleware for venue creation/update
const validateVenue = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Venue name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Venue name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Location must be between 5 and 200 characters'),

  body('capacity')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Capacity must be a positive integer between 1 and 10,000'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('contact_email')
    .optional()
    .isEmail()
    .withMessage('Contact email must be a valid email address'),

  body('contact_phone')
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage('Contact phone must be between 10 and 15 characters'),

  body('owner_id')
    .isMongoId()
    .withMessage('Owner ID must be a valid MongoDB ObjectId'),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];



// Validation middleware for user registration
const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('role')
    .isIn(['owner', 'organizer'])
    .withMessage('Role must be either "owner" or "organizer"'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];



// Validation middleware for user login
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];



// Validation middleware for venue search/filter
const validateVenueSearch = [
  body('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location filter must not exceed 100 characters'),

  body('min_capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum capacity must be a positive integer'),

  body('max_capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum capacity must be a positive integer'),

  body('min_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),

  body('max_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),

  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  body('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for booking creation
const validateBooking = [
  body('venue_id')
    .isMongoId()
    .withMessage('Venue ID must be a valid MongoDB ObjectId'),

  body('organizer_id')
    .isMongoId()
    .withMessage('Organizer ID must be a valid MongoDB ObjectId'),

  body('event_name')
    .trim()
    .notEmpty()
    .withMessage('Event name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Event name must be between 2 and 100 characters'),

  body('event_date')
    .isISO8601()
    .withMessage('Event date must be a valid date (YYYY-MM-DD format)')
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        throw new Error('Event date cannot be in the past');
      }
      return true;
    }),

  body('start_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format (24-hour)'),

  body('end_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format (24-hour)')
    .custom((value, { req }) => {
      if (req.body.start_time && value) {
        const startTime = new Date(`2000-01-01T${req.body.start_time}:00`);
        const endTime = new Date(`2000-01-01T${value}:00`);
        
        if (endTime <= startTime) {
          throw new Error('End time must be after start time');
        }
      }
      return true;
    }),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for booking updates
const validateBookingUpdate = [
  body('event_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Event name must be between 2 and 100 characters'),

  body('event_date')
    .optional()
    .isISO8601()
    .withMessage('Event date must be a valid date (YYYY-MM-DD format)')
    .custom((value) => {
      if (value) {
        const eventDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (eventDate < today) {
          throw new Error('Event date cannot be in the past');
        }
      }
      return true;
    }),

  body('start_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format (24-hour)'),

  body('end_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format (24-hour)')
    .custom((value, { req }) => {
      if (req.body.start_time && value) {
        const startTime = new Date(`2000-01-01T${req.body.start_time}:00`);
        const endTime = new Date(`2000-01-01T${value}:00`);
        
        if (endTime <= startTime) {
          throw new Error('End time must be after start time');
        }
      }
      return true;
    }),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for booking status updates
const validateBookingStatus = [
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Status must be one of: pending, confirmed, cancelled'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateVenue,
  validateUserRegistration,
  validateUserLogin,
  validateVenueSearch,
  validateBooking,
  validateBookingUpdate,
  validateBookingStatus
};
