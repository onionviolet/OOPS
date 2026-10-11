"""Assemble the reviewed metadata scout. No network, gameplay or shared writes."""
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[3]
U = None

# Analyst mappings of advertised hooks, never additional source canon.
# title: family, source, object, mechanism, trigger, path shape, rule kind
MAP = {
    'I Have a Super USB Drive': ('interface; creation', 'item-bound', 'USB and eligible fictional inputs', 'carrier with discoverable rules; extraction is review-only', U, 'field', 'activation gate'),
    'My Cell Prison': ('soul work; shapeshifting', 'rebirth; prison-linked source', 'cell body and prison', 'rebirth into a cell; replaceable parts are review-only', U, 'field', 'carrier condition'),
    'Let Me Game in Peace': ('interface; simulation; beasts', 'item-bound phone', 'phone copy of a dimensional zone', 'game attempts yielding power rewards', 'blood payment for another game life', 'field', 'per-attempt cost'),
    'Losing Money to Be a Tycoon': ('interface; wealth', 'granted system', 'business results', 'reward for losses', 'a qualifying loss; precise settlement unknown', 'field', 'reward policy'),
    'Astral Apostle': ('soul work; multiplication', 'projected soul vessels', 'local apostle bodies', 'separate vessels and identities', 'projection', 'web', 'carrier condition'),
    'Seized by the System': ('interface; possession', 'granted autonomous system', 'host body', 'system operates the body', U, 'field', 'imposed control'),
    'Soul of Negary': ('soul work; inheritance', 'remnant soul after stolen aura', 'protagonist aura and remnant self', 'harvesting advantage; later absorption is review-only', U, 'field', 'imposed loss'),
    'My Divine Diary': ('reincarnation; knowledge', 'accident', 'successive lives', 'reincarnation and cumulative knowledge', 'death and another birth', 'field', 'revival condition'),
    'Fantasy Simulator': ('interface; simulation', 'granted simulator', 'simulated life and continuing body', 'simulated outcomes grant outside rewards', U, 'field', 'reward policy'),
    'Carefree Path of Dreams': ('dreams', 'dream route; source specifics unknown', 'dreams and worlds', 'dream-linked progression; reality effect unverified', U, 'field', 'access condition'),
    'Low Dimensional Game': ('creation; will and domain', 'environment access', 'lower-dimensional world', 'local world editing', 'access through an entrance', 'field', 'jurisdiction condition'),
    'Everybody is Kung Fu Fighting, While I Started a Farm': ('plants; creation; interface', 'seed-based system', 'farm and planted inputs', 'growth; invented manuals are review-only', 'planting; eligible objects unknown', 'tree', 'conversion condition'),
    'Doomsday Wonderland': ('adaptation; world travel', 'posthuman adaptation', 'survivor across apocalypse worlds', 'local survival powers', U, 'field', 'world condition'),
    "Trafford's Trading Club": ('contracts and oaths; wealth; lifespan', 'brokered exchange', 'desired outcome and offered possessions', 'trade whose proceeds extend the proprietor life', 'completed transaction', 'web', 'mutual exchange'),
    'Dungeon Reset': ('interface; creation', 'reset exception', 'one dungeon survivor', 'exemption from reset', 'dungeon reset', 'field', 'imposed world rule'),
    'The Book Eating Magician': ('consumption; knowledge', 'consumed books', 'book contents and learner', 'consumption grants a spell', 'book consumption with high understanding in synopsis', 'field', 'consumed input'),
    'The 31st Piece Turns the Tables': ('interface; probability', 'divine game', 'operator turned game piece', 'role transition in a dice-driven game', U, 'field', 'imposed role'),
    'The Main Heroines are Trying to Kill Me': ('regression; memory; interface', 'regressor privilege', 'several prior-timeline witnesses', 'memory retention is shared', 'regression', 'field', 'retention condition'),
    'Kidnapped Dragons': ('regression; revival', 'Vintage Clock authority', 'world time', 'rewind after failure or death', 'death or failed rescue as described by synopsis', 'field', 'revival condition'),
    'I’m an Infinite Regressor, But I’ve Got Stories to Tell': ('regression; memory', 'regression; origin unknown', 'narrator experience', 'many failed runs retained as experience', U, 'field', 'retention condition'),
    'I Became the Necromancer of the Academy': ('soul work', 'not established', 'dead with remaining grievance', 'speaker invites grievance and promises salvation', U, U, 'promise lead, binding unverified'),
    'The S-Classes That I Raised': ('leveling others; leadership', 'granted title', 'stronger people supported by weak bearer', 'nurturing route', U, 'field', 'title condition'),
    'D-Genesis: Three Years after the Dungeons Appeared': ('interface; observation; skill transfer', 'acquired skill; transferable orbs', 'dungeon status and skill orbs', 'private appraisal and power trade', U, 'web', 'expiry condition'),
    'Making Magic: The Sweet Life of a Witch Who Knows an Infinite MP Loophole': ('creation; stat work', 'chosen unique skill', 'created items and mana pool', 'mana-gated creation with pool-growth loophole', 'creation; pool growth described as daily', 'field', 'resource gate'),
    'To Another World... with Land Mines!': ('cursed gift; interface', 'granted reincarnation skills', 'selected ability and bearer', 'attractive grants hide dangerous conditions', 'skill selection; exact harm trigger unknown', 'tree', 'hidden drawback'),
    'Lazy Dungeon Master': ('will and domain; possession', 'dungeon office and core', 'master, core and remote monster body', 'life tied to core; later remote possession', 'core destruction kills master', 'field', 'anchor condition'),
    'Min-Maxing My TRPG Build in Another World': ('interface; knowledge; trained skills', 'rebirth with rulebook access', 'build and universe rules', 'rules knowledge supports optimization', U, 'tree', 'information advantage; service exchange'),
    'Monster Tamer': ('beasts; mind and soul', 'companion grant; exact source unknown', 'monster hearts and companions', 'inner agency and concealed bonds', U, 'web', 'bond lead, terms unverified'),
    'The Magician Who Rose From Failure': ('machines; observation; knowledge', 'prior-life knowledge; trained invention', 'magic as measured by an instrument', 'measurement device', 'use of device; exact operation unknown', 'field', 'measurement condition'),
    'Did I Seriously Just Get Reincarnated as My Gag Character?!': ('shapeshifting; interface', 'rebirth into authored avatar', 'joke avatar body', 'wrong build is the arrival carrier', 'reincarnation', U, 'carrier condition'),
    'The Game at Carousel: A Horror Movie LitRPG': ('presence; conditions; interface', 'role and trope', 'apparent awareness of monsters', 'protection conditional on convincing unawareness', 'convincingly appearing unaware', 'field', 'activation gate'),
    'Godclads': ('inheritance; will and domain; rules', 'stolen divine power; legacy', 'laws of existence', 'ascenders contest rule ownership', U, 'web', 'authority contest'),
    'Slumrat Rising': ('interface; patron grants', 'corporate selection', 'employee access to System Astrologica', 'institution controls access to growth', 'selection', 'field', 'institutional access'),
    'Markets and Multiverses': ('reincarnation; power trade', 'transmigration and between-life market', 'abilities and items between lives', 'many local systems and trading route', 'successive lives', 'web', 'carrier and market condition'),
    'The Daily Grind': ('knowledge; interface', 'office subdimension; review-level skill orbs', 'office space and useful expertise', 'office adventure rewards; precise transfer is review-only', U, 'field', 'reward lead'),
    'All the Dust that Falls': ('machines; leadership', 'summoned vacuum', 'cleaning and followers', 'ordinary purpose in a supernatural world', 'cleaning; exact reward trigger unverified', 'field', 'interpretation lead'),
    'Return of the Runebound Professor': ('revival; soul work; runic craft', 'reincarnation; runes', 'body and injured soul', 'body reforms while soul injury survives', 'death', 'field', 'physical cost'),
    'Minute Mage: A Time Magic LitRPG': ('regression; time', 'acquired time magic', 'short time window', 'limited rewind extended by levels', 'rewind use', 'ladder', 'use limit'),
    'The Stubborn Skill-Grinder In A Time Loop': ('regression; trained skills', 'time loop', 'practice across attempts', 'death returns and repeated practice raises skills', 'death', 'field', 'retention condition'),
    'Industrial Strength Magic': ('machines; interface; magic', 'mixed family sources and system', 'body and selected path', 'system steers a path that conflicts with preference', 'system activation', 'tree', 'imposed incentive'),
    'Double-Blind: A Modern LITRPG': ('presence; interface', 'hidden class; review evidence', 'public classification of bearer', 'false identity; review-only detailed hook', U, 'field', 'concealment lead'),
    'Pale Lights': ('contracts and oaths; patron grants', 'goddess contract', 'thief and capricious patron', 'divine bargain; precise price unverified', U, 'web', 'mutual contract lead'),
    'Mimic Me! Within The Eternal Forest': ('shapeshifting; adaptation', 'monster evolution', 'shifting egg body', 'survival before evolution; wishes are author-forum lead', U, 'tree', 'evolution condition'),
    'The Law of Averages': ('power trade; wealth', 'purchased powers', 'buyer and sale', 'market access instead of awakening', 'purchase', 'field', 'market condition'),
    'Ra': ('machines; knowledge; composed craft', 'trained engineering', 'industrial and domestic magic', 'technical study of an operation', U, 'field', 'physical procedure'),
    'Fine Structure': ('rules; negation; knowledge', 'discovered scientific framework', 'local physical laws', 'experiments followed by closure of possibilities', 'experiment; causal sequence requires text', 'field', 'imposed world rule'),
    'I Can See Your Death': ('observation; future sight', 'accident-awakened sight', 'another person death date and sign', 'color distinguishes advertised intervention status', 'sight; exact activation unknown', 'field', 'prediction condition'),
    'The Oracle Paths': ('interface; future sight', 'granted AI bracelet', 'choices and future consequences', 'guidance available to all Earthlings', U, 'field', 'guidance condition'),
    'I Can See Life Values (working English gloss)': ('observation; interface', 'granted system', 'patient life value', 'health-related reading; meaning of number unverified', 'observation; exact operation unknown', 'field', 'measurement condition'),
    'Information Omniscient (working English gloss)': ('observation; memory; intent', 'sensory faculty; origin unspecified', 'past events, intent and buried memory', 'different senses expose different information', 'sensory access', 'field', 'interpretation condition'),
}

