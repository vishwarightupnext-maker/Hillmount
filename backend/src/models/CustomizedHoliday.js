const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  type:  { type: String, enum: ['heading', 'text', 'list'], default: 'text' },
  text:  { type: String, default: '' },
  items: [{ type: String }],
}, { _id: false });

const amenitySchema = new mongoose.Schema({
  label: { type: String, default: '' },
  icon:  { type: String, default: '' },
}, { _id: false });

const itineraryDaySchema = new mongoose.Schema({
  dayLabel: { type: String, default: '' },
  date:     { type: String, default: '' },
  title:    { type: String, default: '' },
  nights:   { type: Number, default: 0 },
  sections: [sectionSchema],
  amenities:[amenitySchema],
}, { _id: false });

const includeItemSchema = new mongoose.Schema({
  icon:  { type: String, default: 'Hotel' },
  label: { type: String, default: '' },
}, { _id: false });

const customizedHolidaySchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, trim: true, index: true, sparse: true },
  tourCode:    { type: String, default: '', trim: true },
  days:        { type: Number, default: 4 },
  nights:      { type: Number, default: 3 },
  states:      { type: Number, default: 1 },
  cities:      { type: Number, default: 1 },
  tags:        { type: [String], default: [] },
  interests:   { type: [String], default: [] },
  destination: { type: String, default: '', trim: true },
  destRow:     { type: [String], default: [] },
  heroImage:   { type: String, default: '' },
  price:       { type: Number, default: 0 },
  highlights:  { type: [String], default: [] },
  itinerary:   [itineraryDaySchema],
  includes:    [includeItemSchema],
  inclusions:  { type: [String], default: [] },
  exclusions:  { type: [String], default: [] },
  tourInfo:    { type: String, default: '' },
  needToKnow:  { type: String, default: '' },
  packageType: { type: String, enum: ['customized', 'speciality', 'tailor-made', 'short-stay', 'mice', 'cruise'], default: 'customized' },
  published:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('CustomizedHoliday', customizedHolidaySchema);
