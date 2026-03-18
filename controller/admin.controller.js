const { Permission, Admin, Session } = require('../models');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET_KEY = process.env.SECRET; // Store this securely in .env

// Generate JWT
const generateToken = (admin) => {
  return jwt.sign({ id: admin._id, role: admin.role }, SECRET_KEY, {
    expiresIn: '7d',
  });
};

// @route POST /api/admin/register
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({ name, email, password, role });
    const token = generateToken(admin);

    res.status(201).json({
      status: true,
      message: 'Registered successfully',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// @route POST /api/admin/login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    console.log(admin);
    
    if (!admin) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(admin);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const permissions = await Permission.find({ admin: admin._id });

    await Session.create({
      userId: admin.sid,
      token,
      expiresAt,
    });

    const isProd = process.env.NODE_ENV === 'production';
    // ✅ Set cookie
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    res.status(200).json({
      status: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        },
        permissions
      }
    });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ status: false, message: err.message });
  }
};

// @route GET /api/admin/me
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password').lean();
    if (!admin) return res.status(404).json({ status: false, message: 'Admin not found' });
    const permissions = await Permission.find({ admin: admin._id });
    res.status(200).json({ status: true, message: 'Profile fetched', data: { ...admin, permissions } });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// controller
exports.getAllAdmins = async (req, res) => {
  const admins = await Admin.find({ role: 'SubAdmin' }).select("-password");
  res.json({ status: true, message: "Admins fetched", data: admins });
};

exports.updateAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  const admin = await Admin.findById(req.params.id);
  if (!admin) return res.status(404).json({ status: false, message: "Not found" });

  admin.name = name;
  admin.email = email;
  admin.role = role;
  if (password) admin.password = password;

  await admin.save();
  res.json({ status: true, message: "Admin updated", data: admin });
};

exports.deleteAdmin = async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ status: true, message: "Admin deleted" });
};

exports.logoutAdmin = async (req, res) => {
  try {
    const token = req.cookies.session_token;

    if (!token) {
      return res.status(400).json({ status: false, message: 'No session token in cookie' });
    }

    // Delete the session from the database
    await Session.deleteOne({ token });

    // Clear the session token cookie
    res.clearCookie('session_token', {
      path: '/',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({ status: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ status: false, message: 'Logout failed' });
  }
}
