"""Serial route qualification using the existing polite transport, no retries."""
import sys,json
from pathlib import Path
sys.path.extend(['/Users/weiwei/code/lncrawl-polite','/Users/weiwei/code/lncrawl-polite/.venv-polite/lib/python3.9/site-packages'])
from lncrawl.polite.transport import Client
base=Path('docs/research/novels/power-scout-2026-10-10')
routes=[('webnovel','https://www.webnovel.com/book/let-me-game-in-peace_15117994305858505'),('qidian','https://book.qidian.com/booklist/detail/644453/'),('tappytoon','https://www.tappytoon.com/en/book/dungeon-reset-novel'),('wuxiaworld','https://www.wuxiaworld.com/novel/book-eater'),('j-novel','https://j-novel.club/series/d-genesis/'),('pale-lights-author','https://palelights.com/')]
results=[]
with Client(base/'transport') as client:
 for name,url in routes:
  print('Qualifying',name,flush=True)
  try:
   body,receipt=client.fetch(url)
   folder=base/'route-probes'/name;folder.mkdir(parents=True,exist_ok=True)
   (folder/'landing.html').write_bytes(body)
   row={'route':name,'url':url,'status':'landing_received','receipt':receipt}
  except Exception as e: row={'route':name,'url':url,'status':'stopped','reason':str(e)}
  results.append(row)
  Path('docs/research/power-systems/novel-crawl/ROUTES.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
  print(row['status'],row.get('reason',''),flush=True)
