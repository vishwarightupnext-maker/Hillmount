const router = require('express').Router();
const { sendContact } = require('../controllers/contactController');

router.post('/', sendContact); // POST /api/contact

module.exports = router;
