# Measure how a generated clip maps its start frame: per box, find where the capture's box patch lands in
# the clip's first and last frames (both upscaled to 1920x1080), then fit video = s*capture + t per axis.
# Usage (needs numpy and Pillow): python3 measure-clip.py first.png last.png, with frame-build.png in the cwd.
# C holds the box centres in the capture (camera px at 1920x1080, from boxesLayout DESKTOP).
import sys, numpy as np
from PIL import Image
cap = np.asarray(Image.open('frame-build.png').convert('L'), dtype=float)
C = {'microsoft': (902, 200), 'slack': (1498, 380), 'hubspot': (1690, 620), 'fortnox': (1459, 860), 'claude': (211, 860), 'chatgpt': (211, 580), 'notion': (346, 320)}
def match(frame, cx, cy, half=70, R=40):
    tb = cap[cy-half:cy+half, cx-half:cx+half]; best = None
    for dy in range(-R, R+1):
        for dx in range(-R, R+1):
            ta = frame[cy-half+dy:cy+half+dy, cx-half+dx:cx+half+dx]
            if ta.shape != tb.shape: continue
            e = np.mean(np.abs(ta-tb))
            if best is None or e < best[0]: best = (e, dx, dy)
    return best
for path in sys.argv[1:]:
    fr = np.asarray(Image.open(path).convert('L').resize((1920, 1080), Image.BICUBIC), dtype=float)
    pts = {k: match(fr, *v) for k, v in C.items()}
    xs = np.array([C[k][0] for k in C]); ys = np.array([C[k][1] for k in C])
    vx = xs + np.array([pts[k][1] for k in C]); vy = ys + np.array([pts[k][2] for k in C])
    sx, tx = np.polyfit(xs, vx, 1); sy, ty = np.polyfit(ys, vy, 1)
    rx = vx - (sx*xs+tx); ry = vy - (sy*ys+ty)
    print(path, {k: (v[1], v[2], round(v[0], 1)) for k, v in pts.items()})
    print(f'  sx={sx:.4f} tx={tx:.2f} sy={sy:.4f} ty={ty:.2f}  max resid x {abs(rx).max():.2f} y {abs(ry).max():.2f}')
    print(f'  CSS: translate({-tx/sx/19.2:.3f}%, {-ty/sy/10.8:.3f}%) scale({1/sx:.4f}, {1/sy:.4f})')
