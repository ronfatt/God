const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcBase = '/Users/rms/Desktop/52张扑克牌设计';
const dstDir = path.join(__dirname, '../public/cards');

// Target uniform dimensions: 1024 x 1536 (2:3 aspect ratio, 4K crisp master quality)
const TARGET_WIDTH = 1024;
const TARGET_HEIGHT = 1536;

const SUIT_MAP = [
  { folder: '红心', prefix: 'H' },
  { folder: '红砖', prefix: 'D' },
  { folder: '葵花', prefix: 'C' },
  { folder: '黑桃', prefix: 'S' },
];

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

async function processCards() {
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }

  let count = 0;

  for (const suit of SUIT_MAP) {
    const folderPath = path.join(srcBase, suit.folder);
    console.log(`\nProcessing realm folder: ${suit.folder} (Prefix: ${suit.prefix})...`);

    for (const rank of RANKS) {
      const srcFileName = `${rank}${suit.folder}.png`;
      const srcPath = path.join(folderPath, srcFileName);
      const outFileName = `${suit.prefix}-${rank}.jpg`;
      const outPath = path.join(dstDir, outFileName);

      if (!fs.existsSync(srcPath)) {
        console.error(`Missing file: ${srcPath}`);
        continue;
      }

      // Read image metadata
      const image = sharp(srcPath);
      const meta = await image.metadata();

      // Resize with precision cover & high quality sharp lanczos3 resampling
      await sharp(srcPath)
        .resize(TARGET_WIDTH, TARGET_HEIGHT, {
          fit: 'cover',
          position: 'center',
          kernel: sharp.kernel.lanczos3,
        })
        .jpeg({
          quality: 95,
          mozjpeg: true,
        })
        .toFile(outPath);

      count++;
      console.log(`[${count}/52] Processed: ${srcFileName} (${meta.width}x${meta.height}) -> ${outFileName} (1024x1536)`);
    }
  }

  console.log(`\n🎉 Successfully processed and replaced all ${count} cards with uniform 1024x1536 master quality!`);
}

processCards().catch(console.error);
