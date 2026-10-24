const router = require('express').Router();
const { getAll, create, update, remove, toggleActive } = require('../controllers/marqueeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',                    getAll);
router.post('/',    protect,       create);
router.put('/:id',  protect,       update);
router.delete('/:id', protect,     remove);
router.patch('/:id/toggle', protect, toggleActive);

module.exports = router;
