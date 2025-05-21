// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllUsers } = require('../controllers/userController');

// GET /users - list all users (protected)
router.get('/', authMiddleware, getAllUsers);

module.exports = router;
