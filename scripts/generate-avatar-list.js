/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

const portraitsDir = path.join(__dirname, '../src/assets/portraits');
const outputFile = path.join(__dirname, '../src/assets/portraits/avatars.json');

fs.readdir(portraitsDir, (err, files) => {
  if (err) {
    console.error('Error reading portraits directory:', err);
    return;
  }
  const imageFiles = files.filter(
    file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && file !== 'avatars.json'
  );
  const avatarList = {
    avatars: imageFiles,
  };
  fs.writeFileSync(outputFile, JSON.stringify(avatarList, null, 2));
  console.log('Avatar list generated successfully!');
});
