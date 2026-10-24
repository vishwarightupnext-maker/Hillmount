import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const QUALITY = 80;
let converted = 0;
let failed = 0;
let skipped = 0;

async function convertImagesToWebP(dir) {
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        await convertImagesToWebP(fullPath);
      } else if (/\.(jpg|jpeg)$/i.test(file.name)) {
        const outputPath = fullPath.replace(/\.(jpg|jpeg)$/i, '.webp');

        // Check if WebP already exists
        if (fs.existsSync(outputPath)) {
          console.log(`⏭️  SKIP: ${outputPath} (already exists)`);
          skipped++;
          continue;
        }

        try {
          await sharp(fullPath)
            .webp({ quality: QUALITY })
            .toFile(outputPath);

          const originalSize = fs.statSync(fullPath).size / 1024;
          const newSize = fs.statSync(outputPath).size / 1024;
          const saved = ((1 - newSize / originalSize) * 100).toFixed(1);

          console.log(`✅ CONVERTED: ${outputPath}`);
          console.log(`   Size: ${originalSize.toFixed(1)}KB → ${newSize.toFixed(1)}KB (${saved}% smaller)`);

          // Delete original JPG/JPEG file
          fs.unlinkSync(fullPath);
          console.log(`   🗑️  DELETED: ${fullPath}\n`);
          converted++;
        } catch (err) {
          console.error(`❌ FAILED: ${fullPath}`);
          console.error(`   Error: ${err.message}\n`);
          failed++;
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
}

async function main() {
  console.log('🔄 Starting WebP conversion...\n');
  console.log(`📁 Scanning: ${ASSETS_DIR}\n`);

  await convertImagesToWebP(ASSETS_DIR);

  console.log('\n📊 Conversion Summary:');
  console.log(`   ✅ Converted: ${converted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log('\n✨ Done! WebP files created successfully.\n');

  if (converted > 0) {
    console.log('💡 Tip: You can now delete .jpg/.jpeg files and use .webp in your code');
    console.log('   Update your imports: "image.jpg" → "image.webp"\n');
  }
}

main().catch(console.error);
