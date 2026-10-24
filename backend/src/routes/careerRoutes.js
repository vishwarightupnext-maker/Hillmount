const router = require('express').Router();
const { getAll, getOne, create, update, remove, toggleActive } = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',       getAll);             // public – active only; ?all=1 for admin
router.get('/:id',    getOne);             // public
router.post('/',      protect, create);
router.put('/:id',    protect, update);
router.delete('/:id', protect, remove);
router.patch('/:id/toggle', protect, toggleActive);

module.exports = router;
