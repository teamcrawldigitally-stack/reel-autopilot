# full pictures (with their own background): paint out the Gemini mark, 2x, save jpg
import sys, cv2, numpy as np
for name in sys.argv[1:]:
    im = cv2.imread(f"raw/{name}.png")
    mask = np.zeros(im.shape[:2], np.uint8); mask[905:965, 452:512] = 255
    im = cv2.inpaint(im, mask, 9, cv2.INPAINT_TELEA)
    im = cv2.resize(im, (im.shape[1] * 2, im.shape[0] * 2), interpolation=cv2.INTER_LANCZOS4)
    cv2.imwrite(f"{name}.jpg", im, [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(name, im.shape)
