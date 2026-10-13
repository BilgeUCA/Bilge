import math, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
INK = "#111"

def svg(w, h, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">\n{body}\n</svg>\n'

def star(cx, cy, ro, ri):
    pts = []
    for k in range(8):
        a = math.radians(-90 + k * 45)
        r = ro if k % 2 == 0 else ri
        pts.append(f"{cx + r*math.cos(a):.2f},{cy + r*math.sin(a):.2f}")
    return f'<polygon points="{" ".join(pts)}" fill="{INK}"/>'

# ---------- A: Tunduk b ----------
def sym_a():
    cx, cy, R, r = 128, 164, 64, 34
    ring = (f'<path fill-rule="evenodd" fill="{INK}" d="M{cx-R},{cy}a{R},{R} 0 1,0 {2*R},0a{R},{R} 0 1,0 {-2*R},0z'
            f'M{cx-r},{cy}a{r},{r} 0 1,0 {2*r},0a{r},{r} 0 1,0 {-2*r},0z"/>')
    stem = f'<rect x="64" y="28" width="30" height="{cy-28}" fill="{INK}"/>'
    bars = []
    L = 40  # slat half-length; ends bury into the ring band
    for o in (-12, 12):
        d = o / 2 ** 0.5
        for sx in (1, -1):  # two crossed sets at +/-45 deg
            ux, uy = 0.7071 * sx, 0.7071
            px, py = -uy * o, ux * o
            bars.append(f'M{cx+px-ux*L:.2f},{cy+py-uy*L:.2f}L{cx+px+ux*L:.2f},{cy+py+uy*L:.2f}')
    lat = f'<path d="{" ".join(bars)}" fill="none" stroke="{INK}" stroke-width="9"/>'
    return stem + ring + lat

# ---------- B: Book-peaks with sun ----------
def sym_b():
    left = [(124, 132), (78, 52), (18, 184), (124, 212)]
    right = [(256 - x, y) for x, y in left]
    p = lambda pts: f'<polygon points="{" ".join(f"{x},{y}" for x, y in pts)}" fill="{INK}"/>'
    return p(left) + p(right) + f'<circle cx="128" cy="74" r="18" fill="{INK}"/>'

# ---------- C: Pole-star i ----------
def sym_c():
    return (f'<rect x="106" y="122" width="44" height="106" fill="{INK}"/>' + star(128, 62, 48, 14.34))

# ---------- wordmark "bilge" (geometric, constructed; strokes for exploration) ----------
W = 26
def wordmark(dot="circle"):
    B, xh = 180, 110
    cy, top, asc, r = B - xh / 2, B - xh, 30, (xh - W) / 2
    st = f'fill="none" stroke="{INK}" stroke-width="{W}"'
    out = []
    def circ(cx):
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" {st}/>')
    def stem(x, y0, y1):
        out.append(f'<rect x="{x-W/2}" y="{y0}" width="{W}" height="{y1-y0}" fill="{INK}"/>')
    x = 40
    stem(x, asc, B); circ(x + r)                         # b
    xi = x + 2 * r + W / 2 + 22 + W / 2
    stem(xi, top, B)                                    # i
    if dot == "star":
        out.append(star(xi, 42, 22, 6.57))
    else:
        out.append(f'<circle cx="{xi}" cy="44" r="{W/2+1}" fill="{INK}"/>')
    xl = xi + W + 28
    stem(xl, asc, B)                                     # l
    gcx = xl + W / 2 + 22 + W / 2 + r
    circ(gcx)
    xg = gcx + r
    stem(xg, top, B + 10)                                # g
    hx = xg - r
    ex, ey = hx + r * math.cos(math.radians(160)), B + 10 + r * math.sin(math.radians(160))
    out.append(f'<path d="M{xg},{B+10}A{r},{r} 0 0,1 {ex:.2f},{ey:.2f}" {st}/>')
    ecx = xg + W / 2 + 22 + W / 2 + r                   # e
    e45 = (ecx + r * math.cos(math.radians(42)), cy + r * math.sin(math.radians(42)))
    out.append(f'<path d="M{ecx-r},{cy}H{ecx+r}A{r},{r} 0 1,0 {e45[0]:.2f},{e45[1]:.2f}" {st}/>')
    width = ecx + r + W / 2 + 30
    return "".join(out), width

def lockup(sym, dot):
    wm, ww = wordmark(dot)
    total = 256 + 10 + ww
    body = f'<g>{sym}</g><g transform="translate(266,0)">{wm}</g>'
    return svg(total, 256, body)

for k, f, dot in (("a", sym_a, "circle"), ("b", sym_b, "circle"), ("c", sym_c, "star")):
    open(f"{k}-symbol.svg", "w").write(svg(256, 256, f()))
    open(f"{k}-lockup.svg", "w").write(lockup(f(), dot))
wm, ww = wordmark("star")
open("c-wordmark.svg", "w").write(svg(ww, 256, wm))
print("ok")
