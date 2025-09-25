const User = require('../models/User');

class UserController {
  // Create a new user (for testing)
  static async createUser(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          message: 'User with this email already exists'
        });
      }

      // Create user
      const user = await User.create({ name, email, password, role });

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