const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({
    host:   process.env.ZOHO_HOST || 'smtp.zoho.in',
    port:   Number(process.env.ZOHO_PORT) || 465,
    secure: (process.env.ZOHO_PORT === '587') ? false : true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

/* ── Debug: verify SMTP connection ── GET /api/enquiry/verify ── */
const verifySmtp = async (_req, res) => {
  const t = createTransporter();
  try {
    await t.verify();
    res.json({ success: true, message: 'SMTP connection OK ✓', config: {
      host: process.env.ZOHO_HOST || 'smtp.zoho.in',
      port: Number(process.env.ZOHO_PORT) || 465,
      user: process.env.ZOHO_EMAIL,
    }});
  } catch (err) {
    console.error('[SMTP verify]', err);
    res.status(500).json({
      success: false,
      code:    err.code,
      message: err.message,
      fix:
        err.code === 'EAUTH'        ? '→ Wrong email/password. Use an App Password from Zoho Mail → Settings → Security → App Passwords' :
        err.code === 'ECONNREFUSED' ? '→ Host unreachable. Change ZOHO_HOST=smtp.zoho.com in .env and restart' :
        err.code === 'ESOCKET'      ? '→ SSL error. Add ZOHO_PORT=587 in .env and restart' :
        '→ Check backend console for full error',
    });
  }
};

const sendEnquiry = async (req, res) => {
  const {
    name, phone, countryDial, email, desc,
    destination, month, budgetMin, budgetMax, daysMin, daysMax,
  } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ success: false, message: 'Name, phone and email are required.' });
  }

  const fmtRupee = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
  const fmtDays  = (n) => `${n} day${n !== 1 ? 's' : ''}`;

  const row = (label, value) =>
    value
      ? `<tr>
           <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;width:150px;white-space:nowrap;">${label}</td>
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
      <h1 style="margin:0;font-size:20px;color:#000;letter-spacing:.5px;">New Quick Enquiry</h1>
      <p style="margin:4px 0 0;font-size:12px;color:#333;">HillMount Holidays — hillmountholidays.com</p>
    </div>
    <div style="padding:20px 30px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row('Full Name',        name)}
        ${row('Mobile',          `${countryDial || '+91'} ${phone}`)}
        ${row('Email',           email)}
        ${row('Description',     desc)}
        ${row('Destination',     destination)}
        ${row('Month of Travel', month)}
        ${budgetMin && budgetMax ? row('Budget',   `${fmtRupee(budgetMin)} – ${fmtRupee(budgetMax)}`) : ''}
        ${daysMin   && daysMax  ? row('Duration',  `${fmtDays(daysMin)} – ${fmtDays(daysMax)}`)       : ''}
      </table>
    </div>
    <div style="background:#f9f9f9;padding:14px 30px;border-top:1px solid #eee;">
      <p style="margin:0;font-size:11px;color:#999;">Submitted via Quick Enquiry form on hillmountholidays.com</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from:    `"HillMount Holidays" <${process.env.ZOHO_EMAIL}>`,
      to:      process.env.ENQUIRY_TO || process.env.ZOHO_EMAIL,
      replyTo: email,
      subject: `Quick Enquiry from ${name}`,
      html,
    });
    res.json({ success: true, message: 'Enquiry sent successfully!' });
  } catch (err) {
    console.error('[Enquiry send] code:', err.code, '| message:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send enquiry.',
      code: err.code,
      hint:
        err.code === 'EAUTH'        ? 'Wrong email/password. Use an App Password from Zoho Mail → Settings → Security → App Passwords' :
        err.code === 'ECONNREFUSED' ? 'Host unreachable. Try ZOHO_HOST=smtp.zoho.com in .env' :
        err.code === 'ESOCKET'      ? 'SSL error. Try ZOHO_PORT=587 in .env' :
        err.message,
    });
  }
};

module.exports = { sendEnquiry, verifySmtp };
