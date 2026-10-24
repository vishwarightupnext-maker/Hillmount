const fs   = require('fs');
const path = require('path');
const HomeBanner = require('../models/HomeBanner');

/* Public — returns the current banner image, or null if none uploaded yet
   (frontend falls back to its bundled default image in that case). */
const getBanner = async (_req, res) => {
  try {
    const banner = await HomeBanner.findOne().sort({ createdAt: -1 });
    res.json({ success: true, data: banner || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Admin — uploads a new image, replacing the previous one (single slot). */
const uploadBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image file is required' });

    const prev = await HomeBanner.findOne().sort({ createdAt: -1 });
    const imageUrl = `/uploads/home-banner/${req.file.filename}`;
    const banner = await HomeBanner.create({ image: imageUrl, alt: req.body.alt || 'Cozy home' });

    if (prev) {
      const abs = path.join(__dirname, '../../', prev.image);
      fs.unlink(abs, () => {});
      await HomeBanner.deleteOne({ _id: prev._id });
    }

    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getBanner, uploadBanner };
