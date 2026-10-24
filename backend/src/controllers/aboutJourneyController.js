const fs   = require('fs');
const path = require('path');
const AboutJourney = require('../models/AboutJourney');

/* Public — returns the current "Our Journey" image, or null if none uploaded
   yet (frontend falls back to its bundled default image in that case). */
const getImage = async (_req, res) => {
  try {
    const doc = await AboutJourney.findOne().sort({ createdAt: -1 });
    res.json({ success: true, data: doc || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Admin — uploads a new image, replacing the previous one (single slot). */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image file is required' });

    const prev = await AboutJourney.findOne().sort({ createdAt: -1 });
    const imageUrl = `/uploads/about-journey/${req.file.filename}`;
    const doc = await AboutJourney.create({ image: imageUrl, alt: req.body.alt || 'Our Team' });

    if (prev) {
      const abs = path.join(__dirname, '../../', prev.image);
      fs.unlink(abs, () => {});
      await AboutJourney.deleteOne({ _id: prev._id });
    }

    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getImage, uploadImage };
