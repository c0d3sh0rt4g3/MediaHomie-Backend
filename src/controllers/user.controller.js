import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

const userController = {
  /**
   * Register a new user
   */
  register: async (req, res) => {
    try {
      // Validate input using express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed. Please check the provided data.',
          errors: errors.array()
        });
      }

      const { email, password, userName } = req.body;

      // Check if email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          message: 'The email address is already associated with another account.'
        });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create a new user
      const newUser = new User({
        email,
        userName,
        passwordHash
      });

      const savedUser = await newUser.save();

      // Exclude password from the response
      const userWithoutPassword = savedUser.toObject();
      delete userWithoutPassword.passwordHash;

      return res.status(201).json({
        message: 'Account created successfully!',
        user: userWithoutPassword
      });
    } catch (err) {
      console.error('Register error:', err);

      return res.status(500).json({
        message: 'An unexpected error occurred during registration. Please try again later.',
        error: err.message
      });
    }
  },

  /**
   * Log in a user using email and password
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check for missing credentials
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required to login.'
        });
      }

      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          message: 'No account found with that email address.'
        });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          message: 'Incorrect password. Please try again.'
        });
      }

      // Build response without password
      const userData = {
        id: user._id,
        email: user.email,
        userName: user.userName,
        createdAt: user.createdAt
      };

      return res.status(200).json({
        message: 'Welcome back!',
        user: userData
      });
    } catch (err) {
      console.error('Login error:', err);

      return res.status(500).json({
        message: 'An unexpected error occurred during login. Please try again later.',
        error: err.message
      });
    }
  },

  /**
   * Get a list of all users
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}, '-passwordHash');
      return res.status(200).json({ users });
    } catch (err) {
      console.error('Fetch users error:', err);
      return res.status(500).json({ message: 'Error retrieving user list.' });
    }
  },

  /**
   * Get a single user by ID
   */
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id, '-passwordHash');

      if (!user) {
        return res.status(404).json({ message: `No user found with ID ${id}.` });
      }

      return res.status(200).json({ user });
    } catch (err) {
      console.error('Get user error:', err);
      return res.status(500).json({ message: 'Error retrieving user information.' });
    }
  }
};

export default userController;
