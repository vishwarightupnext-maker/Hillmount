const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema(
  {
    label:       { type: String, required: true, trim: true },
    period:      { type: String, default: '' },
    subtitle:    { type: String, default: '' },
    description: { type: String, default: '' },
    image:       { type: String, required: true },
    active:      { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Season', seasonSchema);
