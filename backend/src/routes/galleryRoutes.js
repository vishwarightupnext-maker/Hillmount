const router  = require('express').Router();
const path    = require('path');
const multer  = require('multer');
const { getAll, create, update, remove, toggleActive } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } = require('../Constant');
const { compressSingle } = require('../middleware/compressImage');

const DEST = path.join(__dirname, '../../uploads/gallery');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const extOk  = ALLOWED_IMAGE_TYPES.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = ALLOWED_IMAGE_TYPES.test(file.mimetype);
    extOk && mimeOk ? cb(null, true) : cb(new Error('Only jpeg/jpg/png/webp allowed'), false);
  },
});

router.get('/',                  getAll);
router.post('/',   protect, upload.single('image'), compressSingle(DEST), create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);
router.patch('/:id/toggle', protect, toggleActive);

module.exports = router;
