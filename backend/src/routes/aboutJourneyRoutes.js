const router = require('express').Router();
const path   = require('path');
const multer = require('multer');
const { getImage, uploadImage } = require('../controllers/aboutJourneyController');
const { protect } = require('../middleware/authMiddleware');
const { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } = require('../Constant');
const { compressSingle } = require('../middleware/compressImage');

const DEST = path.join(__dirname, '../../uploads/about-journey');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ok = ALLOWED_IMAGE_TYPES.test(path.extname(file.originalname).toLowerCase())
            && ALLOWED_IMAGE_TYPES.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only jpeg/jpg/png/webp allowed'), false);
  },
});

router.get('/',  getImage);
router.post('/', protect, upload.single('image'), compressSingle(DEST), uploadImage);

module.exports = router;
