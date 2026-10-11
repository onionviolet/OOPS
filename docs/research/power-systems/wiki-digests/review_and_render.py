"""Render lane W research only. This script never fetches or changes gameplay."""
import json,pathlib,re,hashlib,fcntl
O=pathlib.Path(__file__).resolve().parent
R=O.parents[3]
if (O/'DUMP_COVERAGE.json').exists():raise SystemExit('Historical API-baseline renderer disabled after dump integration; use integrate_dumps.py for current outputs.')
A=json.loads((O/'ACQUISITION.json').read_text())
# Claim text is original paraphrase; maps and takeaways are analyst proposals.
C=[]
def claim(code,series,page,section,text,take,delta):
 C.append(dict(id=code,series=series,page=page,section=section,text=text,proposal=take,delta=delta,status='wiki_revision_reviewed_secondary'))
T='The Wandering Inn';P='Path of Exile 1 support gems'
claim('W01',T,'Classes','Leveling','A level can take effect before its sleep-time announcement. Some classes and bodies have different notice rules.','Keep the change, the notice and the recipient as separate events.','E8 visibility: notice timing')
claim('W02',T,'Classes','Class Consolidation','After certain classes merge, work in one part can advance the whole; maid duties can advance a merged combat path.','A merged path must state which activities earn shared growth.','E8C branching: activity routing after fusion')
claim('W03',T,'Classes','Limits and Consequences','A total of one hundred across several classes is not a proven ceiling; the page records people above that total.','Store a per-class threshold separately from a total-level estimate.','E8C ceiling: measurement basis')
claim('W04',T,'Skills','Learning Skills','A person can first perform a method unaided and then have it recognized as a Skill without gaining a level.','Allow execution-first recognition instead of always reward-first learning.','E8C gate: demonstrated execution')
claim('W05',T,'Skills','Combination Skills','Some joint techniques later work for one contributor; others keep requiring the original team.','A combined technique needs an explicit participant set and a rule for later solo use.','E8B composed/shared: participant retention')
claim('W06',T,'Skills','Mischief Skills','Some prank-related Skills bank the results of antics and spend that credit on stronger effects.','Let completed jokes supply a stored local currency, rather than merely pricing a silly vow.','E8B source: banked acts')
claim('W07',T,'Skills','Ward Skills','A ward can receive abilities tied to a designated guardian.','Record the named provider and the relationship from which each borrowed effect comes.','E8B granted/shared: guardian provenance')
claim('W08',T,'Skills','Vows','Declared vows can grant Skills outside normal leveling; monastic examples include benefits that deepen with time. The section does not give a general breach penalty.','Separate growth from keeping a vow from its unverified breach law.','E8D benefit and ramp established; consequence unknown')
claim('W09',T,'Conditions','Background','Some conditions are hidden from their bearer, with notice arriving only after removal.','Allow discovery to lag behind both application and cure.','E8 visibility: retrospective notice')
claim('W10',T,'Aspects','Overview and examples','This wiki uses Aspects for body-changing Skills, including a temporary iron-like body.','Keep source terms namespaced so a body effect is not mistaken for one of our ten descriptive axes.','E8 vocabulary: source term distinct from model axis')
claim('W11',T,'Quests','Requirements','Quest posting needs knowledge of a real objective and a guaranteed tangible reward; not every imagined target qualifies.','Separate knowledge eligibility, reward custody and posting authority.','E8B quest giving: admissibility before posting')
claim('W12',T,'Grand Design of Isthekenous','Overview','The system can move experience from one activity category to another and alter its multiplier; chess is an example.','A local system may revise reward routing while retaining a dated rule version.','E8C currency: versioned activity weights')
claim('W13',T,'Grand Design of Isthekenous','Overview','The system distills feats into Skills; the copy need not match the original feat.','Record the source demonstration and the fidelity of the granted version.','E8 source/mastery: imitation fidelity')
claim('W14',T,'Trials of Levelling','Overview','A species can finish the trials and still be rejected at the later judgment. Knowledge of the trials is suppressed for many system users.','Keep task completion, admission and ability to know the gate separate.','E8C gate and grader: collective eligibility')
claim('W15',T,'Artifacts','Magical Dissonance','Several active artifacts near each other can interfere. Inactive items in a holding bag avoid this; balancing leakage changes the safe load.','Use active leakage and proximity rather than a fixed count of carried items.','E8 limit: spatial aggregate interference')
claim('W16',T,'Artifacts','Enchantment Degradation','Magic-producing monsters can preserve nearby enchantments; leaked magic also benefits the monsters.','Preservation can create a useful but dangerous local ecology.','E8 persistence: ecological carrier support')
claim('W17',T,'Horror Ranks','Background','Horror advancement degrades ordinary classes. This page says lost ranks can restore levels, while Classes and Skills leave restoration unresolved.','Keep conflicting witness records until a primary scene resolves which losses return.','E8C risk: competing paths with disputed recovery')
claim('W18',T,'Magic','Categories of magic','The page distinguishes mana-based casting, emotion-based witchcraft, community-based shamanism and faith-based miracles.','Make fuel and suppression rules depend on the actual source.','E8B source: different budgets and counters')
claim('P01',P,'Support gem','Mechanics','Tags alone do not establish support compatibility. One support can modify several compatible linked skills; several supports can modify one skill.','Validate an effect contract and its socket group before composition.','E8B composition: reinforces existing typed-contract proposal')
claim('P02',P,'Support gem','Mechanics and Greater supports','Duplicate supports do not simply stack. Stronger versions can replace ordinary versions on the same skill.','Resolve a replacement family before applying modifiers.','E8B composition: precedence and exclusion families')
claim('P03',P,'Support gem','Mechanics','Two copies of the same skill in different support groups can provide distinct usable versions.','Give each configured skill instance its own identity.','E8 object: configuration instance')
claim('P04',P,'Skill gem','Overview','Leveling a gem strengthens it but can also raise its character-level and attribute requirements.','Growth can improve an item while making its current host unable to use it.','E8C gate: moving host requirement')
claim('P05',P,'Gem tag','Mechanics','Gem tags belong to the item. A single gem can grant two skills with different behavior and support eligibility.','Separate labels on the carrier from capabilities of each granted effect.','E8 object: carrier labels versus payload behavior')
claim('P06',P,'Trigger','Mechanics','Adding two trigger conditions to the same skill disables it. Different skills can still form a chain with one trigger each.','Validate each trigger node instead of rejecting or allowing the whole chain by one broad tag.','E8 trigger: arity constraint')
claim('P07',P,'Trigger','Interactions','A triggered effect is not counted as a manual use or cast for effects that listen for those events.','Retain event kind and origin when a reaction creates another event.','E8D breach watchers: semantic event kinds')
claim('P08',P,'Trigger','Mechanics and Multiple triggered skills','Triggered effects still pay costs. Their cooldowns belong to skills; some systems fire independently while others select one eligible skill at a time.','Describe automatic delivery, scheduling, cost and cooldown separately.','E8B reactive: arbitration policy')
claim('P09',P,'Reservation','Overview','Reservation locks part of a resource while an effect stays active without reducing the resource maximum.','Track capacity, locked budget and spendable balance separately.','E8 price: reservation versus expenditure')
claim('P10',P,'Reservation','Reservation Efficiency','A modifier to ordinary spending cost does not necessarily reduce reservation; their calculations differ.','Bind discounts to a named cost operation.','E8 price: operation-specific modifiers')
# Review checks page existence and revision but cannot replace human semantic review.
pageindex={}
for host in A['hosts'].values():
 for p in host['pages']:
  if p['state']=='acquired':
   for series in p['series']:pageindex[(series,p['title'])]=p
