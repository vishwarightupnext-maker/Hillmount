const mongoose = require('mongoose');

/* Singleton-style: the counter-banner section always shows the single
   most-recently-uploaded image. Admin uploads replace it in place. */
const homeBannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    alt:   { type: String, default: 'Cozy home' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomeBanner', homeBannerSchema);
