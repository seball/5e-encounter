/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

function processDirectory(inputDir, outputPath, type) {
  fs.readdir(inputDir, (err, files) => {
    if (err) {
      console.error(`Error reading ${type} directory:`, err);
      return;
    }

    const imageFiles = files.filter(
      file =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && !file.endsWith('.json')
    );

    const avatarList = {
      avatars: imageFiles,
    };

    fs.writeFileSync(outputPath, JSON.stringify(avatarList, null, 2));
    console.log(`${type} list generated successfully!`);
  });
}

const portraitsDir = path.join(__dirname, '../src/assets/portraits');
const portraitsOutput = path.join(__dirname, '../src/assets/portraits.json');
processDirectory(portraitsDir, portraitsOutput, 'Portraits');

const monstersDir = path.join(__dirname, '../src/assets/monsters');
const monstersOutput = path.join(__dirname, '../src/assets/monsters.json');
processDirectory(monstersDir, monstersOutput, 'Monsters');
