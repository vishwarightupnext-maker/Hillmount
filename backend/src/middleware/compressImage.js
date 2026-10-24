const path  = require('path');
const sharp = require('sharp');

const QUALITY = 80;

const makeName = () => `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

// Middleware for single-file uploads (req.file)
const compressSingle = (destDir) => async (req, res, next) => {
  if (!req.file) return next();
  try {
    const filename   = makeName();
    const outputPath = path.join(destDir, filename);
    await sharp(req.file.buffer).webp({ quality: QUALITY }).toFile(outputPath);
    req.file.filename = filename;
    req.file.path     = outputPath;
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware for multi-field uploads (req.files)
// fieldDirMap: { fieldname: absoluteDestDir, ... }
const compressFields = (fieldDirMap) => async (req, res, next) => {
  if (!req.files) return next();
  try {
    for (const [field, destDir] of Object.entries(fieldDirMap)) {
      const files = req.files[field];
      if (!files?.length) continue;
      for (const file of files) {
        const filename   = makeName();
        const outputPath = path.join(destDir, filename);
        await sharp(file.buffer).webp({ quality: QUALITY }).toFile(outputPath);
        file.filename = filename;
        file.path     = outputPath;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { compressSingle, compressFields };
