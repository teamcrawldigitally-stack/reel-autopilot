#!/usr/bin/env python3
"""Saturday 7 Nov Diwali money series: put the dhan reels at the front of the Astro queue (Saturday only,
no trial copies), and move 04-zindagi + 05-rahu to the end. Usage: queue_dhan.py qid [qid ...] (only ids whose mp4 exists)."""
import json, os, sys

ROOT = "/home/claude/rap-push"
SAMPLES = "/home/claude/reel-autopilot/samples"
Q = os.path.join(ROOT, "queue/astro24x7")
DAY = "2026-11-07"

SALARY_CAPTION = (
    "🪔 सैलरी आते ही पैसा ख़त्म? हमने हिसाब लगाया: सैलरी ₹30,000 = किराया ₹10,000 + EMI ₹6,000 + घर ₹9,000 + "
    "छोटे-मोटे खर्च ₹5,000। ये छोटे खर्च साल भर में ₹60,000 बन जाते हैं, और बचत ₹0। (ये उदाहरण के नंबर हैं)\n\n"
    "✅ लक्ष्मी पूजा में एक लिफ़ाफ़ा रखिए, उस पर लिखिए \"बचत\"\n"
    "✅ हर सैलरी पर पहले 10% (₹3,000) उसी में = साल भर में ₹36,000\n"
    "✅ दिवाली सेल में EMI पर नया सामान नहीं\n\n"
    "👇 जिसकी सैलरी आते ही ख़त्म हो जाती है, उसे ये भेजिए।"
)
KARZ_CAPTION = (
    "🪔 कर्ज़ नहीं उतर रहा? पहले हिसाब: ₹50,000 का कर्ज़, ब्याज 3% महीना। ₹2,000 की किश्त में ₹1,500 सिर्फ़ ब्याज, "
    "कर्ज़ घटा सिर्फ़ ₹500। ऐसे 47 महीने (करीब 4 साल) और कुल ~₹93,800 चुकाने पड़ते हैं। किश्त ₹3,000 करें तो 24 महीने, "
    "कुल ~₹70,360, यानी ~₹23,400 की बचत। (ये उदाहरण के नंबर हैं)\n\n"
    "✅ दिवाली की रात पूजा के बाद \"ॐ श्रीं महालक्ष्म्यै नमः\" 108 बार\n"
    "✅ मान्यता है: बढ़ी हुई किश्त मंगलवार से शुरू करें\n"
    "✅ दिवाली खर्च के लिए नया कर्ज़ नहीं\n\n"
    "👇 जिस पर कर्ज़ का बोझ है, उसे ये भेजिए।"
)

PLAN = {  # qid: (sample name or None, title, hook, look, caption override)
    "33-dhan-murti": ("dhan-murti", None, "बैठी या खड़ी?", "devo", None),
    "34-dhan-namak": ("dhan-namak", None, "पैसा टिकता नहीं?", "devo", None),
    "35-dhan-salary": (None, "सैलरी आते ही पैसा ख़त्म?", "सैलरी आते ही पैसा ख़त्म?", "hisaab", SALARY_CAPTION),
    "36-dhan-peepal": ("dhan-peepal", None, "आज शनिवार, पीपल का दीया", "devo", None),
    "37-dhan-kaudi": ("dhan-kaudi", None, "11 कौड़ियाँ", "devo", None),
    "38-dhan-purse": ("dhan-purse", None, "पर्स में 1 चीज़", "devo", None),
    "39-dhan-tijori": ("dhan-tijori", None, "तिजोरी किस तरफ़?", "devo", None),
    "40-dhan-karz": (None, "कर्ज़ नहीं उतर रहा?", "कर्ज़ नहीं उतर रहा?", "hisaab", KARZ_CAPTION),
}
order = list(PLAN)

mpath = os.path.join(Q, "manifest.json")
m = json.load(open(mpath))
have = {i["id"] for i in m["items"]}
for qid in sys.argv[1:]:
    if qid in have or not os.path.exists(os.path.join(Q, f"{qid}.mp4")):
        print("skip", qid)
        continue
    name, title, hook, look, cap = PLAN[qid]
    tags = ["#दिवाली", "#लक्ष्मीपूजा", "#धन", "#Astro24x7", "#ज्योतिष"]
    if name:
        s = json.load(open(os.path.join(SAMPLES, f"{name}.json")))
        title = s["title"]
        cap = s["caption"]
        tags = [f"#{t}" for t in s.get("hashtags", [])] + ["#Astro24x7", "#ज्योतिष"]
    item = {
        "id": qid, "title": title, "video": f"{qid}.mp4",
        "caption": cap + "\n\n" + " ".join(dict.fromkeys(tags)),
        "audioName": f"Astro 24x7 · {title}", "thumbOffsetMs": 1500 if look == "hisaab" else 1200,
        "look": look, "type": "diwali-money", "hook": hook,
        "notBefore": DAY, "notAfter": DAY, "trialCopy": False,
    }
    # front of the unposted part, in series order
    pos = next(k for k, it in enumerate(m["items"]) if it["id"] == "04-zindagi-ke-9-adhyay" or it["id"] == "07-diwali")
    for k, it in enumerate(m["items"]):
        if it["id"] in PLAN and order.index(it["id"]) < order.index(qid):
            pos = k + 1
    m["items"].insert(pos, item)
    have.add(qid)
    print("added", qid, "at", pos)

# zindagi + rahu (Saturday's old reels) go to the end of the queue
MOVE = ["04-zindagi-ke-9-adhyay", "05-rahu-3-pehchaan"]
if [it["id"] for it in m["items"][-2:]] != MOVE:
    tail = [next(it for it in m["items"] if it["id"] == x) for x in MOVE]
    m["items"] = [it for it in m["items"] if it["id"] not in MOVE] + tail
    print("moved to end", MOVE)
m["perDay"] = 8 if any(i["id"] in PLAN for i in m["items"]) else m.get("perDay", 2)
m["schedule"] = "Normal posts 12:47 PM + 6:47 PM IST, trial copies 3:47 PM + 9:47 PM IST (see .github/workflows/post-queue.yml). Sat 7 Nov: Diwali money series, normal posts every 1.5 h from 11:17 AM (perDay 8 for that day only), no trial copies."
json.dump(m, open(mpath, "w"), ensure_ascii=False, indent=2)
open(mpath, "a").write("\n")
