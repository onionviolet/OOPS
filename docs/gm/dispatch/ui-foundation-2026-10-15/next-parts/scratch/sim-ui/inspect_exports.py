"""SI adaptation of CY inspect_exports.py: captured text contrast and uncropped sheets."""
from pathlib import Path
import json, re, math
from PIL import Image, ImageDraw
HERE=Path(__file__).resolve().parent
receipt=json.loads((HERE/'render-receipt.json').read_text())
lookup=[x/255/12.92 if x/255<=.04045 else ((x/255+.055)/1.055)**2.4 for x in range(256)]
def lum(a):return lookup[a[0]]*.2126+lookup[a[1]]*.7152+lookup[a[2]]*.0722
for scene in receipt['results']:
    bg=Image.open(HERE/(scene['id']+'-background.png')).convert('RGB');samples=[]
    for r in scene['observed']['rects']:
        x0,y0=max(0,math.ceil(r['x'])),max(0,math.ceil(r['y']))
        x1,y1=min(bg.width,math.floor(r['right'])),min(bg.height,math.floor(r['bottom']))
        if x1<=x0 or y1<=y0:continue
        rgb=tuple(int(float(x)) for x in re.findall(r'[\d.]+',r['color'])[:3]);fg=lum(rgb)
        colors=bg.crop((x0,y0,x1,y1)).getcolors((x1-x0)*(y1-y0))
        ratios=[(max(fg,lum(c))+.05)/(min(fg,lum(c))+.05) for count,c in colors]
        samples.append(dict(text=r['text'],font=r['font'],minimumRatio=round(min(ratios),3)))
    scene['pixelContrast']=dict(method='Minimum captured text color contrast across visible layout rectangles on text-transparent composited background',minimum=min(s['minimumRatio'] for s in samples),samples=samples)
receipt['minimumTextContrast']=min(r['pixelContrast']['minimum'] for r in receipt['results'])
receipt['contrastBelow45']=[dict(id=r['id'],samples=[s for s in r['pixelContrast']['samples'] if s['minimumRatio']<4.5]) for r in receipt['results'] if r['pixelContrast']['minimum']<4.5]
(HERE/'render-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
for size in [14,21]:
    scenes=[r for r in receipt['results'] if r['size']==size and r['viewport'][0]==1366 and not r['grade']]
    sheet=Image.new('RGB',(1200,480*((len(scenes)+1)//2)),'#10131d');d=ImageDraw.Draw(sheet)
    for i,s in enumerate(scenes):
        f=s['observed']['host'];crop=Image.open(HERE/s['png']).crop((int(f['x']),int(f['y']),math.ceil(f['right']),math.ceil(f['bottom'])))
        crop.thumbnail((576,438));x=(i%2)*600;y=(i//2)*480
        d.text((x+10,y+8),s['id'],fill='#f4f0ff');sheet.paste(crop,(x+(600-crop.width)//2,y+34))
    sheet.save(HERE/f'contact-sheet-{size}.png')
summary={k:v for k,v in receipt.items() if k!='results'}
print(json.dumps(summary,indent=2))
