// Generate branded PWA icons using canvas
const fs = require('fs');
const path = require('path');

// Check if canvas is available
let Canvas;
try {
    Canvas = require('canvas');
} catch (e) {
    console.log('canvas package not found, installing...');
    require('child_process').execSync('npm install canvas --no-save', { stdio: 'inherit' });
    Canvas = require('canvas');
}

const { createCanvas } = Canvas;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#FF1744');
    gradient.addColorStop(0.5, '#FF6B9D');
    gradient.addColorStop(1, '#FFC1E3');
    
    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Add music emoji/icon - using a circle with music note symbol
    // Since emoji rendering can be inconsistent, we'll draw a stylized music note
    
    // Draw white circle background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Draw music note in white
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = size * 0.02;
    ctx.shadowOffsetY = size * 0.01;

    // Simple music note using text (more compatible)
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♪', size / 2, size / 2);

    return canvas;
}

console.log('Generating branded PWA icons...\n');

sizes.forEach(size => {
    const canvas = createIcon(size);
    const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Created icon-${size}x${size}.png`);
});

console.log('\n✅ All branded icons created successfully in public/icons/');
console.log('\nNext steps:');
console.log('1. git add public/icons/');
console.log('2. git commit -m "Add branded PWA icons"');
console.log('3. git push origin main');
console.log('4. vercel --prod');
