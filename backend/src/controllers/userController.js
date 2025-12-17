const User = require('../models/User');

class UserController {
  // Create a new user (for testing)
  static async createUser(req, res) {
    try {
      const { name, email, password, role, firebase_uid, phone_number } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          message: 'User with this email already exists'
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role,
        firebaseUid: firebase_uid,
        phoneNumber: phone_number
      });

      res.status(201).json({
        message: 'User created successfully',
        user: user
      });
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors
        });
      }

      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'User with this email already exists'
        });
      }

      res.status(500).json({
        message: 'Error creating user',
        error: error.message
      });
    }
  }

  // Link or create a user record from Firebase Auth identity
  static async linkFirebaseAccount(req, res) {
    try {
      if (!req.firebaseUser) {
        return res.status(401).json({
          message: 'Firebase authentication is required.'
        });
      }

      const {
        uid,
        phone_number: firebasePhoneNumber,
        email: firebaseEmail,
        name: firebaseName
      } = req.firebaseUser;

      const { name, email, role, phoneNumber } = req.body;

      if (!role) {
        return res.status(400).json({
          message: 'Role is required to link a Firebase account.'
        });
      }

      const resolvedEmail = email || firebaseEmail;

      if (!resolvedEmail) {
        return res.status(400).json({
          message: 'Email is required to create or link a user.'
        });
      }

      const updatePayload = {
        name: name || firebaseName || 'Firebase User',
        email: resolvedEmail,
        role,
        firebaseUid: uid,
        phoneNumber: phoneNumber || firebasePhoneNumber || undefined
      };

      const user = await User.findOneAndUpdate(
        { firebaseUid: uid },
        { $set: updatePayload },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.json({
        message: 'Firebase account linked successfully',
        user
      });
    } catch (error) {
      console.error('Error linking Firebase account:', error);
      res.status(500).json({
        message: 'Error linking Firebase account',
        error: error.message
      });
    }
  }

  // Store or update a user device token
  static async saveDeviceToken(req, res) {
    try {
      if (!req.firebaseUser) {
        return res.status(401).json({
          message: 'Firebase authentication is required.'
        });
      }

      const { deviceToken } = req.body;

      if (!deviceToken) {
        return res.status(400).json({
          message: 'deviceToken is required'
        });
      }

      const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });

      if (!user) {
        return res.status(404).json({
          message: 'User not found for the authenticated Firebase account'
        });
      }

      await user.addFcmToken(deviceToken);

      res.json({
        message: 'Device token saved successfully',
        userId: user._id,
        tokens: user.fcmTokens
      });
    } catch (error) {
      console.error('Error saving device token:', error);
      res.status(500).json({
        message: 'Error saving device token',
        error: error.message
      });
    }
  }

  // Get all users
  static async getAllUsers(req, res) {
    try {
      const users = await User.find().sort({ createdAt: -1 });

      res.json({
        message: 'Users retrieved successfully',
        users: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({
        message: 'Error retrieving users',
        error: error.message
      });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      res.json({
        message: 'User retrieved successfully',
        user: user
      });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({
        message: 'Error retrieving user',
        error: error.message
      });
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, role },
        { new: true, runValidators: true }
      );

      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating user:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors
        });
      }

      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'User with this email already exists'
        });
      }

      res.status(500).json({
        message: 'Error updating user',
        error: error.message
      });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Delete user
      await User.findByIdAndDelete(id);

      res.json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        message: 'Error deleting user',
        error: error.message
      });
    }
  }

  // Login user
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      // Find user by email with password
      const user = await User.findByEmailWithPassword(email);
      
      if (!user) {
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isPasswordValid = await user.verifyPassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        message: 'Login successful',
        user: userResponse
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({
        message: 'Error logging in',
        error: error.message
      });
    }
  }

  // Get user's venues
  static async getUserVenues(req, res) {
    try {
      const { id } = req.params;
      
      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Get user's venues
      const venues = await user.getVenues();

      res.json({
        message: 'User venues retrieved successfully',
        user: user,
        venues: venues,
        count: venues.length
      });
    } catch (error) {
      console.error('Error getting user venues:', error);
      res.status(500).json({
        message: 'Error retrieving user venues',
        error: error.message
      });
    }
  }
}

module.exports = UserController;