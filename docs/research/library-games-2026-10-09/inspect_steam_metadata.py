"""Read only the assigned app metadata and manifests; never touch saves/config."""
from pathlib import Path
import struct,json,hashlib,datetime
APPS=[3848900,4522510,3795920,2847400,3606890,1740540,1812820]
steam=Path.home()/'Library/Application Support/Steam'
blob=(steam/'appcache/appinfo.vdf').read_bytes()
class Cursor:
 def __init__(self,p): self.p=p
 def u(self,fmt):
  n=struct.calcsize(fmt); v=struct.unpack_from(fmt,blob,self.p)[0];self.p+=n;return v
 def string(self):
  end=blob.index(0,self.p);s=blob[self.p:end].decode('utf-8',errors='replace');self.p=end+1;return s
magic=struct.unpack_from('<I',blob)[0]
assert magic==0x07564429, 'Reader qualified only for v29'
cur=Cursor(struct.unpack_from('<Q',blob,8)[0]);table=[cur.string() for _ in range(cur.u('<I'))]
def section(c):
 out={}
 while True:
  t=c.u('<B')
  if t in (8,11):return out
  k=table[c.u('<I')]
  if t==0:v=section(c)
  elif t==1:v=c.string()
  elif t==2:v=c.u('<i')
  elif t in (7,10):v=c.u('<q')
  elif t in (3,4,6):c.p+=4;v='<uninterpreted 4-byte value>'
  elif t==5:
   start=c.p
   while blob[c.p:c.p+2]!=b'\0\0':c.p+=2
   v=blob[start:c.p].decode('utf-16le',errors='replace');c.p+=2
  else:raise ValueError(f'unknown binary VDF type {t}')
  out[k]=v
rows=[];p=16
while p+8<=len(blob):
 i,size=struct.unpack_from('<II',blob,p)
 if i==0:break
 if i in APPS:
  raw=section(Cursor(p+68)); app=raw.get('appinfo',raw)
  rows.append({'appid':i,'common':{k:app.get('common',{}).get(k) for k in ['name','oslist','type']},'config':app.get('config'),'depots':app.get('depots'),'sections':list(app)})
 p+=8+size
out={'captured_at':datetime.datetime.now().astimezone().isoformat(),'source_sha256':hashlib.sha256(blob).hexdigest(),'reader_basis':'Read-only port of Neutron helpers/appinfo.swift v29 parser, sections scoped to assigned IDs. App cache does not prove ownership.','apps':rows,'missing':[i for i in APPS if i not in {x['appid'] for x in rows}],'manifests':{str(i):(steam/f'steamapps/appmanifest_{i}.acf').exists() for i in APPS}}
Path(__file__).with_name('STEAM_METADATA.json').write_text(json.dumps(out,indent=2)+'\n')
for r in rows:print(r['appid'],r['common'],'sections',r['sections'],'config',r['config'],'depot_keys',list((r['depots'] or {})))
print('Missing',out['missing'],'manifests',out['manifests'])
