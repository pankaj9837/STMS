const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "Email already in use" });

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email ,role:user.role} });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ msg: "Invalid email or password" });

    const token = generateToken(user);

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role:user.role } });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};
