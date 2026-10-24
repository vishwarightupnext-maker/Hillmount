const buildImageUrl = (req, relativePath) =>
  `${req.protocol}://${req.get('host')}${relativePath}`;

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { buildImageUrl, asyncHandler };
