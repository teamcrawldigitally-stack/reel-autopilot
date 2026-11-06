#!/usr/bin/env python3
"""fullify.py key [key...]: rewrite samples/dhan-<key>.json so every scene has its own full-bleed picture
(dhs-*.jpg, Ken Burns), the last (CTA) scene keeps Lakshmi ji. Re-run dhan_scripts.py first to reset."""
import json, sys
ROOT = "/home/claude/reel-autopilot"
FULL = {  # per scene: list of (img, word) ; word None = from scene start ; "cut:" prefix = keep a cut-out hero
    "murti": [[("dhs-m1", None)], [("cut:lakshmi-stand-cut", None), ("dhs-m2", "पैसा")], [("dhs-m3", None)], [("dhs-m4", None)], [("dhs-m5", None)], None],
    "namak": [[("dhs-n1", None)], [("dhs-n2", None)], [("dhs-n3", None)], [("dhs-n4", None)], [("dhs-n5", None)], None],
    "peepal": [[("dhs-p1", None)], [("dhs-p2", None)], [("dhs-p3", None)], [("dhs-p4", None)], [("dhs-p5", None)], None],
    "kaudi": [[("dhs-k1", None)], [("dhs-k2", None)], [("dhs-k3", None)], [("dhs-k4", None)], [("dhs-k5", None)], None],
    "purse": [[("dhs-u1", None)], [("dhs-u2", None)], [("dhs-u3", None)], [("dhs-u4", None)], [("dhs-u5", None)], None],
    "tijori": [[("dhs-t1", None)], [("dhs-t2", None)], [("dhs-t3", None)], [("dhs-t4", None)], [("dhs-t5", None)], None],
}
for key in sys.argv[1:]:
    p = f"{ROOT}/samples/dhan-{key}.json"
    s = json.load(open(p))
    z = 0
    for sc, plan in zip(s["scenes"], FULL[key]):
        if plan is None:
            continue
        old = {h["img"]: h for h in sc["heroes"]}
        heroes = []
        for img, word in plan:
            if img.startswith("cut:"):
                h = dict(old.get(img[4:], {"img": img[4:], "kind": "deity"}))
                h.pop("prop", None)
            else:
                h = {"img": img, "kind": "full", "zoom": "in" if z % 2 == 0 else "out"}
                z += 1
            if word:
                h["word"] = word
            heroes.append(h)
        sc["heroes"] = heroes
    s["wallpaper"] = []
    imgs = set()
    for sc in s["scenes"]:
        for h in sc["heroes"]:
            imgs.add(h["img"])
            if "prop" in h:
                imgs.add(h["prop"]["img"])
    s["images"] = sorted(imgs)
    json.dump(s, open(p, "w"), ensure_ascii=False, indent=2)
    print(key, [[h["img"] for h in sc["heroes"]] for sc in s["scenes"]])
