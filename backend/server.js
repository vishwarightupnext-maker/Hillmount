const { webcrypto } = require('crypto');
if (!globalThis.crypto) globalThis.crypto = webcrypto;

process.on('warning', (w) => {
  if (w.message?.includes('returnDocument')) return;
  console.warn(w.stack);
});

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const connectDB = require('./src/config/db');

// Ensure upload directories exist on startup
['uploads/mobile', 'uploads/desktop', 'uploads/resumes', 'uploads/gallery', 'uploads/blogs', 'uploads/seasons', 'uploads/reviews', 'uploads/mice', 'uploads/reels', 'uploads/reel-thumbnails', 'uploads/custom-holidays', 'uploads/home-banner', 'uploads/team', 'uploads/about-journey'].forEach((dir) =>
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true })
);

const adminRoutes              = require('./src/routes/adminRoutes');
const adBannerRoutes           = require('./src/routes/adBannerRoutes');
const faqRoutes                = require('./src/routes/faqRoutes');
const careerRoutes             = require('./src/routes/careerRoutes');
const applicationRoutes        = require('./src/routes/applicationRoutes');
const galleryRoutes            = require('./src/routes/galleryRoutes');
const blogRoutes               = require('./src/routes/blogRoutes');
const reviewRoutes             = require('./src/routes/reviewRoutes');
const seasonRoutes             = require('./src/routes/seasonRoutes');
const marqueeRoutes            = require('./src/routes/marqueeRoutes');
const miceGalleryRoutes        = require('./src/routes/miceGalleryRoutes');
const reelRoutes               = require('./src/routes/reelRoutes');
const customizedHolidayRoutes  = require('./src/routes/customizedHolidayRoutes');
const enquiryRoutes            = require('./src/routes/enquiryRoutes');
const newsletterRoutes         = require('./src/routes/newsletterRoutes');
const contactRoutes            = require('./src/routes/contactRoutes');
const homeBannerRoutes         = require('./src/routes/homeBannerRoutes');
const miceEnquiryRoutes        = require('./src/routes/miceEnquiryRoutes');
const teamRoutes               = require('./src/routes/teamRoutes');
const aboutJourneyRoutes       = require('./src/routes/aboutJourneyRoutes');
const privacyPolicyRoutes      = require('./src/routes/privacyPolicyRoutes');

const { seedSuperAdmin } = require('./src/controllers/adminController');

const app = express();

connectDB().then(() => seedSuperAdmin());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://www.hillmountholidays.com',
  'https://hillmountholidays.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, origin);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Veena World External API Proxy Handler
const veenaProxyHandler = async (req, res) => {
  try {
    const targetUrl = `https://extapi.veenaworld.com/partner/staging/v1${req.url}`;
    const options = {
      method: req.method,
      headers: {
        'x-api-key': 'l3h1EvJdjEatKTDxBBDjq99jhTat6edl731UlTia',
        'X-Partner-Id': 'mpfWKNkb4grRBbc5w53K',
        'x-user-currency': 'INR',
        'Accept': 'application/json, text/plain, */*',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(req.body);
    }

    const apiRes = await fetch(targetUrl, options);
    const contentType = apiRes.headers.get('content-type');

    res.status(apiRes.status);
    if (contentType && contentType.includes('application/json')) {
      const data = await apiRes.json();
      return res.json(data);
    }
    const text = await apiRes.text();
    return res.send(text);
  } catch (err) {
    console.error('[VeenaAPI Proxy Error]:', err.message);
    return res.status(500).json({ success: false, message: 'External API proxy failed', error: err.message });
  }
};

app.use('/veena-api', veenaProxyHandler);
app.use('/api/veena-api', veenaProxyHandler);

// Serve static files from the React frontend build if present
const frontendDistPath = fs.existsSync(path.join(__dirname, '../HillMountHollidays-frontend/dist'))
  ? path.join(__dirname, '../HillMountHollidays-frontend/dist')
  : path.join(__dirname, '../frontend');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

// API Routes
app.use('/api/admin',        adminRoutes);
app.use('/api/ad-banners',   adBannerRoutes);
app.use('/api/faqs',         faqRoutes);
app.use('/api/careers',      careerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/gallery',      galleryRoutes);
app.use('/api/blogs',        blogRoutes);
app.use('/api/reviews',      reviewRoutes);
app.use('/api/seasons',      seasonRoutes);
app.use('/api/marquee',      marqueeRoutes);
app.use('/api/mice-gallery',        miceGalleryRoutes);
app.use('/api/reels',              reelRoutes);
app.use('/api/customized-holidays', customizedHolidayRoutes);
app.use('/api/enquiry',            enquiryRoutes);
app.use('/api/newsletter',        newsletterRoutes);
app.use('/api/contact',           contactRoutes);
app.use('/api/home-banner',       homeBannerRoutes);
app.use('/api/mice-enquiry',      miceEnquiryRoutes);
app.use('/api/team',              teamRoutes);
app.use('/api/about-journey',     aboutJourneyRoutes);
app.use('/api/privacy-policy',    privacyPolicyRoutes);

// Catch-all route to serve index.html for client-side routing
app.get('/*splat', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/veena-api')) {
    return next();
  }
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).send('API endpoint not found or frontend build not available on backend port');
});

app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`HillMount Server → http://localhost:${PORT}`));
