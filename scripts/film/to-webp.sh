#!/usr/bin/env bash
# Convert a PNG to WebP with ffmpeg-static. Alpha is preserved.
# Usage: scripts/film/to-webp.sh <in.png> <out.webp> [lossless|<quality 0-100>]   (default: 82)
set -euo pipefail
in="$1"; out="$2"; mode="${3:-82}"
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ff="$repo/node_modules/ffmpeg-static/ffmpeg"
if [ "$mode" = "lossless" ]; then
  "$ff" -v error -y -i "$in" -c:v libwebp -lossless 1 -pix_fmt bgra "$out"
else
  "$ff" -v error -y -i "$in" -c:v libwebp -quality "$mode" -pix_fmt yuva420p "$out"
fi
echo "$out $(wc -c < "$out" | tr -d ' ') bytes"
