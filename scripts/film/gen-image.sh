#!/usr/bin/env bash
# Generate one pencil-sketch image with Codex's built-in image_gen (runs on the ChatGPT subscription).
# Usage: scripts/film/gen-image.sh <out.png> "<prompt>"
# Both canon sheets are attached as references; the brand invariants line is appended to every prompt.
set -euo pipefail
out="$1"; prompt="$2"
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
codex_bin="$(ls -d "$HOME"/.vscode/extensions/openai.chatgpt-*/bin/*/codex 2>/dev/null | sort -V | tail -1 || true)"
[ -x "${codex_bin:-}" ] || { echo "codex binary not found under ~/.vscode/extensions/openai.chatgpt-*" >&2; exit 1; }
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
name="$(basename "$out")"
invariants="Hand-drawn pencil sketch on cream paper #F3ECE1, soft graphite shading, vintage 1930s animation style, confident clean line work, original characters, no mouse ears, no gloves, no text, no watermark, no white background, no gradients or glow."
extra_args=()
extra_note=""
n=3
for ref in ${EXTRA_REFS:-}; do
  extra_args+=(-i "$ref")
  extra_note="$extra_note Image $n is an additional reference."
  n=$((n+1))
done
full="Image 1 is the character sheet for \"Max\" (reference only). Image 2 is the character sheet for \"the guide\" (reference only).$extra_note Use your built-in image_gen tool to generate ONE image, then copy the final PNG into the current working directory as $name. Reply with only the final file path. If the tool rejects the request, retry once with softer wording that keeps the same content.

$prompt

Style invariants: $invariants"
"$codex_bin" exec --sandbox workspace-write --skip-git-repo-check -C "$work" \
  -i "$repo/public/film/canon/max-sheet.png" -i "$repo/public/film/canon/guide-sheet.png" ${extra_args[@]+"${extra_args[@]}"} \
  -o "$work/answer.txt" "$full" > "$work/run.log" 2>&1 || true
if [ -f "$work/$name" ]; then
  mkdir -p "$(dirname "$out")"; cp "$work/$name" "$out"; echo "$out"
else
  echo "generation failed; last log lines:" >&2; tail -5 "$work/run.log" >&2; exit 1
fi
