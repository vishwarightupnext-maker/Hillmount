const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    role:     { type: String, required: true, trim: true },
    linkedin: { type: String, default: '', trim: true },
    image:    { type: String, required: true },
    order:    { type: Number, default: 0 },
    active:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);
