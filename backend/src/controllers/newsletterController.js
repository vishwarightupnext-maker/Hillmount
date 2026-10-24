const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({
    host:   process.env.ZOHO_HOST || 'smtp.zoho.com',
    port:   465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

const subscribe = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:30px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);">
    <div style="background:#1E88E5;padding:20px 28px;">
      <h1 style="margin:0;font-size:18px;color:#000;">New Newsletter Subscriber</h1>
      <p style="margin:4px 0 0;font-size:11px;color:#333;">HillMount Holidays — hillmountholidays.com</p>
    </div>
    <div style="padding:20px 28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;width:100px;">Name</td>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#111;font-size:13px;font-weight:600;">${name}</td>
        </tr>
        <tr>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;">Email</td>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#111;font-size:13px;font-weight:600;">${email}</td>
        </tr>
        ${phone ? `<tr>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;">Phone</td>
          <td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#111;font-size:13px;font-weight:600;">${phone}</td>
        </tr>` : ''}
      </table>
    </div>
    <div style="background:#f9f9f9;padding:12px 28px;border-top:1px solid #eee;">
      <p style="margin:0;font-size:11px;color:#999;">Submitted via newsletter form on hillmountholidays.com</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from:    `"HillMount Holidays" <${process.env.ZOHO_EMAIL}>`,
      to:      'info@hillmountholidays.com',
      replyTo: email,
      subject: `New Newsletter Subscriber — ${name}`,
      html,
    });
    res.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    console.error('[Newsletter] code:', err.code, '| message:', err.message);
    res.status(500).json({ success: false, message: 'Failed to subscribe. Please try again.' });
  }
};

module.exports = { subscribe };
