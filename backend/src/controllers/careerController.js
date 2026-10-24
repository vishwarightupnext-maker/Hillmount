const Career = require('../models/Career');

const getAll = async (req, res) => {
  try {
    // public: only active; admin (query ?all=1): all
    const filter = req.query.all === '1' ? {} : { active: true };
    const careers = await Career.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: careers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: career });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { category, title, type, location, department, employmentType, eligibility, workWillInclude, active } = req.body;
    if (!category || !title || !location || !department)
      return res.status(400).json({ success: false, message: 'category, title, location and department are required' });

    const career = await Career.create({
      category, title, type, location, department, employmentType,
      eligibility:     Array.isArray(eligibility)     ? eligibility     : [],
      workWillInclude: Array.isArray(workWillInclude) ? workWillInclude : [],
      active: active !== false && active !== 'false',
    });
    res.status(201).json({ success: true, data: career });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
    if (!career) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: career });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleActive = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: 'Job not found' });
    career.active = !career.active;
    await career.save();
    res.json({ success: true, data: career });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove, toggleActive };
