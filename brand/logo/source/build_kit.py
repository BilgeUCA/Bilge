"""BILGE logo — master artwork generator (Book Peaks).

Run:  python build_kit.py   → writes ../master/*.svg

Construction (256-unit symbol grid):
  - Two pages = two mirrored quadrilaterals: apex A, spine-top S1, outer corner O, spine-bottom S2.
  - Inner page edge (A→S1) is exactly 60°; bottom edge (O→S2) is exactly 15° (the open-book tilt).
  - Spine = negative gap between the pages. Sun = circle sitting in the valley with equal
    clearance to both inner edges.
  - Wordmark "bilge": geometric lowercase built from one stroke weight (26 u), rings overshoot
    the x-height by 1.5 u; all letters are filled outlines (no live text, no strokes).
"""
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "master")
os.makedirs(OUT, exist_ok=True)

BLUE = "#2563EB"   # Bilge Blue (matches the app's --color-primary)
SUN = "#F59E0B"    # Kun Amber
INK = "#111827"    # Ink (gray-900)
WHITE = "#FFFFFF"

T60, T15 = math.tan(math.radians(60)), math.tan(math.radians(15))


def f(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


# ---------------------------------------------------------------- symbol
def symbol(page=BLUE, sun=SUN, gap=8.0, sun_r=18.0, sun_clear=12.0, scale=1.0, oy=-6.0):
    """Return SVG body for the symbol on a 256 canvas.

    gap       spine width (negative space between pages)
    sun_r     sun radius; sun_clear = clearance to the inner page edges
    scale     scales the drawing about the canvas centre (used by the small-size cut)
    """
    half = gap / 2
    ax, ay = 80.0, 50.0 + oy                    # apex
    s1x = 128 - half                            # spine x (left page)
    s1y = ay + (s1x - ax) * T60                 # 60° inner edge
    ox, oyy = 20.0, 186.0 + oy                  # outer bottom corner
    s2y = oyy + (s1x - ox) * T15                # 15° bottom edge
    left = [(ax, ay), (s1x, s1y), (s1x, s2y), (ox, oyy)]
    right = [(256 - x, y) for x, y in left]
    # sun centre: on the axis, distance to the 60° line == sun_r + sun_clear
    # signed distance from (128, y) to line through A with dir (cos60, sin60)
    d = sun_r + sun_clear
    sy = ay + ((128 - ax) * math.sin(math.radians(60)) - d) / math.cos(math.radians(60))

    def tf(x, y):
        return 128 + (x - 128) * scale, 128 + (y - 128) * scale

    def poly(pts):
        pts = [tf(*p) for p in pts]
        return "M" + "L".join(f"{f(x)},{f(y)}" for x, y in pts) + "Z"

    cx, cy = tf(128, sy)
    r = sun_r * scale
    return (f'<path fill="{page}" d="{poly(left)}{poly(right)}"/>'
            f'<circle fill="{sun}" cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}"/>')


# ---------------------------------------------------------------- wordmark
W = 26.0            # stroke weight
B, XH = 180.0, 110.0
ASC = 30.0
CY = B - XH / 2
RO = XH / 2 + 1.5   # ring outer radius incl. overshoot
RI = RO - W
SP_ROUND = 22.0     # round-to-stem / round-to-round spacing
SP_STEM = 28.0      # stem-to-stem spacing


def ring(cx, cy):
    return "R" + (f"M{f(cx-RO)},{f(cy)}a{f(RO)},{f(RO)} 0 1,0 {f(2*RO)},0a{f(RO)},{f(RO)} 0 1,0 {f(-2*RO)},0Z"
            f"M{f(cx-RI)},{f(cy)}a{f(RI)},{f(RI)} 0 1,0 {f(2*RI)},0a{f(RI)},{f(RI)} 0 1,0 {f(-2*RI)},0Z")


def rect(x, y, w, h):
    return f"M{f(x)},{f(y)}h{f(w)}v{f(h)}h{f(-w)}Z"


def pt(cx, cy, r, deg):
    a = math.radians(deg)
    return cx + r * math.cos(a), cy + r * math.sin(a)


def wordmark():
    """Return (path d, width, (ymin, ymax)) for 'bilge'."""
    d = []
    # b
    bx = 30.0                                  # stem left edge
    d.append(rect(bx, ASC, W, B - ASC))
    bcx = bx + RO
    d.append(ring(bcx, CY))
    # i
    ix = bcx + RO + SP_ROUND
    d.append(rect(ix, B - XH, W, XH))
    dot_r = W / 2 + 1.5
    d.append(f"M{f(ix+W/2-dot_r)},{f(ASC+dot_r)}a{f(dot_r)},{f(dot_r)} 0 1,0 {f(2*dot_r)},0"
             f"a{f(dot_r)},{f(dot_r)} 0 1,0 {f(-2*dot_r)},0Z")
    # l
    lx = ix + W + SP_STEM
    d.append(rect(lx, ASC, W, B - ASC))
    # g
    gcx = lx + W + SP_ROUND + RO
    d.append(ring(gcx, CY))
    gx = gcx + RO - W                          # stem left edge
    hy = B + 10
    d.append(rect(gx, B - XH, W, hy - (B - XH)))
    hcx = gx + W - RO                          # hook centre so hook's outer edge meets stem
    o0, o1 = pt(hcx, hy, RO, -4), pt(hcx, hy, RO, 160)
    i1, i0 = pt(hcx, hy, RI, 160), pt(hcx, hy, RI, -4)
    d.append(f"M{f(o0[0])},{f(o0[1])}A{f(RO)},{f(RO)} 0 0,1 {f(o1[0])},{f(o1[1])}"
             f"L{f(i1[0])},{f(i1[1])}A{f(RI)},{f(RI)} 0 0,0 {f(i0[0])},{f(i0[1])}Z")
    # e
    ecx = gx + W + SP_ROUND + RO
    a0o, a1o = pt(ecx, CY, RO, 0), pt(ecx, CY, RO, 45)
    a1i, a0i = pt(ecx, CY, RI, 45), pt(ecx, CY, RI, 0)
    d.append(f"M{f(a0o[0])},{f(a0o[1])}A{f(RO)},{f(RO)} 0 1,0 {f(a1o[0])},{f(a1o[1])}"
             f"L{f(a1i[0])},{f(a1i[1])}A{f(RI)},{f(RI)} 0 1,1 {f(a0i[0])},{f(a0i[1])}Z")
    # crossbar: flush with the outer contour on the right
    bx_end = math.sqrt(RO**2 - (W / 2) ** 2)
    d.append(f"M{f(ecx-RO+W/2)},{f(CY-W/2)}H{f(ecx+bx_end)}"
             f"A{f(RO)},{f(RO)} 0 0,1 {f(ecx+bx_end)},{f(CY+W/2)}H{f(ecx-RO+W/2)}Z")
    width = ecx + RO + 30
    return d, width, (ASC, hy + RO)


# ---------------------------------------------------------------- files
def write(name, w, h, body, x0=0, y0=0, title="BILGE logo"):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{f(x0)} {f(y0)} {f(w)} {f(h)}" '
           f'width="{f(w)}" height="{f(h)}" role="img" aria-label="{title}"><title>{title}</title>'
           f'{body}</svg>\n')
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
        fh.write(svg)


