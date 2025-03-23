
const fs = require('fs');
const path = require('path');

// Function to ensure directory exists
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    try {
      fs.mkdirSync(directory, { recursive: true });
      console.log(`Created directory: ${directory}`);
    } catch (error) {
      console.error(`Error creating directory ${directory}:`, error.message);
    }
  }
}

// Copy file with error handling
function copyFileWithErrorHandling(source, target) {
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, target);
      console.log(`Copied ${source} to ${target} successfully`);
    } else {
      console.error(`Source file does not exist: ${source}`);
    }
  } catch (error) {
    console.error(`Error copying ${source} to ${target}:`, error.message);
  }
}

// Copy the frontend package.json to the root directory and to /dev-server if needed
try {
  const rootDir = path.resolve(__dirname, '..');
  const devServerDir = '/dev-server';
  const sourcePath = path.resolve(__dirname, 'package.json');
  const targetPathRoot = path.resolve(rootDir, 'package.json');
  
  // Create dev-server directory if it doesn't exist
  ensureDirectoryExists(devServerDir);
  
  const targetPathDevServer = path.join(devServerDir, 'package.json');
  
  // Copy to root directory
  copyFileWithErrorHandling(sourcePath, targetPathRoot);
  
  // Copy to /dev-server
  copyFileWithErrorHandling(sourcePath, targetPathDevServer);
  
} catch (error) {
  console.error('Error handling package.json:', error.message);
}

// Create or update index.html in relevant directories
try {
  const rootDir = path.resolve(__dirname, '..');
  const devServerDir = '/dev-server';
  const rootIndexPath = path.resolve(rootDir, 'index.html');
  const frontendIndexPath = path.resolve(__dirname, 'index.html');
  const devServerIndexPath = path.join(devServerDir, 'index.html');
  
  // Ensure dev-server directory exists
  ensureDirectoryExists(devServerDir);
  
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
  copyFileWithErrorHandling(frontendIndexPath, rootIndexPath);
  
  // Copy to /dev-server
  copyFileWithErrorHandling(frontendIndexPath, devServerIndexPath);
  
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
  
  // Ensure dev-server directory exists
  ensureDirectoryExists(devServerDir);
  
  // Copy to root directory
  copyFileWithErrorHandling(frontendViteConfigPath, rootViteConfigPath);
  
  // Copy to /dev-server
  copyFileWithErrorHandling(frontendViteConfigPath, devServerViteConfigPath);
  
} catch (error) {
  console.error('Error handling vite.config.ts:', error.message);
}

console.log('Setup completed. If you still encounter issues, please manually copy the following files:');
console.log('1. frontend/package.json to the root directory and to /dev-server/');
console.log('2. frontend/index.html to the root directory and to /dev-server/');
console.log('3. frontend/vite.config.ts to the root directory and to /dev-server/');
