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
execSync('npx gh-pages -d out -t true', { stdio: 'inherit' });

console.log('Deployment complete!'); 