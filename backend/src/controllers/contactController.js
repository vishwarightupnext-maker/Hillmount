const nodemailer = require('nodemailer');

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

const sendContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:580px;margin:30px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);">
    <div style="background:#1E88E5;padding:22px 30px;">
      <h1 style="margin:0;font-size:20px;color:#000;letter-spacing:.5px;">New Contact Message</h1>
      <p style="margin:4px 0 0;font-size:12px;color:#333;">HillMount Holidays — hillmountholidays.com</p>
    </div>
    <div style="padding:20px 30px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;width:130px;white-space:nowrap;">Name</td>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#111;font-size:13px;font-weight:600;">${name}</td>
        </tr>
        <tr>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;white-space:nowrap;">Email</td>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#111;font-size:13px;font-weight:600;">${email}</td>
        </tr>
        <tr>
          <td style="padding:9px 12px;color:#666;font-size:13px;white-space:nowrap;vertical-align:top;">Message</td>
          <td style="padding:9px 12px;color:#111;font-size:13px;white-space:pre-wrap;">${message}</td>
        </tr>
      </table>
    </div>
    <div style="background:#f9f9f9;padding:14px 30px;border-top:1px solid #eee;">
      <p style="margin:0;font-size:11px;color:#999;">Submitted via Contact Us form on hillmountholidays.com</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from:    `"HillMount Holidays" <${process.env.ZOHO_EMAIL}>`,
      to:      process.env.CONTACT_TO || process.env.ENQUIRY_TO || process.env.ZOHO_EMAIL,
      replyTo: email,
      subject: `Contact Message from ${name}`,
      html,
    });
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('[Contact send] code:', err.code, '| message:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
};

module.exports = { sendContact };
