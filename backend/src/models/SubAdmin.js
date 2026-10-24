const mongoose = require('mongoose');
const crypto = require('crypto');

const subAdminSchema = new mongoose.Schema(
  {
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['admin', 'sub-admin'], default: 'sub-admin' },
    access: {
      blogs:          { type: String, enum: ['none', 'view', 'edit'], default: 'none' },
      customHolidays: { type: String, enum: ['none', 'view', 'edit'], default: 'none' },
    },
    plainPassword:  { type: String, default: '' },
    resetOtp:       { type: String, default: null },
    resetOtpExpiry: { type: Date,   default: null },
  },
  { timestamps: true }
);

subAdminSchema.pre('save', function () {
  if (!this.isModified('password')) return;
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(this.password, salt, 10000, 64, 'sha512').toString('hex');
  this.password = `${salt}:${hash}`;
});

subAdminSchema.methods.comparePassword = function (plain) {
  const [salt, storedHash] = this.password.split(':');
  const hash = crypto.pbkdf2Sync(plain, salt, 10000, 64, 'sha512').toString('hex');
  return hash === storedHash;
};

module.exports = mongoose.model('SubAdmin', subAdminSchema);
