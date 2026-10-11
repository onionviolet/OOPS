"""Selected rule passages, serial official normal HTML; no login/API."""
import sys,json,hashlib
from pathlib import Path
sys.path.extend(['/Users/weiwei/code/lncrawl-polite','/Users/weiwei/code/lncrawl-polite/.venv-polite/lib/python3.9/site-packages'])
from lncrawl.polite.transport import Client
from bs4 import BeautifulSoup
base=Path('docs/research/novels/power-scout-2026-10-10')
ledger=Path('docs/research/power-systems/novel-crawl/ACQUISITION.json');rows=json.loads(ledger.read_text())
routes=[('book-eater','https://www.wuxiaworld.com/novel/book-eater/be-chapter-'+str(i),'.chapter-body') for i in range(2,5)]
routes += [('making-magic-web','https://ncode.syosetu.com/n4154fl/'+str(i)+'/', '.p-novel__text:not(.p-novel__text--preface):not(.p-novel__text--afterword)') for i in [2,3]]
routes += [('d-genesis-web','https://kakuyomu.jp/works/1177354054894181631/episodes/1177354054894181655','.widget-episodeBody')]
with Client(base/'transport') as c:
 for book,url,selector in routes:
  try:
   with c.chapter(url):body,receipt=c.fetch(url)
   folder=base/book/'sources';folder.mkdir(parents=True,exist_ok=True);h=hashlib.sha256(url.encode()).hexdigest()[:12];f=folder/(h+'.html');f.write_bytes(body)
   soup=BeautifulSoup(body,'html.parser');node=soup.select_one(selector)
   txt=node.get_text('\n',strip=True) if node else ''
   if txt:f.with_suffix('.txt').write_text(txt)
   rows.append({'book':book,'url':url,'receipt':receipt,'html':str(f),'text':str(f.with_suffix('.txt')) if txt else None,'characters':len(txt),'status':'text_acquired' if txt else 'page_received_no_text'})
   print(book,url.rsplit('/',2)[-2:],'characters',len(txt),flush=True)
   # No content means a public rendering/access limit; stop this book.
   if not txt:
    if book=='book-eater':break
  except Exception as e:
   rows.append({'book':book,'url':url,'status':'stopped','reason':str(e)});print('STOP',str(e),flush=True)
  ledger.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
ledger.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
