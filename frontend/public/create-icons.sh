#!/bin/bash
# Generate PWA icons from SVG using ImageMagick
# Usage: ./create-icons.sh

# Create a simple Math Kingdom icon using SVG
cat > temp-icon.svg << 'SVGEOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#grad)"/>
  <text x="256" y="320" font-size="280" text-anchor="middle" fill="white" font-family="Arial, sans-serif">🎓</text>
</svg>
SVGEOF

# Convert to PNG if ImageMagick is available
if command -v convert &> /dev/null; then
    convert temp-icon.svg -resize 192x192 icon-192.png
    convert temp-icon.svg -resize 512x512 icon-512.png
    echo "Icons generated successfully!"
else
    echo "ImageMagick not found. Please install it or use an online tool to convert temp-icon.svg"
fi

rm -f temp-icon.svg
