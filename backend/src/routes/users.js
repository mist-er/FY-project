const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateUserRegistration, validateUserLogin, validateDeviceTokenRegistration } = require('../middleware/validation');
const verifyFirebaseIdToken = require('../middleware/firebaseAuth');

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', validateUserLogin, UserController.loginUser);

// @route   POST /api/users
// @desc    Create a new user
// @access  Public (for testing)
router.post('/', validateUserRegistration, UserController.createUser);

// @route   GET /api/users
// @desc    Get all users
// @access  Public (for testing)
router.get('/', UserController.getAllUsers);

// @route   POST /api/users/firebase/link
// @desc    Link a Firebase account to a user
// @access  Protected via Firebase ID token
router.post('/firebase/link', verifyFirebaseIdToken, UserController.linkFirebaseAccount);

// @route   POST /api/users/device-token
// @desc    Save a Firebase Cloud Messaging device token
// @access  Protected via Firebase ID token
router.post(
  '/device-token',
  verifyFirebaseIdToken,
  validateDeviceTokenRegistration,
  UserController.saveDeviceToken
);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public (for testing)
router.get('/:id', UserController.getUserById);

module.exports = router;