for c in C:
 p=pageindex.get((c['series'],c['page']))
 if not p:raise ValueError('Reviewed claim has no acquired revision: '+c['id'])
 c.update(revision_id=p['revision_id'],source_url=p['revision_url'],response_sha256=p['sha256'])
(O/'REVIEW.json').write_text(json.dumps({'state':'bounded_secondary_revision_review','claims':C,'limits':'Selected overview/mechanics sections reviewed; no primary canon certification, no transcluded table completeness.'},ensure_ascii=False,indent=2)+'\n')
def clean(x):return str(x).replace('|',' / ').replace('\n',' ').replace('—',', ')
def value(x):
 if isinstance(x,dict):
  for k in ['value','text','variant','values']:
   if k in x:return value(x[k])
  return 'not specified in prior row'
 if isinstance(x,list):return ', '.join(value(y) for y in x)
 return 'unknown' if x is None else clean(x)
def link(p):return '['+p['title']+' r'+str(p['revision_id'])+']('+p['revision_url']+')'
AXES=['object','mechanism','trigger','certainty','scope','price','limit','visibility','persistence','growth']
SLOTS=['swearer','restriction','object','scope','duration','benefit','consequence','witness','condition','ramp','stake','counterparty','release','visibility','inheritance','interpretation','coercion_clause']
rows=[]
for r in A['series']:
 owned=[c for c in C if c['series']==r['title']]
 acquired=[p for h in A['hosts'].values() for p in h['pages'] if r['title'] in p['series'] and p['state']=='acquired']
 hosts=[h for h in A['hosts'].values() if any(u.startswith('https://'+h['host']+'/') for u in r['urls'])]
 status='revision_digest_available' if acquired else 'blocked_no_revision' if hosts else 'no_qualified_wiki_identified'
 lines=['# '+r['title']+' wiki digest','', 'State: '+status+'. Checked 2026-10-10 UTC.','', 'This is a mechanics research record, not an accepted design or gameplay change. Wiki statements are secondary evidence. All E8 mappings are analyst inference; all takeaways are proposals.','']
 if owned:
  lines+=['## Revision-reviewed mechanics','']
  for c in owned:lines+=['**'+c['id']+' '+c['page']+' / '+c['section']+'.** '+c['text']+' ['+c['page']+' r'+str(c['revision_id'])+']('+c['source_url']+').','','Mapping: '+c['delta']+'. Proposal: '+c['proposal'],'']
 else:lines+=['## Evidence limit','','No article revision was acquired for this subject. There is no fresh wiki correction, confirmed gag, breach law or canon claim in this digest. The tables below preserve earlier lane mappings as leads only.','']
 lines+=['## Source attempts','', '| Host or route | Outcome |','|---|---|']
 for h in hosts:lines+=['| '+h['host']+' | '+('API revisions acquired; see sources below' if h['pages'] else clean(h.get('reason','unknown')))+' |']
 if not hosts:lines+=['| No eligible MediaWiki source in supplied metadata | Category or unresolved wiki discovery; no guessed article treated as evidence |']
 for p in acquired:lines+=['',link(p)+'. Response SHA-256: `'+p['sha256']+'`.']
 if acquired:lines+=['','Scope: page introduction and named mechanics sections only. Templates and linked chapters were not expanded or fetched. The long catalogs are not claimed complete.']
 lines+=['','## Earlier lane mappings, not verified by lane W','']
 for ptr in r['rows']:
  d=json.loads((R/ptr['path']).read_text()); key='series' if 'series' in d else 'candidates';matches=[x for x in d[key] if x.get('id')==ptr['id'] and x.get('title',x.get('name'))==r['title']]
  if not matches:continue
  row=matches[0]
  if ptr['lane']=='broad-scout':
   lines+=['Prior metadata hook, not wiki evidence: '+clean(row.get('verified_hook','not supplied')),'','Prior proposal: '+clean(row.get('proposal','not supplied')),'','Unknowns: '+value(row.get('unknowns')),'']
  lines+=['Input: ['+ptr['lane']+' '+str(ptr['id'])+'](../'+ptr['lane']+'/'+('CANDIDATES.json' if ptr['lane']=='broad-scout' else 'SERIES.json')+'). Existing evidence labels stay with that row.','']
  if 'path' in row:
   lines+=['| E8C part | Prior mapping, unverified here |','|---|---|']
   for k in ['currency','steps','gate','risk','shape','branching','grader','ceiling']:lines+=['| '+k+' | '+value(row['path'].get(k))+' |']
  lines+=['','E8B families: '+value(row.get('families'))+'. Sources: '+value(row.get('power_sources'))+'.','']
  ax=row.get('axes',row.get('axis_variants',{}));lines+=['| E8 axis | Prior mapping, unverified here |','|---|---|']
  for k in AXES:lines+=['| '+k+' | '+value(ax.get(k))+' |']
  vow=row.get('contracts_and_costs',row.get('vows_contracts_costs',row.get('vows',{})));vow=vow[0] if isinstance(vow,list) and vow else vow;vow=vow if isinstance(vow,dict) else {};slots=vow.get('slots',{})
  lines+=['','| E8D slot | Prior mapping, unverified here |','|---|---|']
  for k in SLOTS:lines+=['| '+k+' | '+value(slots.get(k))+' |']
  lines+=['','No absent slot implies that this source forbids it. Source penalties and loopholes require a checked scene or revision.','']
 if r['title']==T:
  lines+=['## Fresh mapping amendments','','E8C: activity and insight feed a class ladder that can branch, merge, lose permission and restore it. System appraisal is separate from public rank and sleep-time notice. No cumulative-100 ceiling is established. Risks include class loss, conflicting paths and active artifact leakage.','', 'E8B: trained mastery, system grants, body effects, shared powers, item effects, banked antics and community fuel are distinct means.','', 'E8 axes: object includes each recipient and carrier; mechanism includes system recognition; trigger can be a joint act; certainty retains page conflicts; scope can follow a linked group; price includes banked acts and fuel; limit includes admission and leakage; visibility includes hidden conditions; persistence follows restored class access or artifact ecology; growth follows tasks, insight, fusion and local rule changes.','', 'E8D: vow bearer, restriction, benefit and time growth are described in Skills / Vows. Witness, breach punishment, release, coercion, inheritance and exact interpretation remain unknown. Do not fill them from the general E8D template.','', 'Rule abuse: merged maid/combat classes route maid work into combat growth (W02). This is a described interaction, not a checked gag scene.','']
 if r['title']==P:
  lines+=['## Fresh mapping amendments','','E8C: gems grow through use while host gates can rise; a build is a socket graph and passive/ascendancy branch, not one universal level. Costs include per-use spending and reserved capacity.','', 'E8B: item-bound, trained and composed effects have separate carrier, payload and link-group states. A trigger does not turn these into a vow.','', 'E8 axes: object separates gem and skill instance; mechanism checks effect capabilities; trigger has a local one-source constraint; certainty comes from compatibility; scope follows the link group; price distinguishes spend and reserve; limit includes host requirements; visibility is a tooltip with limited semantics; persistence follows item and build custody; growth follows gem level and configuration.','', 'E8D: no promise, witness or breach sanction is established by these pages. Costs and trigger constraints do not by themselves make a contract. Proposal: breach watchers should distinguish a manual cast from a triggered effect (P07).','', 'Rule abuse: several skills can share supports, while duplicate supports replace rather than multiply; multi-step triggers can be valid even though two triggers on one node fail. No comedic scene checked.','']
 (O/('DIGEST_'+r['slug']+'.md')).write_text('\n'.join(lines)+'\n')
 rows.append(dict(title=r['title'],slug=r['slug'],state=status,input_rows=r['rows'],revision_ids=[p['revision_id'] for p in acquired],claim_ids=[c['id'] for c in owned],urls=r['urls']))
