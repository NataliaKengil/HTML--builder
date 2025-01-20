const fs = require('fs/promises');
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const outputPath = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    const files = await fs.readdir(stylesPath, { withFileTypes: true });
    let stylesArray = [];

    for (const file of files) {
      const filePath = path.join(stylesPath, file.name);
      const fileExt = path.extname(file.name);

      if (file.isFile() && fileExt === '.css') {
        const data = await fs.readFile(filePath, 'utf8');
        stylesArray.push(data);
      }
    }

    await fs.writeFile(outputPath, stylesArray.join('\n'));
    console.log('Styles merged successfully into bundle.css');
  } catch (err) {
    console.error('Error merging styles:', err);
  }
}
mergeStyles();
