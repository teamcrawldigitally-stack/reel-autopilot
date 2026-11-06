#!/usr/bin/env bash
# usage: scripts/place_vo.sh <ep> s1_0=<hash> s1_1=<hash> ...
# copies staged Sarvam clips into public/<ep>/vo/lines/<scene>_<n>.wav
set -euo pipefail
ep="$1"; shift
mkdir -p "public/$ep/vo/lines"
for kv in "$@"; do
  k="${kv%%=*}"; h="${kv#*=}"
  src="/mnt/user-data/uploads/Astro24x7/sarvam-tts-$h.wav"
  for i in 1 2 3 4 5; do [ -s "$src" ] && break; sleep 1; done
  cp "$src" "public/$ep/vo/lines/$k.wav"
done
ls "public/$ep/vo/lines" | wc -l
