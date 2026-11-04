#!/usr/bin/env bash
# usage: scripts/mix_music.sh <video.mp4> <music-file> <music-start-sec> <out.mp4> [music-volume]
# Lays the music under the reel's own audio (voice + SFX), ducks it while Kabir
# speaks, fades in/out, and masters to about -14 LUFS. Video is copied as is.
set -euo pipefail
in="$1"; music="$2"; start="$3"; out="$4"; vol="${5:-0.18}"
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
FO=$(python3 -c "print(max(0, $D - 2.2))")
tmp="${out%.mp4}.tmp.mp4"
ffmpeg -v error -y -i "$in" -stream_loop -1 -ss "$start" -i "$music" -filter_complex \
"[1:a]aresample=44100,aformat=channel_layouts=stereo,volume=${vol},afade=t=in:d=0.6,afade=t=out:st=${FO}:d=2.2[m];\
[0:a]aresample=44100,aformat=channel_layouts=stereo,asplit=2[v][key];\
[m][key]sidechaincompress=threshold=0.05:ratio=3:attack=20:release=450[md];\
[v][md]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 44100 -t "$D" -movflags +faststart "$tmp"
mv "$tmp" "$out"
echo "wrote $out"
