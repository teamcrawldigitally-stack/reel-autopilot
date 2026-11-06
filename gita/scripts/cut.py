import sys
from PIL import Image, ImageDraw, ImageFilter
from rembg import remove, new_session
sess = new_session("isnet-general-use")
for name in sys.argv[1:]:
    im = Image.open(f"raw/{name}.png").convert("RGB")
    d = ImageDraw.Draw(im)
    d.rectangle([440, 885, 520, 960], fill=(0, 0, 0))  # Gemini sparkle mark
    im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    out = remove(im, session=sess, post_process_mask=True)
    bbox = out.getbbox()
    out = out.crop(bbox)
    out.save(f"{name}-cut.png", optimize=True)
    print(name, out.size, bbox)
