#!/usr/bin/env bash
# Patches Expo web export so Vercel will serve it. Vercel refuses paths
# containing "__" (system prefix) or "/." (dotfiles), and chokes on
# directories with "@" and "+" chars (pnpm's deterministic layout).
#
# This script:
#   1. Flattens icon fonts from .../node_modules/.../Fonts/*.ttf
#      into /assets/fonts/*.ttf so the paths are clean
#   2. Rewrites every CSS/HTML/JS reference to the new path
#
# Run from anywhere; assumes apps/mobile/dist exists.

set -e
DIST="$(cd "$(dirname "$0")/.." && pwd)/dist"

if [ ! -d "$DIST" ]; then
  echo "❌ $DIST not found. Run 'expo export --platform web' first."
  exit 1
fi

echo "📦 Flattening icon fonts → /assets/fonts/"
mkdir -p "$DIST/assets/fonts"
find "$DIST/assets" -name '*.ttf' -not -path '*/fonts/*' \
  -exec cp {} "$DIST/assets/fonts/" \;

echo "✏️  Rewriting font references"
find "$DIST" -type f \
  \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' \) \
  -exec perl -i -pe \
    's{/assets/[^/]*node_modules/[^"]*Fonts/}{/assets/fonts/}g; s{/assets/[^/]*\.pnpm/[^"]*Fonts/}{/assets/fonts/}g' \
    {} \;

echo "✅ Done. Deploy with: cd $DIST && npx vercel --prod --yes --scope rennielab"
