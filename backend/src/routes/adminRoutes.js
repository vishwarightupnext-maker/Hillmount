const router = require('express').Router();
const {
  login, registerAdmin, verifyToken,
  getSubAdmins, createSubAdmin, updateSubAdmin, deleteSubAdmin,
  forgotPassword, resetPassword,
} = require('../controllers/adminController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', registerAdmin);
router.post('/register-admin', registerAdmin);
router.get('/verify', protect, verifyToken);

// Password reset — no auth required
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Sub-admin management — super admin only
router.get('/sub-users', protect, superAdminOnly, getSubAdmins);
router.post('/sub-users', protect, superAdminOnly, createSubAdmin);
router.put('/sub-users/:id', protect, superAdminOnly, updateSubAdmin);
router.delete('/sub-users/:id', protect, superAdminOnly, deleteSubAdmin);

module.exports = router;
