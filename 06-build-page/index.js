const fs = require('fs/promises');
const path = require('path');
const projectDistPath = path.join(__dirname, 'project-dist');
const templateHtmlPath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const outputHtmlPath = path.join(projectDistPath, 'index.html');
const outputCssPath = path.join(projectDistPath, 'style.css');
const assetsDir = path.join(__dirname, 'assets');
const outputAssetsDir = path.join(projectDistPath, 'assets');

async function buildPage() {
  try {
    await fs.mkdir(projectDistPath, { recursive: true });
    let template = await fs.readFile(templateHtmlPath, 'utf8');
    const componentFiles = await fs.readdir(componentsDir);
    for (const file of componentFiles) {
      const filePath = path.join(componentsDir, file);
      const fileExt = path.extname(file);
      const componentTag = path.basename(file, fileExt);
      if (fileExt === '.html') {
        const componentContent = await fs.readFile(filePath, 'utf8');
        const regExp = new RegExp(`{{${componentTag}}}`, 'g');
        template = template.replace(regExp, componentContent);
      }
    }
    await fs.writeFile(outputHtmlPath, template);
  } catch (err) {
    console.error(`Error building the page: ${err}`);
  }
}

async function mergeStyles() {
  try {
    const files = await fs.readdir(stylesDir, { withFileTypes: true });
    let stylesArray = [];
    for (const file of files) {
      const filePath = path.join(stylesDir, file.name);
      const fileExt = path.extname(file.name);
      if (file.isFile() && fileExt === '.css') {
        const data = await fs.readFile(filePath, 'utf8');
        stylesArray.push(data);
      }
    }
    await fs.writeFile(outputCssPath, stylesArray.join('\n'));
    console.log('Styles merged successfully into style.css');
  } catch (err) {
    console.error('Error merging styles:', err);
  }
}

async function copyAssets(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
    console.log('Assets copied successfully');
  } catch (err) {
    console.error(`Error copying assets: ${err}`);
  }
}

async function buildProject() {
  await buildPage();
  await mergeStyles();
  await copyAssets(assetsDir, outputAssetsDir);
}
buildProject();
