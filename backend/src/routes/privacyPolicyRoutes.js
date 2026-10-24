const router = require('express').Router();
const { getPolicy, savePolicy } = require('../controllers/privacyPolicyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',  getPolicy);
router.post('/', protect, savePolicy);

module.exports = router;
