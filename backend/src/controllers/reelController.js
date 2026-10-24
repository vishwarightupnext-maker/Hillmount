const fs   = require('fs');
const path = require('path');
const sharp = require('sharp');
const Reel  = require('../models/Reel');

const VIDEO_DIR = path.join(__dirname, '../../uploads/reels');
const THUMB_DIR = path.join(__dirname, '../../uploads/reel-thumbnails');

const getAll = async (req, res) => {
  try {
    const filter = req.query.all === '1' ? {} : { active: true };
    const reels  = await Reel.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: reels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const videoFile = req.files?.video?.[0];
    const thumbFile = req.files?.thumbnail?.[0];

    if (!videoFile) return res.status(400).json({ success: false, message: 'Video file is required' });

    // Save video as-is (no compression)
    const videoExt  = path.extname(videoFile.originalname).toLowerCase();
    const videoName = `${Date.now()}-${Math.random().toString(36).slice(2)}${videoExt}`;
    fs.writeFileSync(path.join(VIDEO_DIR, videoName), videoFile.buffer);

    // Compress and save thumbnail if provided
    let thumbnailUrl = '';
    if (thumbFile) {
      const thumbName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      await sharp(thumbFile.buffer).webp({ quality: 80 }).toFile(path.join(THUMB_DIR, thumbName));
      thumbnailUrl = `/uploads/reel-thumbnails/${thumbName}`;
    }

    const reel = await Reel.create({
      videoUrl: `/uploads/reels/${videoName}`,
      thumbnailUrl,
      title: req.body.title || '',
      order: parseInt(req.body.order ?? 0),
    });
    res.status(201).json({ success: true, data: reel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const reel = await Reel.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!reel) return res.status(404).json({ success: false, message: 'Reel not found' });
    res.json({ success: true, data: reel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const reel = await Reel.findByIdAndDelete(req.params.id);
    if (!reel) return res.status(404).json({ success: false, message: 'Reel not found' });
    // Delete files
    fs.unlink(path.join(__dirname, '../../', reel.videoUrl), () => {});
    if (reel.thumbnailUrl) fs.unlink(path.join(__dirname, '../../', reel.thumbnailUrl), () => {});
    res.json({ success: true, message: 'Reel deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleActive = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ success: false, message: 'Reel not found' });
    reel.active = !reel.active;
    await reel.save();
    res.json({ success: true, data: reel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, create, update, remove, toggleActive };