# Editorial ranking by added decision space, not canon strength or popularity.
RANKED = [
 ('The Game at Carousel: A Horror Movie LitRPG', 'Apparent awareness', 'Actual knowledge and what an enemy thinks you know can differ.', 'Compare a warned observer who maintains the role with one who openly reacts.'),
 ('Dungeon Reset', 'Selective world reset', 'One carrier can be exempt while the surrounding world refreshes.', 'Reset one room and inspect body, belongings and construction separately.'),
 ('To Another World... with Land Mines!', 'Hidden grant terms', 'An offered benefit need not expose its real drawback.', 'A reliable guide reveals one concealed condition before a grant is chosen.'),
 ('Fine Structure', 'Discovery can close a law', 'An old true measurement can become obsolete when the world changes.', 'Keep a successful trial receipt; show a later failure under a new rule version.'),
 ('Godclads', 'Power as rule ownership', 'A power holder can contest which local law applies.', 'Two authorities conflict over one action; record winner and affected scope.'),
 ('The Book Eating Magician', 'Destroying a book to learn', 'The carrier is spent while understanding and usable method transfer separately.', 'A learner receives one method while the consumed copy is no longer teachable.'),
 ("Trafford's Trading Club", 'Price feeds the broker', 'One payer loss can sustain a different beneficiary.', 'Show payer, desired outcome, broker gain and unresolved liabilities on one receipt.'),
 ('Making Magic: The Sweet Life of a Witch Who Knows an Infinite MP Loophole', 'Creation grows its own capacity', 'A real loophole can compound instead of paying a fixed cost.', 'One allowed daily operation increases capacity; do not invent its source formula.'),
 ('Astral Apostle', 'Local vessel portfolios', 'Body, local identity and returning traveler can have distinct owners.', 'One traveler changes vessels while the old local biography stays attached to its person.'),
 ('Return of the Runebound Professor', 'Different revival layers', 'A rebuilt body can retain a damaged soul.', 'After one permitted revival, clear bodily injury but retain a named soul wound.'),
 ('D-Genesis: Three Years after the Dungeons Appeared', 'Perishable power trade', 'A transferable ability can expire before delivery or sale.', 'A custody transfer succeeds before expiry and fails honestly afterward.'),
 ('Pale Lights', 'Capricious contract partner', 'Patron preferences and a fixed signed term need not be identical.', 'Keep the original bargain alongside a later change in patron mood.'),
 ('I Can See Your Death', 'Certainty versus changeability', 'Seeing a clear future and being able to alter it are different claims.', 'Show a precise reading with an untested intervention flag, then record the actual attempt.'),
 ('The Oracle Paths', 'Competing future guidance', 'Opponents can also act on predictions.', 'Revise a preview when another informed actor changes their intended action.'),
 ('Losing Money to Be a Tycoon', 'Failure rewards meet other minds', 'A deliberate bad plan can be defeated by helpful independent agents.', 'Separate intended loss, staff interpretation, actual profit and the system payout.'),
]

