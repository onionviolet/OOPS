"""Uncapped offline wiki inventory/read route. No network, no uncited body corpus."""
import pathlib,json,re,gzip,hashlib,xml.etree.ElementTree as ET,sys,datetime,importlib.util,collections
O=pathlib.Path(__file__).resolve().parent;F=O/'full-dumps';P=pathlib.Path.home()/'.codex/research/wikis';D=json.loads((O/'DUMPS.json').read_text())
def utc():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def save(p,x):
 p.parent.mkdir(parents=True,exist_ok=True);tmp=p.with_suffix(p.suffix+'.tmp');tmp.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n');tmp.replace(p)
def hostslug(h):return h.replace('.fandom.com','')
RX=re.compile(r'(?i)\b(power|abilities|ability|techniques?|magic|spells?|curses?|enchant|ritual|contracts?|vows?|oaths?|law|laws|legal|court|justice|authority|rules?|systems?|organizations?|organisations?|factions?|guilds?|clans?|races?|species|biology|physiology|world|cosmology|realms?|dimensions?|planes?|religions?|orders?|deities|gods?|spirits?|souls?|energy|mana|rank|grades?|cultivation|paths?|pathways?|skills?|combat|weapons?|armou?r|artifacts?|artefacts?|equipment|items?|potions?|alchemy|materials|ingredients|haki|nen|zanpak|reiatsu|reiryoku|shinigami|covenants?|shouts?|thu.um|gu|fruit|trion|chakra|effect|mechanics|seals?|knowledge|schools?|institutions?|locations?)\b')
BIO=re.compile(r'(?i)(characters?|individuals?|people|persons?|\bcharacter\b|^person$)')
META=re.compile(r'(?i)(gallery|image gallery|synopsis|soundtrack|episode|chapter|volume|user:|forum:|wiki:|wiki rules|sandbox|transcript|Walkthrough|Story arc)')
POWERS=re.compile(r'(?i)(abilit|power|technique|combat|fighting|skill|body|physiology|biology|equipment|weapon|transformation|spirit|intelligence|strength|weakness|condition|restriction|vow|contract|magic|shout|law|authority|race)')
def stream(wiki,handler):
 import py7zr
 from py7zr.io import Py7zIO,WriterFactory
 archive=pathlib.Path(D['wikis'][wiki]['download']['file'])
 parser=ET.XMLPullParser(events=('start','end'));root=None;site={};n=0
 def consume(b):
  nonlocal root,site,n
  parser.feed(b)
  for event,e in parser.read_events():
   tag=e.tag.split('}')[-1]
   if event=='start' and root is None:root=e
   if event!='end':continue
   if tag=='siteinfo':
    site={c.tag.split('}')[-1]:c.text for c in e if c.tag.split('}')[-1] in ['sitename','base','dbname','generator']};root.remove(e);continue
   if tag!='page':continue
   cc={c.tag.split('}')[-1]:c for c in e};r=cc.get('revision');rr={c.tag.split('}')[-1]:c for c in r} if r is not None else {}
   get=lambda k:rr[k].text if k in rr else None
   title=cc['title'].text or '';ns=cc['ns'].text if 'ns' in cc else '0';text=get('text') or '';n+=1;handler(title,ns,get('id'),get('timestamp'),text,site)
   root.remove(e);e.clear()
 class W(Py7zIO):
  def __init__(self):self.p=0
  def write(self,b):consume(b);self.p+=len(b);return len(b)
  def read(self,size=None):return b''
  def seek(self,offset,whence=0):return self.p if whence==1 else 0
  def flush(self):pass
  def size(self):return self.p
 class Factory(WriterFactory):
  def create(self,name):
   if not name.endswith('.xml'):raise ValueError(name)
   return W()
 with py7zr.SevenZipFile(archive,'r') as z:z.extractall(factory=Factory())
 parser.close();return {'xml_pages':n,'site':site}
def meta(title,ns,rid,timestamp,text):
 cats=re.findall(r'\[\[Category:([^\]|]+)',text,re.I);sections=re.findall(r'^(={2,6})\s*(.*?)\s*\1\s*$',text,re.M)
 templates=list(dict.fromkeys(re.findall(r'\{\{\s*([^{}|\n]+)',text)))
 red=re.match(r'\s*#redirect\s*\[\[([^\]#]+)',text,re.I)
 return {'title':title,'namespace':ns,'revision_id':rid,'timestamp':timestamp,'text_sha256':hashlib.sha256(text.encode()).hexdigest(),'characters':len(text),'categories':cats,'sections':[{'level':len(eq),'title':s} for eq,s in sections],'templates':templates,'redirect':red[1].strip() if red else None}
