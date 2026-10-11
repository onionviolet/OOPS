import json
from pathlib import Path
O=Path('docs/research/power-systems/novel-crawl');x=json.loads((O/'SERIES.json').read_text());rows=x['series'];by={r['id']:r for r in rows}
selection={r['id']:r for r in json.loads((O/'SELECTION.json').read_text())['candidates']}
ranked=[
('D027','Information unlocks executable copies','Help exposes hidden clauses; copied skills remain sealed until the source holder teaches them. A purchased skill is not yet a usable skill.','LM01, LM02','Proposal: separate acquisition, disclosed rules, instruction and execution.'),
('D044','Borrow now, face a growing later bill','Luck borrowing creates pressure; release brings misfortune. Immediate foresight is a different pact, and neither power erases ordinary danger.','PL02, PL03, PL05','Proposal: store debt accumulation, discharge and conditional forecast as distinct records.'),
('D025','Power carriers expire before the power is used','Skill orbs expire after a short fixed time in narrated world observations; a dungeon card is a separate eligibility gate.','DG01, DG02','Proposal: record carrier expiry, recipient eligibility and granted power separately.'),
('D026','Capacity growth does not refill fuel','Created fruit raises maximum mana without restoring spent mana; the tested effect is once daily. Creation can also leave the user sick from depletion.','MM02, MM03','Proposal: give capacity, available fuel and refill separate balances.'),
('D018','Inheritance can transfer skilled control','Studied books feed a grimoire; rewards improve execution, affinity and craft functions. Rapid feeding causes actual overload.','BE02, BE03, BE04','Proposal: let inherited practice change usable functions while assimilation remains a separate limit.'),
('D033','Apparent ignorance can protect you','Metadata advertises protection for convincing unawareness. Actual judgment and failure conditions remain unread.','metadata','Proposal: make actual knowledge, displayed awareness and enemy belief separate.'),
('D017','A reset can exclude one carrier','Metadata gives a survivor an exception to dungeon reset. The free normal pages supplied no body text. What survives is still unknown.','metadata','Proposal: let a reset target a declared set without silently resetting everything.'),
('D005','One traveler, many local bodies','Metadata promises separate apostle vessels and identities. Body autonomy, death and return transfer remain unknown.','metadata','Proposal: keep controller, local body, identity and biography separate.'),
('D034','A stolen source can confer rule authority','Metadata describes stolen divine powers and contested existence laws. Exact contests and fuel remain unread.','metadata','Proposal: model source ownership separately from authority to impose a law.'),
('D014','A customer price can fund a broker life','Metadata advertises precious goods, lifespan and souls traded for outcomes, benefiting the proprietor. Refunds and consent rules are unread.','metadata','Proposal: keep payer loss, delivered result and supplier reward in separate receipts.'),
('D016','Raw data can exceed understanding','The publisher-hosted synopsis describes multiple senses exposing hidden information. Interpretation limits are reader leads, not established rules.','metadata','Proposal: store sensed data separately from concepts and interpretation.'),
('D004','Helpers can defeat the reward objective','Metadata describes profit defeating a loss-reward plan. Ledger categories and settlement rates remain unverified.','metadata','Proposal: give helpers independent goals and keep accounting rules explicit.'),
('D003','Safe rehearsal still spends a bodily resource','Metadata ties phone-dungeon retries to blood and names transferable rewards. Retry limits and fidelity remain unread.','metadata','Proposal: quote the real attempt cost and define permitted reward exports.'),
('D036','Reincarnation can coexist with final death','Metadata gives repeated lives, a market and possible permanent death. Retention and current currencies remain unread.','metadata','Proposal: separate lifespan, rebirth access and retained inventory.'),
('D039','Body replacement can leave another wound','Metadata pairs reformation with soul injury. Healing and final-death rules remain unread.','metadata','Proposal: separate body reconstruction from persistent soul damage.')]
lines=['# Lane N: free-text acquisition and power mechanics','',
'**Delivery:** 15 candidates qualified, 11 chapters from five books acquired and read, ten titles without usable chapter text. This is a bounded acquisition and reading pass, not a full-book read or gameplay implementation. No E8 files, game source, build or commits changed. All takeaways are proposals.','',
'Lane D was checked at the first scheduled ten-minute boundary, 05:38 UTC. Its final list was present, so no further wait was needed. All selected candidates scored 5; ties preserve CANDIDATES.json order. SELECTION.json freezes that list and hash. No matching supplied EPUB was found in the documented library/private-source inventory. Inbox checks at start, selection and final delivery found no EPUBs.','',
'The polite FanFicFare Royal Road attempt stopped on robots before any chapter download. Normal official author/publisher HTML was acquired with the existing lncrawl-polite transport, then packaged offline with FanFicFare. The stock polite CLI is Fanqie-only; no verified Fanqie edition of a selected title was found. This transport bridge does not imply new stock CLI support. Strict per-host pacing and durable stops applied. Raw HTML/text/cache and five sample EPUBs are private and gitignored.','',
'## F1: Acquired coverage','',
'| Book | Edition and read range | Evidence limit |','|---|---|---|',
'| Pale Lights | Original author web Book 1 (2022), chapters 1-3 | Root read chapter 1 and reviewed leaf evidence for 2-3; one repair added honour-code and intent-price clauses. Not similarly numbered Book 2 pages. |',
'| Book Eater | Wuxiaworld licensed English, chapters 1-3 | Chapter 4 served a challenge; host stopped. Hunger predation is warned, not performed. |',
'| D-Genesis | Author Japanese web edition, prologue and chapter 1 | English LN not read. Orb expiry/eligibility are narrated history; card acquisition is witnessed. |',
'| Making Magic | Author Japanese web edition, chapters 1-2 | English LN not read. Estimates and protagonist experiments remain qualified. |',
'| Land Mines | Author Japanese web edition, prologue | English LN not read. Skill descriptions are exposed terms; misuse outcomes are not witnessed. |','',
'Every other selected title has a private READING.md recording zero chapter coverage, the metadata lead and unknowns. SERIES.json maps all eight path parts, ten axes, families/sources, vows/costs and per-mechanic proposal status. Null means unknown, never absent. Chapter evidence is a separate layer over lane D metadata classifications.','',
'## F2: Access limits','',
'| Route | Actual result | Action |','|---|---|---|',
'| Royal Road | Robots disallow GPTBot | Stop host; reuse refusal for all five selected titles, no chapter retries. |',
'| Qidian | Robots disallow GPTBot | Stop host; no challenge workaround. |',
'| Webnovel | First normal landing served Cloudflare challenge | Stop host for the session. |',
'| J-Novel Club | HTTP 308 redirect | Strict transport stopped; switch to author web editions, not a same-host URL variant. |',
'| Wuxiaworld | First three chapters received; fourth had challenge parameters | Keep prior qualified text; stop host. |',
'| Tappytoon | Catalogue marks episodes 1-5 free and 6 paid; normal pages 1-4 contain no novel body | Stop rendering route; no guest token, API, login or paid episode fetched. |',
'| Syosetu, Kakuyomu, Pale Lights author | Robots-qualified normal HTML received | Read the bounded rule samples and reuse cached bytes. |','',
'ROUTES.json, ACQUISITION.json and private request receipts distinguish robots refusal, challenge, redirect, rendering limit and text read. These are not claims that a title is unavailable to Weibao in his own browser. No ttks, ttkan or 69shu scripted access occurred. No selected source was refetched. Each host remained far below 300 chapters.','',
'## P1: Top 15 mechanics, ranked by added design value','',
'Ranks compare what changes a player decision in our current model. The first five have chapter evidence; the remaining ten are openly metadata-only leads. They are not promoted to canon.','',
'| Rank | Code / book | Mechanic and evidence | What we take |','|---|---|---|']
for n,(id,name,desc,evidence,take) in enumerate(ranked,1):
 r=by[id];url=next((s['url'] for s in x['chapter_sources'] if s['book']==r['acquisition']['private_folder'].rsplit('/',1)[-1]),selection[id]['source_urls'][0]);lines.append(f'| {n} | M{n}: {r["title"]} | **{name}.** {desc} Evidence: {evidence}; [source]({url}). | {take} |')