(O/'SERIES.json').write_text(json.dumps({'lane':'W','date':'2026-10-10','state':'bounded_digests_with_access_backlog','series':rows,'evidence_policy':'No revision means no fresh wiki claim. Earlier mappings are explicitly unverified here.'},ensure_ascii=False,indent=2)+'\n')
# Private receipt inventory includes robots refusals; no raw text copied to tracked output.
cache=pathlib.Path.home()/'.codex/research/wikis/lane-w-transport/cache'
receipts=[json.loads(p.read_text()) for p in cache.glob('*.json')]
for h in A['hosts'].values():h['request_receipts']=[x for x in receipts if x['url'].startswith('https://'+h['host']+'/')]
(O/'ACQUISITION.json').write_text(json.dumps(A,ensure_ascii=False,indent=2)+'\n')
s=['# Lane W sources','','Date: 2026-10-10 UTC. Source roles and claims remain distinct.','', 'Crawler: crawl_wikis.py imports the unchanged GPL-3.0-or-later polite transport from /Users/weiwei/code/lncrawl-polite/lncrawl/polite/transport.py. No code in that repository was changed.','', 'User agent: `YAIRPG-wiki-research/1.0 (personal research; AI-assisted; no login)`. No cookies, login, proxies, redirect following or browser challenges. Robots checked before API help, with the actual client and named AI identities. The API help is documentation, sometimes HTML; articles are query/revisions JSON only. Requests use maxlag=5, serial host access and persistent randomized 4 to 8 second pacing. Budget is 300 article requests per host, below the assignment ceiling of 400. Responses are hash-cached and never refetched.','', 'Raw bodies and per-wiki revision indexes: ~/.codex/research/wikis/. Tracked receipts contain hashes and URLs only. Claim citations use fixed oldid links. Wiki editors are the secondary source; linked novel chapters or staff posts were not fetched. License is recorded from siteinfo when available, not assumed from the host brand.','', '## Input snapshots','']
for x in A['inputs']:s+=['- `'+x['path']+'`: `'+x['sha256']+'`.']
s+=['','## Acquired revisions','', '| Series | Page revision | Response hash |','|---|---|---|']
for h in A['hosts'].values():
 for p in h['pages']:
  if p['state']=='acquired':s+=['| '+', '.join(p['series'])+' | '+link(p)+' | `'+p['sha256']+'` |']