def index(wiki):
 folder=P/wiki/'dump/full-reading';folder.mkdir(exist_ok=True);file=folder/'ALL_PAGE_INDEX.jsonl.gz';summary=F/(hostslug(wiki)+'_INDEX.json')
 if summary.exists() and file.exists():return json.loads(summary.read_text())
 content=[];categories={};count=0
 with gzip.open(file,'wt',encoding='utf-8',compresslevel=6) as out:
  def visit(title,ns,rid,timestamp,text,site):
   nonlocal count
   m=meta(title,ns,rid,timestamp,text);out.write(json.dumps(m,ensure_ascii=False,separators=(',',':'))+'\n');count+=1
   if ns=='14':categories[title.removeprefix('Category:')]=m['categories']
   elif ns=='0':content.append(m)
  info=stream(wiki,visit)
 # Expand category descendants, not just title words. All unresolved pages remain in scope triage.
 relevant={c for c in categories if RX.search(c)};changed=True
 while changed:
  changed=False
  for c,parents in categories.items():
   if c not in relevant and any(p in relevant for p in parents):relevant.add(c);changed=True
 inventory=[]
 for m in content:
  t=m['title'];cats=m['categories'];bio=bool(BIO.search(' '.join(cats)+' '+' '.join(m['templates'])))
  skyrim='skyrim' in t.lower() or any('skyrim' in c.lower() for c in cats)
  if wiki=='elderscrolls.fandom.com' and not skyrim:state='out_of_skyrim_scope';reason='No Skyrim title/category evidence'
  elif META.search(t) or any(re.search(r'(?i)(wiki maintenance|site maintenance|wiki community|articles for deletion|image galleries)',c) for c in cats):state='excluded_metadata_or_narrative';reason='Named gallery/chapter/episode/meta page; not standalone mechanics'
  elif m['redirect']:state='redirect';reason='Resolve offline to its content page'
  elif bio:
   if any(POWERS.search(s['title']) for s in m['sections']):state='mechanic_sections';reason='Character article; read all mechanism-bearing sections only'
   else:state='needs_scope_review';reason='Character without obvious power headings; no automatic omission'
  elif RX.search(t) or any(c in relevant for c in cats) or any(POWERS.search(s['title']) for s in m['sections']):state='full_page';reason='Title, category ancestry or mechanics headings'
  else:state='needs_scope_review';reason='No confident mechanical or exclusion classification'
  inventory.append(m|{'scope_state':state,'scope_reason':reason})
 body=P/wiki/'dump/full-reading/CONTENT_SCOPE.jsonl.gz'
 with gzip.open(body,'wt',encoding='utf-8',compresslevel=6) as out:
  for m in inventory:out.write(json.dumps(m,ensure_ascii=False,separators=(',',':'))+'\n')
 result={'state':'indexed_not_read','wiki':wiki,'archive_sha256':D['wikis'][wiki]['archive_sha256'],'archive_file':D['wikis'][wiki]['download']['file'],'date_utc':utc(),'xml_pages':info['xml_pages'],'site':info['site'],'content_pages':len(content),'scope_counts':dict(collections.Counter(m['scope_state'] for m in inventory)),'index_file':str(file),'scope_file':str(body),'page_cap':None,'semantic_policy':'Indexing and category closure are not full reading. All full_page/mechanic_sections and unresolved pages require reader disposition. Redirect targets must be resolved, transclusions bounded, and excluded topics documented.'}
 save(summary,result);return result

def read(wiki,titles,mode='full'):
 found=[]
 def visit(title,ns,rid,timestamp,text,site):
  if ns!='0' or title not in titles:return
  m=meta(title,ns,rid,timestamp,text);chosen=text
  if mode=='mechanic_sections':
   headings=list(re.finditer(r'^(={2,6})\s*(.*?)\s*\1\s*$',text,re.M));spans=[]
   for i,h in enumerate(headings):
    if not POWERS.search(h[2]):continue
    end=next((hh.start() for hh in headings[i+1:] if len(hh[1])<=len(h[1])),len(text));spans.append((h.start(),end))
   # Coalesce nested sections so each character's power text is counted once.
   merged=[]
   for start,end in spans:
    if merged and start<=merged[-1][1]:merged[-1]=(merged[-1][0],max(end,merged[-1][1]))
    else:merged.append((start,end))
   chosen='\n'.join(text[start:end] for start,end in merged);m['source_spans']=merged
  m['read_mode']=mode;m['selected_characters']=len(chosen);m['selected_sha256']=hashlib.sha256(chosen.encode()).hexdigest();m['text']=chosen;found.append(m)
 stream(wiki,visit)
 for m in found:print(json.dumps(m,ensure_ascii=False))
 missing=sorted(set(titles)-{m['title'] for m in found})
 if missing:raise RuntimeError('Missing titles: '+str(missing))
