const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating:      { type: Number, required: true, min: 1, max: 5 },
    category:    { type: String, required: true, trim: true },   // Family / Couple / Solo / Group
    destination: { type: String, required: true, trim: true },
    text:        { type: String, required: true, trim: true },
    reviewer:    { type: String, required: true, trim: true },
    date:        { type: String, required: true, trim: true },   // e.g. "May, 2026"
    image:       { type: String, default: '' },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
