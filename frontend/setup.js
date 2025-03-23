
const fs = require('fs');
const path = require('path');

// Create a symbolic link to the frontend package.json in the root directory
try {
  const rootDir = path.resolve(__dirname, '..');
  const sourcePath = path.resolve(__dirname, 'package.json');
  const targetPath = path.resolve(rootDir, 'package.json');
  
  // Check if the symlink already exists
  if (!fs.existsSync(targetPath)) {
    // Create the symlink
    fs.symlinkSync(sourcePath, targetPath, 'file');
    console.log('Symbolic link created successfully!');
  } else {
    console.log('package.json already exists in the root directory.');
  }
} catch (error) {
  console.error('Error creating symbolic link:', error);
}

// Also create an index.html in the root if it doesn't exist
try {
  const rootIndexPath = path.resolve(__dirname, '..', 'index.html');
  const frontendIndexPath = path.resolve(__dirname, 'index.html');
  
  if (!fs.existsSync(rootIndexPath) && fs.existsSync(frontendIndexPath)) {
    fs.copyFileSync(frontendIndexPath, rootIndexPath);
    console.log('index.html copied to root directory.');
  } else if (!fs.existsSync(frontendIndexPath)) {
    // Create a basic index.html in the frontend directory
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WallStreet AI</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <link href="https://fonts.googleapis.com/css2?family=Happy+Monkey&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    
    fs.writeFileSync(frontendIndexPath, htmlContent);
    fs.copyFileSync(frontendIndexPath, rootIndexPath);
    console.log('Created index.html in both frontend and root directories.');
  }
} catch (error) {
  console.error('Error handling index.html:', error);
}

// Make sure vite.config.ts is also in the root
try {
  const rootViteConfigPath = path.resolve(__dirname, '..', 'vite.config.ts');
  const frontendViteConfigPath = path.resolve(__dirname, 'vite.config.ts');
  
  if (!fs.existsSync(rootViteConfigPath) && fs.existsSync(frontendViteConfigPath)) {
    fs.copyFileSync(frontendViteConfigPath, rootViteConfigPath);
    console.log('vite.config.ts copied to root directory.');
  }
} catch (error) {
  console.error('Error copying vite.config.ts:', error);
}
