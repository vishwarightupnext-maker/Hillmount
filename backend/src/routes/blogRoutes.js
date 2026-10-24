const router  = require('express').Router();
const path    = require('path');
const multer  = require('multer');
const { getAll, getOne, getBySlug, create, update, remove, togglePublish } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } = require('../Constant');
const { compressSingle } = require('../middleware/compressImage');

const DEST = path.join(__dirname, '../../uploads/blogs');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ok = ALLOWED_IMAGE_TYPES.test(path.extname(file.originalname).toLowerCase())
            && ALLOWED_IMAGE_TYPES.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only jpeg/jpg/png/webp/avif images allowed'), false);
  },
});

router.get('/',                  getAll);
router.get('/slug/:slug',        getBySlug);
router.get('/:id',               getOne);
router.post('/',   protect, upload.single('coverImage'), compressSingle(DEST), create);
router.put('/:id', protect, upload.single('coverImage'), compressSingle(DEST), update);
router.delete('/:id',            protect, remove);
router.patch('/:id/publish',     protect, togglePublish);

module.exports = router;
