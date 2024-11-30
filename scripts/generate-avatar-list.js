/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

const portraitsDir = path.join(__dirname, '../src/assets/portraits');
let outputFile = path.join(__dirname, '../src/assets/portraits.json');

fs.readdir(portraitsDir, (err, files) => {
  if (err) {
    console.error('Error reading portraits directory:', err);
    return;
  }
  const imageFiles = files.filter(
    file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && file !== 'portraits.json'
  );
  const avatarList = {
    avatars: imageFiles,
  };
  fs.writeFileSync(outputFile, JSON.stringify(avatarList, null, 2));
  console.log('Avatar list generated successfully!');
});

// const monstersDir = path.join(__dirname, '../src/assets/monsters');
// outputFile = path.join(__dirname, '../src/assets/monsters.json');

// fs.readdir(monstersDir, (err, files) => {
//   if (err) {
//     console.error('Error reading monsters directory:', err);
//     return;
//   }
//   const imageFiles = files.filter(
//     file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && file !== 'monsters.json'
//   );
//   const avatarList = {
//     avatars: imageFiles,
//   };
//   fs.writeFileSync(outputFile, JSON.stringify(avatarList, null, 2));
//   console.log('Avatar list generated successfully!');
// });
