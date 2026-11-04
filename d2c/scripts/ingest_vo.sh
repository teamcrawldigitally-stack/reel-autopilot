#!/usr/bin/env bash
# usage: scripts/ingest_vo.sh <dir-with-wavs> s1=<file> s2=<file> ...
# Copies each scene's voice clip into public/vo/<scene>.wav, trimming
# leading/trailing silence (keeps ~60 ms), then rebuilds src/timing.json.
set -euo pipefail
cd "$(dirname "$0")/.."
src="$1"; shift
mkdir -p public/vo
for pair in "$@"; do
  id="${pair%%=*}"; f="${pair#*=}"
  ffmpeg -v error -y -i "$src/$f" \
    -af "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse" \
    -ar 44100 -ac 1 -c:a pcm_s16le "public/vo/$id.tmp.wav"
  mv "public/vo/$id.tmp.wav" "public/vo/$id.wav"
  printf "%s %s -> %.2fs\n" "$id" "$f" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 public/vo/$id.wav)"
done
node scripts/timing.mjs
