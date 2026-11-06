#!/usr/bin/env bash
# usage: scripts/render.sh <ep-id e.g. ep07> <file-name-part e.g. Pehla-Shlok>
# render → music bed → Instagram encode → cover png; prints length + loudness
set -euo pipefail
ep="$1"; name="$2"
Comp="$(echo "${ep:0:1}" | tr a-z A-Z)${ep:1}"
num="${ep#ep}"
BROWSER="$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64 | head -1)/chrome-headless-shell"
mkdir -p out
npx remotion render src/index.ts "$Comp" "out/${ep}_tmp.mp4" --codec h264 --crf 18 --x264-preset veryfast --audio-codec aac --audio-bitrate 256k --browser-executable="$BROWSER" --concurrency=2 --log=error
bash scripts/mix_music.sh "out/${ep}_tmp.mp4" public/music/jailer-bed.wav 0 "out/${ep}_mix.mp4"
final="out/Gita-Shlok-Series_EP${num}_${name}.mp4"
ffmpeg -v error -y -i "out/${ep}_mix.mp4" -c:v libx264 -preset veryfast -crf 19 -pix_fmt yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 128k -ar 48000 -movflags +faststart "$final"
npx remotion still src/index.ts "${Comp}Cover" "out/Gita-Shlok-Series_EP${num}_cover.png" --frame=0 --browser-executable="$BROWSER" --log=error
rm -f "out/${ep}_tmp.mp4" "out/${ep}_mix.mp4"
echo "length: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$final")"
ffmpeg -hide_banner -i "$final" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
echo "$final"