if __name__=='__main__':
 cmd=sys.argv[1];wiki=sys.argv[2]
 if cmd=='index':print(json.dumps(index(wiki),ensure_ascii=False,indent=2))
 elif cmd=='read':read(wiki,json.loads(pathlib.Path(sys.argv[3]).read_text()),sys.argv[4] if len(sys.argv)>4 else 'full')

def materialize(wiki):
 """Private cited-page reading inputs, only scoped text; never a full extracted XML."""
 cited=F/(hostslug(wiki)+'_SOURCES.json')
 if cited.exists():
  raise RuntimeError('Reading manifest is frozen. Use a separately cited scope supplement; do not overwrite active reader inputs.')
 info=index(wiki);scope=[]
 with gzip.open(info['scope_file'],'rt') as f:
  scope=[json.loads(line) for line in f]
 selected={m['title']:m for m in scope if m['scope_state'] in ['full_page','mechanic_sections','needs_scope_review']};base=P/wiki/'dump/full-reading';ready=[]
 # Read queue references cite every retained input as an explicitly pending source, not a verified claim.
 host=__import__('urllib.parse',fromlist=['urlsplit']).urlsplit(info['site']['base']).netloc
 def visit(title,ns,rid,timestamp,text,site):
  if ns!='0' or title not in selected:return
  m=selected[title].copy();chosen=text;spans=[(0,len(text))]
  bio=bool(BIO.search(' '.join(m['categories'])+' '+' '.join(m['templates'])))
  if bio:
   headings=list(re.finditer(r'^(={2,6})\s*(.*?)\s*\1\s*$',text,re.M));spans=[]
   for i,h in enumerate(headings):
    if POWERS.search(h[2]):spans.append((h.start(),next((hh.start() for hh in headings[i+1:] if len(hh[1])<=len(h[1])),len(text))))
   # Include only additional mechanism-bearing paragraphs, not unrelated biography.
   for para in re.finditer(r'(?s)(?:^|\n\n)(.*?)(?=\n\n|$)',text):
    if RX.search(para[1]) and not any(start<=para.start() and para.end()<=end for start,end in spans):spans.append((para.start(),para.end()))
   spans.sort();merged=[]
   for start,end in spans:
    if merged and start<=merged[-1][1]:merged[-1]=(merged[-1][0],max(end,merged[-1][1]))
    else:merged.append((start,end))
   spans=merged;chosen='\n'.join(text[start:end] for start,end in spans)
   if not chosen:m['scope_state']='excluded_character_without_mechanic_text';m['scope_reason']='No mechanism-bearing headings/paragraphs in the cached revision; no claim the character lacks powers.'
  m.update(source_spans=spans,source_wiki=host,revision_url='https://'+host+'/wiki/'+__import__('urllib.parse',fromlist=['quote']).quote(title.replace(' ','_'),safe='/:()')+'?oldid='+str(rid),read_characters=len(chosen),read_sha256=hashlib.sha256(chosen.encode()).hexdigest(),read_state='unread' if chosen else 'scope_excluded',archive_sha256=info['archive_sha256'])
  if chosen:
   fname=base/'cited-pages'/(hashlib.sha256(title.encode()).hexdigest()[:20]+'.json.gz');fname.parent.mkdir(exist_ok=True)
   with gzip.open(fname,'wt',encoding='utf-8',compresslevel=6) as f:json.dump({'metadata':m,'text':chosen},f,ensure_ascii=False)
   m['read_file']=str(fname)
  ready.append(m)
 stream(wiki,visit)
 save(cited,{'state':'cited_reading_queue_not_semantic_verification','wiki':wiki,'archive_sha256':info['archive_sha256'],'source_identity':host,'page_cap':None,'pages':ready,'retention_policy':'Only reference-listed page inputs are retained. Character inputs retain mechanism-bearing sections/paragraphs, not complete biographies. Page text stays private.'})
 print(json.dumps({'wiki':wiki,'reading_pages':sum(bool(m.get('read_file')) for m in ready),'scope_exclusions':sum(not bool(m.get('read_file')) for m in ready),'characters':sum(m['read_characters'] for m in ready),'source_manifest':str(cited)},indent=2))
if __name__=='__main__' and sys.argv[1]=='queue':materialize(sys.argv[2])
