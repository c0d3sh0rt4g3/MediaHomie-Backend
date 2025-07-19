import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { generateToken } from '../config/jwt.config.js';

/**
 * User controller for authentication-related operations
 */
const userController = {
  /**
   * Register a new user
   */
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed.',
          errors: errors.array()
        });
      }

      const { email, password, userName } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          message: 'Email is already associated with an account.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({
        email,
        userName,
        passwordHash,
        role: 'user'
      });

      const savedUser = await newUser.save();

      const token = generateToken(savedUser);

      const userWithoutPassword = savedUser.toObject();
      delete userWithoutPassword.passwordHash;

      return res.status(201).json({
        message: 'Account created successfully!',
        token,
        user: userWithoutPassword
      });

    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).json({
        message: 'Server error during registration.',
        error: err.message
      });
    }
  },

  /**
   * Log in an existing user
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required.'
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          message: 'Invalid credentials.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          message: 'Incorrect password.'
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        message: 'Login successful!',
        token,
        user: {
          id: user._id,
          email: user.email,
          userName: user.userName,
          role: user.role,
          createdAt: user.createdAt
        }
      });

    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({
        message: 'Server error during login.',
        error: err.message
      });
    }
  }
};

export default userController;
