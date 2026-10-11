"""Lane W API crawl. Raw responses private; no HTML article fetching."""
import importlib.util, json, pathlib, hashlib, re, urllib.parse, sys, time
from bs4 import BeautifulSoup
ROOT=pathlib.Path(__file__).resolve().parents[4]
OUT=pathlib.Path(__file__).resolve().parent
PRIVATE=pathlib.Path.home()/'.codex/research/wikis'
spec=importlib.util.spec_from_file_location('polite_transport','/Users/weiwei/code/lncrawl-polite/lncrawl/polite/transport.py')
t=importlib.util.module_from_spec(spec);spec.loader.exec_module(t)
# Import unchanged GPL transport by reference, without copying it into this project.
t.UA='YAIRPG-wiki-research/1.0 (personal research; AI-assisted; no login)'
t.IDENTITIES=(t.UA,'GPTBot','ChatGPT-User','OAI-SearchBot','OpenAI','polite-wildcard-policy')
def hashfile(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def refs(x):
 if isinstance(x,dict):
  for k,v in x.items():
   if k=='source_ids' and isinstance(v,list):yield from v
   else:yield from refs(v)
 elif isinstance(x,list):
  for v in x:yield from refs(v)
def wiki(u):
 q=urllib.parse.urlsplit(u); h=q.netloc
 if not h:return None
 if h.endswith('fandom.com') or h.endswith('wiki.gg') or h in ['en.wikipedia.org','es.wikipedia.org','www.poewiki.net','wiki.wanderinginn.com','coppermind.net','jojowiki.com','wiki.abidanarchive.com','mtg.fandom.com','dnd5e.wikidot.com']:
  if 'wikidot.com' in h:return None
  path='/w/api.php' if 'wikipedia.org' in h else '/api.php'
  title=urllib.parse.unquote(q.path.split('/wiki/',1)[-1] if '/wiki/' in q.path else q.path.split('/index.php/',1)[-1] if '/index.php/' in q.path else q.path.lstrip('/'))
  return (q.scheme+'://'+h+path,title)
 return None
EXTRA={
 'Reverend Insanity':['https://reverend-insanity.fandom.com/wiki/Gu','https://reverend-insanity.fandom.com/wiki/Cultivation'],
 'Omniscient Reader’s Viewpoint':['https://omniscient-readers-viewpoint.fandom.com/wiki/Star_Stream','https://omniscient-readers-viewpoint.fandom.com/wiki/Probability'],
 'The Second Coming of Gluttony':['https://the-second-coming-of-gluttony.fandom.com/wiki/Gluttony'],
 'I Shall Seal the Heavens':['https://i-shall-seal-the-heavens.fandom.com/wiki/Cultivation'],
 'Renegade Immortal':['https://renegade-immortal.fandom.com/wiki/Cultivation'],
 'Shadow Slave':['https://shadowslave.fandom.com/wiki/Spell','https://shadowslave.fandom.com/wiki/Aspect'],
 'Mother of Learning':['https://mother-of-learning.fandom.com/wiki/Magic'],
 'The Dresden Files':['https://dresdenfiles.fandom.com/wiki/Magic','https://dresdenfiles.fandom.com/wiki/Seven_Laws_of_Magic'],
 'The Stormlight Archive':['https://coppermind.net/wiki/Surgebinding'],
 'Mistborn':['https://coppermind.net/wiki/Allomancy','https://coppermind.net/wiki/Feruchemy'],
 'Marvel comics':['https://marvel.fandom.com/wiki/Category:Power_Systems'],
 'DC comics':['https://dc.fandom.com/wiki/Emotional_Spectrum'],
 'Dungeons & Dragons: 2024 revised fifth edition':['https://en.wikipedia.org/wiki/Magic_of_Dungeons_%26_Dragons'],
 'Magic: The Gathering':['https://mtg.fandom.com/wiki/Color'],
 'Monastic vows: Benedictine example':['https://en.wikipedia.org/wiki/Rule_of_Saint_Benedict'],
 'Curses: Sleeping Beauty and The Monkey Paw':['https://en.wikipedia.org/wiki/The_Monkey%27s_Paw'],
 'Genies and wishes: Aladdin and Fisherman tales':['https://en.wikipedia.org/wiki/The_Fisherman_and_the_Jinni'],
 'Frieren':['https://frieren.fandom.com/wiki/Magic'],
 'Mob Psycho 100':['https://mob-psycho-100.fandom.com/wiki/Psychic_Power'],
 'Dandadan':['https://dandadan.fandom.com/wiki/Spiritual_Power'],
 'Fire Force':['https://fire-force.fandom.com/wiki/Ignition_Ability'],
 'Kaiju No. 8':['https://kaiju-no-8.fandom.com/wiki/Unleashed_Combat_Power'],
 'Dark Souls 1 covenants':['https://darksouls.fandom.com/wiki/Covenant_(Dark_Souls)'],
 'System-novel staples':[],
 'The Wandering Inn':['https://wiki.wanderinginn.com/'+x for x in ['Skills','Conditions','Aspects','Quests','Grand_Design_of_Isthekenous','Trials_of_Levelling','Horror_Ranks','Artifacts','Magic']],
 'Path of Exile 1 support gems':['https://www.poewiki.net/wiki/'+x for x in ['Skill_gem','Gem_tag','Trigger','Reservation','Item_socket','Link','Ascendancy_class','Unique_item','Currency']]}
DISCOVERED={'My Cell Prison': ['https://my-cell-prison.fandom.com/wiki/My_Cell_Prison_Wiki'], 'Soul of Negary': ['https://soul-of-negary-novel.fandom.com/wiki/Origin', 'https://soul-of-negary-novel.fandom.com/wiki/Soul_Virus', 'https://soul-of-negary-novel.fandom.com/wiki/Flame_World', 'https://soul-of-negary-novel.fandom.com/wiki/Negary/Abilities'], 'Fantasy Simulator': ['https://fantasy-simulator.fandom.com/wiki/Chen_Heng/Simulations'], 'Carefree Path of Dreams': ['https://carefree-path-of-dreams.fandom.com/wiki/Dream_Master', 'https://carefree-path-of-dreams.fandom.com/wiki/Scientific_Cultivation_Method'], 'Low Dimensional Game': ['https://vsbattles.fandom.com/wiki/Low_Dimensional_Game'], 'Doomsday Wonderland': ['https://doomsday-wonderland.fandom.com/wiki/Temporary_Right_Of_Abode', 'https://doomsday-wonderland.fandom.com/wiki/Planar_World', 'https://doomsday-wonderland.fandom.com/wiki/Duoluozhong'], 'The Book Eating Magician': ['https://thebookeatingmagician.fandom.com/wiki/Umbra', 'https://the-book-eating-magician.fandom.com/wiki/Theodore_Miller'], 'The Main Heroines are Trying to Kill Me': ['https://the-main-heroines-are-trying-to-kill-me.fandom.com/wiki/The_Main_Heroines_Are_Trying_To_Kill_Me_Wiki'], 'Kidnapped Dragons': ['https://kidnappeddragons.fandom.com/wiki/Kidnapped_Dragons_Wiki'], 'The S-Classes That I Raised': ['https://mysranks.fandom.com/wiki/The_S-Ranks_That_I_Raised'], 'To Another World... with Land Mines!': ['https://to-another-world-with-land-mines.fandom.com/wiki/%22Landmines%22_Skills'], 'Lazy Dungeon Master': ['https://lazydungeonmaster.fandom.com/wiki/Dungeon_Master', 'https://lazydungeonmaster.fandom.com/wiki/Dungeon_Core', 'https://lazydungeonmaster.fandom.com/wiki/Dungeons'], 'Monster Tamer': ['https://monster-tamer.fandom.com/wiki/Majima_Takahiro'], 'The Magician Who Rose From Failure': ['https://the-magician-who-rose-from-failure.fandom.com/wiki/Spells'], 'The Daily Grind': ['https://the-daily-grind.fandom.com/wiki/The_Daily_Grind_Wiki'], 'Return of the Runebound Professor': ['https://runebound-professor.fandom.com/wiki/Runes', 'https://runebound-professor.fandom.com/wiki/Noah_Vines/Runes'], 'The Stubborn Skill-Grinder In A Time Loop': ['https://the-stubborn-skillgrinder-in-a-time-loop.fandom.com/wiki/Skills', 'https://the-stubborn-skillgrinder-in-a-time-loop.fandom.com/wiki/Mythical_Skills', 'https://the-stubborn-skillgrinder-in-a-time-loop.fandom.com/wiki/Worlds'], 'Pale Lights': ['https://pale-lights.fandom.com/wiki/The_Trials', 'https://pale-lights.fandom.com/wiki/The_Watch'], 'Fine Structure': ['https://vsbattles.fandom.com/wiki/Fine_Structure_Explanation_Page'], 'The Oracle Paths': ['https://oracle-paths.fandom.com/wiki/Dream_Aether', 'https://oracle-paths.fandom.com/wiki/Bloodline', 'https://oracle-paths.fandom.com/wiki/False_World_War']}
def inventory():
 records={}; inputs=[]
 for lane in ['anime-manga','web-fiction','western']:
  p=ROOT/'docs/research/power-systems'/lane/'SERIES.json';d=json.loads(p.read_text());inputs.append({'path':str(p.relative_to(ROOT)),'sha256':hashfile(p)})
  sources={s['id']:s for s in d['sources']}
  for row in d['series']:
   name=row['title']; canonical='Cradle' if name=='Cradle' else name
   r=records.setdefault(canonical,{'title':canonical,'slug':re.sub('[^a-z0-9]+','-',canonical.lower()).strip('-'),'rows':[],'urls':[]})
   r['rows'].append({'lane':lane,'id':row['id'],'path':str(p.relative_to(ROOT))})
   for sid in sorted(set(refs(row))):
    s=sources.get(sid,{});u=s.get('url',s.get('target',''))
    if wiki(u) and u not in r['urls']:r['urls'].append(u)
 for name,urls in EXTRA.items():
  if name in records:
   for u in urls:
    if u not in records[name]['urls']:records[name]['urls'].append(u)
 p=ROOT/'docs/research/power-systems/broad-scout/CANDIDATES.json'
 if p.exists():
  d=json.loads(p.read_text());inputs.append({'path':str(p.relative_to(ROOT)),'sha256':hashfile(p)})
  rows=d if isinstance(d,list) else d.get('candidates',d.get('series',[]))
  for row in rows:
   name=row.get('title',row.get('name',row.get('series')))
   if not isinstance(name,str):continue
   r=records.setdefault(name,{'title':name,'slug':re.sub('[^a-z0-9]+','-',name.lower()).strip('-'),'rows':[],'urls':[]})
   r['rows'].append({'lane':'broad-scout','id':row.get('id'),'path':str(p.relative_to(ROOT))})
   def urls(x):
    if isinstance(x,str) and x.startswith('https://'):yield x
    elif isinstance(x,dict):
     for v in x.values():yield from urls(v)
    elif isinstance(x,list):
     for v in x:yield from urls(v)
   for u in urls(row):
    if wiki(u) and u not in r['urls']:r['urls'].append(u)

 for name,urls in DISCOVERED.items():
  if name in records:
   for u in urls:
    if u not in records[name]['urls']:records[name]['urls'].append(u)
 return list(records.values()),inputs

def run():
 records,inputs=inventory(); plan={}
 for r in records:
  for u in r['urls']:
   api,title=wiki(u)
   # Avoid biography and episode crawls. Mechanic-focused supplied pages only.
   if re.search(r'(Synopsis|Episode_|Arc$)',title) or ('/' not in title and re.search(r'(Denji|Knuckle_Bine|Mirio_Togata|Frieren$|Shigeo_Kageyama|Zenitsu|Mitsuri|Okarun|Turbo_Granny|Arthur_Boyle|Kafka_Hibino|Gen_Narumi|Pagma$|Roy_Mustang|List_of_)',title)):continue
   plan.setdefault(api,{}).setdefault(title,{'url':u,'series':[]})['series'].append(r['title'])
 receiptfile=OUT/'ACQUISITION.json'
 old=json.loads(receiptfile.read_text()) if receiptfile.exists() else {'hosts':{}}
 result={'inputs':inputs,'series':records,'hosts':old['hosts'],'d_candidates_present':any('CANDIDATES' in x['path'] for x in inputs)}
 receiptfile.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 with t.Client(PRIVATE/'lane-w-transport',chapter_cap=300) as client:
  for api,pages in plan.items():
   h=urllib.parse.urlsplit(api).netloc
   if api in result['hosts'] and result['hosts'][api].get('state') in ['blocked','complete']:
    prior=result['hosts'][api]
    if prior.get('state')=='complete':
     if 'siteinfo' in prior and all(any(x.get('requested_title')==title for x in prior['pages']) for title in pages):continue
    elif prior.get('reason')!='Expecting value: line 1 column 1 (char 0)':continue
    if prior.get('reason')=='Expecting value: line 1 column 1 (char 0)':prior['local_error']='Initial code wrongly assumed action=help returns JSON; read cached API help HTML, without refetch.'
    prior['state']='active';prior.pop('reason',None)
   host=result['hosts'].setdefault(api,{'host':h,'api':api,'pages':[],'state':'active'})
   try:
    # fetch handles robots and identity restrictions before any API call.
    url=api+'?'+urllib.parse.urlencode({'action':'help','modules':'query','format':'json'})
    body,info=client.fetch(url)
    try:guide=json.loads(body)
    except json.JSONDecodeError:
     soup=BeautifulSoup(body,'html.parser')
     if not soup.title or 'MediaWiki API help' not in soup.title.get_text():raise RuntimeError('API help is not JSON or recognizable MediaWiki help')
     guide={'mediawiki_help_html':True}
     guidance=soup.get_text(' ',strip=True)
     host['api_help_review']={'title':soup.title.get_text(),'maxlag_documented':'maxlag' in guidance,'rate_terms_present':any(x in guidance.lower() for x in ['rate limit','ratelimit','etiquette']),'note':'action=help defaults to HTML even with format=json; API documentation only, not article scraping.'}
    host['guidance']={'url':url,'receipt':info,'keys':list(guide),'note':'API help reviewed; transport obeys robots crawl delay/rate; maxlag=5; serial 4-8 second gaps.'}
    if 'error' in guide:raise RuntimeError('API help error: '+str(guide['error']))
    if 'siteinfo' not in host:
     siteurl=api+'?'+urllib.parse.urlencode({'action':'query','meta':'siteinfo','siprop':'general|rightsinfo','format':'json','maxlag':'5'})
     sb,si=client.fetch(siteurl);sd=json.loads(sb);host['siteinfo']={'url':siteurl,'receipt':si,'data':sd.get('query',{})}
    for title,p in pages.items():
     if any(x.get('requested_title')==title for x in host['pages']):continue
     params={'action':'query','prop':'revisions','rvprop':'ids|timestamp|content','rvslots':'main','titles':title,'redirects':'1','format':'json','formatversion':'2','maxlag':'5'}
     url=api+'?'+urllib.parse.urlencode(params)
     with client.chapter(url):body,info=client.fetch(url)
     d=json.loads(body)
     if 'error' in d:raise RuntimeError('API error: '+str(d['error']))
     for page in d.get('query',{}).get('pages',[]):
      rev=page.get('revisions',[{}])[0]; rid=rev.get('revid'); canon=page.get('title',title)
      entry={'requested_title':title,'title':canon,'series':p['series'],'url':p['url'],'revision_id':rid,'timestamp':rev.get('timestamp'),'sha256':hashlib.sha256(body).hexdigest(),'receipt':info,'state':'acquired' if rid else 'missing','revision_url':api.rsplit('/',1)[0]+'/index.php?'+urllib.parse.urlencode({'title':canon,'oldid':rid}) if rid else None}
      host['pages'].append(entry)
      # Raw stored by transport; add wiki-specific private provenance index.
      folder=PRIVATE/h;folder.mkdir(exist_ok=True)
      (folder/(str(rid or 'missing')+'-'+hashlib.sha256(url.encode()).hexdigest()[:12]+'.json')).write_text(json.dumps({'provenance':entry,'response':d},ensure_ascii=False,indent=2))
     receiptfile.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    host['state']='complete'
   except Exception as e:
    host['state']='blocked';host['reason']=str(e);print('STOP',h,str(e),flush=True)
   receiptfile.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
   print(h,host['state'],len(host['pages']),flush=True)
   (OUT/'CHECKPOINT.md').write_text('# Lane W checkpoint\n\nState: API acquisition in progress.\nWriter: lane W; no children.\nProcessed hosts: '+str(len(result['hosts']))+'; last: '+h+' ('+host['state']+').\nLive receipt: ACQUISITION.json. Raw data: ~/.codex/research/wikis/.\nNo runtime, E8, build, save or commit changes.\nNext: finish host plan, recheck lane D, review acquired revisions, write digests and requests.\n')
 print('ACQUISITION_DONE',len(records),len(plan),flush=True)
if __name__=='__main__':run()
