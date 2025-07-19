/**
 * Authentication middleware module
 * Provides token verification for protected routes
 * @file auth.middleware.js
 * @module middleware/auth
 */

import { verifyToken } from '../config/jwt.config.js';
import User from '../models/user.model.js';

/**
 * Middleware to authenticate JWT tokens and attach user information to request
 * @async
 * @function authenticateToken
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Authorization header containing Bearer token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 * @throws {Object} 401 status when token is missing
 * @throws {Object} 403 status when token is invalid or user not found
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    req.user = {
      id: user._id,
      userName: user.userName,
      email: user.email
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware factory for role-based access (unsupported in this schema, placeholder)
 * @function authorizeRole
 * @returns {Function} Middleware that throws an error (roles aren't defined in schema)
 */
export const authorizeRole = () => {
  return (req, res) => {
    return res.status(500).json({
      message: 'Role-based authorization is not supported with the current user schema.'
    });
  };
};
