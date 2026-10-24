const mongoose = require('mongoose');

/* Singleton-style: the Privacy Policy page always shows the single
   most-recently-saved document. Admin edits update it in place. */
const privacyPolicySchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PrivacyPolicy', privacyPolicySchema);
