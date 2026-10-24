const mongoose = require('mongoose');

const miceEnquirySchema = new mongoose.Schema(
  {
    companyName:   { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    phone:         { type: String, required: true, trim: true },
    travellers:    { type: String, trim: true },
    destination:   { type: String, trim: true },
    travelMonth:   { type: String, trim: true },
    budget:        { type: String, trim: true },
    requirement:   { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MiceEnquiry', miceEnquirySchema);
