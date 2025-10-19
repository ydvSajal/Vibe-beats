#!/usr/bin/env node

/**
 * Generate iOS-specific PWA assets:
 * - 180x180 apple-touch-icon
 * - 1242x2688 splash screen (iPhone 12/13 Pro Max)
 * - 1125x2436 splash screen (iPhone X/11 Pro)
 * - 1170x2532 splash screen (iPhone 14)
 */

const fs = require('fs');
const path = require('path');

// Try to load canvas
let Canvas;
try {
  Canvas = require('canvas').Canvas;
} catch (err) {
  console.error('⚠️  canvas package not found. Installing...');
  require('child_process').execSync('npm install canvas', { stdio: 'inherit' });
  Canvas = require('canvas').Canvas;
}

const { createCanvas } = require('canvas');

const iconDir = path.join(__dirname, 'public', 'icons');
const splashDir = path.join(__dirname, 'public', 'splash-screens');

// Create directories if they don't exist
if (!fs.existsSync(iconDir)) fs.mkdirSync(iconDir, { recursive: true });
if (!fs.existsSync(splashDir)) fs.mkdirSync(splashDir, { recursive: true });

// Primary color and branding
const primaryColor = '#FF1744';
const backgroundColor = '#FFFFFF';
const accentColor = '#FF1744';

/**
 * Generate a solid color icon (180x180 for Apple touch icon)
 */
function generateAppleTouchIcon() {
  const size = 180;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Gradient or solid branding
  // Create a simple gradient-filled square with rounded corners
  ctx.fillStyle = primaryColor;
  const cornerRadius = 20;
  const x = 0, y = 0, w = size, h = size;

  // Draw rounded rectangle
  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y);
  ctx.lineTo(x + w - cornerRadius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + cornerRadius);
  ctx.lineTo(x + w, y + h - cornerRadius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - cornerRadius, y + h);
  ctx.lineTo(x + cornerRadius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - cornerRadius);
  ctx.lineTo(x, y + cornerRadius);
  ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
  ctx.closePath();
  ctx.fill();

  // Add a simple circle or logo placeholder (white circle in center)
  ctx.fillStyle = backgroundColor;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 4, 0, Math.PI * 2);
  ctx.fill();

  // Add text "VB" for Vibe Beats
  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${size * 0.5}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VB', size / 2, size / 2);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconDir, 'icon-180x180.png'), buffer);
  console.log('✓ Created icon-180x180.png');
}

/**
 * Generate a splash screen with background and branding
 */
function generateSplashScreen(width, height, filename) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Gradient overlay (subtle)
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(255, 23, 68, 0.05)');
  gradient.addColorStop(1, 'rgba(255, 23, 68, 0.15)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw centered brand element (rounded square with primary color)
  const brandSize = Math.min(width, height) * 0.25;
  const brandX = (width - brandSize) / 2;
  const brandY = (height - brandSize) / 3;
  const cornerRadius = 20;

  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(brandX + cornerRadius, brandY);
  ctx.lineTo(brandX + brandSize - cornerRadius, brandY);
  ctx.quadraticCurveTo(brandX + brandSize, brandY, brandX + brandSize, brandY + cornerRadius);
  ctx.lineTo(brandX + brandSize, brandY + brandSize - cornerRadius);
  ctx.quadraticCurveTo(brandX + brandSize, brandY + brandSize, brandX + brandSize - cornerRadius, brandY + brandSize);
  ctx.lineTo(brandX + cornerRadius, brandY + brandSize);
  ctx.quadraticCurveTo(brandX, brandY + brandSize, brandX, brandY + brandSize - cornerRadius);
  ctx.lineTo(brandX, brandY + cornerRadius);
  ctx.quadraticCurveTo(brandX, brandY, brandX + cornerRadius, brandY);
  ctx.closePath();
  ctx.fill();

  // Add icon inside the brand box
  ctx.fillStyle = backgroundColor;
  ctx.beginPath();
  ctx.arc(brandX + brandSize / 2, brandY + brandSize / 2, brandSize / 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${brandSize * 0.4}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VB', brandX + brandSize / 2, brandY + brandSize / 2);

  // Add app name at the bottom
  ctx.fillStyle = '#333333';
  ctx.font = `bold ${height * 0.04}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('Vibe Beats', width / 2, height - height * 0.1);

  ctx.fillStyle = '#666666';
  ctx.font = `${height * 0.025}px Arial, sans-serif`;
  ctx.fillText('Connect through music', width / 2, height - height * 0.05);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(splashDir, filename), buffer);
  console.log(`✓ Created ${filename}`);
}

// Generate assets
console.log('📱 Generating iOS PWA assets...');

try {
  generateAppleTouchIcon();
  generateSplashScreen(1242, 2688, 'splash-1242x2688.png');
  generateSplashScreen(1125, 2436, 'splash-1125x2436.png');
  generateSplashScreen(1170, 2532, 'splash-1170x2532.png');
  console.log('✅ All iOS assets generated successfully in public/icons/ and public/splash-screens/');
} catch (err) {
  console.error('❌ Error generating iOS assets:', err);
  process.exit(1);
}