s+=['','## Host checks and refusals','','| Host | Check URL and status | SHA-256 | Outcome |','|---|---|---|---|']
for h in A['hosts'].values():
 for x in h['request_receipts']:
  if '/robots.txt' in x['url'] or 'action=help' in x['url']:s+=['| '+h['host']+' | ['+str(x['status'])+']('+x['url']+') | `'+x['sha256']+'` | '+clean(h.get('reason','API available'))+' |']
 if not h['request_receipts']:s+=['| '+h['host']+' | No body received | unknown | '+clean(h.get('reason','unknown'))+' |']
 if 'siteinfo' in h:s+=['| '+h['host']+' | [License siteinfo]('+h['siteinfo']['url']+') | `'+h['siteinfo']['receipt']['sha256']+'` | '+clean(h['siteinfo']['data'].get('rightsinfo',{}))+' |']
(O/'SOURCES.md').write_text('\n'.join(s)+'\n')
print('Rendered',len(rows),'digests;',len(C),'reviewed claims')
# Ranked additions describe concrete deltas to live E8, not new families invented by a blocked crawl.
rank=['W15','P07','W01','W02','P06','P05','P09','W14','W05','W11','W06','W16','P04','P02','W07']
novelty={
'W15':('Spatial leakage budget','Existing gear state does not specify the aggregate spatial test or tuning the leakage.'),
'P07':('Event meaning survives automation','Reactive delivery is listed, but an effect and a manual cast need separate hook identities.'),
'W01':('Change before notice','Visibility is listed; announcement scheduling and observer-specific event times are not explicit.'),
'W02':('Activity routing after a merge','Fusion is listed; which activity advances which fused component needs a rule.'),
'P06':('One trigger per node, legal chains','Conditions are listed; graph node constraints are a distinct local rule.'),
'P05':('Carrier label differs from each payload','Typed composition is already proposed; multi-payload item semantics make it concrete.'),
'P09':('Reservation is a separate budget','Price is an axis; a locked fraction that leaves maximum capacity intact needs its own operation.'),
'W14':('Admission after collective trials','Trials are listed; completion, collective judgment and censored gate knowledge are separate.'),
'W05':('A joint technique can become solo','Shared/composed delivery is listed; contributor retention is not explicit.'),
'W11':('Quest posting checks reality and backing','Quest giving exists; knowledge admissibility and guaranteed reward custody add checks.'),
'W06':('Bank the results of jokes','Absurdity pricing exists; stored prank credit spent on other effects is different.'),
'W16':('A threat preserves its treasure','Power ecosystems exist; mutual preservation between leaking artifacts and monsters adds a specific loop.'),
'P04':('Growth raises a host gate','Growth/gates exist; a stronger tool can stop being executable by its current host.'),
'P02':('Support replacement families','Typed composition exists; strongest-only and greater-version precedence need explicit grouping.'),
'W07':('Borrow through a named guardian','Bonds and grants exist; the relationship selects whose payload can be lent.')}
n=['# New mechanics and concrete refinements','','Ranked by the change in player decisions and the gap in E8 to E8D, not by franchise power. All takeaways are proposals. These are 15 candidate deltas from two acquired wikis, not 15 newly verified series or accepted engine requirements. No blocked series supplies a fresh claim.','','| Rank / code | Mechanic | Gap after comparing live E8 | Evidence and proposal |','|---|---|---|---|']
for i,cid in enumerate(rank,1):
 c=next(c for c in C if c['id']==cid);name,gap=novelty[cid];n+=['| '+str(i)+' / M'+str(i)+' | '+name+' | '+gap+' | ['+cid+' '+c['page']+']('+c['source_url']+'): Proposal: '+c['proposal']+' |']
