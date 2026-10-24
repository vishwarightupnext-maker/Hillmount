const mongoose = require('mongoose');

/* Singleton-style: the "Our Journey" section on About Us always shows the
   single most-recently-uploaded image. Admin uploads replace it in place. */
const aboutJourneySchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    alt:   { type: String, default: 'Our Team' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutJourney', aboutJourneySchema);
