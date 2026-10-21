"""Derive local-only web faces from the supplied MS Gothic bitmap strikes.

Requires fonttools and brotli. Source and outputs stay in the ignored private
font folder. This does not install fonts or grant redistribution rights.
Run: python scripts/derive_gothic_bitmaps.py
"""
from pathlib import Path
from fontTools.ttLib import TTCollection
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / 'resources/fonts/private'
SOURCE = FOLDER / 'msgothic.ttc'
font = TTCollection(SOURCE).fonts[0]
assert font['name'].getDebugName(1) == 'MS Gothic'
cmap = font.getBestCmap()
receipts = []
for strike_index, strike in enumerate(font['EBLC'].strikes):
    size = strike.bitmapSizeTable.ppemY
    assert strike.bitmapSizeTable.bitDepth == 1
    bitmaps = font['EBDT'].strikeData[strike_index]
    # Latin UI text only. Other scripts and symbols retain the original face.
    mapping = {c: name for c, name in cmap.items() if 32 <= c <= 126 and name in bitmaps}
    order = ['.notdef', *dict.fromkeys(mapping.values())]
    glyphs, metrics = {}, {}
    for name in order:
        pen = TTGlyphPen(None)
        if name == '.notdef':
            metrics[name] = (size * 32, 0)
        else:
            glyph = bitmaps[name]
            glyph.ensureDecompiled()
            metric = getattr(glyph, 'metrics', None)
            if metric is None:
                table = next(t for t in strike.indexSubTables if name in t.names)
                metric = table.metrics
            width, height = metric.width, metric.height
            bearing_x, bearing_y = metric.horiBearingX, metric.horiBearingY
            for y in range(height):
                row = glyph.getRow(y, metrics=metric)
                for x in range(width):
                    if row[x // 8] & (0x80 >> (x % 8)):
                        left, top = (bearing_x + x) * 64, (bearing_y - y) * 64
                        pen.moveTo((left, top)); pen.lineTo((left + 64, top))
                        pen.lineTo((left + 64, top - 64)); pen.lineTo((left, top - 64)); pen.closePath()
            metrics[name] = (metric.horiAdvance * 64, bearing_x * 64)
        glyphs[name] = pen.glyph()
    builder = FontBuilder(size * 64, isTTF=True)
    builder.setupGlyphOrder(order)
    builder.setupCharacterMap(mapping)
    builder.setupGlyf(glyphs)
    builder.setupHorizontalMetrics(metrics)
    ascent = strike.bitmapSizeTable.hori.ascender * 64
    descent = strike.bitmapSizeTable.hori.descender * 64
    builder.setupHorizontalHeader(ascent=ascent, descent=descent)
    builder.setupNameTable({'familyName': f'OOPS Gothic Bitmap {size}', 'styleName': 'Regular',
                           'uniqueFontIdentifier': f'OOPS-private-gothic-bitmap-{size}',
                           'fullName': f'OOPS Gothic Bitmap {size}', 'psName': f'OOPSGothicBitmap{size}',
                           'copyright': 'Derived from locally supplied MS Gothic. Original font rights retained. Local use only.'})
    builder.setupOS2(sTypoAscender=ascent, sTypoDescender=descent, usWinAscent=ascent, usWinDescent=-descent)
    builder.setupPost()
    builder.setupMaxp()
    builder.font.flavor = 'woff2'
    out = FOLDER / f'gothic-bitmap-{size}.woff2'
    builder.save(out)
    receipts.append({'size': size, 'glyphs': len(mapping), 'file': out.name,
                     'sha256': hashlib.sha256(out.read_bytes()).hexdigest()})
(FOLDER / 'bitmap-receipt.json').write_text(json.dumps({'source_sha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(), 'faces': receipts}, indent=2))
print(f'Derived {len(receipts)} private bitmap faces, preserving the original font.')
