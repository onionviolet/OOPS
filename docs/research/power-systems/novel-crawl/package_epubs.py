"""Offline FanFicFare EPUB packaging of already qualified official pages."""
import json,hashlib
from pathlib import Path
from datetime import datetime
from bs4 import BeautifulSoup
from fanficfare.configurable import Configuration
from fanficfare.story import Story
from fanficfare.writers import getWriter
base=Path('docs/research/novels/power-scout-2026-10-10')
ledger=Path('docs/research/power-systems/novel-crawl/ACQUISITION.json')
rows=json.loads(ledger.read_text())
# Repair selector-only extraction from existing immutable normal page downloads.
selectors={'book-eater':'.chapter-body','land-mines-web':'.p-novel__text:not(.p-novel__text--preface):not(.p-novel__text--afterword)'}
for r in rows:
 if r['book'] in selectors and r.get('html'):
  f=Path(r['html']);node=BeautifulSoup(f.read_bytes(),'html.parser').select_one(selectors[r['book']])
  if node:
   text=node.get_text('\n',strip=True);f.with_suffix('.txt').write_text(text);r.update(text=str(f.with_suffix('.txt')),characters=len(text),status='text_acquired')
ledger.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
info={'pale-lights':('Pale Lights - Book 1 chapters 1-3','ErraticErrata','en'),'book-eater':('Book Eater - chapters 1-3','McEnroe; translation RainbowTurtle','en'),'land-mines-web':('Land Mines - original web prologue','Itsuki Mizuho','ja'),'making-magic-web':('Making Magic - original web chapters 1-2','Aloha Zachou','ja'),'d-genesis-web':('D-Genesis - original web prologue and chapter 1','Tsuranori Kono','ja')}
receipts=[]
for book,(title,author,lang) in info.items():
 selected=[r for r in rows if r['book']==book and r.get('text') and r['status']=='text_acquired']
 config=Configuration(['defaults'],'epub');config.read_string('[defaults]\ninclude_titlepage:false\ninclude_tocpage:always\ninclude_images:false\n')
 story=Story(config)
 for k,v in {'title':title,'author':author,'authorId':author,'storyId':book,'storyUrl':selected[0]['url'],'site':'official qualified free chapter sample','language':lang,'datePublished':datetime(2026,10,10),'dateUpdated':datetime(2026,10,10),'dateCreated':datetime(2026,10,10),'numChapters':len(selected)}.items():story.setMetadata(k,v)
 for r in selected:
  f=Path(r['html']);soup=BeautifulSoup(f.read_bytes(),'html.parser');text=Path(r['text']).read_text();
  # Plain normalized chapter text only, with no active code/images/network links.
  import html
  content='<div>'+''.join('<p>'+html.escape(p)+'</p>' for p in text.splitlines())+'</div>'
  story.addChapter({'title':soup.title.get_text() if soup.title else f.stem,'url':r['url'],'html':content})
 class Adapter:
  def getStoryMetadataOnly(self):return story
  def getStory(self,notification=lambda x,y:x):return story
 output=base/book/'sources'/'qualified-free-sample.epub'
 if output.exists():raise RuntimeError('Existing EPUB must be reused, not overwritten: '+str(output))
 getWriter('epub',config,Adapter()).writeStory(outfilename=str(output))
 receipts.append({'book':book,'file':str(output),'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'chapter_count':len(selected),'tool':'FanFicFare offline EPUB writer; network via existing lncrawl-polite transport','edition_scope':title})
 print(book,len(selected),'chapters packaged')
Path('docs/research/power-systems/novel-crawl/EPUBS.json').write_text(json.dumps(receipts,ensure_ascii=False,indent=2)+'\n')
