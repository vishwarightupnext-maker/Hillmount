const router = require('express').Router();
const { sendEnquiry, verifySmtp } = require('../controllers/enquiryController');

router.get('/verify', verifySmtp);   // GET  /api/enquiry/verify — debug SMTP
router.post('/',      sendEnquiry);  // POST /api/enquiry

module.exports = router;
