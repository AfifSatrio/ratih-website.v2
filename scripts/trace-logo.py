"""Rebuild the SVG from frame_005.jpg. Requires Pillow and vtracer==1.0.0a4.

Run: python scripts/trace-logo.py
The other frames are retained as references for the reveal timing.
"""
from pathlib import Path
import re
import tempfile
import xml.etree.ElementTree as ET

from PIL import Image
import vtracer

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public/images/ratih"
image = Image.open(ASSETS / "references/frame_005.jpg").convert("RGB")
width, height = image.size


def trace(kind):
    mask = Image.new("RGB", image.size, "white")
    pixels = image.load()
    output = mask.load()
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            white = min(r, g, b) > 160
            yellow = r > 180 and g > 120 and b < 120
            selected = (kind == "white" and white and y < 750) or \
                       (kind == "yellow" and yellow and y < 750) or \
                       (kind == "text" and white and y >= 750)
            if selected:
                output[x, y] = (0, 0, 0)
    with tempfile.TemporaryDirectory() as directory:
        source = Path(directory) / "mask.png"
        target = Path(directory) / "trace.svg"
        mask.save(source)
        config = vtracer.Config.bw()
        config.mode = "spline"
        config.filter_speckle = 12
        config.corner_threshold = 60
        config.length_threshold = 4
        config.splice_threshold = 45
        config.path_precision = 2
        config.convert_file(str(source), str(target))
        paths = []
        for element in ET.parse(target).getroot().iter():
            if element.tag.endswith("}path") or element.tag == "path":
                paths.append({"d": element.attrib["d"],
                              "transform": element.attrib.get("transform", "")})
        return sorted(paths, key=lambda p: float(re.search(r"[-\d.]+", p["transform"])[0]) if p["transform"] else 0)


def path_markup(path, css="", fill=""):
    return f'<path class="{css}" d="{path["d"]}" transform="{path["transform"]}"' + (f' fill="{fill}"' if fill else '') + '/>'


white, yellow, text = trace("white"), trace("yellow"), trace("text")
parts = ['''<svg xmlns="http://www.w3.org/2000/svg" class="reveal-art" viewBox="0 0 1080 1080" role="img" aria-labelledby="logo-title">
<title id="logo-title">Ratih Creative — logo putih dengan aksen kuning</title>
<!-- Vectorized from references/frame_005.jpg with scripts/trace-logo.py. -->
<defs><radialGradient id="backdrop"><stop offset="0" stop-color="#101117"/><stop offset="1" stop-color="#08090c"/></radialGradient></defs>
<rect width="1080" height="1080" fill="url(#backdrop)"/>
<g class="construction" opacity="0" stroke="#444951" stroke-width="1">''']
for x in [264, 564, 820]:
    parts.append(f'<line x1="{x}" y1="180" x2="{x}" y2="774"/>')
for y in [213, 415, 710]:
    parts.append(f'<line x1="215" y1="{y}" x2="865" y2="{y}"/>')
parts.append('</g>')
for paths, color in [(white, "#fff"), (yellow, "#ffc329")]:
    parts.extend(path_markup(p, "logo-fill", color) for p in paths)
parts.append('<g fill="none" stroke="#d7d8da" stroke-width="1.2" stroke-linejoin="round">')
parts.extend(path_markup(p, "logo-outline") for p in white + yellow)
parts.append('</g><g class="creative-word" fill="#fff" aria-hidden="true">')
# Animate wrappers so original traced positions are never overwritten.
parts.extend('<g class="creative-letter">' + path_markup(p) + '</g>' for p in text)
parts.append('</g></svg>')
(ASSETS / "ratih-creative.svg").write_text("\n".join(parts) + "\n")
print(f"Traced {len(white)} white shapes, {len(yellow)} yellow shapes, {len(text)} letters.")
