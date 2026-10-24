const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema(
  {
    videoUrl:     { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    title:        { type: String, default: '' },
    order:        { type: Number, default: 0 },
    active:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reel', reelSchema);
