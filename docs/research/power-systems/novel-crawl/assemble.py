"""Reproduce Lane N's paraphrased ledgers from frozen selection and private receipts."""
import json,hashlib,re
from pathlib import Path
OUT=Path('docs/research/power-systems/novel-crawl');PRIVATE=Path('docs/research/novels/power-scout-2026-10-10')
selection=json.loads((OUT/'SELECTION.json').read_text())['candidates']
baseline={r['id']:r for r in json.loads(Path('docs/research/power-systems/broad-scout/SERIES.json').read_text())['series']}
acq=json.loads((OUT/'ACQUISITION.json').read_text())
slugs={'D003':'let-me-game-in-peace','D004':'losing-money-to-be-a-tycoon','D005':'astral-apostle','D014':'traffords-trading-club','D016':'information-omniscient','D017':'dungeon-reset','D018':'book-eater','D025':'d-genesis-web','D026':'making-magic-web','D027':'land-mines-web','D033':'the-game-at-carousel','D034':'godclads','D036':'markets-and-multiverses','D039':'runebound-professor','D044':'pale-lights'}
# Root read all narrative paragraphs of these exact source members.
DATA={
'D018':[
 ('BE01','946c36c60447','graduate','Academy graduation requires both written knowledge and third-circle ability; a strong exam does not satisfy the practical gate.','narration and teacher dialogue','This is an institutional gate, not proof of a universal third-circle ceiling.','Proposal: grade knowledge and executable power separately.'),
 ('BE02','8ec271b8c25a','comprehension','The grimoire consumes a studied book and reports high comprehension before awarding its spell.','observed consumption and system statement','These high-comprehension cases do not establish a mandatory threshold for every book.','Proposal: keep prior study, transfer and executable skill as separate states.'),
 ('BE03','0941bda679f9','sensitivity','After eating books, Theo casts the previously failed spell and gains affinity, mana sensitivity and specific craft functions.','narrated outcomes and system statements','Author wisdom is narrated; not all author memories or personalities are shown.','Proposal: let one inheritance alter control or craft functions rather than merely add knowledge.'),
 ('BE04','0941bda679f9','neglected','The voice warns that a hungry grimoire may eat its owner; rapid feeding causes a severe information headache.','system warning versus observed overload','Predation is threatened, not witnessed. The first hunger deadline is not a proven daily schedule.','Proposal: track provider hunger and recipient assimilation separately.')],
'D027':[
 ('LM01','cf0463350dff','20ポイント','The protagonist spends creation points on an irreversible Help choice; the interface then exposes hidden terms.','narrated selection and displayed terms','This is information purchased during character setup, not an abstinence vow.','Proposal: price rule knowledge independently from power.'),
 ('LM02','cf0463350dff','封印','Copied skills are described as level-one sealed copies that need instruction from the source holder to unlock.','displayed skill terms','No copy is activated here; teacher consent is the protagonist\'s inference, not an explicit universal enforcement rule.','Proposal: separate obtaining a method from gaining permission or training to execute it.'),
 ('LM03','cf0463350dff','寿命の4%','The theft skill transfers lifespan according to the total stolen skill levels, with return of skills at the thief\'s death.','displayed terms','The fatal threshold is the protagonist\'s arithmetic; no theft or death is performed here.','Proposal: quote the whole transferred set and its cumulative bill before use.'),
 ('LM04','cf0463350dff','10倍','An advertised experience multiplier also raises required mastery experience, so the numerator alone misleads.','displayed terms and protagonist reaction','No training outcome measured; later special uses remain unknown.','Proposal: display gain rate and requirement together.')],
'D026':[
 ('MM01','f887d34cc24d','創造魔法','Creation consumes mana to make usable gear; an exhausted spell wand remains usable as an ordinary striking tool.','narrated creation and practical observation','The split between wand material cost and stored spells is the protagonist\'s estimate.','Proposal: retain mundane functions when stored charges run out.'),
 ('MM02','cae62499d701','回復効果','A created fruit raises maximum mana but does not refill the current reservoir; creating it can cause depletion symptoms.','narrated consumption and observation','The character estimates quantities; no universal exact cost table is established.','Proposal: separate capacity, current fuel and refill.'),
 ('MM03','cae62499d701','1日1個まで','The character\'s multi-day test finds fruit has an effect only once daily and grants a random positive capacity increase.','reported experiment by protagonist','No global ceiling or world-calendar definition is tested.','Proposal: record experiment evidence and a per-carrier effective-use cadence.'),
 ('MM04','cae62499d701','50消費','Creating a small refill potion costs more mana than it restores; stored emergency relief differs from profitable energy production.','character\'s reported cost and use rationale','Approximate figures, not a proven universal transmutation rate.','Proposal: track a recipe\'s input, output and timing before calling it a loop.')],
'D025':[
 ('DG01','7e3a4117805e','二十三時間','Narrated public observations give skill orbs an expiry of 23 hours, 56 minutes and 4 seconds from appearing, creating local delivery and stockpiling problems.','narrated world history','Storage exceptions are not tested in the read pages; claimed society policy is fictional.','Proposal: give a power carrier its own expiry, separate from the granted skill.'),
 ('DG02','7e3a4117805e','カードを出現','Skill-orb use requires a dungeon card; the protagonist receives one after an accidental vehicle kill.','narrated eligibility and witnessed card acquisition','Orb activation not yet shown; the ranking\'s experience interpretation is presented as a belief.','Proposal: distinguish access credential, power acquisition and appraisal.'),
 ('DG03','7e3a4117805e','ダンジョン深度','A broadcast distinguishes explored floors from sensor-estimated depth; physical depth is not known to map exactly to floor count.','in-world expert report','This is an appraisal method, not author-guaranteed total knowledge.','Proposal: keep measured, estimated and visited extent separate.')]
}
claims={};sources=[]
for id,entries in DATA.items():
 slug=slugs[id];bookrows=[r for r in acq if r['book']==slug and r.get('text')]
 sourcemap={Path(r['text']).stem:r for r in bookrows}
 out=[]
 for cid,member,needle,text,mode,caveat,proposal in entries:
  r=sourcemap[member];p=Path(r['text']);lines=p.read_text().splitlines();matches=[i+1 for i,t in enumerate(lines) if needle in t]
  if not matches:raise ValueError((cid,'missing locator',needle))
  out.append({'id':cid,'claim':text,'mode':mode,'caveat':caveat,'proposal':proposal,'source':{'member':member,'paragraphs':matches,'url':r['url'],'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}})
 claims[id]=out
 (PRIVATE/slug/'CLAIMS.json').write_text(json.dumps({'coverage':'all narrative text in acquired members; original web edition where specified','claims':out},ensure_ascii=False,indent=2)+'\n')
claims['D044']=json.loads((PRIVATE/'pale-lights/CLAIMS.json').read_text())['claims']
for r in acq:
 if r.get('text') and r['status']=='text_acquired':
  p=Path(r['text']);sources.append({'book':r['book'],'id':r['book']+':'+p.stem,'url':r['url'],'private_member':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'paragraphs':len(p.read_text().splitlines()),'coverage':'all narrative text read; social footer excluded for Pale Lights','reader':'root/pale_reader reviewed by root' if r['book']=='pale-lights' else 'root'})
status={k:'No selected local copy; official source unavailable to this client.' for k in slugs}
for k in ['D003','D004','D005','D014']:status[k]='Webnovel stopped on first Cloudflare challenge; Qidian robots disallow GPTBot. No chapter fetch on either stopped host.'
status['D016']='Qidian robots disallow GPTBot. Publisher booklist remains metadata only.'
status['D017']='Normal pages for free episodes 1-4 returned no novel body; catalogue marks episode 6 paid. No API or token used; rendering route stopped.'
for k in ['D033','D034','D036','D039']:status[k]='Royal Road robots disallow GPTBot; same-host refusal reused, no retry for another title.'
for k in claims:status[k]='Bounded official free text read; more text needed for unresolved/later mechanics.'
rows=[]
for rank,c in enumerate(selection,1):
 id=c['id'];slug=slugs[id];r=json.loads(json.dumps(baseline[id]));r.update(selection_rank=rank,novelty_score=c['novelty_score'],author=c['author'],platform=c['platform'],original_title=c.get('original_title'),acquisition={'status':status[id],'private_folder':str(PRIVATE/slug),'chapter_count':sum(x['book']==slug for x in sources),'full_book_read':False,'edition':'original Japanese web edition, not English light novel' if id in ['D025','D026','D027'] else 'original author web Book 1 (2022)' if id=='D044' else 'licensed English publisher sample' if id=='D018' else None},claims=claims.get(id,[]),metadata_hook=c['verified_hook'],unknowns=c['unknowns'],evidence_basis='Lane D metadata mapping retained separately; each new chapter claim has source locator, mode and caveat.',proposals_status='proposal; not accepted or implemented')
 r['mapping_status']='Metadata classification only' if not r['claims'] else 'Chapter-supported additions below; baseline metadata mapping retained where not superseded.'
 if id=='D018':
  r['path'].update(currency='Mana for spells; magic books/items feed the grimoire',steps='Circles; Theo second circle; graduation third circle',gate={'acquisition':'Unidentified grimoire enters left palm','advancement':'Circle mastery and usable control; consumed books improve functions'},risk='Assimilation overload observed; hungry grimoire predation warned',shape='Circle ladder plus separate knowledge/control functions',grader='Academy assesses written and practical graduation separately')
  r['axes'].update(mechanism='Book consumption transfers functional wisdom',trigger='Palm grimoire eats supplied book',price='Consumed material; overload; provider hunger',growth='Specific spells, affinity, control and craft functions')
 elif id=='D025':
  r['path']['gate']={'acquisition':'First monster kill gives dungeon card; card needed to use orb','advancement':None};r['axes'].update(limit='Orb expires; card required',persistence='Carrier expiry known; skill retention not exercised',certainty='World appraisals can be reported estimates, not direct measurements')
 elif id=='D026':
  r['path'].update(currency='Mana to create; XP or daily fruit raises capacity',steps='Levels; read opening reaches level five',gate={'acquisition':'Goddess grants selected Creation skill','advancement':'Kills and daily effective fruit consumption'},risk='Mana depletion sickness observed',shape='Level ladder plus capacity-growth loop')
  r['axes'].update(price='Mana expenditure; depletion',limit='Fruit effective once per day; capacity is not refill',growth='Random positive daily capacity increments',certainty='Protagonist experiment/estimates; not omniscient numerical UI')
 elif id=='D027':
  r['path'].update(currency='Character setup points; later skill XP',gate={'acquisition':'Spend allocated points; Help exposes terms','advancement':'Copied skills need source-holder teaching'},risk='Displayed hidden prices; no misuse outcome performed',shape='Setup menu plus independently learned skills',grader='Provider allocates points from prior life; later grade unknown')
  r['axes'].update(mechanism='Menu grants skills; Help exposes hidden clauses',price='Setup points; skill-specific future costs',limit='Copied skills start sealed at level one',certainty='Displayed terms supported; fatal theft result inferred, not witnessed')
 elif id=='D044':
  r['path'].update(currency='Borrowed luck incurs later misfortune; Fisher price not specified',steps=None,gate={'acquisition':'Personal patron contract; formation not shown','advancement':None},risk='Luck bill worsens with delay; combat and pursuit remain dangerous',shape=None,grader=None)
  r['axes'].update(mechanism='Luck intervention and short action-linked foresight are distinct',trigger='Holder activation; one patron-initiated rescue',certainty='Forecast ontology unstated; conditional acts tested',price='Qualitative luck debt; Fisher price unknown',limit='Patron material reach and judgment differ',visibility='Private patron perception; behavioral power tells remain inference',persistence='Ongoing pact; cross-life retention unknown',growth='Control/habit practice; no staged power growth shown')
 r['chapter_mapping_source_ids']=[x['id'] for x in r['claims']]
 if id=='D044':
  r['vows_contracts_costs']['chapter_costs']={'mechanism_kind':'patron pact cost, not demonstrated vow breach','payer':'Tristan','supplier':'Fortuna','trade':'Borrow luck now; later misfortune on release','bill_growth':'Delay worsens bill; harm use qualitatively worse (narration)','breach':None,'interpretation_trick':'Five-breath rearm is a separate local honour convention','collective_rules':'Watch service reported as seven-year oath; collective magical enforcement unknown','sources':['PL03','PL07','PL08','PL14','PL15']}
 elif id in ['D018','D025','D026','D027']:
  r['vows_contracts_costs']['chapter_costs']={'mechanism_kind':'technique/resource/eligibility rule','trade':r['axes']['price'],'limit':r['axes']['limit'],'breach':None,'collective_rules':None,'source_ids':r['chapter_mapping_source_ids']}

 # Explicitly classify new costs instead of filling unsupported vow slots.
 if id in ['D018','D025','D026','D027']:
  r['vows_contracts_costs']['chapter_classification']='Technique/resource/eligibility rule, not established as vow. No breach sanction inferred.'
 if id=='D044':r['vows_contracts_costs']['chapter_classification']='Patron pact, revenge promise, Watch service oath and local honour convention remain separate. No magical oath breach consequence shown.'
 rows.append(r)
 folder=PRIVATE/slug;folder.mkdir(parents=True,exist_ok=True);(folder/'sources').mkdir(exist_ok=True)
 if id!='D044':
  lines=['# '+c['title']+' bounded source notes','',status[id],'','Read scope: '+str(r['acquisition']['chapter_count'])+' acquired chapter(s), no full-book claim.','']
  for s in sources:
   if s['id'].startswith(slug+':'):lines += ['- '+s['id']+' | '+s['url']+' | SHA-256 '+s['sha256']+' | all '+str(s['paragraphs'])+' text lines read.']
  lines += ['','Chapter findings and proposals:','']
  for cl in r['claims']:lines += ['- '+cl['id']+': '+cl['claim']+' Evidence: '+cl['mode']+'. '+cl['caveat']+' '+cl['proposal']]
  lines += ['','Metadata-only lead: '+c['verified_hook'],'','Unknowns: '+str(c['unknowns']),'','Full E8-E8D mapping and evidence split: tracked novel-crawl/SERIES.json, row '+id+'.']
  (folder/'READING.md').write_text('\n'.join(lines)+'\n')
(OUT/'SERIES.json').write_text(json.dumps({'schema_version':1,'lane':'N','status':'research delivery; access-limited source coverage','selection':'top 15 descending novelty, stable candidate order ties','series':rows,'chapter_sources':sources,'no_gameplay_changes':True},ensure_ascii=False,indent=2)+'\n')
(OUT/'SOURCES.md').write_text('# Lane N sources and evidence\n\nSelection and metadata: ../broad-scout/CANDIDATES.json and SERIES.json, frozen by SELECTION.json. No chapter claims derive from a search snippet. Each chapter claim is paraphrased, with member/hash/locator, narrator or character mode, and caveat.\n\n## Direct chapter sources\n\n'+ '\n'.join('- '+s['id']+': ['+s['id']+']('+s['url']+') | SHA-256 '+s['sha256']+' | all narrative text read.' for s in sources)+'\n\n## Acquisition receipts\n\nROUTES.json records official landing qualification. ACQUISITION.json records normal chapter requests and extraction. EPUBS.json records five offline FanFicFare packages, 11 chapters total. Private transport/requests.jsonl stores UTC, status, bytes, hashes and host refusal receipts. No source-library rewrite, login or purchase.\n\nRoyal Road and Qidian disallow GPTBot. Webnovel and Wuxiaworld each served a challenge; Wuxiaworld chapters 1-3 were already acquired before chapter 4 stopped the host. J-Novel returned 308 and was not followed. Tappytoon free-page bodies were not rendered; no guest/API credential used. All other same-host candidates reuse the refusal instead of retrying.\n\n## Tool scope\n\nThe supplied polite CLI supports Fanqie only; no selected title had a verified legitimate Fanqie edition. The Royal Road FanFicFare attempt used fff_polite.py and stopped at robots. For normal publisher/author HTML, the existing lncrawl-polite Client provided the same policy transport; package_epubs.py used FanFicFare offline for EPUBs. This is not a claim that the stock CLI supports these publishers. Source texts/cache and reading notes stay gitignored.\n\n## Edition and evidence limits\n\nJapanese sources are original web editions, not verification of English light-novel editions. Pale Lights is original Book 1 (2022), not the similarly numbered 2023 Book 2 pages. Book Eater is Wuxiaworld licensed English text. Five bounded samples are not five completed books. Metadata-only series retain null exact rules. No remembered source claims were promoted.\n')
print('Assembled',len(rows),'series,',len(sources),'chapter sources')
