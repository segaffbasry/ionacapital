"""Download the live site's own photography and cut it to the sizes the homepage uses.

Every source is a real Kanadevia Inova Capital upload on ionacapital.co.uk (found in the page HTML or in the Elementor
post CSS of the page named in the comment). Originals are cached in _scrape/img/; output goes to public/media/ as
progressive JPEGs at two widths ({name}-1600.jpg / {name}-800.jpg) so the page can serve a srcset. The brand ridge
graphic keeps its transparency as PNG.

Run: python3 scripts/media.py   (needs Pillow)
"""

import os
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "_scrape", "img")
OUT = os.path.join(ROOT, "public", "media")
U = "https://ionacapital.co.uk/wp-content/uploads/"

# name: (upload path, where the live site uses it)
SOURCES = {
    # Full-bleed hero (feedback round 1): the largest real aerial on the site, a wide sky over the Gravel Pit domes.
    "hero": ("2025/01/Gravel-Pit-scaled.jpg", "featured image of the Kanadevia Inova / Iona Capital acquisition article (2560x2335)"),
    "purpose": ("2021/11/Sustainable-Investment-Focus.jpg", "/sustainable-investment-focus/ banner"),
    "bioenergy": ("2021/11/Brocklesby-Biogas-Aerial.jpg", "/bioenergy/ Brocklesby Biogas case study"),
    "efw": ("2021/11/Energy-from-Waste-Bridgwater.jpg", "/energy-from-waste/ Bridgwater Resource Recovery case study"),
    "efficiency": ("2021/11/Energy-Efficiency-1.jpg", "/energy-efficiency/ banner"),
    "portfolio": ("2023/05/crofthead-scaled.jpg", "/about/ banner: Crofthead Biogas, Dumfries"),
    "post-wardley": ("2025/11/Wardley-and-Lower-Drayton.jpg", "homepage article 1 featured image"),
    "post-cothen": ("2025/10/Cothen-Biogas.jpg", "homepage article 2 featured image"),
    "post-gravel-pit": ("2025/01/Gravel-Pit-scaled.jpg", "homepage article 3 featured image"),
    "team": ("2021/07/Iona_Office-22-scaled-e1680193363915.jpg", "/iona-team/ banner: the London office"),
}
RIDGE = ("2025/04/Kanadevia_graphic_element_RGB1920px.png", "homepage hero overlay (post-7.css, .elementor-background-overlay)")


def fetch(path):
    os.makedirs(CACHE, exist_ok=True)
    local = os.path.join(CACHE, os.path.basename(path))
    if not os.path.exists(local):
        req = urllib.request.Request(U + path, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as r, open(local, "wb") as f:
            f.write(r.read())
    return local


WIDTHS = {"hero": (2400, 1600, 800)}  # the full-bleed hero also gets a 2400px cut for large retina screens


def cut(name, path):
    im = Image.open(fetch(path)).convert("RGB")
    for width in WIDTHS.get(name, (1600, 800)):
        out = im.copy()
        if out.width > width:
            out = out.resize((width, round(out.height * width / out.width)), Image.LANCZOS)
        out.save(os.path.join(OUT, f"{name}-{width}.jpg"), "JPEG", quality=80, optimize=True, progressive=True)
    print(f"{name:16} {im.width}x{im.height}  {path}")


os.makedirs(OUT, exist_ok=True)
for name, (path, _) in SOURCES.items():
    cut(name, path)

ridge = Image.open(fetch(RIDGE[0])).convert("RGBA")
ridge.resize((1600, 800), Image.LANCZOS).save(os.path.join(OUT, "ridge.png"), optimize=True)
print("ridge            1920x960 ->1600x800 png")
