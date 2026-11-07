# dark pictures on black: alpha from brightness (∪ rembg), soft fade at the picture edges
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from rembg import remove, new_session
sess = new_session("isnet-general-use")
for name in sys.argv[1:]:
    im = Image.open(f"raw/{name}.png").convert("RGB")
    ImageDraw.Draw(im).rectangle([440, 885, 520, 960], fill=(0, 0, 0))
    im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    a1 = np.array(remove(im, session=sess, post_process_mask=True))[:, :, 3].astype(np.float32) / 255
    rgb = np.array(im).astype(np.float32)
    a2 = np.clip((rgb.max(axis=2) - 8) / 36, 0, 1)
    a = np.maximum(a1, a2)
    h, w = a.shape
    fx = np.minimum(1, np.minimum(np.arange(w), w - 1 - np.arange(w)) / (0.12 * w))
    fy = np.minimum(1, np.minimum(np.arange(h), h - 1 - np.arange(h)) / (0.08 * h))
    a = a * fx[None, :] * fy[:, None]
    o = Image.fromarray(np.dstack([rgb, a * 255]).astype(np.uint8), "RGBA")
    o = o.crop(o.getbbox())
    o.save(f"{name}-cut.png", optimize=True)
    print(name, o.size)
