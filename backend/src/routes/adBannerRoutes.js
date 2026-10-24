const router = require('express').Router();
const path = require('path');
const multer = require('multer');
const { getAll, create, update, remove, toggleActive } = require('../controllers/adBannerController');
const { protect } = require('../middleware/authMiddleware');
const { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } = require('../Constant');
const { compressFields } = require('../middleware/compressImage');

const MOBILE_DEST  = path.join(__dirname, '../../uploads/mobile');
const DESKTOP_DEST = path.join(__dirname, '../../uploads/desktop');

const fileFilter = (_req, file, cb) => {
  const extOk  = ALLOWED_IMAGE_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = ALLOWED_IMAGE_TYPES.test(file.mimetype);
  extOk && mimeOk
    ? cb(null, true)
    : cb(new Error('Only jpeg/jpg/png/webp images are allowed'), false);
};

const upload = multer({ storage: multer.memoryStorage(), fileFilter, limits: { fileSize: MAX_FILE_SIZE } });

const uploadFields = upload.fields([
  { name: 'mobileImage', maxCount: 1 },
  { name: 'desktopImage', maxCount: 1 },
]);

const compressBanners = compressFields({
  mobileImage:  MOBILE_DEST,
  desktopImage: DESKTOP_DEST,
});

router.get('/', getAll);
router.post('/', protect, uploadFields, compressBanners, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);
router.patch('/:id/toggle', protect, toggleActive);

module.exports = router;
