const nodemailer = require('nodemailer');
const MiceEnquiry = require('../models/MiceEnquiry');

const createTransporter = () =>
  nodemailer.createTransport({
    host:   process.env.ZOHO_HOST || 'smtp.zoho.in',
    port:   Number(process.env.ZOHO_PORT) || 465,
    secure: process.env.ZOHO_PORT === '587' ? false : true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

const sendMiceEnquiry = async (req, res) => {
  const {
    companyName, contactPerson, phone,
    travellers, destination, travelMonth, budget, requirement,
  } = req.body;

  if (!companyName || !contactPerson || !phone) {
    return res.status(400).json({ success: false, message: 'Company name, contact person and phone are required.' });
  }

  const row = (label, value) =>
    value
      ? `<tr>
           <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;width:160px;white-space:nowrap;">${label}</td>
           <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#111;font-size:13px;font-weight:600;">${value}</td>
         </tr>`
      : '';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:580px;margin:30px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);">
    <div style="background:#1E88E5;padding:22px 30px;">
      <h1 style="margin:0;font-size:20px;color:#000;letter-spacing:.5px;">New MICE Proposal Request</h1>
      <p style="margin:4px 0 0;font-size:12px;color:#333;">HillMount Holidays — hillmountholidays.com</p>
    </div>
    <div style="padding:20px 30px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row('Company Name',      companyName)}
        ${row('Contact Person',    contactPerson)}
        ${row('Phone',             phone)}
        ${row('No. of Travellers', travellers)}
        ${row('Preferred Destination', destination)}
        ${row('Travel Month',      travelMonth)}
        ${row('Approximate Budget', budget)}
        ${row('Requirement',       requirement)}
      </table>
    </div>
    <div style="background:#f9f9f9;padding:14px 30px;border-top:1px solid #eee;">
      <p style="margin:0;font-size:11px;color:#999;">Submitted via MICE Corporate Enquiry form on hillmountholidays.com</p>
    </div>
  </div>
</body>
</html>`;

  try {
    await MiceEnquiry.create({
      companyName, contactPerson, phone,
      travellers, destination, travelMonth, budget, requirement,
    });

    const transporter = createTransporter();
    await transporter.sendMail({
      from:    `"HillMount Holidays" <${process.env.ZOHO_EMAIL}>`,
      to:      process.env.MICE_TO || process.env.ENQUIRY_TO || process.env.ZOHO_EMAIL,
      subject: `MICE Proposal Request from ${companyName}`,
      html,
    });

    res.json({ success: true, message: 'Your MICE proposal request has been sent!' });
  } catch (err) {
    console.error('[MICE enquiry send] code:', err.code, '| message:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send your request. Please try again later.' });
  }
};

const listMiceEnquiries = async (_req, res) => {
  const items = await MiceEnquiry.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items });
};

module.exports = { sendMiceEnquiry, listMiceEnquiries };
