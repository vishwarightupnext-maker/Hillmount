const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|webp|avif|svg/;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

module.exports = {
  get ADMIN_EMAIL() {
    return (process.env.ADMIN_EMAIL || 'admin@hillmount.com').trim();
  },
  get ADMIN_PASSWORD() {
    return (process.env.ADMIN_PASSWORD || 'Admin@123').trim();
  },
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
};