REQUESTS = [
 ('The Game at Carousel: A Horror Movie LitRPG', 'https://www.royalroad.com/fiction/65629/the-game-at-carousel-a-horror-movie-litrpg', 'Read the first bystander protection test and one failure or exception. Who judges convincing unawareness?'),
 ('Dungeon Reset', 'https://www.tappytoon.com/en/book/dungeon-reset-novel', 'Read the glitch/reset event and first post-reset crafting. What survives: body, objects, skills or construction?'),
 ('To Another World... with Land Mines!', 'https://j-novel.club/series/to-another-world-with-land-mines/', 'Read the initial gift selection and a revealed trap. Establish hidden terms, guide access and actual harm triggers.'),
 ('Fine Structure', 'https://qntm.gumroad.com/l/ELFop', 'Use an accessible author edition or a copy you have. Read a discovery and its closure; establish trigger order and law-edit authority.'),
 ('Godclads', 'https://www.royalroad.com/fiction/59663/godclads', 'Read the first clear divine-law operation and a contested use. Establish fuel, authority scope and failure costs.'),
 ('The Book Eating Magician', 'https://www.wuxiaworld.com/novel/book-eater', 'Publisher title is Book Eater. Read the first consumption and a rejected or constrained transfer; distinguish understanding, author memory and spell execution.'),
 ("Trafford's Trading Club", 'https://www.webnovel.com/book/trafford%27s-trading-club_6831849802000805', 'Read one negotiated trade and its aftermath. Establish valuation, consent, delivered result and what extends the proprietor life.'),
 ('Making Magic: The Sweet Life of a Witch Who Knows an Infinite MP Loophole', 'https://j-novel.club/series/making-magic/', 'Read the actual MP-growth loop and a mana-gated creation. Establish consumed inputs, daily cadence and which limits really apply.'),
 ('Astral Apostle', 'https://www.webnovel.com/book/astral-apostle_21638395405875905', 'Read first vessel creation, departure and return. What memory, ability and local history stays with each carrier?'),
 ('Return of the Runebound Professor', 'https://www.royalroad.com/fiction/68679/return-of-the-runebound-professor', 'Read a death/reformation and soul-wound recovery. Establish which injury persists and whether healing has a separate price.'),
]

