const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, required: true, default: 'General Enquiries', trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    showOnHome: { type: Boolean, default: false },
    showOnMice: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faq', faqSchema);
