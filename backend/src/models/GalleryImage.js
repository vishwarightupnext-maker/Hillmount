const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    alt:      { type: String, default: 'gallery image' },
    // 'side' = the 3 expanding cards | 'row1' = marquee row 1 | 'row2' = marquee row 2
    section:  { type: String, enum: ['side', 'row1', 'row2'], required: true },
    order:    { type: Number, default: 0 },
    active:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
