const router = require('express').Router();
const path   = require('path');
const multer = require('multer');
const { getAll, create, update, remove, toggleActive } = require('../controllers/reelController');
const { protect } = require('../middleware/authMiddleware');
const { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } = require('../Constant');

const ALLOWED_VIDEO_TYPES = /mp4|webm|mov|avi/;
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_VIDEO_SIZE },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      const ok = ALLOWED_IMAGE_TYPES.test(path.extname(file.originalname).toLowerCase());
      ok ? cb(null, true) : cb(new Error('Only image files allowed for thumbnail'), false);
    } else if (file.fieldname === 'video') {
      const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
      ALLOWED_VIDEO_TYPES.test(ext) ? cb(null, true) : cb(new Error('Only mp4/webm/mov allowed'), false);
    } else {
      cb(null, false);
    }
  },
});

router.get('/',                  getAll);
router.post('/',   protect, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), create);
router.put('/:id', protect, update);
router.delete('/:id',            protect, remove);
router.patch('/:id/toggle',      protect, toggleActive);

module.exports = router;
