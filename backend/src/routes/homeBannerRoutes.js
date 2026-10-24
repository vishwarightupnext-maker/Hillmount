const router = require('express').Router();
const path   = require('path');
const multer = require('multer');
const { getBanner, uploadBanner } = require('../controllers/homeBannerController');
const { protect } = require('../middleware/authMiddleware');
const { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } = require('../Constant');
const { compressSingle } = require('../middleware/compressImage');

const DEST = path.join(__dirname, '../../uploads/home-banner');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ok = ALLOWED_IMAGE_TYPES.test(path.extname(file.originalname).toLowerCase())
            && ALLOWED_IMAGE_TYPES.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only jpeg/jpg/png/webp allowed'), false);
  },
});

router.get('/',  getBanner);
router.post('/', protect, upload.single('image'), compressSingle(DEST), uploadBanner);

module.exports = router;
