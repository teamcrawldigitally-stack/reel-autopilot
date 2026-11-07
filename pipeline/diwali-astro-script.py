#!/usr/bin/env python3
"""Diwali astrology reel (7 Nov, Akshay: festivals only with an astrology link): writes samples/diwali-astro.json"""
import json, re
ROOT = "/home/claude/reel-autopilot"
PAL = {"accent": "#F2A516", "accentDeep": "#7A4A06", "bg": "#1C0709", "glow": "112,32,38", "glow2": "58,14,18"}
L = lambda top, bottom, word: {"top": top, "bottom": bottom, "word": word}
CTA = {"img": "lakshmi-cut", "kind": "big", "w": 1100, "x": -10, "y": 300}


def full(img, z):
    return {"img": img, "kind": "full", "zoom": "in" if z % 2 == 0 else "out"}


def S(vo, img, z, labels, **kw):
    s = {"voiceover": vo, "heroes": [full(img, z) if img else CTA], "labels": labels, "visual": "devo"}
    s.update(kw)
    return s


R = {
    "diwali-astro": dict(
        title="दिवाली अमावस्या पर क्यों?",
        music="music/dolce-nonna.mp3",
        caption="🪔 दिवाली अमावस्या की रात ही क्यों? जवाब ज्योतिष में है:\n\n✨ आज रात सूर्य और चंद्र दोनों तुला राशि में, और तुला के स्वामी हैं शुक्र, धन और लक्ष्मी के कारक\n✨ तुला में सूर्य नीच के होते हैं, साल में सबसे कमज़ोर, इसलिए सबसे अँधेरी रात, और इसलिए दीये\n✨ लक्ष्मी पूजा वृषभ लग्न में: ये स्थिर लग्न है, और ये भी शुक्र की राशि\n\n🕯️ लक्ष्मी पूजा का समय (दिल्ली, 8 नवंबर): शाम 5:54 से 7:50 तक, प्रदोष काल में वृषभ लग्न (Drik Panchang)। आपके शहर में कुछ मिनट आगे-पीछे।\n\n👇 कमेंट में लिखिए \"शुभ दीपावली\", और ये रील परिवार के ग्रुप में भेजिए।",
        hashtags=["दिवाली", "Diwali2026", "LakshmiPuja"],
        scenes=[
            S("अमावस्या को अशुभ मानते हैं, फिर सबसे बड़ा त्योहार, दिवाली, अमावस्या की रात क्यों? जवाब ज्योतिष में है।", "dhs-dv1", 0,
              [L("अमावस्या की रात", "दिवाली क्यों?", "दिवाली"), L("जवाब", "ज्योतिष में", "ज्योतिष")], title="दिवाली", titleSub="अमावस्या पर क्यों?"),
            S("आज की रात सूर्य और चंद्र, दोनों तुला राशि में हैं। और तुला के स्वामी हैं शुक्र, धन और लक्ष्मी के कारक।", "dhs-dv2", 1,
              [L("सूर्य + चंद्र", "तुला राशि में", "तुला"), L("तुला के स्वामी", "शुक्र = लक्ष्मी", "शुक्र")], counter="1"),
            S("तुला में सूर्य नीच के होते हैं, यानी साल में सबसे कमज़ोर। इसलिए ये साल की सबसे अँधेरी रात है, और इसलिए दीये।", "dhs-dv3", 2,
              [L("तुला में सूर्य", "नीच के", "नीच"), L("सबसे अँधेरी रात", "इसलिए दीये", "दीये")], counter="2"),
            S("और लक्ष्मी पूजा होती है वृषभ लग्न में। ये स्थिर लग्न है, और ये भी शुक्र की राशि। मान्यता है, स्थिर लग्न में पूजा से लक्ष्मी घर में टिकती हैं।", "dhs-dv4", 3,
              [L("लक्ष्मी पूजा", "वृषभ लग्न में", "वृषभ"), L("स्थिर लग्न", "लक्ष्मी टिकती हैं", "टिकती")], counter="3"),
            S("दिल्ली में आज ये समय शाम पाँच बजकर चौवन मिनट से सात बजकर पचास मिनट तक है। आपके शहर में कुछ मिनट आगे पीछे होगा।", "dhs-dv5", 4,
              [L("दिल्ली में आज", "5:54 – 7:50 PM", "पाँच"), L("आपके शहर में", "कुछ मिनट आगे-पीछे", "शहर")]),
            S("कमेंट में लिखिए शुभ दीपावली, और ये रील परिवार के ग्रुप में भेजिए। आज शाम केतु वालों की बारी, फॉलो कर लीजिए।", None, 0,
              [L("कमेंट में लिखिए", "शुभ दीपावली", "शुभ"), L("आज शाम", "केतु वालों की बारी", "केतु"), L("फॉलो", "कर लीजिए", "फॉलो")]),
        ],
    ),
}

toks = lambda s: [re.sub(r"[\s।॥,?!.\-]", "", t) for t in s.split()]
for key, r in R.items():
    bad = [(i, l["word"]) for i, sc in enumerate(r["scenes"]) for l in sc["labels"] if l["word"] not in toks(sc["voiceover"])]
    imgs = sorted({h["img"] for sc in r["scenes"] for h in sc["heroes"]})
    out = {"topic": r["title"], "title": r["title"], "composition": "DevoReel", "look": "devo", "hook": r["scenes"][0]["voiceover"],
           "images": imgs, "floats": [], "caption": r["caption"], "hashtags": r["hashtags"], "music": r["music"], "scenes": r["scenes"],
           "palette": PAL, "wallpaper": [], "typo": "gold"}
    json.dump(out, open(f"{ROOT}/samples/{key}.json", "w"), ensure_ascii=False, indent=2)
    print(key, "bad cues:", bad)
