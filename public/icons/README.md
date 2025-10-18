# PWA Icons

This directory should contain your app icons for the Progressive Web App (PWA).

## Required Icons

You need to create the following icons and place them in this directory:

- `icon-192x192.png` - 192x192 pixels (required for Android)
- `icon-512x512.png` - 512x512 pixels (required for Android)
- `icon-72x72.png` - 72x72 pixels (optional, for badges)

## Creating Icons

You can:
1. Use a design tool (Figma, Canva, Photoshop) to create custom icons
2. Use an icon generator like https://realfavicongenerator.net/
3. Use a simple emoji or logo as a temporary placeholder

## Temporary Placeholder

Until you create real icons, you can use these steps to create simple placeholder icons:

### Option 1: Use an online tool
- Go to https://realfavicongenerator.net/
- Upload any image or logo
- Generate and download the icons
- Place them in this `public/icons/` directory

### Option 2: Create with code
Run this PowerShell command to create simple colored placeholder icons:

```powershell
# Install ImageMagick first if you don't have it
# Then run:
# magick -size 192x192 xc:#7c3aed -gravity center -pointsize 96 -fill white -annotate +0+0 "🎵" icon-192x192.png
# magick -size 512x512 xc:#7c3aed -gravity center -pointsize 256 -fill white -annotate +0+0 "🎵" icon-512x512.png
# magick -size 72x72 xc:#7c3aed -gravity center -pointsize 48 -fill white -annotate +0+0 "🎵" icon-72x72.png
```

## After Adding Icons

Once you've added the icons to this directory, your PWA will:
- Be installable on mobile devices
- Show your icon on the home screen
- Display properly in app switchers
- Look professional when shared
