"""Lane setup 2026-10-13 (Weibao: full dump lanes for JJK, Bleach, Chainsaw Man).

JJK: refetch the same S3 archive after the private cache was lost; accept only if
SHA-256 equals the frozen DUMPS.json record. Bleach and Chainsaw Man: their S3
dumps are DEEP_ARCHIVE and their Fandom API hosts refused robots.txt, so use the
independent WikiTeam text-only history XML on the Internet Archive (images
skipped). Serial requests, honest identity, randomized 4-8 s gaps, disk floor,
md5 checked against IA metadata. No Fandom host is contacted.
"""
import pathlib,json,urllib.request,hashlib,time,random,shutil,sys
from dump_crawl import UA,DISK_FLOOR,PRIVATE,LEDGER,now,save
TARGETS={
 'jujutsu-kaisen.fandom.com':{'route':'fandom-s3-refetch','url':'https://s3.amazonaws.com/wikia_xml_dumps/j/ju/jujutsukaisen_pages_current.xml.7z','file':'pages-current.xml.7z'},
 'typemoon.fandom.com':{'route':'fandom-s3-refetch','url':'https://s3.amazonaws.com/wikia_xml_dumps/t/ty/typemoon_pages_current.xml.7z','file':'pages-current.xml.7z'},
 'hunterxhunter.fandom.com':{'route':'fandom-s3-refetch','url':'https://s3.amazonaws.com/wikia_xml_dumps/h/hu/hunterxhunter_pages_current.xml.7z','file':'pages-current.xml.7z'},
 'fma.fandom.com':{'route':'fandom-s3-refetch','url':'https://s3.amazonaws.com/wikia_xml_dumps/f/fm/fma_pages_current.xml.7z','file':'pages-current.xml.7z'},
 'bleach.fandom.com':{'route':'wikiteam-ia','item':'wiki-bleach.fandom.com-20231226','name':'bleach.fandom.com-20231226-history.xml.zst'},
 'chainsaw-man.fandom.com':{'route':'wikiteam-ia','item':'wiki-chainsaw-man.fandom.com-20231127','name':'chainsaw-man.fandom.com-20231127-history.xml.zst'},
 'onepiece.fandom.com':{'route':'fandom-s3-refetch','url':'https://s3.amazonaws.com/wikia_xml_dumps/o/on/onepiece_pages_current.xml.7z','file':'pages-current.xml.7z'},
 'myheroacademia.fandom.com':{'route':'wikiteam-ia','item':'wiki-myheroacademia.fandom.com-20231128','name':'myheroacademia.fandom.com-20231128-history.xml.zst'},
 'frieren.fandom.com':{'route':'wikiteam-ia','item':'wiki-frieren.fandom.com-20231212','name':'frieren.fandom.com-20231212-history.xml.zst'},
 'blackclover.fandom.com':{'route':'wikiteam-ia','item':'wiki-blackclover.fandom.com-20231224','name':'blackclover.fandom.com-20231224-history.xml.zst'},
 'mob-psycho-100.fandom.com':{'route':'wikiteam-ia','item':'wiki-mob-psycho-100.fandom.com-20231205','name':'mob-psycho-100.fandom.com-20231205-history.xml.zst'},
 'kimetsu-no-yaiba.fandom.com':{'route':'wikiteam-ia','item':'wiki-kimetsu-no-yaiba.fandom.com-20231219','name':'kimetsu-no-yaiba.fandom.com-20231219-history.xml.zst'},
}
last=[0.0]
def get(url):
 wait=last[0]+random.uniform(4,8)-time.time()
 if wait>0:time.sleep(wait)
 try:return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':UA}),timeout=120)
 finally:last[0]=time.time()
def digest(p,algo):
 h=hashlib.new(algo)
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1<<20),b''):h.update(b)
 return h.hexdigest()
def main(only=None):
 ledger=json.loads(LEDGER.read_text())
 for wiki,t in TARGETS.items():
  if only and wiki not in only:continue
  entry=ledger['wikis'][wiki];folder=PRIVATE/wiki/'dump';folder.mkdir(parents=True,exist_ok=True)
  rec={'route':t['route'],'started':now()}
  if t['route']=='wikiteam-ia':
   with get('https://archive.org/metadata/'+t['item']) as r:m=json.load(r)
   f=next(x for x in m['files'] if x['name']==t['name'])
   rec.update(item=t['item'],url='https://archive.org/download/'+t['item']+'/'+t['name'],expected_md5=f['md5'],expected_bytes=int(f['size']),dumper=str(m['metadata'].get('description',''))[:300]);dest=folder/t['name']
  else:
   rec.update(url=t['url'],expected_sha256=entry['archive_sha256'],expected_bytes=entry.get('compressed_bytes'));dest=folder/t['file']
  if not dest.exists():
   if shutil.disk_usage(PRIVATE).free-(rec['expected_bytes'] or 0)<DISK_FLOOR:raise SystemExit('Disk floor blocks '+wiki)
   part=dest.with_suffix(dest.suffix+'.part')
   with get(rec['url']) as r,part.open('wb') as out:
    rec.update(status=r.status,final_url=r.geturl());shutil.copyfileobj(r,out,1<<20)
   part.replace(dest)
  rec.update(file=str(dest),bytes=dest.stat().st_size,sha256=digest(dest,'sha256'),md5=digest(dest,'md5'),finished=now())
  ok=rec['md5']==rec['expected_md5'] if t['route']=='wikiteam-ia' else rec['sha256']==rec['expected_sha256']
  rec['verified']=ok
  if not ok:print(wiki,'HASH MISMATCH',rec,flush=True);entry.setdefault('alternate_routes',[]).append(rec);save(LEDGER,ledger);continue
  if t['route']=='wikiteam-ia':
   entry['alternate_routes']=[x for x in entry.get('alternate_routes',[]) if x.get('item')!=t['item']]+[rec]
   entry.update(state='review_ready',archive_sha256=rec['sha256'],archive_format='wikiteam-history-xml-zst',download={'file':rec['file'],'sha256':rec['sha256'],'url':rec['url'],'route':'wikiteam-ia'},state_note='S3 dump DEEP_ARCHIVE and Fandom API refused; WikiTeam IA text dump used 2026-10-13. Latest revision per page is the reading input.')
  else:
   entry.setdefault('cache_restorations',[]).append(rec);entry['download']['file']=rec['file']
  save(LEDGER,ledger);print(wiki,'OK',rec['bytes'],rec['sha256'][:16],flush=True)
if __name__=='__main__':main(sys.argv[1:] or None)
