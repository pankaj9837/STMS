// controllers/userController.js

const User = require('../models/User');

/**
 * GET /users
 * Retrieve all users (username, email, role) and return as JSON.
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch users, projecting only username, email, and role
    const users = await User.find({}, 'username email role');
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
  }
};
