"""Authorized Fandom S3 dumps. Single paced client, private cache, streaming XML selection."""
import pathlib,json,re,urllib.request,urllib.error,urllib.parse,time,random,hashlib,fcntl,os,shutil,xml.etree.ElementTree as ET,io,sys
from datetime import datetime,timezone
OUT=pathlib.Path(__file__).resolve().parent
PRIVATE=pathlib.Path.home()/'.codex/research/wikis'
STATE=PRIVATE/'dump-route-state.json';LEDGER=OUT/'DUMPS.json'
UA='YAIRPG-wiki-research/1.1 (personal research; AI-assisted; Fandom public dumps; no login)'
CAP=1_500_000_000
DISK_FLOOR=4_000_000_000
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args,**kwargs):return None
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}),NoRedirect())
def now():return datetime.now(timezone.utc).isoformat()
def save(p,d):
 q=p.with_suffix(p.suffix+'.tmp');q.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');q.replace(p)
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
def checkpoint(text):
 p=OUT/'CHECKPOINT.md';s=p.read_text();s=s.split('\n## Current dump operation\n')[0];p.write_text(s+'\n## Current dump operation\n\n'+now()+'\n\n'+text+'\n')
def plan():
 a=json.loads((OUT/'ACQUISITION.json').read_text());hosts={}
 for row in a['series']:
  for url in row['urls']:
   h=urllib.parse.urlsplit(url).netloc
   if h.endswith('.fandom.com'):
    item=hosts.setdefault(h,{'wiki':h,'series':[],'wanted':[]})
    if row['title'] not in item['series']:item['series'].append(row['title'])
    title=urllib.parse.unquote(urllib.parse.urlsplit(url).path.split('/wiki/')[-1]).replace('_',' ')
    if title not in item['wanted']:item['wanted'].append(title)
 additions=[('harrypotter.fandom.com','Harry Potter'),('elderscrolls.fandom.com','The Elder Scrolls: Skyrim'),('fallout.fandom.com','Fallout'),('reincarnation-paradise.fandom.com','Reincarnation Paradise'),('stormlightarchive.fandom.com','The Stormlight Archive'),('mistborn.fandom.com','Mistborn')]
 for wiki,series in additions:hosts.setdefault(wiki,{'wiki':wiki,'series':[series],'wanted':[]})
 priority=['jujutsu-kaisen','lordofthemysteries','mother-of-learning','bleach','naruto','harrypotter','eldenring','elderscrolls','fallout','reincarnation-paradise','chainsaw-man','hunterxhunter','undead-unluck','typemoon','stormlightarchive','worm','mistborn','reverend-insanity','omniscient-readers-viewpoint']
 ordered=[]
 for h in priority:
  if h+'.fandom.com' in hosts:ordered.append(hosts.pop(h+'.fandom.com'))
 ordered.extend(hosts.values())
 # Known migration and aliases are named leads, not third guesses. No guessed Cradle fan site.
 for x in ordered:
  name=x['wiki'].split('.')[0];x['dbnames']=list(dict.fromkeys([name.replace('-',''),name]))[:2]
  if name=='eldenring':x['dbnames']=['eldenring','elden-ring']
 return ordered

