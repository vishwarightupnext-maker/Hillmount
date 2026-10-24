const Application = require('../models/Application');

const getAll = async (req, res) => {
  try {
    const filter = req.query.jobId ? { jobId: req.query.jobId } : {};
    const applications = await Application.find(filter)
      .populate('jobId', 'title category')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { jobId, jobTitle, fullName, email, message } = req.body;

    if (!jobId || !fullName || !email)
      return res.status(400).json({ success: false, message: 'jobId, fullName and email are required' });

    if (!req.file)
      return res.status(400).json({ success: false, message: 'Resume PDF is required' });

    const resume = `/uploads/resumes/${req.file.filename}`;
    const application = await Application.create({ jobId, jobTitle, fullName, email, message, resume });
    res.status(201).json({ success: true, data: application, message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'reviewed', 'shortlisted', 'rejected'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status value' });

    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, create, updateStatus, remove };
