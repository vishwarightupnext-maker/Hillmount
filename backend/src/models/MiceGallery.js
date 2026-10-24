const mongoose = require('mongoose');

const miceGallerySchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    alt:      { type: String, default: '' },
    // 6 fixed slots matching the collage layout
    slot: {
      type: String,
      enum: ['left', 'center-tl', 'center-tr', 'center-bl', 'center-br', 'right'],
      required: true,
    },
    label:    { type: String, default: '' },
    sublabel: { type: String, default: '' },
    destination:  { type: String, default: '' },
    nights:       { type: Number, default: null },
    startingFrom: { type: Number, default: null },
    active:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MiceGallery', miceGallerySchema);
