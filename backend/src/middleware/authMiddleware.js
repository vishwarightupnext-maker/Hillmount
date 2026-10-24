const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error('[Auth] Token error:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token — please log in again' });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.admin?.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Super admin access required' });
  next();
};

module.exports = { protect, superAdminOnly };
