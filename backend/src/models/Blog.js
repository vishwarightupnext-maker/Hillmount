const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, trim: true, index: true, sparse: true }, // URL-friendly identifier
    tag:         { type: String, required: true, trim: true },      // e.g. "Bali Travel Plan"
    destination: { type: String, required: true, trim: true },      // e.g. "Bali" — used for filter
    interest:    { type: String, default: '', trim: true },         // legacy single-value (kept for backward compat)
    interests:   { type: [String], default: [] },                  // multi-select flags, e.g. ["Adventure","MICE"]
    city:        { type: String, default: '', trim: true },        // comma-separated city tags, e.g. "Brisbane, Gold Coast"
    excerpt:     { type: String, required: true, trim: true },
    content:     { type: String, default: '' },                     // full article body
    author:      { type: String, required: true, trim: true },
    coverImage:  { type: String, default: '' },                     // /uploads/blogs/filename or external URL
    published:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
