const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
  {
    category:       { type: String, required: true, trim: true },
    title:          { type: String, required: true, trim: true },
    type:           { type: String, default: 'Full Time' },
    location:       { type: String, required: true, trim: true },
    department:     { type: String, required: true, trim: true },
    employmentType: { type: String, default: 'Full Time Employee' },
    eligibility:    [{ type: String }],
    workWillInclude:[{ type: String }],
    active:         { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Career', careerSchema);