WM_D, WM_W, (WM_Y0, WM_Y1) = wordmark()
PAD = 8


def wm(ink, x=0.0, y=0.0, s=1.0):
    parts = "".join(f'<path fill-rule="evenodd" d="{p[1:]}"/>' if p[0] == "R" else f'<path d="{p}"/>'
                    for p in WM_D)
    return f'<g fill="{ink}" transform="translate({f(x)},{f(y)}) scale({f(s)})">{parts}</g>'


def sym(x, y, s, **kw):
    return f'<g transform="translate({f(x)},{f(y)}) scale({f(s)})">{symbol(**kw)}</g>'


# symbol extents on its 256 canvas (for tight lockups)
SYM_X0, SYM_X1, SYM_Y0, SYM_Y1 = 20.0, 236.0, 44.0, 207.87


def horizontal(page, sun, ink, **kw):
    # symbol: apex sits 3 u above the ascender (overshoot of the points), spine bottom ~ baseline + 2
    s = (B + 2 - (ASC - 3)) / (SYM_Y1 - SYM_Y0)
    sx = -SYM_X0 * s
    sy = (ASC - 3) - SYM_Y0 * s
    gap = 52
    wx = (SYM_X1 - SYM_X0) * s + gap - 30   # wordmark has 30 u left bearing
    body = sym(sx, sy, s, page=page, sun=sun, **kw) + wm(ink, wx, 0)
    x1 = wx + WM_W - 30
    return body, (-PAD, ASC - 3 - PAD, x1 + 2 * PAD, (WM_Y1 + PAD) - (ASC - 3 - PAD))


