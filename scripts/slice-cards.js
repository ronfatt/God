const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Precision extraction for 724x1024 poster:
const CARD_WIDTH = 129;
const CARD_HEIGHT = 246;

const REALMS = [
  {
    prefix: 'H',
    file: 'public/realms/heart_realm_poster.jpg',
    ranks: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
  },
  {
    prefix: 'D',
    file: 'public/realms/diamond_realm_poster.jpg',
    ranks: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
  },
  {
    prefix: 'C',
    file: 'public/realms/club_realm_poster.jpg',
    ranks: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
  },
  {
    prefix: 'S',
    file: 'public/realms/spade_realm_poster.jpg',
    ranks: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
  },
];

async function extractCards() {
  const outDir = path.join(__dirname, '../public/cards');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Row 1 & 2 columns (5 cards):
  const colX = [23, 161, 299, 437, 575];
  const row1Y = 206;
  const row2Y = 459;

  // Row 3 columns (J, Q, K - 3 cards):
  const row3ColX = [146, 297, 448];
  const row3Y = 711;

  for (const realm of REALMS) {
    const inputPath = path.join(__dirname, '..', realm.file);

    for (let i = 0; i < 13; i++) {
      const rank = realm.ranks[i];
      const cardId = `${realm.prefix}-${rank}`;
      let left = 0;
      let top = 0;

      if (i < 5) {
        left = colX[i];
        top = row1Y;
      } else if (i < 10) {
        left = colX[i - 5];
        top = row2Y;
      } else {
        left = row3ColX[i - 10];
        top = row3Y;
      }

      const outPath = path.join(outDir, `${cardId}.jpg`);
      await sharp(inputPath)
        .extract({
          left: Math.max(0, left),
          top: Math.max(0, top),
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        })
        .jpeg({ quality: 98 })
        .toFile(outPath);
    }
  }

  console.log('Successfully re-extracted 52 cards with full margins and badges!');
}

extractCards().catch(console.error);
