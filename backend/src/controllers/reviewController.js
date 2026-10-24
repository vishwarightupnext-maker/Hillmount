const fs   = require('fs');
const path = require('path');
const Review = require('../models/Review');

const getAll = async (req, res) => {
  try {
    const filter = req.query.all === '1' ? {} : { active: true };
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { rating, category, destination, text, reviewer, date, active } = req.body;
    if (!rating || !category || !destination || !text || !reviewer || !date)
      return res.status(400).json({ success: false, message: 'rating, category, destination, text, reviewer and date are required' });

    const image = req.file ? `/uploads/reviews/${req.file.filename}` : '';

    const review = await Review.create({
      rating: Number(rating),
      category, destination, text, reviewer, date,
      image,
      active: active === 'false' || active === false ? false : true,
    });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const updates = { ...req.body };
    if ('rating' in updates) updates.rating = Number(updates.rating);
    if ('active' in updates) updates.active = updates.active === 'true' || updates.active === true;

    const review = await Review.findByIdAndUpdate(req.params.id, updates, { returnDocument: 'after', runValidators: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.image) {
      const abs = path.join(__dirname, '../../', review.image);
      fs.unlink(abs, () => {});
    }
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleActive = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    review.active = !review.active;
    await review.save();
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove, toggleActive };
