#!/usr/bin/env python3
"""Adds the finished 14-20 Nov reels to queue/astro24x7/manifest.json (in calendar order, after the existing items).
usage: queue_add.py id [id ...]   (only ids whose video exists in queue/astro24x7/ are added)"""
import json, os, sys

ROOT = os.environ.get("REPO", "/home/claude/reel-autopilot")
Q = os.path.join(ROOT, "queue/astro24x7")
PLAN = {
    "19-chandra": ("chandra", "2026-11-14", "devo", "planet-series", "3 पहचान"),
    "20-chhath": ("chhath", "2026-11-14", "paper", "festival", "why"),
    "21-shaadi": ("shaadi", "2026-11-15", "toon", "evergreen", "question"),
    "22-surya": ("surya", "2026-11-15", "devo", "planet-series", "3 पहचान"),
    "23-vrishchik": ("vrishchik", "2026-11-16", "paper", "gochar", "which rashi"),
    "24-naam": ("naam", "2026-11-16", "toon", "evergreen", "save chart"),
    "25-mangal": ("mangal", "2026-11-17", "devo", "planet-series", "3 पहचान"),
    "26-guruchandal": ("guruchandal", "2026-11-17", "paper", "gochar", "myth-bust"),
    "27-janm": ("janm", "2026-11-18", "toon", "evergreen", "question"),
    "28-guru": ("guru", "2026-11-18", "devo", "planet-series", "3 पहचान"),
    "29-rahuketu": ("rahuketu", "2026-11-19", "paper", "gochar", "big change"),
    "30-rashi": ("rashi", "2026-11-19", "toon", "evergreen", "12 rashis"),
    "31-devuthani": ("devuthani", "2026-11-20", "devo", "festival", "festival"),
    "32-budh": ("budh", "2026-11-20", "devo", "planet-series", "3 पहचान"),
}
order = list(PLAN)
mpath = os.path.join(Q, "manifest.json")
m = json.load(open(mpath))
have = {i["id"] for i in m["items"]}
for qid in sys.argv[1:]:
    if qid in have or not os.path.exists(os.path.join(Q, f"{qid}.mp4")):
        print("skip", qid); continue
    name, nb, look, typ, hook = PLAN[qid]
    s = json.load(open(os.path.join(ROOT, "samples", f"{name}.json")))
    tags = [f"#{t}" for t in s.get("hashtags", [])] + ["#Astro24x7", "#ज्योतिष"]
    item = {"id": qid, "title": s["title"], "video": f"{qid}.mp4", "caption": s["caption"] + "\n\n" + " ".join(dict.fromkeys(tags)),
            "audioName": f"Astro 24x7 · {s['title']}", "thumbOffsetMs": 1200, "look": look, "type": typ, "hook": hook, "notBefore": nb}
    # keep calendar order: insert before the first later planned item already in the queue
    pos = len(m["items"])
    for k, it in enumerate(m["items"]):
        if it["id"] in PLAN and order.index(it["id"]) > order.index(qid):
            pos = k; break
    m["items"].insert(pos, item); have.add(qid); print("added", qid, "notBefore", nb)
json.dump(m, open(mpath, "w"), ensure_ascii=False, indent=2); open(mpath, "a").write("\n")
