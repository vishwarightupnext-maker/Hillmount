const router = require('express').Router();
const { getAll, create, update, remove } = require('../controllers/faqController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAll);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

module.exports = router;
