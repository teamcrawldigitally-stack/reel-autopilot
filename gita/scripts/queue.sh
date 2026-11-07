#!/usr/bin/env bash
# usage: scripts/queue.sh ep10:Kal-Se-Pakka ep11:LIC-Ka-Vakya ...   (renders one after another)
cd "$(dirname "$0")/.."
for item in "$@"; do
  ep="${item%%:*}"; name="${item#*:}"
  echo "== $ep"
  scripts/render.sh "$ep" "$name" 2>&1 | grep -E "length|I:|Gita-Shlok|rror" 
done
