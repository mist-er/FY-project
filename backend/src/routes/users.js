const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateUserRegistration } = require('../middleware/validation');

// @route   POST /api/users
// @desc    Create a new user
// @access  Public (for testing)
router.post('/', validateUserRegistration, UserController.createUser);

// @route   GET /api/users
// @desc    Get all users
// @access  Public (for testing)
router.get('/', UserController.getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public (for testing)
router.get('/:id', UserController.getUserById);

module.exports = router;