class Route:
 def __init__(self):
  self.lock=(PRIVATE/'dump-route.lock').open('a');fcntl.flock(self.lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
  self.s=json.loads(STATE.read_text()) if STATE.exists() else {'last_end':0,'requests':{},'stopped':None}
  if self.s.get('pending'):
   self.s['stopped']='Interrupted request with unknown outcome; no automatic retry';save(STATE,self.s)
 def request(self,url,method,folder=None):
  key=method+' '+url
  if key in self.s['requests']:
   r=self.s['requests'][key]
   if r.get('file') and (not pathlib.Path(r['file']).exists() or sha(pathlib.Path(r['file']))!=r['sha256']):raise RuntimeError('Cache integrity failure; no refetch')
   return r
  if self.s['stopped']:raise RuntimeError('S3 route stopped: '+self.s['stopped'])
  if method=='GET' and folder:
   head=self.s['requests'].get('HEAD '+url,{})
   headers={k.lower():v for k,v in head.get('headers',{}).items()}
   length=int(headers.get('content-length','0'))
   free=shutil.disk_usage(PRIVATE).free
   if length<=0:raise RuntimeError('Archive size unknown; no download')
   if length>CAP:raise RuntimeError('Archive exceeds 1.5 GB compressed cap')
   if free-length<DISK_FLOOR:raise RuntimeError(f'Disk floor blocks download: free {free}, archive {length}, floor {DISK_FLOOR}')
  wait=self.s['last_end']+random.uniform(4,8)-time.time()
  if wait>0:time.sleep(wait)
  self.s['pending']={'method':method,'url':url,'started':now()};save(STATE,self.s)
  r={'method':method,'url':url,'started':now()}
  try:
   try:response=opener.open(urllib.request.Request(url,method=method,headers={'User-Agent':UA}),timeout=60)
   except urllib.error.HTTPError as e:response=e
   with response:
    r.update(status=response.status,headers=dict(response.headers))
    if method=='GET' and response.status==200 and folder:
     folder.mkdir(parents=True,exist_ok=True);tmp=folder/'pages-current.xml.7z.part'
     if tmp.exists():raise RuntimeError('Partial archive exists; no refetch')
     count=0;h=hashlib.sha256();tick=time.time()
     with tmp.open('xb') as f:
      for chunk in iter(lambda:response.read(1024*1024),b''):
       count+=len(chunk)
       if count>CAP:raise RuntimeError('Response exceeded compressed size cap')
       f.write(chunk);h.update(chunk)
       if time.time()-tick>25:checkpoint('Downloading '+folder.parent.name+': '+str(count)+' bytes; one request active. No gameplay writes.');tick=time.time()
     expected=int(response.headers.get('Content-Length',count))
     if count!=expected:raise RuntimeError('Truncated archive; keep partial; no retry')
     dest=folder/'pages-current.xml.7z';tmp.replace(dest);r.update(file=str(dest),bytes=count,sha256=h.hexdigest())
    elif method=='GET':
     body=response.read();r['error_body_sha256']=hashlib.sha256(body).hexdigest();r['error_code']=''
     error_folder=folder if folder else PRIVATE/'dump-errors'
     error_folder.mkdir(parents=True,exist_ok=True)
     error_file=error_folder/(hashlib.sha256(key.encode()).hexdigest()[:20]+'.error-body')
     error_file.write_bytes(body);r['error_file']=str(error_file);r['error_body_bytes']=len(body)
     try:r['error_code']=ET.fromstring(body).findtext('Code')
     except ET.ParseError:pass
    if response.status==429 or response.status==503 or response.headers.get('Retry-After') or r.get('error_code') in ['SlowDown','Throttling','ThrottlingException','RequestLimitExceeded']:
     self.s['stopped']='S3 throttling/status '+str(response.status)
    elif response.status not in [200,403,404]:self.s['stopped']='Unexpected S3 response '+str(response.status)
  except Exception as e:
   r['error']=str(e);r['no_retry']=True
  r['finished']=now();self.s['requests'][key]=r;self.s['last_end']=time.time();self.s.pop('pending',None);save(STATE,self.s)
  return r

KEYWORDS=re.compile(r'(?i)\b(?:powers?|techniques?|abilit(?:y|ies)|magic|chakra|haki|nen|devils?|fruits?|zanpak\w*|reiatsu|reiryoku|reishi|spells?|vows?|contracts?|restrictions?|domains?|barriers?|grades?|ranks?|cultivation|sequences?|pathways?|acting|potions?|beyonders?|authority|laws?|lawyers?|courts?|orders?|justice|judges?|oaths?|curses?|cursed|rituals?|souls?|seals?|immortal\w*|fate|alchemy|mana|trion|triggers?|weapons?|artifacts?|equipment|skills?|systems?|bloodlines?|elements?|time loop|loops?|reincarnation|limitations?|shinsu|positions?|sovereigns?|ancient power|dream master|essences?|origins?|probability|grimoires?|negat\w*|shadow extraction|runes?|allomancy|feruchemy|hemalurgy|surgebinding|spren|radiants?|investiture|shards?|geas|heralds?|sacred arts)\b')
EXCLUDE=re.compile(r'(?i)(^chapter|^volume|^episode|synopsis|/history|/synopsis|/(?:image )?gallery|arc$|\bvs\.|soundtrack|^list of characters|^theory:|^user|^forum|^blog|^template|^category|^file|^talk|^sandbox|^quote|^trivia)')
class Selector:
 def __init__(self,folder,item):
  self.folder=folder;self.item=item;self.parser=ET.XMLPullParser(events=('start','end'));self.root=None;self.count=0;self.saved=[];self.index=(folder/'PAGE_INDEX.jsonl').open('w');self.xmlbytes=0;self.site={};self.tick=time.time()
  self.target=set(x.lower() for x in item['wanted'] if not EXCLUDE.search(x))
 def consume(self,data):
  self.xmlbytes+=len(data);self.parser.feed(data)
  for event,e in self.parser.read_events():
   tag=e.tag.split('}')[-1]
   if event=='start' and self.root is None:self.root=e
   if event!='end':continue
   if tag=='siteinfo':
    self.site={c.tag.split('}')[-1]:c.text for c in e if c.tag.split('}')[-1] in ['sitename','base','dbname','generator']};self.root.remove(e)
   if tag!='page':continue
   children={c.tag.split('}')[-1]:c for c in e};title=children.get('title').text or '';ns=children.get('ns');ns=ns.text if ns is not None else '0';rev=children.get('revision');rc={c.tag.split('}')[-1]:c for c in rev} if rev is not None else {};rid=rc.get('id').text if rc.get('id') is not None else None;text=rc.get('text').text or '' if rc.get('text') is not None else '';timestamp=rc.get('timestamp').text if rc.get('timestamp') is not None else None
   self.count+=1;self.index.write(json.dumps({'title':title,'namespace':ns,'revision_id':rid,'chars':len(text)},ensure_ascii=False)+'\n')
   take=(ns=='0' and not EXCLUDE.search(title) and (title.lower() in self.target or KEYWORDS.search(title)))
   # TES scope is Skyrim-only. Titles or category markup must establish Skyrim.
   if self.item['wiki']=='elderscrolls.fandom.com':take=take and ('skyrim' in title.lower() or bool(re.search(r'\[\[Category:[^\]]*Skyrim',text,re.I)))
   if take and (len(self.saved)<400 or title.lower() in self.target):
    if len(self.saved)>=400:
     removable=next((i for i in range(len(self.saved)-1,-1,-1) if self.saved[i]['title'].lower() not in self.target),None)
     if removable is None:continue
     self.saved.pop(removable)
    slug=hashlib.sha256(title.encode()).hexdigest()[:16];p=self.folder/'pages'/(slug+'.json');p.parent.mkdir(exist_ok=True)
    record={'title':title,'revision_id':rid,'timestamp':timestamp,'url':'https://'+self.item['wiki']+'/wiki/'+urllib.parse.quote(title.replace(' ','_'),safe='/:()'),'revision_url':'https://'+self.item['wiki']+'/wiki/'+urllib.parse.quote(title.replace(' ','_'),safe='/:()')+'?oldid='+str(rid),'text_sha256':hashlib.sha256(text.encode()).hexdigest(),'text':text}
    save(p,record);self.saved.append({k:v for k,v in record.items() if k!='text'}|{'private_file':str(p)})
   self.root.remove(e);e.clear()
  if time.time()-self.tick>25:checkpoint('Offline streaming '+self.item['wiki']+': '+str(self.count)+' XML pages scanned; '+str(len(self.saved))+' selected. Raw XML never materialized.');self.tick=time.time()
 def finish(self):
  self.parser.close();self.index.close();result={'state':'selected_offline','site':self.site,'xml_pages_scanned':self.count,'xml_bytes':self.xmlbytes,'selected_pages':self.saved,'selection_limit':400,'selection_policy':'Namespace zero, mechanics titles or named mechanism-bearing pages. Exclude chapter/episode/history/gallery pages. TES additionally requires Skyrim title/category.'};save(self.folder/'SELECTION.json',result);return result

def extract(folder,item):
 import py7zr
 from py7zr.io import Py7zIO,WriterFactory
 if (folder/'SELECTION.json').exists():return json.loads((folder/'SELECTION.json').read_text())
 selector=Selector(folder,item)
 class Writer(Py7zIO):
  def __init__(self):self.pos=0
  def write(self,b):selector.consume(b);self.pos+=len(b);return len(b)
  def read(self,size=None):return b''
  def seek(self,offset,whence=0):
   if offset==0 and whence==0:return 0
   if whence==1 and offset==0:return self.pos
   raise OSError('Streaming sink does not support arbitrary seek')
  def flush(self):pass
  def size(self):return self.pos
 class Factory(WriterFactory):
  def create(self,filename):
   if not filename.endswith('.xml'):raise RuntimeError('Unexpected archive member '+filename)
   return Writer()
 with py7zr.SevenZipFile(folder/'pages-current.xml.7z','r') as z:
  if len(z.getnames())!=1:raise RuntimeError('Expected one XML member; need bounded review')
  z.extractall(factory=Factory())
 return selector.finish()

def main():
 route=Route();items=plan();ledger=json.loads(LEDGER.read_text()) if LEDGER.exists() else {'schema_version':1,'date':'2026-10-10','dump_route':'Fandom offered public S3 database dumps','wikis':{},'non_fandom_gate':'Cradle uses Abidan Archive, no qualified current Fandom wiki found. Other non-Fandom API stops remain unchanged.'};save(LEDGER,ledger)
 # Direct binary dump URLs are specifically authorized. S3 absent-key 403s are naming misses, never wiki challenges.
 for item in (items[:int(sys.argv[2])] if len(sys.argv)>2 and sys.argv[1]=='--limit' else items):
  wiki=item['wiki'];entry=ledger['wikis'].setdefault(wiki,item|{'state':'planned','attempts':[]});folder=PRIVATE/wiki/'dump'
  if entry['state'] in ['review_ready','unavailable_name_guesses','unavailable_two_guesses','skipped_size_cap','skipped_space','dump_unavailable_storage']:continue
  checkpoint('Active S3 acquisition: '+wiki+'. Priority order retained; API hosts remain stopped.')
  if route.s['stopped']:break
  found=None
  for db in item['dbnames']:
   url='https://s3.amazonaws.com/wikia_xml_dumps/'+db[0]+'/'+db[:2]+'/'+db+'_pages_current.xml.7z';head=route.request(url,'HEAD')
   if not any(a['url']==url for a in entry['attempts']):entry['attempts'].append(head)
   save(LEDGER,ledger)
   if head.get('status')==200:found=head;break
   if route.s['stopped']:break
  if not found:entry['state']='route_stopped' if route.s['stopped'] else 'unavailable_name_guesses';save(LEDGER,ledger);print(wiki,entry['state'],flush=True);continue
  length=int(found['headers'].get('Content-Length',found['headers'].get('content-length','0')));entry.update(compressed_bytes=length,url=found['url'],last_modified=found['headers'].get('Last-Modified',found['headers'].get('last-modified')))
  if length<=0:entry['state']='unknown_size_no_download';save(LEDGER,ledger);continue
  if length>CAP:entry['state']='skipped_size_cap';save(LEDGER,ledger);print(wiki,'SKIP_SIZE',length,flush=True);continue
  if shutil.disk_usage(PRIVATE).free-length<DISK_FLOOR:entry['state']='skipped_space';save(LEDGER,ledger);print(wiki,'SKIP_SPACE',length,flush=True);continue
  body=route.request(found['url'],'GET',folder);entry['download']=body
  if not body.get('file'):
   entry['state']='route_stopped' if route.s['stopped'] else 'dump_unavailable_storage';save(LEDGER,ledger)
   if route.s['stopped']:break
   print(wiki,entry['state'],body.get('error_code'),flush=True);continue
  entry['archive_sha256']=body['sha256'];entry['state']='downloaded';save(LEDGER,ledger);save(folder/'DOWNLOAD.json',{k:v for k,v in entry.items() if k not in ['pages']})
  try:
   selection=extract(folder,item);entry.update(state='review_ready',site=selection['site'],xml_pages_scanned=selection['xml_pages_scanned'],xml_bytes=selection['xml_bytes'],pages=selection['selected_pages']);save(LEDGER,ledger);print(wiki,'READY',length,len(entry['pages']),flush=True)
  except Exception as e:entry['state']='extraction_error';entry['error']=str(e);save(LEDGER,ledger);print(wiki,'EXTRACTION_ERROR',str(e),flush=True)
 checkpoint('S3 pass finished or stopped. Ledger: DUMPS.json. Review offline pages next; no blocked-to-covered promotion before evidence review. Route state: '+str(route.s['stopped']))
if __name__=='__main__':
 if (OUT/'full-dumps/INTAKE.json').exists():raise SystemExit('Old capped selection workflow is historical. Use full_dump_reader.py for uncapped coverage. Route remains reusable with enforced 4 GB floor.')
 main()
