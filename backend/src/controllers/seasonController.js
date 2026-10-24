const fs   = require('fs');
const path = require('path');
const Season = require('../models/Season');

const getAll = async (req, res) => {
  try {
    const seasons = await Season.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: seasons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { label, period, subtitle, description, order } = req.body;
    if (!label) return res.status(400).json({ success: false, message: 'Label is required' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });

    const image = `/uploads/seasons/${req.file.filename}`;
    const season = await Season.create({
      label,
      period:      period      || '',
      subtitle:    subtitle    || '',
      description: description || '',
      image,
      order: order ? Number(order) : 0,
    });
    res.status(201).json({ success: true, data: season });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const season = await Season.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!season) return res.status(404).json({ success: false, message: 'Season not found' });
    res.json({ success: true, data: season });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const season = await Season.findByIdAndDelete(req.params.id);
    if (!season) return res.status(404).json({ success: false, message: 'Season not found' });
    if (season.image) {
      const abs = path.join(__dirname, '../../', season.image);
      fs.unlink(abs, () => {});
    }
    res.json({ success: true, message: 'Season deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleActive = async (req, res) => {
  try {
    const season = await Season.findById(req.params.id);
    if (!season) return res.status(404).json({ success: false, message: 'Season not found' });
    season.active = !season.active;
    await season.save();
    res.json({ success: true, data: season });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, create, update, remove, toggleActive };
