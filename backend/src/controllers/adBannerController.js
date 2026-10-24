const fs = require('fs');
const path = require('path');
const AdBanner = require('../models/AdBanner');

const getAll = async (req, res) => {
  try {
    const banners = await AdBanner.find().sort({ createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, linkUrl, active } = req.body;

    if (!title)
      return res.status(400).json({ success: false, message: 'Title is required' });

    if (!req.files?.mobileImage?.[0] || !req.files?.desktopImage?.[0])
      return res.status(400).json({ success: false, message: 'Both mobile and desktop images are required' });

    const mobileImage = `/uploads/mobile/${req.files.mobileImage[0].filename}`;
    const desktopImage = `/uploads/desktop/${req.files.desktopImage[0].filename}`;

    const banner = await AdBanner.create({
      title,
      mobileImage,
      desktopImage,
      linkUrl: linkUrl || '',
      active: active !== 'false',
    });

    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const banner = await AdBanner.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const banner = await AdBanner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    // Delete physical files
    [banner.mobileImage, banner.desktopImage].forEach((imgPath) => {
      if (!imgPath) return;
      const abs = path.join(__dirname, '../../', imgPath);
      fs.unlink(abs, () => {});
    });

    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleActive = async (req, res) => {
  try {
    const banner = await AdBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    banner.active = !banner.active;
    await banner.save();
    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, create, update, remove, toggleActive };
