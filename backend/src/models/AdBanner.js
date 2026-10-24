const mongoose = require('mongoose');

const adBannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    mobileImage: { type: String, required: true },
    desktopImage: { type: String, required: true },
    linkUrl: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdBanner', adBannerSchema);
