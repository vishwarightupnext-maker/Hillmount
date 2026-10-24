const Faq = require('../models/Faq');

const getAll = async (req, res) => {
  try {
    const query =
      req.query.home === '1' ? { showOnHome: true } :
      req.query.mice === '1' ? { showOnMice: true } :
      {};
    const faqs = await Faq.find(query).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { question, answer, category, order, showOnHome, showOnMice } = req.body;
    if (!question || !answer)
      return res.status(400).json({ success: false, message: 'Question and answer are required' });

    const faq = await Faq.create({
      question,
      answer,
      category: category || 'General Enquiries',
      order: order ?? 0,
      showOnHome: !!showOnHome,
      showOnMice: !!showOnMice,
    });
    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, create, update, remove };
