"""Sample actual composited reading backgrounds and make a review contact sheet."""
from pathlib import Path
import json, re, math
from PIL import Image, ImageDraw
HERE=Path(__file__).resolve().parent
receipt=json.loads((HERE/'render-receipt.json').read_text())
lookup=[x/255/12.92 if x/255<=.04045 else ((x/255+.055)/1.055)**2.4 for x in range(256)]
def lum(a):return lookup[a[0]]*.2126+lookup[a[1]]*.7152+lookup[a[2]]*.0722
for scene in receipt['results']:
 bg=Image.open(HERE/(scene['id']+'-background.png')).convert('RGB')
 samples=[]
 for r in scene['observed']['rects']:
  # Full glyph layout rectangle, intersected with the visible reading scroller.
  x0,y0=max(0,math.ceil(r['x'])),max(0,math.ceil(r['y']))
  x1,y1=min(bg.width,math.floor(r['right'])),min(bg.height,math.floor(r['bottom']))
  if x1<=x0 or y1<=y0:continue
  rgb=tuple(int(float(x)) for x in re.findall(r'[\d.]+',r['color'])[:3])
  fg=lum(rgb); pixels=(x1-x0)*(y1-y0); colors=bg.crop((x0,y0,x1,y1)).getcolors(pixels)
  ratios=[(max(fg,lum(c))+.05)/(min(fg,lum(c))+.05) for count,c in colors]
  samples.append(dict(text=r['text'],font=r['font'],minimumRatio=round(min(ratios),3),backgroundPixels=pixels))
 scene['pixelContrast']=dict(method='Minimum contrast over every pixel in each visible text layout rectangle on text-fill-transparent screenshot; gradients, grid and SVG remain. This covers captured text only.',minimum=min(s['minimumRatio'] for s in samples),samples=samples)
receipt['allAwakeningActionsVisible']=all(r['observed'].get('awakeningActionsVisible') is True for r in receipt['results'] if r['surface']=='awakening')
receipt['clipping']=[dict(id=r['id'],notice=r['observed']['noticeClipped'],x=r['observed']['horizontalOverflow']) for r in receipt['results'] if r['observed'].get('awakeningActionsVisible') is False or r['observed']['noticeClipped'] or r['observed']['foreignOverflowX'] or r['observed']['horizontalOverflow']]
receipt['minimumTextContrast']=min(r['pixelContrast']['minimum'] for r in receipt['results'])
receipt['contrastBelow45']=[dict(id=r['id'],samples=[s for s in r['pixelContrast']['samples'] if s['minimumRatio']<4.5]) for r in receipt['results'] if r['pixelContrast']['minimum']<4.5]
(HERE/'render-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
# Every family/surface at 14px, enlarged contribution crops plus shell overview on full exports.
chosen=[r for r in receipt['results'] if r['size']==14 and r['surface'] in ['popup','notice','center']]
w,h=500,400
sheet=Image.new('RGB',(w*3,h*6),'#10131d'); draw=ImageDraw.Draw(sheet)
for i,s in enumerate(chosen):
 img=Image.open(HERE/s['png']).convert('RGB'); f=s['observed']['foreign'];
 box=(int(f['x'])-8,int(f['y'])-8,int(f['right'])+8,int(f['bottom'])+8)
 crop=img.crop(box);crop.thumbnail((w-24,h-50))
 x=(i%3)*w;y=(i//3)*h
 draw.text((x+12,y+10),s['id'],fill='#f5f4ee')
 sheet.paste(crop,(x+(w-crop.width)//2,y+40))
sheet.save(HERE/'contact-sheet.png')
for size_tag, selection in [('21',[r for r in receipt['results'] if r['size']==21 and r['viewport'][0]==1366 and r['surface'] in ['popup','notice','center'] and r['appearance']=='authored']),('wide',[r for r in receipt['results'] if r['viewport'][0]==1920])]:
 extra=Image.new('RGB',(1500,400*((len(selection)+2)//3)),'#10131d'); edraw=ImageDraw.Draw(extra)
 for i,s in enumerate(selection):
  f=s['observed']['foreign']; crop=Image.open(HERE/s['png']).crop((int(f['x'])-5,int(f['y'])-5,int(f['right'])+5,int(f['bottom'])+5));crop.thumbnail((476,350))
  x=(i%3)*500;y=(i//3)*400;edraw.text((x+10,y+10),s['id'],fill='#f5f4ee');extra.paste(crop,(x+(500-crop.width)//2,y+40))
 extra.save(HERE/f'contact-sheet-{size_tag}.png')
print(json.dumps({k:receipt[k] for k in ['count','allTargetSize','allForeignClearOfReports','allAwakeningActionsVisible','allNoScripts','allMotionless','minimumTextContrast','clipping','contrastBelow45','errors']},indent=2))
