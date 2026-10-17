# R20 before | after side-by-side PNGs from evidence/r20/{before,after}/<case>.png.
# Usage: python3 build-r20-comparison.py [case ...]
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
e = Path(__file__).parent / 'evidence/r20'
cases = sys.argv[1:] or sorted(p.stem for p in (e / 'after').glob('*.png') if (e / 'before' / p.name).exists())
font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 28)
for case in cases:
    a, b = Image.open(e / 'before' / f'{case}.png'), Image.open(e / 'after' / f'{case}.png')
    out = Image.new('RGB', (a.width + b.width + 24, max(a.height, b.height) + 48), (16, 24, 39))
    out.paste(a, (0, 48)); out.paste(b, (a.width + 24, 48))
    d = ImageDraw.Draw(out)
    d.text((8, 8), f'Before: R17 shell  ·  {case}', fill=(232, 240, 245), font=font)
    d.text((a.width + 32, 8), f'After: R20 opponent board  ·  {case}', fill=(232, 240, 245), font=font)
    out.save(e / f'compare-{case}.png')
    print('wrote', f'compare-{case}.png')
