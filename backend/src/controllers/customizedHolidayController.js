const fs   = require('fs');
const path = require('path');
const CustomizedHoliday = require('../models/CustomizedHoliday');

const slugify = (text) => {
  const s = String(text).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'holiday';
};

const makeUniqueSlug = async (base, excludeId = null) => {
  let slug = base, i = 1;
  while (i <= 999) {
    const q = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
    if (!await CustomizedHoliday.findOne(q)) return slug;
    slug = `${base}-${++i}`;
  }
  return `${base}-${Date.now()}`;
};

const parseJSON = (v, fallback = []) => {
  if (!v) return fallback;
  try { return JSON.parse(v); } catch { return fallback; }
};

const getAll = async (req, res) => {
  try {
    const filter = req.query.all === '1' ? {} : { published: true };
    if (req.query.type) filter.packageType = req.query.type;
    const data = await CustomizedHoliday.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getOne = async (req, res) => {
  try {
    const doc = await CustomizedHoliday.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getBySlug = async (req, res) => {
  try {
    const doc = await CustomizedHoliday.findOne({ slug: req.params.slug, published: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const create = async (req, res) => {
  try {
    const b = req.body;
    const heroImage = req.file ? `/uploads/custom-holidays/${req.file.filename}` : (b.heroImageUrl || '');
    const slug = await makeUniqueSlug(slugify(b.title || 'holiday'));

    const doc = await CustomizedHoliday.create({
      title:       b.title,
      slug,
      tourCode:    b.tourCode    || '',
      days:        Number(b.days)    || 4,
      nights:      Number(b.nights)  || 3,
      states:      Number(b.states)  || 1,
      cities:      Number(b.cities)  || 1,
      tags:        parseJSON(b.tags,       []),
      interests:   parseJSON(b.interests,  []),
      destination: b.destination || '',
      destRow:     parseJSON(b.destRow,    []),
      heroImage,
      price:       Number(b.price) || 0,
      highlights:  parseJSON(b.highlights, []),
      itinerary:   parseJSON(b.itinerary,  []),
      includes:    parseJSON(b.includes,   []),
      inclusions:  parseJSON(b.inclusions, []),
      exclusions:  parseJSON(b.exclusions, []),
      tourInfo:    b.tourInfo    || '',
      needToKnow:  b.needToKnow  || '',
      packageType: b.packageType || 'customized',
      published:   b.published === 'true' || b.published === true,
    });
    res.status(201).json({ success: true, data: doc });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const update = async (req, res) => {
  try {
    const b = req.body;
    const updates = {};
    const fields = ['title','tourCode','destination','tourInfo','needToKnow','packageType'];
    fields.forEach(f => { if (f in b) updates[f] = b[f]; });
    ['days','nights','states','cities','price'].forEach(f => { if (f in b) updates[f] = Number(b[f]); });
    ['tags','interests','destRow','highlights','itinerary','includes','inclusions','exclusions']
      .forEach(f => { if (f in b) updates[f] = parseJSON(b[f], []); });
    if ('published' in b) updates.published = b.published === 'true' || b.published === true;
    if (req.file) updates.heroImage = `/uploads/custom-holidays/${req.file.filename}`;
    if (b.heroImageUrl) updates.heroImage = b.heroImageUrl;
    if (b.title && !b.slug) updates.slug = await makeUniqueSlug(slugify(b.title), req.params.id);

    const doc = await CustomizedHoliday.findByIdAndUpdate(req.params.id, updates, { returnDocument: 'after', runValidators: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const remove = async (req, res) => {
  try {
    const doc = await CustomizedHoliday.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    if (doc.heroImage?.startsWith('/uploads/'))
      fs.unlink(path.join(__dirname, '../../', doc.heroImage), () => {});
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const togglePublish = async (req, res) => {
  try {
    const doc = await CustomizedHoliday.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    doc.published = !doc.published;
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getAll, getOne, getBySlug, create, update, remove, togglePublish };
