
const fs = require('fs');
const path = require('path');

// Copy the frontend package.json to the root directory and to /dev-server if needed
try {
  const rootDir = path.resolve(__dirname, '..');
  const devServerDir = '/dev-server';
  const sourcePath = path.resolve(__dirname, 'package.json');
  const targetPathRoot = path.resolve(rootDir, 'package.json');
  const targetPathDevServer = path.join(devServerDir, 'package.json');
  
  // Copy to root directory if it doesn't exist
  if (!fs.existsSync(targetPathRoot)) {
    fs.copyFileSync(sourcePath, targetPathRoot);
    console.log('package.json copied to root directory successfully!');
  } else {
    console.log('package.json already exists in the root directory.');
  }
  
  // Try to copy to /dev-server if it exists
  try {
    if (fs.existsSync(devServerDir) && !fs.existsSync(targetPathDevServer)) {
      fs.copyFileSync(sourcePath, targetPathDevServer);
      console.log('package.json copied to /dev-server directory successfully!');
    }
  } catch (devServerError) {
    console.error('Note: Could not copy to /dev-server, may not exist in this environment:', devServerError.message);
  }
} catch (error) {
  console.error('Error copying package.json:', error.message);
}

// Also create an index.html in the root and /dev-server if needed
try {
  const rootDir = path.resolve(__dirname, '..');
  const devServerDir = '/dev-server';
  const rootIndexPath = path.resolve(rootDir, 'index.html');
  const frontendIndexPath = path.resolve(__dirname, 'index.html');
  const devServerIndexPath = path.join(devServerDir, 'index.html');
  
  // Create or update index.html in frontend directory
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
  
  // Copy to root directory
  fs.copyFileSync(frontendIndexPath, rootIndexPath);
  console.log('index.html created/updated in frontend and root directories.');
  
  // Try to copy to /dev-server if it exists
  try {
    if (fs.existsSync(devServerDir)) {
      fs.copyFileSync(frontendIndexPath, devServerIndexPath);
      console.log('index.html copied to /dev-server directory.');
    }
  } catch (devServerError) {
    console.error('Note: Could not copy index.html to /dev-server:', devServerError.message);
  }
} catch (error) {
  console.error('Error handling index.html:', error.message);
}

// Make sure vite.config.ts is also in the root and /dev-server
try {
  const rootDir = path.resolve(__dirname, '..');
  const devServerDir = '/dev-server';
  const rootViteConfigPath = path.resolve(rootDir, 'vite.config.ts');
  const frontendViteConfigPath = path.resolve(__dirname, 'vite.config.ts');
  const devServerViteConfigPath = path.join(devServerDir, 'vite.config.ts');
  
  // Copy to root directory
  if (fs.existsSync(frontendViteConfigPath)) {
    fs.copyFileSync(frontendViteConfigPath, rootViteConfigPath);
    console.log('vite.config.ts copied to root directory.');
    
    // Try to copy to /dev-server if it exists
    try {
      if (fs.existsSync(devServerDir)) {
        fs.copyFileSync(frontendViteConfigPath, devServerViteConfigPath);
        console.log('vite.config.ts copied to /dev-server directory.');
      }
    } catch (devServerError) {
      console.error('Note: Could not copy vite.config.ts to /dev-server:', devServerError.message);
    }
  }
} catch (error) {
  console.error('Error handling vite.config.ts:', error.message);
}
