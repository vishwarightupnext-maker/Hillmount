const router = require('express').Router();
const { sendMiceEnquiry, listMiceEnquiries } = require('../controllers/miceEnquiryController');

router.get('/',  listMiceEnquiries); // GET  /api/mice-enquiry — admin list
router.post('/', sendMiceEnquiry);   // POST /api/mice-enquiry

module.exports = router;