n+=['','## Fold-in proposals','','**D1 E8:** add carrier/payload identity, applied versus noticed time, reserved versus spent resources, event kind and fidelity of copied effects. These fields refine axes without forcing a shared law.','','**D2 E8B:** add participant retention, replacement families, local aggregate interference and named guardian provenance. Keep labels separate from behavior checks.','','**D3 E8C:** give merged paths an activity router; keep collective admission and local graders distinct from task completion. Item growth can alter its execution gate.','','**D4 E8D:** breach hooks consume typed events, not only matching power tags. Keep an unknown sanction unknown; the Inn vow section does not certify JJK-like pricing or punishment.','','Not ranked as new: typed composition (P01), mastery versus system grants (W04), versioned reward weights (W12), and imitation fidelity (W13) already have close owners in the survey fold-in or system-patch proposals. They are useful supporting examples, not a second invention.']
(O/'NEW_MECHANICS.md').write_text('\n'.join(n)+'\n')
# Append source requests using the live next-free ID, preserving all earlier and concurrent lane entries.
requestpath=R/'docs/research/SOURCE_REQUESTS.md'
request_records=[]
with requestpath.open('a+',encoding='utf-8') as f:
 fcntl.flock(f,fcntl.LOCK_EX);f.seek(0);before=f.read();maxid=max([int(x) for x in re.findall(r'^\| S(\d+) \|',before,re.M)] or [0]);append=[]
 for api,h in A['hosts'].items():
  if h['state']!='blocked':continue
  label='Lane W wiki: '+h['host']
  existing=re.search(r'^\| (S\d+) \| '+re.escape(label)+r' \|.*$',before,re.M)
  titles=[r['title'] for r in A['series'] if any(u.startswith('https://'+h['host']+'/') for u in r['urls'])]
  urls=[u for r in A['series'] for u in r['urls'] if u.startswith('https://'+h['host']+'/')]
  if existing:sid=existing.group(1)
  else:
   maxid+=1;sid='S'+str(maxid);reason=clean(h.get('reason','blocked'));append.append('| '+sid+' | '+label+' | '+(urls[0] if urls else api)+' | '+reason+'. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |')
  request_records.append({'id':sid,'host':h['host'],'api':api,'series':titles,'requested_urls':list(dict.fromkeys(urls)),'reason':h.get('reason')})
 if append:
  block='\n\n## Lane W wiki access requests, 2026-10-10\n\nRaw pages go under `~/.codex/research/wikis/<wiki>/`, outside git. These are access requests, not verified source claims. Do not retry refused hosts during this session.\n\n| ID | Book or wiki | Where | Why | Status |\n|---|---|---|---|---|\n'+'\n'.join(append)+'\n';f.write(block);f.flush()
 fcntl.flock(f,fcntl.LOCK_UN)
