const PrivacyPolicy = require('../models/PrivacyPolicy');

/* Public — returns the current Privacy Policy content, or null if none
   saved yet (frontend falls back to its bundled default text in that case). */
const getPolicy = async (_req, res) => {
  try {
    const doc = await PrivacyPolicy.findOne().sort({ createdAt: -1 });
    res.json({ success: true, data: doc || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Admin — saves the Privacy Policy content, replacing the previous
   version (single slot). */
const savePolicy = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const prev = await PrivacyPolicy.findOne().sort({ createdAt: -1 });
    const doc = await PrivacyPolicy.create({ content });
    if (prev) await PrivacyPolicy.deleteOne({ _id: prev._id });

    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPolicy, savePolicy };