def stacked(page, sun, ink, **kw):
    s = 1.25
    sw = (SYM_X1 - SYM_X0) * s
    wmw = WM_W - 60
    total = max(sw, wmw)
    sx = (total - sw) / 2 - SYM_X0 * s
    sy = -SYM_Y0 * s
    sym_h = (SYM_Y1 - SYM_Y0) * s
    wy = sym_h + 40 - ASC
    wx = (total - wmw) / 2 - 30
    body = sym(sx, sy, s, page=page, sun=sun, **kw) + wm(ink, wx, wy)
    return body, (-PAD, -PAD, total + 2 * PAD, wy + WM_Y1 + 2 * PAD)


VERSIONS = {
    # name: (page, sun, ink, symbol tweaks)
    "": (BLUE, SUN, INK, {}),
    "-reversed": (WHITE, SUN, WHITE, {"gap": 10, "sun_r": 17.5, "sun_clear": 13}),   # thinned for dark bg
}

for suffix, (page, sun, ink, kw) in VERSIONS.items():
    write(f"bilge-symbol{suffix}.svg", 256, 256, symbol(page, sun, **kw))
    body, vb = horizontal(page, sun, ink, **kw)
    write(f"bilge-horizontal{suffix}.svg", vb[2], vb[3], body, vb[0], vb[1])
    body, vb = stacked(page, sun, ink, **kw)
    write(f"bilge-stacked{suffix}.svg", vb[2], vb[3], body, vb[0], vb[1])
    write(f"bilge-wordmark{suffix}.svg", WM_W - 60 + 2 * PAD, WM_Y1 - WM_Y0 + 2 * PAD,
          wm(ink), 30 - PAD, WM_Y0 - PAD)

# small-size cut: wider spine, bigger sun, drawn larger on the canvas (used for favicon / app icon)
write("bilge-symbol-small.svg", 256, 256,
      symbol(BLUE, SUN, gap=18, sun_r=21, sun_clear=13, scale=1.12, oy=-4))
# on-tile artwork for presentation mockups (white pages + amber sun on blue)
write("bilge-symbol-on-tile.svg", 256, 256, symbol(WHITE, SUN, gap=10, sun_r=17.5, sun_clear=13))
body, vb = stacked(WHITE, SUN, WHITE, gap=10, sun_r=17.5, sun_clear=13)
write("bilge-stacked-on-tile.svg", vb[2], vb[3], body, vb[0], vb[1])
print("masters written to", os.path.normpath(OUT))
# small-size cut on a blue tile (app icon / PWA icons)
write("bilge-symbol-small-on-tile.svg", 256, 256,
      symbol(WHITE, SUN, gap=18, sun_r=21, sun_clear=13, scale=1.12, oy=-4))
