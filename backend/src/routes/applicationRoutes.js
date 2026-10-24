const router = require('express').Router();
const path   = require('path');
const multer = require('multer');
const { getAll, create, updateStatus, remove } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads/resumes'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Only PDF files are allowed'), false),
});

router.get('/',           protect, getAll);
router.post('/',          upload.single('resume'), create);  // public – user submits
router.patch('/:id',      protect, updateStatus);
router.delete('/:id',     protect, remove);

module.exports = router;
