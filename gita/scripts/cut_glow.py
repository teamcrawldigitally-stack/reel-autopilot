# cut-out for glowing subjects on pure black (halo, fire, stars): rembg mask ∪ brightness key
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from rembg import remove, new_session
sess = new_session("isnet-general-use")
for name in sys.argv[1:]:
    im = Image.open(f"raw/{name}.png").convert("RGB")
    ImageDraw.Draw(im).rectangle([440, 885, 520, 960], fill=(0, 0, 0))
    im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    a1 = np.array(remove(im, session=sess, post_process_mask=True))[:, :, 3].astype(np.float32) / 255
    rgb = np.array(im).astype(np.float32)
    mx = rgb.max(axis=2)
    a2 = np.clip((mx - 14) / 60, 0, 1)
    # fill holes inside the subject: dilate-close the brightness key a little
    a2img = Image.fromarray((a2 * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1))
    a2 = np.array(a2img).astype(np.float32) / 255
    a = np.maximum(a1, a2)
    # un-premultiply dark fringe a bit so glows don't look grey
    out = np.dstack([rgb, a * 255]).astype(np.uint8)
    o = Image.fromarray(out, "RGBA")
    bbox = o.getbbox()
    o = o.crop(bbox)
    o.save(f"{name}-cut.png", optimize=True)
    print(name, o.size, bbox)