def normalize(s):
    return re.sub(r'[^\w]', '', s.casefold())

def main():
    rows = []
    for name in ['chinese.json', 'korean-japanese.json', 'western.json', 'root.json']:
        for row in json.loads((OUT / 'drafts' / name).read_text()):
            row['draft_owner'] = 'drafts/' + name
            row.setdefault('language_group', 'Chinese')
            rows.append(row)
    # Reviewed correction: Tappytoon publishes the novel as well as the adaptation.
    extra = {
        'Dungeon Reset': ['https://www.tappytoon.com/en/book/dungeon-reset-novel', 'https://page.kakao.com/content/50594147?page=1'],
        'The Book Eating Magician': ['https://www.wuxiaworld.com/novel/book-eater', 'https://series.naver.com/novel/detail.series?productNo=2884396'],
    }
    revised_scores = {
        'I Have a Super USB Drive':4, 'My Cell Prison':4, 'Seized by the System':4,
        'Soul of Negary':4, 'Fantasy Simulator':3, 'Carefree Path of Dreams':3,
        'Low Dimensional Game':4, 'Everybody is Kung Fu Fighting, While I Started a Farm':4,
        'Mimic Me! Within The Eternal Forest':4, 'The Stubborn Skill-Grinder In A Time Loop':3,
        'Industrial Strength Magic':3, 'Double-Blind: A Modern LITRPG':3,
    }
    exclusion = {normalize(x['title']) for x in json.loads((OUT/'EXCLUSIONS.json').read_text())}
    sources = []
    series = []
    for i, row in enumerate(rows, 1):
        title = row['title']
        assert normalize(title) not in exclusion, title
        assert title in MAP, title
        row['id'] = f'D{i:03d}'
        row['original_title'] = row.get('original_title')
        row['novelty_score'] = revised_scores.get(title,row['novelty_score'])
        row['novelty_basis'] = 'Editorial estimate of the advertised hook against E8-E8D and prior lanes, not a popularity or literary score.'
        row['adaptation_status'] = 'proposal; not accepted or implemented'
        row['source_urls'] = list(dict.fromkeys(row['source_urls'] + extra.get(title,[])))
        if title == 'Dungeon Reset':
            row['platform'] = 'Kakaopage original novel; licensed English novel and adaptation on Tappytoon'
        if title == 'Slumrat Rising':
            row['power_currency'] = None  # Access is not a fuel unit.
        if isinstance(row['unknowns'],str): row['unknowns'] = [row['unknowns']]
        row['claim_status'] = 'metadata-supported hook; review details remain leads; exact world rules need selected text'
        row['source_ids'] = []
        for j, url in enumerate(row['source_urls'], 1):
            sid = f"{row['id']}-S{j}"
            detail = next((x for x in row.get('source_details',row.get('source_evidence',[])) if x['url']==url),{})
            sources.append(dict(id=sid, candidate_id=row['id'], title=title,url=url,
                                source_kind=detail.get('source_kind',detail.get('kind','public metadata; scope in candidate evidence_scope')),
                                access=detail.get('access',row['evidence_scope']), date='2026-10-10',
                                supports=detail.get('supports','Advertised premise and listed identity fields; review-only details are qualified in the candidate.')))
            row['source_ids'].append(sid)
        family,origin,obj,mech,trig,shape,kind = MAP[title]
        axes = dict.fromkeys(['object','mechanism','trigger','certainty','scope','price','limit','visibility','persistence','growth'])
        axes.update(object=obj, mechanism=mech, trigger=trig,
                    price=row.get('cost'), persistence=row.get('persistence'))
        if title == 'Minute Mage: A Time Magic LitRPG':
            axes.update(scope='Initially one minute; window grows with levels', limit='Initially once daily',growth='Levels extend rewind window')
        if title == 'I Can See Your Death':
            axes['certainty']='Narrator describes black dates as avoidable and red as fixed; objective certainty unverified'
        if title == 'Making Magic: The Sweet Life of a Witch Who Knows an Infinite MP Loophole':
            axes['growth']='Mana pool grows a little daily; formula not read'
        path = dict(currency=row.get('power_currency'),steps=None,
                    gate={'acquisition':row.get('acquisition_gate'),'advancement':None},risk=row.get('cost'),
                    shape=shape,branching=None,grader=None,ceiling=None)
        slots = dict.fromkeys(['swearer','restriction','object','scope','duration','benefit','consequence','witness','condition','ramp','stake','counterparty','release','visibility','inheritance','interpretation','coercion','memory','specificity'])
        slots['object']=obj
        slots['benefit']=row['verified_hook']
        if title == "Trafford's Trading Club":
            slots.update(swearer='Buyer and club proprietor',stake='Precious possessions, lifespan or soul in synopsis',counterparty='Trading club',benefit='Desired outcome; completed trades also extend the owner life')
        if title == 'Pale Lights':
            slots.update(swearer='Thief named Tristan',counterparty='Capricious goddess',benefit='Contract-derived support; precise grant and price not established')
        series.append(dict(id=row['id'],title=title,evidence_sources=row['source_ids'],
                           mapping_status='analyst classification of metadata; null means not established here',
                           path=path,families=family.split('; '),power_sources=origin,
                           axes=axes,vows_contracts_costs=dict(kind=kind,slots=slots,
                               trade=row.get('cost'),breach=None,interpretation_tricks=None,collective_rules=None,
                               qualification='Only trade/contract rows imply bargaining. Resource gates, involuntary rules and physical harm are not inferred vows.'),
                           unique_mechanics=[dict(description=row['verified_hook'],source_ids=row['source_ids'],what_we_take=row['proposal'],status='proposal')],
                           gag_or_rule_abuse=dict(verified_scene=None,metadata_lead=(row.get('review_only_lead') or ('MP loophole advertised; execution unverified' if title.startswith('Making Magic:') else None)),
                               qualification='No chapter scenes read. Ingenious premise, rule exploit and comedy are not interchangeable.')))
    by_title={r['title']:r for r in rows}
    top15=[]
    for rank,(title,name,gain,proof) in enumerate(RANKED,1):
        top15.append(dict(rank=rank,id=f'D-M{rank:02}',candidate_id=by_title[title]['id'],title=title,
                          mechanic=name,added_decision=gain,what_we_take=by_title[title]['proposal'],future_proof=proof,status='proposal'))
    requests=[]
    for i,(title,url,why) in enumerate(REQUESTS,6):
        requests.append(dict(id=f'S{i}',candidate_id=by_title[title]['id'],title=title,url=url,why=why,status='Open; full text needed for exact rules; no acquisition attempted'))
    data=dict(schema_version=1,lane='D broad-scout',date='2026-10-10',status='metadata survey complete',
              scope='Public metadata only, not full-text verification, source acquisition or gameplay.',
              novelty_scale={'1':'Cosmetic variation','2':'Familiar family with a minor condition','3':'Useful distinct variant','4':'Changes a decision or carrier relationship','5':'Changes rule ownership, interpretation or system behavior'},
              candidates=rows,sources=sources,top_15=top15,source_requests=requests)
    (OUT/'CANDIDATES.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    (OUT/'SERIES.json').write_text(json.dumps(dict(schema_version=1,lane='D',date='2026-10-10',status='analyst mappings; proposals',series=series,top_15=top15),ensure_ascii=False,indent=2)+'\n')
    lines=['# Lane D source ledger','',
           'Checked 2026-10-10. Public metadata only. No chapters were deliberately opened or used. Incidental chapter snippets in search results were excluded. Indexed text can be stale, incomplete or mix editions. A reference supports its advertised premise, not every later exception. Identity fields are platform metadata, not authenticated author identities.','',
           'F1: Worker discovery used public indexed metadata. One Japanese metadata page, Making Magic, was directly opened. No parallel direct requests to the same host; the NovelUpdates direct-fetch reservation belonged to the Korean/Japanese worker. No chapter crawl or login.','',
           'F2: https://qntm.org/ra returned 403 once. That host was stopped for the session. Ra uses indexed bibliography/synopsis; Fine Structure uses the indexed author-shop and Google Books descriptions. No bot check was passed.','',
           'F3: CN and several Western entries include explicit reader-review leads. Those details are weaker than publisher synopses and are not exact canon. See each candidate evidence_scope, verified_hook, review_only_lead and unknowns. Tappytoon was checked as a novel publisher, not assumed to be only a comic source.','',
           'Original texts, private saves and the source library were not changed. The official URLs in the ten requests are reading/acquisition landing pages, not promises of free exports or current chapter availability.','',
           '| Source ID | Candidate | Public reference | Access / support boundary |','|---|---|---|---|']
    for s in sources:
        lines.append(f"| {s['id']} | {s['title']} | [Metadata]({s['url']}) | {s['access'].replace('|','/')}; {s['source_kind']}; {s['supports']} |")
    (OUT/'SOURCES.md').write_text('\n'.join(lines)+'\n')
    report=['# Lane D: broad power-system scout','',f'**{len(rows)} candidates, metadata only.** The catalog spans Chinese, Korean, Japanese and Western web fiction. All hooks are paraphrased, all adaptations are proposals, and exact rules need text. No gameplay was changed.','',
      'F1: The best gains over the existing catalog concern who a rule reads, which carrier survives, and who can edit a law. A bystander can know a monster is present yet gain protection by appearing unaware. A reset can omit one person. A discovery can stop working because the world changes. These are different decisions from merely adding another sense or revival family. See D-M01 through D-M05 and their linked metadata.','',
      'F2: Costs need different owners and timings. A book can be consumed as an input, a soul wound can persist after bodily revival, and a buyer payment can extend a broker life. A hidden downside is not a freely chosen oath. No source here establishes a universal fair price, necessary drawback or shared punishment for a group.','',
      'F3: Predicted futures and retained pasts stay separate. I Can See Your Death advertises preventable versus apparently fixed readings; The Oracle Paths gives guidance to other actors too. Minute Mage offers a short rewind, which supplies experience but is not itself an oracle. Exact certainty, memory and intervention rules remain open.','',
      '## Coverage and scoring','',
      'The 1 to 5 score measures added decision space against E8 through E8D and A-C, not literary quality, obscurity or popularity. 3 means a distinct variant; 4 changes a decision or carrier; 5 changes how rules, interpretation or the system work. Review-only extensions do not certify source mechanics. This is a hook scout, not a recommendation to read every title. Some translated titles are fairly visible; the list favors sharp gaps and avoids the famous A-C roster.','',
      'A-C title aliases, the earlier 48-title novel scout and the five supplied S1-S5 seeds were checked for exact normalized repeats. The new rows do not replace their existing research. See EXCLUSIONS.json and INPUTS.json. Broader research mentions are context, not proof that a title has already had a dedicated power survey.','',
      '| ID | Title / author / platform | Lens | Score | Mechanic and boundary |','|---|---|---|---|---|']
    for r in rows:
        report.append(f"| {r['id']} | **{r['title']}**; {r['author']}; {r['platform']} | {', '.join(r['lenses'])} | {r['novelty_score']} | {r['summary']} [Metadata]({r['source_urls'][0]}); detailed evidence boundary in CANDIDATES.json. |")
    report += ['', '## Top 15 mechanics by what they add','', 'Every take and future proof below is an original proposal. None was built or played. Ranking favors added decisions, then clarity of the advertised hook.','', '| Rank / code | Hook and source | What we take | New decision / future proof |','|---|---|---|---|']
    for x in top15:
        r=by_title[x['title']]
        report.append(f"| {x['rank']} / {x['id']} | {x['mechanic']}, [{x['title']}]({r['source_urls'][0]}) ({r['id']}) | {x['what_we_take']} | {x['added_decision']} Future proof: {x['future_proof']} |")
    report += ['', '## Cross-series vows, contracts and costs','',
      'The rows distinguish bargains from procedures and imposed rules. Breach tariff, interpretation tricks and collective liabilities are **not established** unless stated. A dangerous premise is not proof of a specific punishment. The complete null-aware E8D mapping for all candidates appears in SERIES.json.','',
      '| Source | Trade or condition | Kind / authority | Unknown terms and rule-abuse boundary |','|---|---|---|---|']
    for s in series:
        r=by_title[s['title']]
        report.append(f"| [{s['title']}]({r['source_urls'][0]}) | {r.get('cost') or s['axes']['mechanism']} | {s['vows_contracts_costs']['kind']}; {s['power_sources']} | {' '.join(r['unknowns'])} No chapter-backed gag or breach scene in this pass. |")
    report += ['', '## Proposed folds for E8 through E8D','',
      '| Code / owner | Proposed addition | Difference from the current model |','|---|---|---|',
      '| P1 / E8 | Separate actual awareness, displayed reading, apparent awareness and intervention status. Record the observer and evidence. | Builds on E7 and prior-lane reading provenance; a precise prediction can still be unchangeable or only believed fixed. |',
      '| P2 / E8B | Let a source define which carrier it consumes, rebuilds, wounds or keeps. Include expiration on transferable powers. | Uses existing consumption, source and persistence families; a book, body, soul, local vessel and skill orb are distinct carriers. |',
      '| P3 / E8C | Give a growth loop a declared output, recurrence and input. Keep real retained skill, simulated reward and capacity growth separate. | The current shape list remains useful; an exploitable loop need not become a new rank ladder or an infinite global farm. |',
      '| P4 / E8D | Extend the live mechanism-kind and reward-payer fields with rule version, editor authority, final beneficiary and what the quote discloses. | Payer/supplier separation already exists in the A-C fold-in. The added cases are hidden grant terms and the broker receiving lifespan; mood does not silently rewrite signed words. |',
      '| P5 / E8 to E8D | Add carrier-specific reset and law-change policies, with old observations kept as dated receipts. | A source-world reset is in-world behavior, distinct from browser reload bugs. A changed law can invalidate an old method without falsifying its earlier evidence. |','',
      'These are refinements for the integrating GM, not edits to the shared E8 files or accepted rules. The twelve accepted rules still govern: each world defines its own behavior, sources and readings can be wrong, carriers matter, and outliers are possible. Cheap or harmless benefits remain possible where the chosen world allows them.','',
      '### Live input reconciliation','',
      'During this scout, E8, E8C and E8D changed to include the A-C survey fold-ins. This lane did not edit them. The additions were read and reconciled before delivery: carriers, graded readings, resource stores, simulator retention, mechanism kinds and payer/supplier separation are already present. P1-P5 use those owners rather than claim them as new fields. The remaining refinements concern apparent awareness, intervention status, perishable grants, carrier-specific resets and law versions. INPUT_RECONCILIATION.json records the original and reviewed hashes.','',
      '## Ten prioritized full-text requests','',
      'Appended S6-S15 to [SOURCE_REQUESTS.md](../../SOURCE_REQUESTS.md), preserving S1-S5 and all prior text. These are missing-rule requests under a metadata-only assignment, not claims that ten hosts blocked access. Please supply a copy you can access or the targeted passages below to the existing private inbox; no public prose should be added to this dossier. Some author/publisher listings may be partly stubbed or paid. Availability was not fully checked.','',
      'Start with S6 (awareness), S7 (reset) and S8 (hidden terms) if you want the strongest three distinct rule tests. The table is a reference inventory, not ten immediate chores.','',
      '| ID | Candidate / best browser landing page | Why text is needed |','|---|---|---|']
    for x in requests: report.append(f"| {x['id']} | [{x['title']}]({x['url']}) ({x['candidate_id']}) | {x['why']} |")
    report += ['', '## Delivery and open gates','',
      'Research deliverables: CANDIDATES.json, SERIES.json, REPORT.md, SOURCES.md and CHECKPOINT.md. assemble.py reproduces the final dossiers from the owned drafts. VALIDATION.json checks counts, IDs, eight path parts, ten axes, vow slots, source/rank/request references, no exact repeats, no em dashes and shared append preservation. URL checks establish recorded source identity and syntax, not universal live fetchability.','',
      'The lane survey is complete. Source acquisition and primary-text rule checks remain open in S6-S15. No build, source edit, commit, gameplay browser check, save/reload/import check or accepted design claim belongs to this research lane.']
    (OUT/'REPORT.md').write_text('\n'.join(report)+'\n')
    print(json.dumps({'candidates':len(rows),'series':len(series),'sources':len(sources),'requests':len(requests),'top_mechanics':len(top15),'language_groups':dict(Counter('Western' if r['language_group'].startswith('Western') else r['language_group'] for r in rows))}))

if __name__ == '__main__': main()
