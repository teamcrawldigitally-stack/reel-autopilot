# storybook pictures: inpaint the Gemini mark, 2x, then either cut out (rembg) or save a full jpg
# usage: python3 scripts/cut_story.py cut s-chariot   |   python3 scripts/cut_story.py full s-kurukshetra
import sys, numpy as np, cv2
from PIL import Image, ImageFilter
mode, names = sys.argv[1], sys.argv[2:]
sess = None
for name in names:
    src = cv2.imread(f"public/img/raw/{name}.png")
    m = np.zeros(src.shape[:2], np.uint8); m[900:960, 450:515] = 255
    src = cv2.inpaint(src, m, 9, cv2.INPAINT_TELEA)
    im = Image.fromarray(cv2.cvtColor(src, cv2.COLOR_BGR2RGB))
    im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
    if mode == "full":
        im.save(f"public/img/story/{name}.jpg", quality=92); print(name, im.size); continue
    if sess is None:
        from rembg import remove, new_session
        sess = new_session("isnet-general-use")
    from rembg import remove
    o = remove(im, session=sess, post_process_mask=True)
    o = o.crop(o.getbbox()); o.save(f"public/img/story/{name}-cut.png", optimize=True); print(name, o.size)