lines += ['', '## F3: Vows, contracts and costs across all selected books','',
'An activation price, eligibility check, innate downside and sworn bargain are different mechanisms. Unknown breach terms stay unknown. The full slots are in SERIES.json.','',
'| Series | What is paid / gained | Enforcement, interpretation and collective rules | Evidence |','|---|---|---|']
tables={
'D003':('Blood buys attempts and named rewards','Payment, not established vow. No collective or breach rule read.'),
'D004':('Losses trigger a system reward','Bookkeeping, not sworn abstinence. Exact valid-loss judge and settlement unknown.'),
'D005':('Vessels offer local lives','Price, release and autonomy unknown; do not invent obedience contract.'),
'D014':('Customer gives precious value; proprietor gains lifespan','Negotiated trade advertised. Breach, refunds, coercion and valuation unknown.'),
'D016':('Senses reveal hidden information','Not established contract; interpretation limits are reader leads.'),
'D017':('Reset exception enables unusual survival/craft','World rule exception, not vow. Carrier set and collective reset scope unread.'),
'D018':('Books feed a living grimoire and grant functions','Hunger warning differs from actual overload. No sworn promise or automatic moral punishment shown.'),
'D025':('Orbs grant powers after card eligibility','Expiry and access rules, not vows. World law attempts to govern trade; no collective pact shown.'),
'D026':('Mana creates things; fruit raises capacity','Daily effectiveness and depletion are technique costs. No bargain breach or moral judgment shown.'),
'D027':('Setup points buy skills and rule information','Hidden displayed terms: theft spends life, copies need instruction. Activated penalties not observed. Provider edits shared menu, not collective consent.'),
'D033':('Convincing bystander presentation buys safety','Technique condition, not proven vow. Which observer judges is unknown.'),
'D034':('Stolen divine sources offer laws and immortality','Rule authority advertised; pact and contest rules unread.'),
'D036':('Successive lives plus market exchange','Final death advertised; rebirth permission and payer identity unknown.'),
'D039':('Reformation carries soul injury','Innate/technique cost not proved sworn bargain. Release and repair unread.'),
'D044':('Luck now, misfortune later; Fisher grants glimpses','Pact, revenge oath, service term and honour code differ. Five-breath rearm rule is a local convention, not proven magical vow sanction. No shared breach penalty established.')}
for r in rows:
 a,b=tables[r['id']];ev='chapter sample' if r['claims'] else 'lane D metadata only';url=selection[r['id']]['source_urls'][0];lines.append(f'| {r["title"]} | {a} | {b} | [{ev}]({url}); claim IDs in SERIES.json. |')
