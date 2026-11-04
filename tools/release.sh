#!/usr/bin/env bash
# Build all release packages into release/. Run from the repo root after `npm ci --ignore-scripts`.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
ESB="npx esbuild --bundle --platform=node --format=esm --alias:server-only=./src/server-only.js --legal-comments=eof --log-level=warning"

# 1. scripts and server
$ESB src/chart-cli.ts --target=node18 --outfile=skill/ziwei-doushu/scripts/ziwei-chart.mjs
$ESB src/lookup-cli.ts --target=node18 --outfile=skill/ziwei-doushu/scripts/lookup-reading.mjs
rm -rf build/ext build/skill-offline dist && mkdir -p build/data release
$ESB src/mcp-server.ts --splitting --target=node20 --outdir=dist/server --out-extension:.js=.mjs

# 2. dataset (downloaded and checksum-verified once)
cp skill/ziwei-doushu/scripts/lookup_reading.py skill/ziwei-doushu/scripts/SHA256SUMS.txt build/
mkdir -p build/scripts && mv build/lookup_reading.py build/SHA256SUMS.txt build/scripts/
python3 -I build/scripts/lookup_reading.py --download-all

# 3. Claude Desktop extension
mkdir -p build/ext/server build/ext/data
cp dist/server/*.mjs build/ext/server/
cp build/data/year-*.jsonl.zst skill/ziwei-doushu/scripts/SHA256SUMS.txt skill/ziwei-doushu/scripts/MANIFEST.json build/ext/data/
cp -r skill/ziwei-doushu/references skill/ziwei-doushu/SKILL.md build/ext/
cp LICENSE build/ext/LICENSE && cp skill/ziwei-doushu/LICENSE-code-MIT.txt build/ext/LICENSE-upstream-MIT.txt
cp extension/manifest.json build/ext/manifest.json
npx -y @anthropic-ai/mcpb@1.1.0 validate build/ext/manifest.json
npx -y @anthropic-ai/mcpb@1.1.0 pack build/ext release/ziwei-doushu.mcpb

# 4. skills
mkdir -p build/skill-offline && cp -r skill/ziwei-doushu build/skill-offline/
rm -rf build/skill-offline/ziwei-doushu/scripts/__pycache__
cp build/data/year-*.jsonl.zst build/skill-offline/ziwei-doushu/data/
rm -f release/ziwei-doushu-skill-offline.zip release/ziwei-doushu-skill.zip
(cd build/skill-offline && zip -qr ../../release/ziwei-doushu-skill-offline.zip ziwei-doushu)
(cd skill && zip -qr ../release/ziwei-doushu-skill.zip ziwei-doushu -x '*/__pycache__/*' '*/data/*.zst')
ls -la release
