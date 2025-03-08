const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Build the project
console.log('Building the project...');
execSync('npm run build', { stdio: 'inherit' });

// Create .nojekyll file
console.log('Creating .nojekyll file...');
fs.writeFileSync(path.join('out', '.nojekyll'), '');

// Deploy to GitHub Pages
console.log('Deploying to GitHub Pages...');
execSync('npx gh-pages -d out', { stdio: 'inherit' });

console.log('Deployment complete!');

console.log('Local development server is running on: http://localhost:3001');
console.log('Network development server is running on: http://192.168.0.40:3001'); 