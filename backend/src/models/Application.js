const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
    jobTitle: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    message:  { type: String, default: '' },
    resume:   { type: String, required: true }, // relative path e.g. /uploads/resumes/filename.pdf
    status:   { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
