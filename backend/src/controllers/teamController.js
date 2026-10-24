const fs   = require('fs');
const path = require('path');
const TeamMember = require('../models/TeamMember');

const getAll = async (req, res) => {
  try {
    const filter = req.query.all === '1' ? {} : { active: true };
    const members = await TeamMember.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, role, linkedin, order, active } = req.body;
    if (!name || !role) return res.status(400).json({ success: false, message: 'name and role are required' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Image file is required' });

    const member = await TeamMember.create({
      name, role,
      linkedin: linkedin || '',
      image: `/uploads/team/${req.file.filename}`,
      order: order ? Number(order) : 0,
      active: active === 'false' || active === false ? false : true,
    });
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const updates = { ...req.body };
    if ('order' in updates) updates.order = Number(updates.order);
    if ('active' in updates) updates.active = updates.active === 'true' || updates.active === true;

    const prev = await TeamMember.findById(req.params.id);
    if (!prev) return res.status(404).json({ success: false, message: 'Team member not found' });

    if (req.file) {
      updates.image = `/uploads/team/${req.file.filename}`;
      const abs = path.join(__dirname, '../../', prev.image);
      fs.unlink(abs, () => {});
    }

    const member = await TeamMember.findByIdAndUpdate(req.params.id, updates, { returnDocument: 'after', runValidators: true });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Team member not found' });
    if (member.image) {
      const abs = path.join(__dirname, '../../', member.image);
      fs.unlink(abs, () => {});
    }
    res.json({ success: true, message: 'Team member deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleActive = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Team member not found' });
    member.active = !member.active;
    await member.save();
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, create, update, remove, toggleActive };
