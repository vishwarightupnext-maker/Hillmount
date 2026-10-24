const router = require('express').Router();
const path   = require('path');
const multer = require('multer');
const { getAll, create, update, remove, toggleActive } = require('../controllers/miceGalleryController');
const { protect } = require('../middleware/authMiddleware');
const { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } = require('../Constant');
const { compressSingle } = require('../middleware/compressImage');

const DEST = path.join(__dirname, '../../uploads/mice');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ok = ALLOWED_IMAGE_TYPES.test(path.extname(file.originalname).toLowerCase())
            && ALLOWED_IMAGE_TYPES.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only jpeg/jpg/png/webp allowed'), false);
  },
});

router.get('/',                  getAll);
router.post('/',   protect, upload.single('image'), compressSingle(DEST), create);
router.put('/:id', protect, update);
router.delete('/:id',            protect, remove);
router.patch('/:id/toggle',      protect, toggleActive);

module.exports = router;
