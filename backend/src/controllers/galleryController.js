const fs   = require('fs');
const path = require('path');
const GalleryImage = require('../models/GalleryImage');

const getAll = async (req, res) => {
  try {
    // admin passes ?all=1 to get hidden images too
    const filter = req.query.all === '1' ? {} : { active: true };
    const images = await GalleryImage.find(filter).sort({ section: 1, order: 1, createdAt: 1 });
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { alt, section, order } = req.body;
    if (!section) return res.status(400).json({ success: false, message: 'section is required (side | row1 | row2)' });
    if (!req.file)  return res.status(400).json({ success: false, message: 'Image file is required' });

    const imageUrl = `/uploads/gallery/${req.file.filename}`;
    const image = await GalleryImage.create({ imageUrl, alt: alt || 'gallery image', section, order: order ?? 0 });
    res.status(201).json({ success: true, data: image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, data: image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    // delete physical file
    const abs = path.join(__dirname, '../../', image.imageUrl);
    fs.unlink(abs, () => {});
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleActive = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    image.active = !image.active;
    await image.save();
    res.json({ success: true, data: image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, create, update, remove, toggleActive };