(O/'SOURCE_REQUEST_INDEX.json').write_text(json.dumps({'state':'open','requests':request_records},ensure_ascii=False,indent=2)+'\n')
# Plain report plus complete title coverage inventory.
counts={state:sum(x['state']==state for x in rows) for state in set(x['state'] for x in rows)}
acquired=[p for h in A['hosts'].values() for p in h['pages'] if p['state']=='acquired'];distinct={(p['revision_url'],p['revision_id']) for p in acquired}
report=['# Lane W power-system wiki report','','The authorized polite pass is finished; source acquisition remains incomplete. All 115 distinct subjects from A to D have a digest or an explicit coverage record. Two wikis supplied 21 article responses with 20 distinct revisions (Link redirects to Item socket). Seventy-three hosts were stopped. No revision was obtained for the other subjects; a digest file is not proof of wiki verification.','','**F1 Scope:** 67 A to C rows reduce to 65 subjects; D adds 50 candidates. Discovery searched all D titles and kept matching wiki leads. Unrelated homonyms, battle-fanon matches to other works and character-only results were excluded. A missing wiki is unresolved discovery, not proof none exists.','','**F2 Result:** 28 claims have bounded secondary revision evidence. The strongest additions are artifact leakage budgets, separate manual/triggered event semantics, delayed notice and fused-path activity routing. See [ranked 15 mechanics](NEW_MECHANICS.md), [corrections](CORRECTIONS.md), [claim ledger](REVIEW.json) and [sources](SOURCES.md).','','**F3 Access:** most refusals were 403 challenge pages. Other stops were robots API exclusions or a robots redirect. None was bypassed. The initial API-help JSON assumption was a local error: the two recognizable HTML help pages were read from cache, then article access continued through JSON. API help is documentation, not article scraping.','','**F4 Source gates:** '+str(counts.get('blocked_no_revision',0))+' subjects have a blocked qualified wiki; '+str(counts.get('no_qualified_wiki_identified',0))+' have no qualified wiki found in the bounded discovery. Shared [SOURCE_REQUESTS](../../SOURCE_REQUESTS.md) now records '+str(len(request_records))+' host requests, with exact titles/pages in [SOURCE_REQUEST_INDEX.json](SOURCE_REQUEST_INDEX.json). Supply a permitted saved page or revision export; blocked hosts remain stopped.','','**D1 Proposal status:** all mapped fields and takeaways remain agent proposals. Claude owns any E8 fold-in. No E8, gameplay source, bundle, save, source-library, commit or publication changes were made. No rebuild or gameplay check applies to this research-only task.','','## Vows, contracts and comparable costs','','| Subject | Evidence state | Exchange or constraint | Enforcement and unknowns |','|---|---|---|---|','| The Wandering Inn | W08, revision-reviewed Skills / Vows | Declared restrictions grant Skills; some deepen over time | General breach sanction, witness, release and coercion rule not given in checked section |','| Path of Exile 1 | P01 to P10, revision-reviewed | Socket configuration, activation cost and reserved budget | Mechanical compatibility is not an oath. No vow witness or breach punishment established |','| Jujutsu Kaisen | Prior A02 only; wiki blocked | Self versus mutual vows, disclosure and overtime are prior leads | Exact penalties and loopholes remain unverified by W |','| Chainsaw Man | Prior A01 only; wiki blocked | Devil-specific bargain and payments are prior leads | Death-on-breach and partner eligibility need a supplied revision or primary scene |','| Hunter x Hunter | Prior A03 only; wiki blocked | Technique predicates and restriction costs are prior leads | Do not infer a universal penalty or valuation table |','| Stormlight | Prior C / stormlight only; wiki blocked | Bond progression through ideals or truths | Partner harm and era-specific sanctions need their own source boundary |','| Reverend Insanity | Prior B / RI only; wiki blocked | A constraint can have a removable enforcement substrate | Asymmetric removal remains prior dossier evidence, not fresh wiki proof |','| Fate | Prior A20 only; wiki blocked | Finite authority charges, scope and resource supply | Commands are not guaranteed success; no universal pact breach law certified |','| Myth, monastic and knightly subjects | Prior C rows only; APIs denied | Social rules, religious promises and story-specific bargains differ | No common magical-enforcement rule established |','','Rows labeled prior are comparisons of stored surveys, not fresh factual claims. Their original evidence status and limits stay in the source rows. No gag scene was freshly authenticated; W02 and P06 are described rule interactions.','','## Coverage inventory','','| Subject | State | Digest |','|---|---|---|']
for x in rows:report+=['| '+clean(x['title'])+' | '+x['state']+' | [digest](DIGEST_'+x['slug']+'.md) |']
(O/'REPORT.md').write_text('\n'.join(report)+'\n')
print('Report, ranked mechanics and source requests written;',len(request_records),'open host requests')
