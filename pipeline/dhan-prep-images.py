#!/usr/bin/env python3
# prep.py name [name...]: /mnt/user-data/uploads/Downloads/astro-<name>.png -> public/devo/img/dhs-<name>.jpg (1080x1920, watermark corner cropped)
import sys
from PIL import Image
for n in sys.argv[1:]:
    im = Image.open(f"/mnt/user-data/uploads/Downloads/astro-{n}.png").convert("RGB")
    w, h = im.size
    h2 = int(h * 0.935)  # drop the bottom strip with the Gemini sparkle (it sits at 94-98% height)
    w2 = int(h2 * 9 / 16)
    if w2 > w:
        w2 = w; h2 = int(w * 16 / 9)
    x0 = (w - w2) // 2
    im = im.crop((x0, 0, x0 + w2, h2)).resize((1080, 1920), Image.LANCZOS)
    im.save(f"/home/claude/reel-autopilot/public/devo/img/dhs-{n}.jpg", quality=90)
    print(n, w, h, "->", w2, h2)