lines += ['', '## P2: Refinements for E8 to E8D','',
'| Owner | Proposal | Why / evidence |','|---|---|---|',
'| E8 | Add optional observations with evidence mode, subject, confidence, known terms and resolved outcome. | PL05 forecasts and PL09 guessed contract tells are not omniscient readings. Existing observation proposals remain the base. |',
'| E8B | Give source balances separate current fuel, capacity, recharge, effective-use cadence and provider hunger. | MM02-MM04 and BE04 separate the bottlenecks. These are local source fields, not universal resource rules. |',
'| E8C | Separate acquired method, instruction, usable control, body eligibility, institutional appraisal and expiring carrier. | LM02, BE01-BE03 and DG01-DG03 show gates without a shared ladder. Extend the existing progress/access/appraisal split. |',
'| E8D | Record hidden terms, disclosure cost, deferred bill, discharge trigger and known versus unstated breach law. | LM01 exposes terms; PL03 demonstrates cost discharge, not oath violation. Preserve prior payer/enforcer splits. |',
'| E8D / E7 | Retain convention, promise and supernatural bond as different mechanism kinds. | PL07, PL08 and PL14 share a person but have different duration, witness and enforcement evidence. |','',
'No universal price formula, ceiling or mandatory moral veto is proposed. Each world keeps its rules. Raw text stays private; public gameplay would use original names. No source rule became an accepted decision.','',
'## F4: Gags and rule abuse','',
'Land Mines reverses the attractive multiplier by changing both gain and requirement, but this sample shows the disclosed catch, not a measured training exploit (LM04). Making Magic finds that an empty wand still works as a stick (MM01), and its apparent infinite-growth loop has a daily test result and real depletion (MM02-MM04). Book Eater solves one control problem and creates a hunger/assimilation problem (BE02-BE04).','',
'Pale Lights supplies an actual wording-sensitive honour tactic: a disarmed opponent gets a fair rearm chance; Angharad waits the longer disputed interval before striking (PL14). No magical sanction is implied. The luck-harm clause is narrated qualitatively while Tristan declines the suggested petty injury (PL15). Bystander protection, reset crafting and profit/loss comedy remain metadata leads, not newly read scenes.','',
'## A1: Source requests and remaining evidence','',
'Lane D already added nine of these selected titles to S6-S15. Lane W concurrently used S16-S88 for wiki requests; the append uses live unused IDs. This lane appends only six missing books as S89-S94 and preserves the previous file byte-for-byte. More text is requested for exact/later rules even when an opening sample was acquired. Existing rows are neither overwritten nor silently marked done.','',
'SOURCE_REQUESTS.md names the passages needed. The empty inbox supplied no S6-onward EPUBs during this pass. No background inbox watch continues after delivery. A future supplied file should be hashed, matched to its requested edition, copied into that book\'s sources folder with original preserved, and read before increasing coverage.','',
'## A2: Checks and status','',
'VALIDATION.json records selection count/hash/order, source hashes and narrative coverage, EPUB chapter counts, robots/challenge stops, per-host pacing, request-prefix preservation, private gitignore, field completeness and style. One Luna medium leaf read Pale Lights; root reviewed consequential source passages and integrated one targeted repair. No other reader or download process remains. No gameplay test/build was authorized or run. This report completes the available-source lane; full-text verification for the missing and later rules remains an explicit source gate.']
(O/'REPORT.md').write_text('\n'.join(lines)+'\n')
print('Report written')
