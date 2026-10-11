"""Bounded official free HTML acquisition via lncrawl-polite transport.
FanFicFare's EPUB writer packages the qualified public chapter HTML offline.
"""
import sys,json,hashlib
from pathlib import Path
from urllib.parse import urljoin
sys.path.extend(['/Users/weiwei/code/lncrawl-polite','/Users/weiwei/code/lncrawl-polite/.venv-polite/lib/python3.9/site-packages'])
from lncrawl.polite.transport import Client
from bs4 import BeautifulSoup
BASE=Path('docs/research/novels/power-scout-2026-10-10')
rows=[]
with Client(BASE/'transport') as c:
 def fetch(book,url,selector=None):
  try:
   with c.chapter(url):body,receipt=c.fetch(url)
   folder=BASE/book/'sources';folder.mkdir(parents=True,exist_ok=True)
   h=hashlib.sha256(url.encode()).hexdigest()[:12]
   (folder/(h+'.html')).write_bytes(body)
   soup=BeautifulSoup(body,'html.parser')
   node=soup.select_one(selector) if selector else None
   if node:
    for t in node(['script','style']):t.decompose()
    text=node.get_text('\n',strip=True)
    (folder/(h+'.txt')).write_text(text)
   else:text=''
   row={'book':book,'url':url,'receipt':receipt,'html':str(folder/(h+'.html')),'text':str(folder/(h+'.txt')) if text else None,'characters':len(text),'status':'text_acquired' if text else 'page_received_no_text'}
   rows.append(row);print(book,row['status'],len(text),flush=True)
   return soup
  except Exception as e:
   rows.append({'book':book,'url':url,'status':'stopped','reason':str(e)});print('STOP',book,str(e),flush=True);return None
 # Author's normal TOC, choose original Book 1 opening, no feeds/APIs.
 toc=fetch('pale-lights','https://palelights.com/table-of-contents/')
 if toc:
  urls=[]
  for a in toc.select('a[href]'):
   u=a['href']
   if 'palelights.com/2022/' in u and '/chapter-' in u and u not in urls:urls.append(u)
  for u in urls[:3]:
   if fetch('pale-lights',u,'.entry-content') is None:break
 # First publisher chapter is linked in the already received catalogue.
 fetch('book-eater','https://www.wuxiaworld.com/novel/book-eater/be-chapter-1', '#chapter-content')
 # Original Japanese web editions are separate from J-Novel's English LN.
 fetch('land-mines-web','https://ncode.syosetu.com/n0350em/2/', '.js-novel-text')
 fetch('d-genesis-web','https://kakuyomu.jp/works/1177354054894181631')
 # Tappytoon catalogue marks free and paid chapters explicitly.
 p=BASE/'route-probes/tappytoon/landing.html'
 state=json.loads(BeautifulSoup(p.read_bytes(),'html.parser').find('script',id='__NEXT_DATA__').string)
 chapters=sorted(state['props']['initialState']['entities']['chapters'].values(),key=lambda v:v.get('order',999999))
 for ch in chapters[:4]:
  if not ch.get('isFree') or ch.get('isRestrictedToMe') or not ch.get('isAccessible'):
   rows.append({'book':'dungeon-reset','status':'paid_locked_stop','chapter_id':ch['id'],'title':ch['title']});break
  if fetch('dungeon-reset','https://www.tappytoon.com/en/chapters/'+str(ch['id'])) is None:break
Path('docs/research/power-systems/novel-crawl/ACQUISITION.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
