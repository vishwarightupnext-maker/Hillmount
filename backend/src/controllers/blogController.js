const fs   = require('fs');
const path = require('path');
const Blog = require('../models/Blog');

const slugify = (text) => {
  const s = String(text).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');           // strip leading/trailing dashes
  return s || 'blog';                   // fallback so we never store an empty slug
};

const makeUniqueSlug = async (base, excludeId = null) => {
  let slug = base;
  let i = 1;
  while (i <= 999) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Blog.findOne(query);
    if (!existing) return slug;
    slug = `${base}-${++i}`;
  }
  // absolute fallback — timestamp suffix
  return `${base}-${Date.now()}`;
};

const getAll = async (req, res) => {
  try {
    const filter = req.query.all === '1' ? {} : { published: true };
    const blogs  = await Blog.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const parseInterests = (raw) => {
  if (!raw) return [];
  try { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) return parsed; } catch {}
  return [];
};

const create = async (req, res) => {
  try {
    const { title, tag, destination, city, interest, interests, excerpt, content, author, published, coverImageUrl } = req.body;
    if (!title || !tag || !destination || !excerpt || !author)
      return res.status(400).json({ success: false, message: 'title, tag, destination, excerpt and author are required' });

    const coverImage = req.file
      ? `/uploads/blogs/${req.file.filename}`
      : (coverImageUrl || '');

    const baseSlug = slugify(title);
    const slug     = await makeUniqueSlug(baseSlug);

    const blog = await Blog.create({
      title, slug, tag, destination,
      city: city || '',
      interest: interest || '',
      interests: parseInterests(interests),
      excerpt,
      content: content || '',
      author, coverImage,
      published: published === 'true' || published === true,
    });
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.coverImage = `/uploads/blogs/${req.file.filename}`;
    } else if (updates.coverImageUrl !== undefined) {
      updates.coverImage = updates.coverImageUrl;
      delete updates.coverImageUrl;
    }
    if ('published' in updates) updates.published = updates.published === 'true' || updates.published === true;
    if ('interests' in updates) updates.interests = parseInterests(updates.interests);

    // Re-slug if title changed and no explicit slug provided
    if (updates.title && !updates.slug) {
      updates.slug = await makeUniqueSlug(slugify(updates.title), req.params.id);
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { returnDocument: 'after', runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.coverImage?.startsWith('/uploads/')) {
      fs.unlink(path.join(__dirname, '../../', blog.coverImage), () => {});
    }
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const togglePublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.published = !blog.published;
    await blog.save();
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getOne, getBySlug, create, update, remove, togglePublish };
