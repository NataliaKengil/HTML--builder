const fs = require('fs/promises');
const path = require('path');
const secretFolderPath = path.join(__dirname, 'secret-folder');

async function printFilesInfo() {
  try {
    const files = await fs.readdir(secretFolderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(secretFolderPath, file.name);
        const fileStats = await fs.stat(filePath);
        const fileName = path.parse(file.name).name;
        const fileExt = path.extname(file.name).slice(1);
        const fileSize = (fileStats.size / 1024).toFixed(3);
        
        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error('Error reading the secret folder:', err);
  }
}
printFilesInfo();

