const fs   = require('fs');
const path = require('path');
const MiceGallery = require('../models/MiceGallery');

const getAll = async (req, res) => {
  try {
    const filter = req.query.all === '1' ? {} : { active: true };
    const images = await MiceGallery.find(filter).sort({ slot: 1, createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { alt, slot, label, sublabel, destination, nights, startingFrom } = req.body;
    if (!slot)     return res.status(400).json({ success: false, message: 'slot is required' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Image file is required' });

    const imageUrl = `/uploads/mice/${req.file.filename}`;
    const image = await MiceGallery.create({
      imageUrl,
      alt:      alt      || '',
      slot,
      label:    label    || '',
      sublabel: sublabel || '',
      destination:  destination || '',
      nights:       nights       !== undefined && nights       !== '' ? Number(nights)       : null,
      startingFrom: startingFrom !== undefined && startingFrom !== '' ? Number(startingFrom) : null,
    });
    res.status(201).json({ success: true, data: image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const image = await MiceGallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, data: image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const image = await MiceGallery.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    const abs = path.join(__dirname, '../../', image.imageUrl);
    fs.unlink(abs, () => {});
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleActive = async (req, res) => {
  try {
    const image = await MiceGallery.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    image.active = !image.active;
    await image.save();
    res.json({ success: true, data: image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, create, update, remove, toggleActive };
