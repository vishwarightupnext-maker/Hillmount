const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { ADMIN_EMAIL, ADMIN_PASSWORD } = require('../Constant');
const SubAdmin = require('../models/SubAdmin');

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.ZOHO_HOST || 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: { user: process.env.ZOHO_EMAIL, pass: process.env.ZOHO_PASSWORD },
    tls: { rejectUnauthorized: false },
  });

const seedSuperAdmin = async () => {
  try {
    const adminCount = await SubAdmin.countDocuments({ role: 'admin' });
    if (adminCount === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const envEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
      const envPassword = process.env.ADMIN_PASSWORD.trim();
      console.log(`[SeedAdmin] Creating Super Admin in DB (${envEmail})...`);
      await SubAdmin.create({
        email: envEmail,
        password: envPassword,
        plainPassword: envPassword,
        role: 'admin',
        access: { blogs: 'edit', customHolidays: 'edit' },
      });
    }
  } catch (err) {
    console.error('[SeedAdmin] Error seeding Super Admin:', err.message);
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await SubAdmin.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Admin/User with this email already exists' });
    }

    const admin = await SubAdmin.create({
      email: cleanEmail,
      password: cleanPassword,
      plainPassword: cleanPassword,
      role: 'admin',
      access: { blogs: 'edit', customHolidays: 'edit' },
    });

    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully. You can now log in.',
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('[registerAdmin] Error:', err.message);
    return res.status(500).json({ success: false, message: err.message || 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required' });

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  // Dynamic DB lookup for authentication - no static hardcoded credentials check
  try {
    const sub = await SubAdmin.findOne({ email: cleanEmail });
    if (sub && sub.comparePassword(cleanPassword)) {
      const userRole = sub.role || 'sub-admin';
      const tokenPayload = {
        email: sub.email,
        role: userRole,
        id: sub._id,
        access: userRole === 'admin' ? { blogs: 'edit', customHolidays: 'edit' } : sub.access,
      };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res.json({
        success: true,
        token,
        role: userRole,
        access: tokenPayload.access,
        message: 'Login successful',
      });
    }
  } catch (err) {
    console.error('[Login] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }

  return res.status(401).json({ success: false, message: 'Invalid email or password' });
};

const verifyToken = (req, res) => res.json({ success: true, admin: req.admin });

const getSubAdmins = async (_req, res) => {
  try {
    const data = await SubAdmin.find({ role: { $ne: 'admin' } })
      .select('-password -resetOtp -resetOtpExpiry')
      .sort({ createdAt: -1 }); // plainPassword IS included
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createSubAdmin = async (req, res) => {
  try {
    const { email, password, access } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    if (typeof email !== 'string')
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    if (await SubAdmin.findOne({ email: email.trim().toLowerCase() }))
      return res.status(409).json({ success: false, message: 'Email already exists' });

    const sub = await SubAdmin.create({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      plainPassword: password.trim(),
      role: 'sub-admin',
      access: {
        blogs:          access?.blogs          || 'none',
        customHolidays: access?.customHolidays || 'none',
      },
    });
    res.status(201).json({
      success: true,
      data: { _id: sub._id, email: sub.email, plainPassword: sub.plainPassword, access: sub.access, createdAt: sub.createdAt },
    });
  } catch (err) {
    console.error('[createSubAdmin]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateSubAdmin = async (req, res) => {
  try {
    const { password, access } = req.body;
    const sub = await SubAdmin.findById(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: 'User not found' });
    if (password) { sub.password = password.trim(); sub.plainPassword = password.trim(); }
    if (access) sub.access = access;
    await sub.save();
    res.json({ success: true, data: { _id: sub._id, email: sub.email, plainPassword: sub.plainPassword, access: sub.access } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteSubAdmin = async (req, res) => {
  try {
    const sub = await SubAdmin.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, message: 'Email is required' });

  const cleanEmail = email.trim().toLowerCase();
  const envEmail = (ADMIN_EMAIL || '').trim().toLowerCase();

  try {
    let sub = await SubAdmin.findOne({ email: cleanEmail });

    if (!sub && cleanEmail === envEmail) {
      const envPassword = (ADMIN_PASSWORD || 'Admin@123').trim();
      sub = await SubAdmin.create({
        email: envEmail,
        password: envPassword,
        plainPassword: envPassword,
        role: 'admin',
        access: { blogs: 'edit', customHolidays: 'edit' },
      });
    }

    if (sub) {
      const otp = crypto.randomInt(100000, 999999).toString();
      sub.resetOtp = otp;
      sub.resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000);
      await sub.save();
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"HillMount Admin" <${process.env.ZOHO_EMAIL}>`,
          to: sub.email,
          subject: 'Your Password Reset OTP — HillMount Admin',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:30px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);">
              <div style="background:#F5C518;padding:20px 28px;">
                <h1 style="margin:0;font-size:18px;color:#000;">Password Reset</h1>
                <p style="margin:4px 0 0;font-size:11px;color:#333;">HillMount Admin Panel</p>
              </div>
              <div style="padding:24px 28px;">
                <p style="color:#444;font-size:14px;">Use this OTP to reset your password. It expires in <strong>15 minutes</strong>.</p>
                <div style="background:#f4f4f4;border-radius:8px;padding:18px;text-align:center;margin:16px 0;">
                  <span style="font-size:36px;font-weight:900;letter-spacing:12px;color:#1F2937;">${otp}</span>
                </div>
                <p style="color:#888;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
              </div>
            </div>`,
        });
      } catch (mailErr) {
        console.error('[ForgotPassword] Email error:', mailErr.message);
      }
    }
    res.json({ success: true, message: 'If this email is registered, an OTP has been sent.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });

  const cleanEmail = email.trim().toLowerCase();
  try {
    const sub = await SubAdmin.findOne({ email: cleanEmail });
    if (!sub || !sub.resetOtp || !sub.resetOtpExpiry)
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    if (sub.resetOtp !== otp)
      return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    if (new Date() > sub.resetOtpExpiry)
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });

    sub.password = newPassword.trim();
    sub.plainPassword = newPassword.trim();
    sub.resetOtp = null;
    sub.resetOtpExpiry = null;
    await sub.save();

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  seedSuperAdmin,
  registerAdmin,
  login, verifyToken,
  getSubAdmins, createSubAdmin, updateSubAdmin, deleteSubAdmin,
  forgotPassword, resetPassword,
};
