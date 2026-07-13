#!/bin/sh
# Regenerate the social share images from the SVG sources.
# Requires librsvg (brew install librsvg).
set -e
cd "$(dirname "$0")/../.."
rsvg-convert -w 1200 -h 630 scripts/og/og.svg -o public/og.png
rsvg-convert -w 1200 -h 630 scripts/og/og-eid.svg -o public/og-eid.png
echo "Wrote public/og.png and public/og-eid.png"
