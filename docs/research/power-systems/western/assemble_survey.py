"""Rebuild this lane's research files from reviewed, paraphrased notes. No network."""
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[3]
sources = []
rows = []

def source(id, title, url, kind, access, supports, limit='Bounded reference, not a whole-work read.'):
    sources.append(dict(id=id, title=title, url=url, kind=kind, access=access,
                        checked='2026-10-10', supports=supports, limit=limit))

source('W01','Worm reviewed systems dossier','docs/research/novels/full-book/worm/SYSTEMS.md','local_reviewed_dossier','local_read',
       'Triggers and formulas; situated execution; truces; Entity revelations.',
       'Reuse of prior parent-reviewed derived notes, not a fresh novel read. Exact member/paragraph locators remain in the dossier; private and gitignored.')
source('W02','Worm power classifications','https://worm.fandom.com/wiki/Power_Classifications','fan_wiki','search_excerpt',
       'PRT classes describe response types; numeric ratings estimate team threat. Includes link to author-run PRT quest.')
source('C01','Cradle advancement','https://wiki.abidanarchive.com/index.php/Advancement_Level','fan_wiki','page_read',
       'Madra, realm gates, Gold routes, Lord revelations, Sage/Herald and Monarch.')
source('C02','Will Wight on split cores','https://abidanarchive.com/tag/heart%20of%20twin%20stars','author_QA_transcript','search_excerpt',
       'Splitting loses a little energy, does not double reserves; cores can advance separately.')
source('C03','Will Wight on Remnant bonding','https://abidanarchive.com/event/1?page=2','author_QA_transcript','search_excerpt',
       'Advanced Remnants have identity; Sword Sage permitted Yerin to bond.')
source('M01','Mistborn metallic arts','https://en.wikipedia.org/wiki/Mistborn#Magic','encyclopedia','page_read',
       'Allomancy burns metal; Feruchemy stores attributes; Hemalurgy transfers stolen abilities.')
source('M02','Sanderson on Hemalurgy','https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-3-chapter-thirty-nine','author_annotation','search_excerpt',
       'Theft and selection of powers in the spike design.')
source('M03','Sanderson compounding transcript cited by 17th Shard','https://www.17thshard.com/forums/topic/5166-feruchemic-hemalurgic-spike/','author_QA_reproduced','search_excerpt',
       'Same-metal Allomancy/Feruchemy draws outside energy into the stored attribute.',
       'Forum reproduces a Tor Q&A; original event was not opened. Cross-check before direct adaptation.')
source('S01','The Ten Orders of Knights Radiant','https://www.brandonsanderson.com/blogs/blog/the-ten-orders-of-knights-radiant','author_lore','page_read',
       'Spren bonds, differing oaths, Lightweaver truths and personal progress.')
source('S02','Deadeye','https://coppermind.net/wiki/Deadeye','fan_wiki','search_excerpt',
       'Broken bonds harm spren; deadeye creation depends on era and bond stage.',
       'Contains Wind and Truth spoilers. Do not turn the era-specific effect into a timeless law.')
source('K01','The Name of the Wind magic summary','https://es.wikipedia.org/wiki/El_nombre_del_viento','encyclopedia','search_excerpt',
       'Alar links objects; energy loss and bodily heat; Naming requires intuitive understanding.')
source('K02','True names in fiction','https://en.wikipedia.org/wiki/True_name','encyclopedia','search_excerpt',
       'Kingkiller naming grants mastery of the named thing.',
       'Broad summary only. Kingkiller Fandom robots blocked; no exact slippage formula or book-scene claim.')
source('D01','Word of Jim on the Fae','https://wordof.jim-butcher.com/index.php/word-of-jim-woj-compilation/woj-on-the-fae/','author_QA_compilation','page_read',
       'Faerie office succession carries debts; Lea fulfilled a power bargain by giving confidence.',
       'Attributed author Q&A with compiler notes. General folklore preamble is explicitly not necessarily Dresden canon.')
source('D02','Word of Jim on angels and Soulfire','https://wordof.jim-butcher.com/index.php/word-of-jim-woj-compilation/woj-on-angels-demons-fallen-and-knights-of-the-cross/','author_QA_compilation','page_read',
       'Soulfire and Hellfire are not additive; which is used depends on user and purpose.',
       'Does not establish the precise soul depletion or recovery rule.')
source('T01','Wheel of Time Oath Rod','https://library.tarvalon.net/index.php?title=Oath_Rod','fan_reference_with_chapter_citations','page_read',
       'Binder, blocked lies, belief-based truth, lifespan cost and release.')
source('T02','Wheel of Time setting','https://en.wikipedia.org/wiki/The_Wheel_of_Time#Setting','encyclopedia','search_excerpt',
       'One Power halves, saidin taint and setting history.',
       'Novel setting; do not blend with television continuity. Taint is era-specific.')
source('G01','Guide Aspects','https://abridged-guide-to-evil.fandom.com/wiki/Aspects','fan_wiki','search_excerpt',
       'Names develop up to three personality-linked Aspects; no known method for more than three.',
       'Indexed excerpt; host later reported robots block. No page fetch or full-text crawl.')
source('G02','Guide Chapter 74: Partial','https://practicalguidetoevil.wordpress.com/2019/09/11/chapter-74-partial/','author_serial','search_excerpt',
       'Role has causal weight beyond raw physical power.',
       'Short indexed selection only. Avoided unofficial Jumpchain/CYOA sheets found by search.')
source('I01','The Wandering Inn classes','https://wiki.wanderinginn.com/Classes','fan_wiki','search_excerpt',
       'Classes can consolidate; Princess class lost then restored by redefining the role.',
       'Direct page returned 403. No further page requests to this host.')
source('I02','The Wandering Inn system messages','https://wiki.wanderinginn.com/System_messages','fan_wiki','search_excerpt',
       'Messages announce levels, class changes, conditions, titles and quests.',
       'Indexed reference only; full classes page unavailable.')
source('J01','Dungeon Crawler Carl System AI','https://dungeon-crawler-carl.fandom.com/wiki/System_AI','fan_wiki','search_excerpt',
       'AI generates and enforces dungeon rules and awards achievements.',
       'Host later robots blocked. Only initial indexed reference is used.')
source('J02','Dungeon Crawler Carl sponsors','https://dungeon-crawler-carl.fandom.com/wiki/Sponsors','fan_wiki','search_excerpt',
       'Advertisers sponsor crawler channels and send Benefactor Boxes; ratings matter.',
       'Robots block accompanied the indexed result. No subsequent request to this host.')
source('J03','System AI explained, Dutch publisher site','https://www.dungeoncrawlercarl.nl/en/news/the-system-ai-explained/','publisher_labeled_explainer','search_excerpt',
       'AI gives unusually specific rewards involving Carl feet.',
       'Public explainer, not a primary scene. Publisher status is inferred from site presentation; no prose download.')
source('H01','He Who Fights With Monsters essences','https://he-who-fights-with-monsters.fandom.com/wiki/Essences','fan_wiki','search_excerpt',
       'Five abilities per essence; stones awaken remaining abilities; personal randomness; divine revocation.',
       'Page fetch returned 402. Later indexed FAQ reported robots block. Neither was bypassed.')
source('H02','HWFWM essence FAQ','https://he-who-fights-with-monsters.fandom.com/wiki/Frequently_Asked_Questions','fan_wiki','search_excerpt',
       'Three essences produce a confluence; divine alternatives can be revoked; confluences are not transferable.',
       'Indexed text only. Exact rank thresholds are not freshly verified.')
source('L01','Mother of Learning reviewed power dossier','docs/research/novels/full-book/mother-of-learning/POWERS.md','local_reviewed_dossier','local_read',
       'Mana, retained skill, soul scars, shared copy reserves, divine disclosure contract and knowledge evasion.',
       'Reuse of prior reviewed derived notes with chapter claim IDs, not a fresh novel read. Private and gitignored.')
source('N01','D&D 2024 Warlock','https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock','official_rules','page_read',
       'Pact Magic, patron relation, invocations and level gates.',
       '2024 revised fifth edition only. No generic automatic patron revocation rule is supplied here.')
source('N02','D&D 2024 Wish','https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Wish','official_rules','page_read',
       'Spell duplication, open requests, DM judgment, stress and 33 percent loss chance.',
       'Non-duplication effects incur stress, even listed alternatives. Do not blend with 2014 or other editions.')
source('A01','MTG The Value of Pie','https://magic.wizards.com/en/news/making-magic/value-pie-2003-08-18-0','official_designer_article','search_excerpt',
       'Color philosophies constrain both capabilities and weaknesses.',
       'Historical design article, not a current legality list or immutable color-mechanics chart.')
source('A02','MTG Shaman You','https://magic.wizards.com/en/news/making-magic/shaman-you-2008-03-24','official_designer_article','search_excerpt',
       'Color identity affects spellcaster flavor; player-built combinations drive discovery.')
source('F01','Dark Souls covenants','https://darksouls.wikidot.com/covenants','fan_wiki','page_read',
       'Offerings and ranks; switching versus hard betrayal; covenant-specific rewards.',
       'Dark Souls 1 including explicitly labeled Remastered notes; no Dark Souls 2/3 generalization.')
source('E01','Elden Ring official setting','https://www.bandainamcoent.com/games/elden-ring','official_game_site','search_excerpt',
       'Great Runes are claimed fragments of the shattered Elden Ring.')
source('E02','Elden Ring incantations','https://eldenring.fandom.com/wiki/Incantations','fan_wiki','search_excerpt',
       'Incantations need seals, requirements and scaling; spell types vary.')
source('E03','Elden Ring Rune Arc','https://eldenring.wiki.gg/wiki/Rune_Arc','fan_wiki','search_excerpt',
       'Rune Arc activates an equipped Great Rune.',
       'Great Runes page open failed internally; used separately indexed Rune Arc entry.')
source('B01','Hades Duo Boons','https://hades.fandom.com/wiki/Duo_Boons','fan_wiki','search_excerpt',
       'Two-god boons require prerequisite boons and are lost at death.',
       'Hades 1 only; page fetch failed internally. Hades 2 search results were excluded.')
source('P01','Path of Exile support gems','https://www.poewiki.net/wiki/Support_gem','fan_wiki','search_excerpt',
       'Linked sockets, support compatibility, altered behavior and cost multipliers.',
       'PoE 1 only. Official skills URL failed, wiki page returned 403. Indexed page also says tags alone do not decide compatibility.')
source('P02','PoEDB support requirements','https://poedb.tw/us/SupportGemRequirements','game_data_reference','search_excerpt',
       'Linked group rather than direct adjacency; support can change skill behavior.')
source('R01','Slay the Spire Dead Branch','https://slay-the-spire.fandom.com/wiki/Dead_Branch','fan_wiki','search_excerpt',
       'Exhaust creates random hand cards; combines with Corruption.',
       'Original video game only; board-game Dead Branch was excluded.')
source('R02','Slay the Spire Corruption','https://slaythespire.org/wiki/cards/corruption','fan_reference','search_excerpt',
       'Skills cost zero and exhaust on play.',
       'Cross-check card definition in installed game before direct implementation; no browser game test in this lane.')
source('V01','Marvel mutants','https://en.wikipedia.org/wiki/Mutant_(Marvel_Comics)','encyclopedia','search_excerpt',
       'X-gene innate route versus externally induced mutates; variants differ by continuity.')
source('V02','Marvel Elixir','https://www.marvel.com/characters/Elixir','official_character_profile','search_excerpt',
       'Touch-based biokinesis, healing/harm and collapse after major healing.')
source('V03','Marvel mystical mutants','https://www.marvel.com/articles/comics/mystical-mutants-marvel-universe-list?linkId=210900037','official_editorial','search_excerpt',
       'Mutation and learned magic can coexist; Beast studied with Strange.')
source('V04','Dr Strange 2019 issue 1','https://www.marvel.com/comics/issue/77846/dr_strange_2019_1','official_issue_synopsis','search_excerpt',
       'Magic has a cost in this run; surgical and magical obligations compete.',
       'Synopsis does not specify a universal per-spell cost formula.')
source('Z01','DC Green Lantern','https://www.dc.com/characters/green-lantern','official_character_profile','page_read',
       'Willpower-fueled rings, construct powers, oath, duties inherited with ring.')
source('Z02','DC Zatanna','https://www.dc.com/characters/zatanna','official_character_profile','search_excerpt',
       'Backward words, imagination and danger from magic.')
source('Z03','DC Zatanna iconic spells','https://www.dc.com/blog/2025/02/20/daer-siht-tsil-zatanna-s-ten-most-iconic-spells','official_editorial','page_read',
       'Blood-written spell despite lost voice; palindrome against word-reversal counter.',
       'Examples labeled by issue. Animated-series examples are not folded into comics continuity.')
source('Y01','Geas','https://en.wikipedia.org/wiki/Geas','encyclopedia','search_excerpt',
       'Irish taboo or obligation, plural geasa; conflicting bans.')
source('Y02','Death of Cu Chulainn','https://en.wikipedia.org/wiki/Aided_Con_Culainn','encyclopedia','search_excerpt',
       'Dog-meat taboo conflicts with hospitality, weakens hero before death.',
       'Narrative summary, not proof that historical Irish taboos have supernatural effects.')
source('U01','Goethe Faust Part One','https://en.wikipedia.org/wiki/Faust,_Part_One','encyclopedia','search_excerpt',
       'Earthly service exchanged for service in Hell conditional on complete satisfaction.',
       'Goethe wager only; not merged with Marlowe fixed-term pact.')
source('Q01','Rumpelstiltskin','https://en.wikipedia.org/wiki/Rumpelstiltskin','encyclopedia','page_read',
       'First-child bargain and name-guessing release.',
       'Specific Grimm tale; no universal rules about all fairies.')
source('O01','Benedictine daily life','https://www.benedictines.org.uk/daily-life/','religious_community_primary','search_excerpt',
       'Stability, conversion of life and obedience bind a communal vocation.',
       'Real institution and self-described spiritual practice, not evidence of numerical supernatural buffs.')
source('O02','Benedictine vows','https://www.portsmouthabbeymonastery.org/benedictine-vows','religious_community_primary','search_excerpt',
       'Stability in community and perseverance in conversion.')
source('X01','Chivalry','https://en.wikipedia.org/wiki/Chivalry','encyclopedia','search_excerpt',
       'Historically varied warrior, religious and courtly ideals; medieval texts differ.',
       'No single universal medieval knight code or automatic magic sanction established.')
source('X02','Modern code caveat','https://www.gonderzone.org/Library/Chivalry/code.htm','modern_commentary','search_excerpt',
       'The displayed code is a modern formulation, not an authentic universal medieval oath.')
source('CC01','Sleeping Beauty','https://en.wikipedia.org/wiki/Sleeping_Beauty','encyclopedia','page_read',
       'Death curse can be softened to sleep in Perrault/Grimm family of versions.',
       'Versions differ; Perrault awakening does not use a kiss. No Disney curse rules imported.')
source('CC02','The Monkeys Paw','https://www.gutenberg.org/files/12122/12122-h/12122-h.htm','public_domain_story','page_read',
       'Three wishes; money arrives through the son death and compensation.',
       'Public-domain short tale. No copyrighted book prose collected.')
source('JJ01','Aladdin','https://en.wikipedia.org/wiki/Aladdin','encyclopedia','page_read',
       'Distinct ring/lamp spirits, custody of lamp, weaker ring cannot undo stronger lamp magic.',
       'Galland-associated tale summary; Disney three-wish rules are not generalized to this version.')
source('JJ02','The Fisherman and the Genie','https://pressbooks.uiowa.edu/makur3/chapter/the-fisherman-and-the-genie/','public_domain_tale_hosted_by_university','page_read',
       'Seal, rescuer threat, demonstration trick, renewed bargain.',
       'Arabian Nights tale included by the assignment; not classified as intrinsically Western mythology.')

source('B02','Hades Trial of the Gods','https://hades.fandom.com/wiki/Trial_of_the_Gods','fan_wiki','search_excerpt',
       'Spurned god encounter, no Duo offers there, hostile Greater Call dialogue and Bad Call achievement.',
       'Index result accompanied robots block. No later request to this route.')
source('B03','Hades official FAQ','https://www.supergiantgames.com/blog/hades-faq/','official_game_FAQ','search_excerpt',
       'Run-to-run changes and combinations of Olympian powers; specific Greek-myth adaptation.')
source('F02','Dark Souls Chaos Servant','https://darksouls.wikidot.com/chaos-servant','fan_wiki','search_excerpt',
       'Covenant rank can open a shortcut affecting NPC quest access, not merely combat power.')
source('U02','Goethe Faust overview','https://en.wikipedia.org/wiki/Goethe%27s_Faust','encyclopedia','search_excerpt',
       'Conditional satisfaction wager and blood-signing in Part One.',
       'Part Two outcome is not used as a universal loophole.')

source('G03','Guide Interlude: East III','https://practicalguidetoevil.wordpress.com/2021/06/18/interlude-east-iii/','author_serial','search_excerpt',
       'Malicia and Bard discuss pattern-of-three danger and acting before a Name settles.',
       'Character tactical models, not proof of an infallible narrative win rule.')
source('H03','HWFWM book one review','https://fanfiaddict.com/review-he-who-fights-with-monsters-1-by-shirtaloon-aka-travis-deverell/','independent_review','search_excerpt',
       'Adventurer rank sequence iron, bronze, silver, gold, diamond.',
       'Secondary review only. Exact per-ability advancement thresholds not supplied.')

PATH = ['currency','steps','gate','risk','shape','branching','grader','ceiling']
AXES = ['object','mechanism','trigger','certainty','scope','price','limit','visibility','persistence','growth']
SLOTS = ['swearer','restriction','object','scope','duration','benefit','consequence','witness','condition','ramp','stake','counterparty','release','visibility','inheritance','interpretation','coercion_clause']

def claim(id, text, refs, status='verified_reference', locator=None):
    return dict(id=id,text=text,source_ids=refs,status=status,locator=locator)

def row(id, title, group, claims, path, families, origins, delivery, axes, vows, mechanics, abuse, limits):
    assert len(path)==8 and len(axes)==10
    basis=[c['id'] for c in claims if c['status']!='remembered_unverified']
    rows.append(dict(id=id,title=title,group=group,claims=claims,
      model_mapping_status='inference_from_cited_claims',basis_claim_ids=basis,
      path=dict(zip(PATH,path)),families=families,power_sources=origins,delivery_modes=delivery,
      axes=dict(zip(AXES,axes)),vows=vows,
      mechanics=[dict(id=f'{id}.M{i}',name=m[0],basis_claim_ids=m[1],what_we_take=m[2],status='proposal') for i,m in enumerate(mechanics,1)],
      gag_or_rule_abuse=abuse,limits=limits))

def vow(kind, **kw):
    # Null means absent or not established, not a new universal rule.
    return dict(kind=kind,mapping_status='inference',slots={s:kw.get(s) for s in SLOTS},
                enforcement=kw.get('enforcement','not established'),
                collective_rules=kw.get('collective_rules','No shared magical sanction established.'),
                interpretation_trick=kw.get('interpretation_trick','No verified loophole in this source selection.'))

def abuse(text, refs, status='verified_reference', note=None):
    return [dict(text=text,basis_claim_ids=refs,status=status,note=note)]

row('worm','Worm','book',[
 claim('worm.C1','Natural trauma triggers and administered formulas are distinct acquisition routes; powers ultimately involve Entity shards. Formula results and costs vary.',['W01'],locator='natural-triggers-and-formula-acquisition: W162-C01/02, W127-C03; cosmology: W281-C04/07, W291-C01/02'),
 claim('worm.C2','PRT classes guide countermeasures, while numbers estimate threat to a response team, not a universal power level.',['W02']),
 claim('worm.C3','Emergency truces are negotiated and enforced by people. Local powers have distinct reach, fuel and material limits.',['W01'],locator='territorial-coalitions: W220-C03, W279-C13/14; situated-power: W296-C07')],
 ['Shard fuel, materials, attention','Trigger then mastery; no common ladder','Trauma or formula; insight later','Bodily change; source agenda','Fixed gift with creative mastery','Case-specific evolution, not free respec','PRT assesses response needs','No universal cape cap'],
 ['Multiplication','Presence','Beasts','Parasitic','Machines'],['Shard','Granted','Trained'],['Active','Passive','Reactive'],
 ['Specific targets','Remote shard-mediated effect','Gift-specific','Assessment can be wrong','Range and sight differ','Fuel and sensory load','Material and counter','Class visible; origin hidden','Carrier-specific','Use and insight'],
 [vow('Social truce',swearer='Participating groups',restriction='Do not attack allies during emergency',object='Signatories and civilians',scope='Named emergency',duration='Agreement-specific',benefit='Cooperation and access',consequence='Retaliation and loss of trust',witness='Other groups',counterparty='Other signatories',visibility='Shared',interpretation='Negotiated',enforcement='Social, not automatic magic',collective_rules='Participants only; outsiders may decline')],
 [('Assessment is a separate record',['worm.C2'],'Proposal: save who graded a power, what they saw and which response the grade recommends.'),('Gift has its own agenda',['worm.C1'],'Proposal: separate source goals from user goals without treating every shard as collectible.')],
 abuse('Insect control can supply scouting and fine coordination as well as attacks. This is broad use of one gift, not another class unlocked by XP.',['worm.C3'],'inference','Operational profile, not a newly checked gag scene.'),
 'No Worm sequel sweep or fresh whole-book claim. Shards here are not identical to E8 shards of a broken artifact.')

row('cradle','Cradle','book',[
 claim('cradle.C1','Madra Paths climb Foundation, Copper, Iron, Jade, Gold and Lord stages. Lord gates require revelations. Sage and Herald are distinct achievements; Monarch joins them. Remnant absorption is one Gold route, not the only one.',['C01']),
 claim('cradle.C2','Core splitting loses a small amount of energy and divides reserves; cores can advance independently. An advanced Remnant may resist or allow a bond.',['C02','C03'])],
 ['Madra; aura; soulfire','Foundation to Monarch','Cycling, body preparation, revelations, bonds','Weak foundations; resisted bond','Ladder with two late branches','Paths; split cores; Sage/Herald convergence','Actual spiritual state','Monarch locally; ascension elsewhere'],
 ['Element control','Strength and enhancement','Inheritance','Bonds','Concept edge'],['Trained','Environment','Inherited'],['Active','Channel','Ritual'],
 ['Body and spirit','Aspected energy and authority','Technique or insight','Measured rank; individual exceptions','Technique-specific','Reserves and preparation','Channels and compatibility','Senses unlock by stage','Body/spirit and Remnant','Quality differs from capacity'],
 [vow('Bond, not generic sacrifice vow',swearer='Artist and partner',object='Spirits',benefit='Shared advancement means',counterparty='Sacred being',interpretation='Compatibility and relationship',enforcement='Bond mechanics; exact breach penalty not established')],
 [('Split reservoir with shared body',['cradle.C2'],'Proposal: track reservoir size, quality and refill separately from body rank.'),('Converging achievements',['cradle.C1'],'Proposal: allow insight and body transformation in either order before their joint gate.')],
 abuse('Splitting a core does not create free fuel: two smaller cores can house different Paths, with a slight loss at the split.',['cradle.C2']),
 'Ranks summarized from references; no complete Path roster. Remnant identity is not automatically the dead person soul.')

row('mistborn','Mistborn','book',[
 claim('mistborn.C1','Allomancy burns ingested metals. Feruchemy banks attributes in metal while weakening the same trait now; normal stores are personal. Hemalurgy steals and transfers power. These arts use metal differently.',['M01','M02']),
 claim('mistborn.C2','Compounding combines matching-metal Allomancy and Feruchemy so outside energy amplifies the stored attribute. It is not ordinary storage creating energy.',['M03'])],
 ['Burnable metal; stored attributes','Gift access then mastery','Inherited access; stores; stolen power','Depletion and harm in acquisition','Three overlapping toolkits','Single or many metals; Twinborn combinations','Capability, not a level badge','No single common art ceiling'],
 ['Stat work','Storage','Force and gravity','Emotion','Inheritance'],['Innate','Consumed','Item-bound','Stolen'],['Active','Stored','Toggle'],
 ['Body, mind or metal','Burn, bank or transfer','Art-specific activation','Metal-specific','Reach or store size','Fuel or earlier weakness','Access and ownership','Effects may expose art','Stores in metal; access in bearer','Mastery and combinations'],
 [vow('Storage trade, not a promise',swearer='Storing user',restriction='Lower own attribute while filling',object='Attribute',duration='While charging',benefit='Later burst',consequence='Opportunity cost already paid',stake='Stored attribute',enforcement='Resource accounting')],
 [('Time-shift an attribute',['mistborn.C1'],'Proposal: let calm days fund a later burst through a real named store.'),('Cross-system fuel loop',['mistborn.C2'],'Proposal: declare the external fuel and conversion rule that makes a storage combo multiply output.')],
 abuse('Matching arts can compound a store rather than merely return what was saved. The amplifier has an outside energy source.',['mistborn.C2']),
 'No complete sixteen-metal chart or universal inheritance rule. Later identity-free stores need separate era-specific proof.')

row('stormlight','The Stormlight Archive','book',[
 claim('stormlight.C1','Spren bonds grant Surges through ten Orders with different Ideals. Lightweavers progress through personal truths rather than the same oath pattern as other Orders.',['S01']),
 claim('stormlight.C2','Breaking a developed bond can harm its spren. Deadeye creation is tied to the Ba-Ado-Mishram imprisonment era and bond stage, not every broken oath in all history.',['S02'])],
 ['Stormlight, plus bond access','Progressive Ideals; order-specific','Accepted growth or personal truth','Bond damage also hurts partner','Bond release stages','Order identity; individual oath form','Bond and local acceptance','Order summit, not all cosmere power'],
 ['Bonds','Contracts and oaths','Element control','True names'],['Granted','Environment','Trained'],['Active','Passive'],
 ['Bearer and bonded spren','Surges through bond','Fuel and oath access','Words alone insufficient','Order-specific functions','Fuel and obligations','Bond state','Sworn ideals may be public','Bond continuity','Character-linked gates'],
 [vow('Growing oath',swearer='Radiant',restriction='Live an Order Ideal',object='Conduct or personal truth',scope='Life and actions',duration='Ongoing bond',benefit='Deeper bond and powers',consequence='Bond and spren damage',witness='Bonded spren/local acceptance',counterparty='Spren',visibility='Variable',interpretation='Order and person-specific',enforcement='Bond consequence',collective_rules='Shared Order themes, not one pooled vow')],
 [('Change through a promise',['stormlight.C1'],'Proposal: let a vow unlock a new function when a person proves growth, rather than always quoting a strength multiplier.'),('Partner takes breach damage',['stormlight.C2'],'Proposal: assign breach victims separately from the swearer and keep era-specific sanctions.')],
 abuse('Personal truth supplies a progression route where a stock oath would be the wrong gate. This is a distinct Order rule, not cheating the oath system.',['stormlight.C1']),
 'Exact Ideal counts and new-era bond outcomes need source-era selection. No automatic universal deadeye rule.')

row('kingkiller','The Kingkiller Chronicle','book',[
 claim('kingkiller.C1','Sympathy uses Alar to link objects and transfer force or energy, with losses including heat in the user. Naming instead depends on intuitive discovery of a true name; a spoken label alone is insufficient.',['K01','K02'])],
 ['Energy source and concentration','Practice; mastery; Names','Study for links, insight for Names','Bodily heat or depletion','Two distinct arts in open field','Engineering and intuitive routes','Teachers assess skill','No verified numeric cap'],
 ['True names','Force and gravity','Element control','Machines'],['Trained','Environment','Technology'],['Active','Composed'],
 ['Linked objects or named thing','Transfer versus direct mastery','Concentration or insight','Link quality and understanding','Link-specific','Energy and bodily loss','Knowledge is not fuel','Effect visible; link may be hidden','Learned method in learner','Precision versus intuitive grasp'],
 [vow('Not a vow system',enforcement='Physical/magical link rules',collective_rules='Teaching institutions; no collective magical vow established')],
 [('Loss reaches the operator',['kingkiller.C1'],'Proposal: put waste heat and control failure in a technique profile, so better links matter.'),('Name is understanding',['kingkiller.C1'],'Proposal: distinguish an ordinary label, a known true-name secret and the grasp needed to use it.')],
 abuse('An efficient link and an outside heat source could beat a larger personal reserve. This is a design inference, not a checked Kvothe scene.',['kingkiller.C1'],'inference'),
 'Fandom blocked. Exact slippage formula, Alar splitting limits and named duel tricks remain unverified; none supplied as canon.')

row('dresden','The Dresden Files','book',[
 claim('dresden.C1','Faerie-office debts can survive a change of holder. Lea fulfilled Harry power bargain through confidence without increasing his actual powers.',['D01']),
 claim('dresden.C2','The author says Soulfire and Hellfire are not additive; selection depends on user and purpose.',['D02']),
 claim('dresden.C3','Remembered: Soulfire invests part of the caster soul into magic, with depletion risk and recovery. Exact cost and recovery are not verified in this pass.',[],'remembered_unverified')],
 ['Magic; purpose; patron access','Study and acquired gifts','Training, bargain or gift','Obligation and misuse','Open arts with offices','Gift combinations constrained','Peers and local metaphysics','No numeric ceiling verified'],
 ['Contracts and oaths','Debt','Inheritance','Soul work','Borrowed'],['Trained','Granted','Inherited'],['Active','Ritual'],
 ['Caster, bargain and office','Magic plus purpose-specific gift','Casting or claimed favor','Fulfillment may surprise','Deal-specific','Obligations; soul cost unverified','Not every gift adds together','Debt terms may be hidden','Office carries claims','Study and changing duties'],
 [vow('Faerie bargain',swearer='Named parties',restriction='Perform agreed service',object='Promised outcome',duration='Terms of deal',benefit='Service or promised power',consequence='Claim or debt; exact punishment varies',witness='Faerie counterparty',counterparty='Office or individual',inheritance='Office-linked claims persist',interpretation='Outcome may differ from expected means',enforcement='Bargain/office authority',interpretation_trick='Confidence fulfilled Lea promise without a stat increase')],
 [('Office holds the claim',['dresden.C1'],'Proposal: let a debt name an office so a new holder can collect it.'),('Result versus method',['dresden.C1'],'Proposal: record what was promised separately from how the patron fulfills it.')],
 abuse('The apparent power-up in Lea bargain was confidence. Killing or replacing a faerie office holder does not necessarily erase its claims.',['dresden.C1']),
 'Do not source universal truth-binding from author folklore preamble. Soulfire soul cost is remembered only, not ready for direct recreation.')

row('wheel','The Wheel of Time','book',[
 claim('wheel.C1','The One Power has saidin and saidar halves; saidin taint belongs to a specific history. The Oath Rod is a ter angreal binder; sworn acts can become impossible and binding reduces lifespan.',['T01','T02']),
 claim('wheel.C2','The truth oath follows what the speaker believes. Evasion is possible; the Rod can remove oaths. Oaths support institutional trust but do not grant channeling.',['T01'])],
 ['One Power','Learning and strength, not universal XP','Ability plus trained control','Era-specific taint; binding cost','Trained toolkit and institution','Schools and tools','Strength differs from Tower status','Person-specific; not one shared cap'],
 ['Element control','Sealing','Truth-bound','Contracts and oaths'],['Innate','Trained','Item-bound'],['Active','Composed','Ritual'],
 ['Weaves and swearer','Channeling versus binding','Technique or forbidden act','Belief is not objective truth','Tool-specific','Danger and lifespan','Binder prevents acts','True statements can mislead','Oath until released','Skill and institutional tests'],
 [vow('Preventive binder',swearer='Channeler',restriction='Truth and conduct oaths',object='Speech, weapons and force',scope='Bound conduct',duration='Until removal',benefit='Membership and trust',consequence='Forbidden act blocked; lifespan cost',witness='Oath Rod',stake='Lifespan',release='Rod can remove binding',interpretation='Believed truth with evasion',enforcement='Prevention',collective_rules='Common oaths bind each member separately',interpretation_trick='A false belief can be spoken without lying')],
 [('Cannot act versus pay after',['wheel.C1'],'Proposal: make prevention and punishment separate enforcement modes.'),('Belief as truth basis',['wheel.C2'],'Proposal: let a local truth rule inspect belief rather than secretly reading objective world facts.')],
 abuse('A technically true or sincerely believed statement can mislead listeners despite the speech oath.',['wheel.C2']),
 'Not all ter angreal are binders. No universal male/female stat rule or television-source blend.')

row('guide','A Practical Guide to Evil','book',[
 claim('guide.C1','Names give access to up to three Aspects shaped by the person and the Name. A Role has causal weight beyond physical power.',['G01','G02']),
 claim('guide.C2','Malicia and Bard discuss danger at the end of a pattern of three, and planning an attack before a Name settles. These are character tactical judgments, not guaranteed results.',['G03'])],
 ['Name power and narrative position','Claimant to Named; Aspects emerge','Take a Role and develop it','Role mismatch and rival stories','Role succession and aspects','Aspects differ within same Name','Local narrative metaphysics','Three Aspects in reference; magnitude uncapped'],
 ['Fame','Concept edge','Achievements','Causality'],['Faith or fame','Granted','Trained'],['Active','Reactive'],
 ['Actor and story role','Aspect function plus causal weight','Role-fitting action','Narrative pressure is not certainty','Scene and culture','Commitment to role','Role and soul damage','Title known; aspect hidden','Name/role, not automatic heir carry','Personal expression'],
 [vow('Role obligation, not priced vow',swearer='Named actor',restriction='Role-shaped conduct',object='Life pattern',benefit='Name and Aspects',interpretation='Cultural narrative',enforcement='Role mechanics; no breach schedule established')],
 [('Role selects affordances',['guide.C1'],'Proposal: let a title change eligible actions and counterplay as well as stats.'),('Same title, different verbs',['guide.C1'],'Proposal: derive a few aspect verbs from lived choices, rather than issue every title holder identical skills.')],
 abuse('Malicia and Bard plan around when a Name is vulnerable; Malicia pattern-of-three model is corrected in the conversation. Knowledge of story rules can be partial.',['guide.C2'],'verified_reference','A checked plan and disagreement, not a proved automatic victory.'),
 'No Jumpchain AP/CP budgets used. Role causality must not become global plot armor. Exact narrative outcomes still require scene-specific checks.')

row('inn','The Wandering Inn','book',[
 claim('inn.C1','Classes can consolidate, sometimes keeping multiple titles in one class. Lyonette lost Princess through role mismatch and regained it by redefining the role. System messages announce levels, class changes and more.',['I01','I02'])],
 ['Class experience from life','Class levels and consolidation','Occupation, lived challenge and system award','Class loss or unwanted identity','Multiple ladders can merge','Role consolidation, not arithmetic addition','Grand Design; society reads the label','No universal ceiling established'],
 ['Achievements','Interface','Leadership','Creation'],['Granted','Trained'],['Passive','Active','Reactive'],
 ['People and role functions','System-issued skills','Life and level award','Message is an award, not full appraisal','Skill-specific','Effort and chosen life','Class requirements','Announcements versus hidden class','World-person record','Levels and class meaning'],
 [vow('Role condition',swearer='Class holder',restriction='Role-compatible life',object='Class identity',benefit='Class access',consequence='Role mismatch can lose class',release='Role may be redefined',interpretation='Meaning of class',enforcement='Class system; not generic vows')],
 [('Merge a lived career',['inn.C1'],'Proposal: let two pursuits form a new role when their history fits, without adding their level numbers.'),('Redefine rather than restore',['inn.C1'],'Proposal: allow a role lost through conduct to return under a newly demonstrated meaning.')],
 abuse('Redefining Princess let a role return without simply undoing the character life.',['inn.C1']),
 '403 prevented full reference access. No fresh capstone, level-refusal or universal XP formula claims.')

row('carl','Dungeon Crawler Carl','book',[
 claim('carl.C1','The AI runs dungeon rules and achievements. Sponsors advertise on crawler channels and can send Benefactor Boxes; ratings affect sponsor attention.',['J01','J02']),
 claim('carl.C2','A public explainer describes the AI giving unusually specific rewards around Carl feet, including a toe ring.',['J03'])],
 ['Experience, loot and sponsor resources','Crawler levels and floor gates','Survive and meet dungeon conditions','Death and manipulative administration','Level ladder inside staged contest','Build offers; sponsor interests','AI and contest administration','No safe universal cap established'],
 ['Interface','Achievements','Shop','Works only observed'],['Granted','Technology','Item-bound'],['Active','Passive','Reactive'],
 ['Crawler and audience channel','System rewards plus outside gifts','Achievement and sponsor decision','Rules can have biased execution','Dungeon/floor and audience','Risk, attention and obligations','Admin and gift rules','Feed makes acts public','Run-scoped unless specified','Levels and market attention'],
 [vow('Commercial sponsorship',swearer='Sponsor and contest parties',object='Crawler channel',scope='Contest',benefit='Benefactor gear',counterparty='Sponsor',visibility='Broadcast',interpretation='Sponsor/admin terms',enforcement='Commercial/system; exact breach not established',collective_rules='Sponsor market and contest administration coexist')],
 [('Patron and judge differ',['carl.C1'],'Proposal: separate the sponsor paying for a reward from the authority permitting it.'),('Biased reward taste',['carl.C2'],'Proposal: let a comic patron favor odd feats and leave a visible record of what earned the gift.')],
 abuse('The feet-focused rewards make an odd patron preference into a real loot incentive.',['carl.C2']),
 'Indexed/wiki and public explainer coverage only. No exploit recipe or exact sponsor-floor quota proposed as verified canon.')

row('hwfwm','He Who Fights With Monsters','book',[
 claim('hwfwm.C1','Three essences form a confluence. Each essence has five abilities; one wakes on bonding, others through stones. Stone and user shape partly random outputs. Divine essences retain a god connection and can be revoked. Confluences are not transferable.',['H01','H02']),
 claim('hwfwm.C2','The independent book-one review lists iron, bronze, silver, gold and diamond as adventurer ranks. Exact per-ability thresholds and later transcendence are not verified here.',['H03'])],
 ['Essence abilities and training','Iron, bronze, silver, gold, diamond; thresholds open','Bond essences; awaken abilities','Bad fit; divine removal','Three inputs plus confluence','Stone selection biases a build','Metaphysical rank, not rarity label','Diamond in secondary reference; further unknown'],
 ['Inheritance','Curses and blessings','Stat work','Soul work'],['Consumed','Granted','Trained'],['Active','Passive','Ritual'],
 ['Soul and ability set','Essence plus awakening catalyst','Ritual bonding','Biased random, not guaranteed pick','Ability-specific','Rare ingredients and commitment','Slots and donor connection','Rank/rarity can be misread','Soul-bound; no implied portability','Abilities improve; exact gates open'],
 [vow('Divine grant',swearer='Recipient',object='Divine essence',benefit='Granted ability source',consequence='Revocation can unbalance bearer',counterparty='God',interpretation='Grant conditions not fully established',enforcement='Donor connection; not all essences revocable')],
 [('Emergent fourth source',['hwfwm.C1'],'Proposal: let a chosen set produce an emergent result while preserving the inputs.'),('Rarity is not power',['hwfwm.C1'],'Proposal: separate scarcity, output strength, precision of the draw and donor rights.')],
 abuse('The reference explicitly says a duck-essence user can beat a fox-essence user. Theme and rarity do not decide the winner.',['hwfwm.C1']),
 'No acquired book read; page access blocked. Rank names have secondary support; exact advancement thresholds remain open.')

row('mol','Mother of Learning','book',[
 claim('mol.C1','Mana reserves and practiced shaping are distinct. Skills and marked memories can persist across iterations; soul scars can survive bodily renewal. Simulacra share original soul support and mana rather than create free reserves.',['L01'],locator='C001-06/07/08; C005-01/02/08; C070-04/09; C083-10; C084-01-09'),
 claim('mol.C2','One divine disclosure pact reads the bound person senses, thoughts and memories. A private authored research gift allows knowledge evasion without removing that pact.',['L01'],locator='PSE01/02; C096-07-10; C098-09')],
 ['Mana, shaping skill and iteration time','Mastery and loop access, no XP ladder','Teachers, practice, ritual and marker access','Soul scars; finite iterations; lost copies','Knowledge accumulation with reset body','Structured spells, shaping and soul work','Competence differs from loop authorization','No universal upper rank'],
 ['Save and load','Memory','Soul work','Multiplication','Storage'],['Trained','Innate','Item-bound','Granted'],['Active','Composed','Ritual'],
 ['Body, mind, soul, marker','Practice plus authorized continuity','Reset differs from spell trigger','Character theory differs from witnessed result','Loop access and ability range','Mana, scars and real preparation','Wards and authority','Bound observer has limited evidence','Explicit memory/soul carriers','Retained skill; not all body gains'],
 [vow('Information-sensitive divine pact',swearer='Zach in the checked pact',restriction='Mission and disclosure terms',object='Prison safeguards and known evidence',duration='Mission-specific',benefit='Granted mission powers',consequence='Contract sanctions',witness='Divine pact authority',counterparty='Divine party',visibility='Private knowledge matters',interpretation='What senses/thoughts/memory reveal',enforcement='Contract with information clause',interpretation_trick='An ally can arrange help outside the bound person knowledge')],
 [('Knowledge limits enforcement',['mol.C2'],'Proposal: define what a witness can learn and when it checks a clause.'),('Copies share a bill',['mol.C1'],'Proposal: show shared fuel use before copies act so parallel workers do not mint energy.')],
 abuse('The disclosure pact can be evaded through how information reaches the bound person; the pact itself remains.',['mol.C2']),
 'Reuses reviewed dossier. Exact divine contract is one case, not all geasa. No universal save-load or soul-damage cure inferred.')

row('marvel','Marvel comics','comics',[
 claim('marvel.C1','Mutants have an innate X-gene route; mutates gain power through outside changes. These origins are not the same classification. Mutants can also learn magic.',['V01','V03']),
 claim('marvel.C2','Elixir touch-based biokinesis can heal or harm; major healing can cause collapse. Dr Strange 2019 presents competing medical/magic duties and says magic has a cost, without one universal formula.',['V02','V04'])],
 ['Power-specific energy or access','Manifestation and training','Gene, external change, teacher or artifact','Power-specific harm and obligations','Many source-specific paths','Mutation plus study can coexist','Labels depend on observers and continuity','No shared Marvel numeric cap'],
 ['Adaptation','Healing','Strength and enhancement','Machines','Curses and blessings'],['Innate','Mutation','Trained','Technology'],['Active','Passive'],
 ['Body or chosen target','Gene, induced change or magic','Source-specific','Labels do not prove all limits','Person-specific','Example: healer collapses','Touch or learned means','Hidden origin; visible effect','Gene/body versus acquired skill','Control and knowledge'],
 [vow('No common comics vow law',benefit='Patron/ritual-specific magic',consequence='Run-specific cost',enforcement='Continuity and power-specific',collective_rules='Institutions classify; no universal mutant sanction')],
 [('Origin is not effect',['marvel.C1'],'Proposal: keep a power source separate from what it does and from the label others give it.'),('Heal and harm use same grasp',['marvel.C2'],'Proposal: let one body-control method have both uses and a distinct overuse cost.')],
 abuse('A mutant studying magic crosses two acquisition routes instead of treating mutant as a complete class tree.',['marvel.C1']),
 'Comics examples only. No alpha/beta ladder or universal Omega strength number; no MCU blending. Further magic-cost scenes require run-specific review.')

row('dc','DC comics','comics',[
 claim('dc.C1','Hal Jordan ring is alien technology fueled by willpower and makes constructs; Abin Sur passed ring and duties to him. Zatanna commonly uses backward spells.',['Z01','Z02']),
 claim('dc.C2','DC editorial cites Zatanna healing by writing in blood after losing speech, and using a palindrome against a reversal counter. These examples are tied to specific comic issues.',['Z03'])],
 ['Willpower-ring source or learned magic','Training and source access','Ring succession; magic mastery','Duty and spell consequences','Source-specific open mastery','Tools, innate traits and methods differ','Corps status versus actual capability','No common DC cap'],
 ['Creation','Words of power','Inheritance','Force and gravity','Language'],['Technology','Inherited','Trained'],['Active','Composed'],
 ['Construct or spell target','Ring channel versus intent-bearing language','Thought, speech or alternate inscription','Counter depends on real mechanism','Spell/construct-specific','Charge/control or magic cost','Medium can change','Words reveal method','Ring custody plus duties','Creative methods'],
 [vow('Corps duty oath',swearer='Lantern',restriction='Protect assigned sector',object='Duty',benefit='Office and ring access',counterparty='Corps',inheritance='Ring and duties may pass',visibility='Known oath',enforcement='Institutional duty; exact automatic penalty not established')],
 [('Medium is not mechanism',['dc.C2'],'Proposal: a speech counter can leave a hard alternate casting route if the source permits it.'),('Symmetry defeats a counter',['dc.C2'],'Proposal: let a transformed technique remain valid when its structure is unchanged by the hostile rule.')],
 abuse('A palindrome survives a word-reversal counter; writing in blood bypasses one lost-voice situation.',['dc.C2']),
 'Do not give every mute caster this escape. DC editorial lists several continuities; only labeled comics examples used here.')

row('dnd','Dungeons & Dragons: 2024 revised fifth edition','tabletop',[
 claim('dnd.C1','Warlocks gain Pact Magic and invocation choices through level gates and patron relations. The cited class rules do not specify automatic removal of all powers for displeasing a patron.',['N01']),
 claim('dnd.C2','Wish duplicates spells of level eight or lower without their normal requirements. Other uses incur stress, including a 33 percent chance to lose Wish forever. Open-ended requests let the DM fail, partly grant or twist the result.',['N02'])],
 ['Pact slots and class progression','Levels 1 to 20','Level and invocation prerequisites','Wish stress; patron trouble is contextual','Level ladder with toolkit picks','Invocations and multiclass rules','Rules plus DM for open requests','Class cap; Wish is not unlimited control'],
 ['Borrowed','Contracts and oaths','Creation','Causality','Words of power'],['Granted','Trained'],['Active','Ritual'],
 ['Spell target or pact bearer','Defined effect versus adjudication','Spell action and components','Listed duplication versus open wish','Spell-specific','Slots; non-duplication stress','Eligibility and DM authority','Effect versus pact terms','Feature or permanent effect as stated','Levels and choices'],
 [vow('Warlock pact',swearer='Warlock',benefit='Knowledge and Pact Magic',counterparty='Patron',interpretation='Chosen fiction and class rules',enforcement='No automatic revocation clause in cited class'),
  vow('Wish request',swearer='Caster',object='Requested reality change',duration='Effect-specific',benefit='Spell or wished result',consequence='Stress outside duplication; possible permanent loss',witness='DM for open request',interpretation='Defined effect or broad adjudication',enforcement='Spell rules, not abstinence vow',interpretation_trick='Duplication avoids stress; listed alternatives do not')],
 [('Safe function versus open request',['dnd.C2'],'Proposal: offer defined effects beside a flexible request with its own declared failure rules.'),('Pact need not mean revocation',['dnd.C1'],'Proposal: record whether a gift is learned, licensed or continuously lent before applying a patron penalty.')],
 abuse('Spell duplication sidesteps normal components by explicit rule. Calling a non-duplication effect a safe listed option does not evade Wish stress.',['dnd.C2']),
 '2024 rules only. No Wish/Simulacrum infinity exploit or blanket warlock soul-sale assumption used.')

row('mtg','Magic: The Gathering','game',[
 claim('mtg.C1','The color pie ties philosophy to capabilities and weaknesses. The official design essays explain why distinct colors and player-built combinations support discovery.',['A01','A02'])],
 ['Colored and generic mana','Board development, not character ranks','Sources and spell costs','Poor access or unmet cost','Affinity wheel and build web','Multi-color builds change access needs','Card rules and chosen format','Format/card-pool bound, no lore ladder'],
 ['Element control','Creation','Negation','Consumption','Conditions'],['Environment','Trained','Item-bound'],['Active','Reactive','Composed'],
 ['Spells and board objects','Color-specific permission','Rules and timing','Deterministic text; uncertain draws','Card-specific','Mana and build access','Color weaknesses','Public board; hidden hand','Match state','Deck combinations'],
 [vow('Color identity is not an oath',restriction='Capability profile per color',benefit='Distinct strengths',enforcement='Card rules and design; not moral policing',collective_rules='Players share game rules')],
 [('Affinities have blind spots',['mtg.C1'],'Proposal: record which functions a school lacks so a second school changes choices.'),('Philosophy is not alignment',['mtg.C1'],'Proposal: let a path express goals and methods without fixing its user moral worth.')],
 abuse('A mixed build could fill one school weakness but need a more complex fuel supply. This is an original design inference, not a specific sanctioned combo claim.',['mtg.C1'],'inference'),
 'Color flavor drawn from dated official essays. Exact modern color breaks, format legality and named combos not surveyed.')

row('souls','Dark Souls 1 covenants','game',[
 claim('souls.C1','Covenants grant routes and rewards through membership and offerings. Switching is distinguished from hard betrayal; offerings can be halved and ranks reduced. Covenant and version matter.',['F01']),
 claim('souls.C2','Chaos Servant rank can open a shortcut that affects access to an NPC rescue route.',['F02'])],
 ['Souls for player; offerings for covenant','Player growth and covenant ranks are separate','Join and offer required tokens','Betrayal and access loss','Faction rank layered over build','Change membership with consequences','Covenant-specific accounting','Local rank cap, not player strength cap'],
 ['Contracts and oaths','Debt','Faith','Borrowed'],['Granted','Trained','Item-bound'],['Active','Passive'],
 ['Member and faction access','Offerings unlock rewards','Membership and contribution','Explicit game rules','Covenant-specific','Offerings and forgone alternatives','Version and affiliation','Rank is a faction record','Stored credit affected on departure','Contribution rank'],
 [vow('Covenant membership',swearer='Player member',restriction='Covenant-specific duties',object='Members and faction acts',scope='Covenant',duration='Membership',benefit='Rewards and access',consequence='Credit/rank loss; hard betrayal differs',counterparty='Covenant',release='Departure or applicable absolution',interpretation='Game/version-specific rules',enforcement='Faction rules',collective_rules='Co-op or invasion affiliation differs by covenant')],
 [('Leave versus betray',['souls.C1'],'Proposal: distinguish resignation, hostile breach and absolution in the contract ledger.'),('Rank from delivered proof',['souls.C1'],'Proposal: let a faction grade contributions separately from combat ability.')],
 abuse('Departure and betrayal should not be read as the same act simply because both change affiliation.',['souls.C1'],'inference'),
 'No Dark Souls 2/3 rules mixed in. No claim every earned spell disappears on departure.')

row('elden','Elden Ring','game',[
 claim('elden.C1','Great Runes are fragments of the broken Elden Ring. A Rune Arc activates an equipped Great Rune. Incantations use sacred seals and their own stat requirements and scaling.',['E01','E02','E03'])],
 ['Runes for growth; FP for spells','Stat investment; spell and rune access','Acquire spell, meet stats and use seal','Unusable source or spent consumable','Open stat build with artifact layers','Incantation schools and catalyst choices','Requirements and scaling','No single incantation ladder'],
 ['Faith','Element control','Healing','Inheritance','Conditions'],['Trained','Item-bound','Granted'],['Active','Passive'],
 ['Bearer or spell target','Catalyst casting versus rune activation','Cast or Rune Arc use','Requirements differ from worship','Spell-specific','FP and consumable','Seal and prerequisites','Artifact owned may be inactive','Equipment and activation state','Stats and tool upgrades'],
 [vow('Not a general faith vow',object='Seal or Great Rune',benefit='Spell execution or rune effect',condition='Proper means and activation',enforcement='Equipment and game rules',collective_rules='Schools are distinct; no common pact law shown')],
 [('Own, equip and activate',['elden.C1'],'Proposal: show these as separate artifact states.'),('Faith is a casting stat here',['elden.C1'],'Proposal: separate a skill called faith from an actual bargain or moral conduct rule.')],
 abuse('One could possess a famous rune and still lack its active effect. That is an access distinction, not a second acquisition roll.',['elden.C1'],'inference'),
 'Base game lens. Great Rune and ordinary rune currency are different. No invented requirement to obey a god before using every incantation.')

row('hades','Hades 1 boons','game',[
 claim('hades.C1','Duo Boons need prerequisite boons from the relevant gods. They are lost when Zagreus dies and returns, like other boons. Prerequisites establish eligibility, not a guaranteed offer.',['B01','B03']),
 claim('hades.C2','Trial of the Gods does not offer Duo Boons. Calling the spurned god with a full gauge provokes special dialogue and the Bad Call achievement, without another effect from that insult.',['B02'])],
 ['Run offers and combat resources','Boon selections within a run','Obtain prerequisite boons then receive offer','Build fails to appear; death clears boons','Temporary build web','Two-source combinations','Offer and eligibility rules','Build/encounter bounds, not god rank'],
 ['Curses and blessings','Bonds','Borrowed','Element control'],['Granted'],['Active','Passive','Reactive'],
 ['Attack slot or effect','God-specific modification','Combat or eligible offer','Eligible differs from offered','Run and action-specific','Opportunity cost of pick','Prerequisite set','Known boons','Lost at return','Synergy rather than permanent ranks'],
 [vow('Temporary divine boon',swearer='Recipient',object='Run boon',duration='Current escape attempt',benefit='Combat modifier',condition='Relevant action and prerequisites',counterparty='Gods',enforcement='Run state; no abstinence vow')],
 [('Eligibility is not chance',['hades.C1'],'Proposal: show missing prerequisites separately from draw odds.'),('Pair grant with own function',['hades.C1'],'Proposal: two compatible patrons can enable a distinct technique instead of stacking two percentages.')],
 abuse('Using the Greater Call of the god currently attacking you is the Bad Call joke. It earns dialogue and an achievement, not a new hidden retaliation rule.',['hades.C2']),
 'Hades 1 only, indexed reference; no native playtest and no verified reward-stack exploit.')

row('poe','Path of Exile 1 support gems','game',[
 claim('poe.C1','Support gems modify compatible skills within linked sockets and can change behavior and costs. Direct adjacency is unnecessary within a linked group. Gem tags alone do not determine support compatibility.',['P01','P02'])],
 ['Mana, gems and linked equipment','Gem growth and build assembly','Compatible support and linked slots','Unaffordable skill or invalid link','Composed technique web','Swap supports within means','Actual support restrictions','Equipment/skill bounds, not shared world rank'],
 ['Conditions','Marks and stacks','Element control','Delay'],['Item-bound','Trained'],['Composed','Active','Reactive'],
 ['Linked skill, not whole character','Behavior modifier','Supported use','Compatibility must be resolved','Socket group','Changed cost','Explicit support restrictions','Link can be inspected','Equipment-bound','Parts and mastery'],
 [vow('Composition restriction, not vow',object='Skill operation',restriction='Meet support restrictions',benefit='Modified behavior',consequence='Invalid support gives no effect',enforcement='Support resolver')],
 [('Executable grammar for techniques',['poe.C1'],'Proposal: check valid compositions and resulting costs before committing a new technique.'),('Local parts affect local skills',['poe.C1'],'Proposal: prevent a support on one method from silently buffing every power.')],
 abuse('A support linked to several valid skills can alter all of them; adjacency alone is not the rule.',['poe.C1'],'inference'),
 'PoE 1 only, not PoE 2 socket/category rules. Official URL failed and wiki 403; index/data reference evidence only.')

row('spire','Slay the Spire 1 relics','game',[
 claim('spire.C1','Dead Branch creates a random card when a card exhausts. Corruption makes Skills free and exhausts them on play. Together, spending disposable Skills can generate more options.',['R01','R02'])],
 ['Turn energy, hand and deck','Relic/card picks over run','Obtain relevant cards and relics','Random output and exhausted deck','Reactive build web','Combine relic and card rules','Actual ordered triggers','No rank ladder'],
 ['Conditions','Creation','Wild','Sacrifice'],['Item-bound','Granted'],['Reactive','Passive','Composed'],
 ['Card/action record','On-exhaust creates card','Exhaust event','Random card, deterministic trigger','Hand and combat','Disposable option','Actual exhaustion rule','Relics known','Run; combat pile state','Interactions'],
 [vow('Conditional cost, not sworn promise',restriction='Exhaust played Skill under Corruption',object='Skill card',benefit='Zero energy Skill',consequence='Leaves available deck',enforcement='Card and relic triggers')],
 [('Cost becomes another input',['spire.C1'],'Proposal: let a real paid cost trigger another rule, with an explicit resolution order.'),('Power can make clutter',['spire.C1'],'Proposal: show generated options and finite hand/attention costs instead of treating random creation as pure upside.')],
 abuse('Dead Branch plus Corruption turns an exhaust downside into new cards. Generated cards remain random; this is not guaranteed infinity.',['spire.C1']),
 'Original video game, not board-game Dead Branch. No installed-game verification or probability sweep.')

row('geis','Irish geis and geasa','myth',[
 claim('geis.C1','A geis may be a taboo or required act. The Cu Chulainn death story puts a dog-meat ban against hospitality; complying with one breaks the other and weakens the hero.',['Y01','Y02'])],
 ['No common currency','No common steps','Receiving a taboo or obligation','Conflicting duties and doom','Imposed conditions on life','Different personal taboos','Story-specific sacred rule','No common cap'],
 ['Contracts and oaths','Cursed gift','Conditions'],['Granted','Inherited'],['Passive','Reactive'],
 ['Bound person and act','Taboo-linked consequence','Forbidden or required action','Story-version rule','Personal circumstance','Lost freedom and breach harm','Conflicting obligation','Terms known or hidden','Named bearer','No ordinary XP growth'],
 [vow('Sacred taboo',swearer='Hero',restriction='Avoid forbidden meat; hospitality duty',object='Meal',duration='Life condition',benefit='Not explicitly priced in tale',consequence='Weakening and doom',interpretation='Story-version terms',coercion_clause='Trap does not automatically excuse breach',enforcement='Narrative supernatural consequence',interpretation_trick='Make one duty demand another prohibited act')],
 [('Conflict is a real state',['geis.C1'],'Proposal: detect that no available act can keep all promises and show which one each option breaks.'),('No reward still a binding',['geis.C1'],'Proposal: permit imposed duties with no benefit quote rather than inventing a buff to balance them.')],
 abuse('Offering forbidden meat as hospitality creates an obligation trap.',['geis.C1']),
 'Irish tale family, not a generic Celtic constitution. Supernatural effect belongs to narrative, not an empirical claim about culture.')

row('faust','Faustian pact: Goethe wager','myth',[
 claim('faust.C1','In Goethe Part One, Mephistopheles offers earthly service for Faust service in Hell. Faust adds the condition that a wholly satisfying moment ending his striving triggers the loss.',['U01','U02'])],
 ['Patron service and pledged future','Experience seeking, not ranks','Sign bargain; satisfaction is final trigger','Lose self/future service','Conditional wager','Different desires alter journey','Pact and interpretation','No numerical ceiling'],
 ['Contracts and oaths','Borrowed','Debt'],['Granted'],['Active','Ritual'],
 ['Desire and future obligation','Patron fulfills experiences','Satisfaction condition','Inner state is hard to judge','Life wager','Future service','Conditional trigger','Private intention matters','Until wager resolves','No general leveling'],
 [vow('Conditional soul wager',swearer='Faust',restriction='Future service if condition met',object='Life satisfaction',duration='Until decisive moment',benefit='Earthly service',consequence='Death/service in Hell per wager',witness='Pact parties',stake='Future self',counterparty='Mephistopheles',condition='Satisfied enough to cease striving',interpretation='Intent and expressed satisfaction',enforcement='Conditional pact')],
 [('Threshold debt',['faust.C1'],'Proposal: a bargain can charge its full price when a future inner-state condition is met.'),('Benefit threatens keeping',['faust.C1'],'Proposal: let what the patron offers also move the bearer toward the bargain danger.')],
 abuse('The desired reward is also the condition that risks losing the wager; the collector must get more than a signed receipt.',['faust.C1'],'inference'),
 'Goethe Part One only. Do not merge Marlowe twenty-four-year term or claim Part Two settles by the same simple condition.')

row('fae','Fae bargains: Rumpelstiltskin','myth',[
 claim('fae.C1','In the Grimm tale, spinning straw into gold is exchanged for the first child. A later name-guessing condition allows release from that claim.',['Q01'])],
 ['Payment and promised child','Bargain then release trial','Accept service; discover name','Deferred claim on child','Contract with knowledge exit','Revised terms add escape','Named helper and tale rules','No shared fairy rank'],
 ['Transmutation','Contracts and oaths','True names','Debt'],['Granted','Trained'],['Active','Ritual'],
 ['Straw and promised child','Helper craft plus claim','Request or collection','Hidden name determines exit','Specific parties','Payment or child','Release challenge','Terms known; name secret','Deferred obligation','Knowledge changes available exit'],
 [vow('Bargain with secret release',swearer='Parent',restriction='Deliver promised child',object='First child',duration='Until claim or name solution',benefit='Gold-making service',consequence='Child claimed',counterparty='Helper',release='Guess correct name under granted terms',visibility='Name hidden',interpretation='Specific revised bargain',enforcement='Tale bargain',interpretation_trick='Learn secret name to satisfy the release clause')],
 [('Release is a quest',['fae.C1'],'Proposal: add an earned information-based release route to selected hostile bargains.'),('Beneficiary is not payer',['fae.C1'],'Proposal: record who gets the benefit, who promises and whose property or life is claimed.')],
 abuse('Learning the secret name defeats the collection claim through an agreed condition.',['fae.C1']),
 'No universal fairy inability to lie, no iron rule or universal true-name domination inferred from this tale.')

row('monastic','Monastic vows: Benedictine example','vows_history',[
 claim('monastic.C1','Benedictine communities describe vows of stability, conversion of life and obedience, binding a lifelong communal vocation. These differ from reducing all monastic vows to silence or the same three counsels.',['O01','O02'])],
 ['Time, work and communal means','Probation and profession, not power levels','Accepted commitment','Personal or communal breach','Institutional life path','Order-specific practice','Community and spiritual judgment','No empirical supernatural cap'],
 ['Bonds','Faith','Leadership'],['Trained','Faith or fame'],['Passive','Shared'],
 ['Member and community','Practice and relationship','Daily life and profession','Faith claims differ from measured effect','Particular community','Time, autonomy and ownership practice','Chosen rule of life','Public profession','Lifelong relation; no automatic heir vow','Practice and formation'],
 [vow('Real communal profession',swearer='Member',restriction='Stability, conversion, obedience',object='Way of life',scope='Community and vocation',duration='Lifelong profession',benefit='Spiritual/community aim, not verified stat gain',witness='Community',counterparty='Community/superior',interpretation='Living tradition',enforcement='Institution and conscience',collective_rules='Shared rule, individual profession')],
 [('Vow as a way of life',['monastic.C1'],'Proposal: a fictional order vow can open teachers, housing and shared work without a stat multiplier.'),('Change is an ongoing duty',['monastic.C1'],'Proposal: distinguish a transformation commitment from a ban on a list of objects.')],
 abuse('No verified gag or supernatural loophole claimed. Turning obedience into a game discount would be an invention.',['monastic.C1'],'not_found'),
 'Historical/religious description only. All numerical power effects and magical breach effects would be original fiction.')

row('knightly','Knightly vows and chivalry','vows_history',[
 claim('knightly.C1','Chivalry combined warrior, religious and courtly ideals with differing medieval treatments. A popular neat code may be a modern reconstruction, not a universal historical oath.',['X01','X02'])],
 ['Service, equipment and standing','Recognition and service','Local ceremony or lord acceptance','Dishonor and conflict of duties','Institutional/social path','Different orders and allegiances','Community, lord or court','No historical magic rank'],
 ['Leadership','Bonds','Fame','Contracts and oaths'],['Trained','Faith or fame'],['Shared','Passive'],
 ['Person and allegiance','Promise plus institution','Service or accused breach','Accusation is not verdict','Order/lord-specific','Risk and duty','Jurisdiction','Public deeds matter','Office/estate versus personal vow','Deeds and reputation'],
 [vow('Social service vow',swearer='Knight in selected local order',restriction='Chosen service duties',object='Lord, order or protected group',duration='Local terms',benefit='Standing and resources',consequence='Local social/judicial sanction',witness='Institution',counterparty='Lord or order',interpretation='Selected historical or fictional code',enforcement='Social/judicial',collective_rules='Order standards vary')],
 [('Verdict is a later step',['knightly.C1'],'Proposal: separate a breach allegation, evidence, judgment and actual sanction.'),('Duties have jurisdiction',['knightly.C1'],'Proposal: show which lord or order can enforce a promise rather than global honor points.')],
 abuse('No checked historical gag supplied. Competing lord and protection duties are a possible original dilemma.',['knightly.C1'],'inference'),
 'No invented single medieval code. Magical fealty and inherited vow penalties must be explicitly fictional.')

row('curses','Curses: Sleeping Beauty and The Monkey Paw','myth',[
 claim('curses.C1','The Perrault/Grimm family of Sleeping Beauty versions permits a death curse to be softened to long sleep; awakening details differ. Perrault does not require a kiss.',['CC01']),
 claim('curses.C2','The Monkey Paw money wish is followed by the son death and compensation. A result can satisfy the amount while making its causal route disastrous.',['CC02'])],
 ['Curse authority or finite wishes','Imposition, mitigation and resolution','Trigger condition or spoken wish','Harm and unwanted causal fulfillment','Conditional trap with escape','Mitigation need not cancel curse','Tale-specific authority','No common cap'],
 ['Curses and blessings','Delay','Conditions','Causality','Stasis'],['Granted','Item-bound'],['Reactive','Active'],
 ['Victim and household','Conditional harm or causal fulfillment','Spindle or wish','Tale/version-defined','Person plus surrounding people','Harm to named victims','Mitigation differs from removal','Meaning can be hidden','Curse survives time','No standard growth'],
 [vow('Imposed curse or dangerous wish',swearer='Often victim is not signatory',object='Victim or wished result',benefit='May be absent; wish grants result',consequence='Conditional harm',witness='Cursing actor or object',release='Version-specific mitigation/end',interpretation='Outcome can be met through bad means',enforcement='Imposed effect, not reciprocal vow',collective_rules='Household can suffer spillover')],
 [('Mitigate without erase',['curses.C1'],'Proposal: permit a counter to alter a curse outcome while its trigger still resolves.'),('Route of fulfillment matters',['curses.C2'],'Proposal: let a wish promise a result and expose which causal routes remain possible.')],
 abuse('Destroying or banning spindles does not by itself remove the curse; receiving the requested money need not be a happy win.',['curses.C1','curses.C2'],'inference'),
 'Version-tagged tales, not all curses. No proof every wish must hurt somebody or every sleeping curse ends with a kiss.')

row('genies','Genies and wishes: Aladdin and Fisherman tales','myth',[
 claim('genies.C1','Aladdin has distinct ring and lamp spirits. Lamp custody controls the stronger helper; the weaker ring spirit cannot directly reverse its magic but can transport Aladdin to recover the lamp.',['JJ01']),
 claim('genies.C2','In the Fisherman tale a sealed spirit threatens its rescuer. The fisherman prompts it to demonstrate fitting in the jar, reseals it, then negotiates safer release.',['JJ02'])],
 ['Helper service and artifact custody','Acquire, lose and recover access','Summon through item or break seal','Hostile helper or stolen item','Item/patron relationship','Different spirits have different scope','Tale and helper capacity','Not universal omnipotence'],
 ['Summoning','Sealing','Creation','Debt','Borrowed'],['Item-bound','Granted'],['Active','Ritual'],
 ['Requested object or service','Spirit performs work','Item activation or release','Helper may be hostile','Power differs by spirit','Custody and bargain','Lesser helper cannot undo all','Holder matters','Object carries access','No standard levels'],
 [vow('Release bargain and custody',swearer='Fisherman and spirit',object='Release and safe treatment',benefit='Freedom for spirit; aid for rescuer',counterparty='Spirit',stake='Seal and release control',interpretation='Agreed promise',enforcement='Custody plus bargain',interpretation_trick='Demonstration restores containment before renegotiation')],
 [('Custody controls a service',['genies.C1'],'Proposal: a carrier can grant command access without transferring the helper powers into the bearer.'),('Weaker route still matters',['genies.C1'],'Proposal: a weaker ally can solve access while remaining unable to cancel a stronger effect.')],
 abuse('The fisherman uses a demonstration to regain custody. Aladdin uses the weaker ring spirit for access rather than asking it to undo stronger magic.',['genies.C1','genies.C2']),
 'Arabian/Middle Eastern tale routes included by brief. No generic three-wish limit, malicious genie personality or infinite omnipotence imposed.')

# Distinct additions ranked against the live E8 drafts, rather than an appeal
# to how famous or powerful a franchise is. Every ranked addition is a proposal.
ranked = [
 ('M1','Separate prevention, automatic penalty and later judgment','wheel.M1',
  'E8D has a consequence slot but starts from breach then penalty. A blocked act has no committed breach; a court can impose one later.',
  'Add enforcement.mode and an attempt/breach/verdict split.',
  'Attempt one blocked lie, break one punitive pact, face one alleged social breach. Logs must differ.'),
 ('M2','Give the witness a knowledge boundary','mol.M1',
  'E8D interpretation-by-tags cannot express a clause reading thoughts, memories or sincere belief.',
  'Add truth_basis, observer, evidence_channels and check_time. Use wheel.C2 as the belief contrast.',
  'The same false statement passes a belief oath but fails an objective-fact rule; an undisclosed fact does not reach a limited witness.'),
 ('M3','Give the bargain an office holder','dresden.M1',
  'E8D inheritance is present, but succession of the creditor office differs from inheriting a personal vow.',
  'Add claim_holder_type and office_id; keep debtor, creditor and current holder distinct.',
  'Replace the office holder; the claim stays, without copying the old holder memories into the new one.'),
 ('M4','A real store plus an outside amplifier','mistborn.M2',
  'E8B stored mode and Stat work exist. The new part is distinguishing ordinary banking from externally fueled multiplication.',
  'Add fill_cost, balance, output_rate, converter and external_source to selected stores.',
  'A plain store pays only its balance; a declared second source amplifies output and spends its own fuel.'),
 ('M5','Reservoir size is not rank quality','cradle.M1',
  'E8C currency and steps exist, but a split reservoir should not lower its quality or double its fuel.',
  'Separate capacity, balance, quality, refill and the common body gate.',
  'Split one store into two compatible sources with loss; advance one quality while the other remains unchanged.'),
 ('M6','Validate what a technique part can really modify','poe.M1',
  'E8B composed delivery and E4 tags exist. PoE cautions that shared tags alone do not prove support compatibility.',
  'Add a typed operation contract beside tags; compute resulting cost and failure reasons.',
  'A tag match without a supported operation stays invalid; one valid part changes only its linked methods.'),
 ('M7','Paid costs can feed another rule','spire.M1',
  'The north star already has triggers and combos. The new work is an event order and a record showing that the cost was paid once.',
  'Represent committed costs as events with provenance; distinguish legal in-world loops from duplicate replay.',
  'One exhausted option creates one draw; replaying the same receipt creates none; a new generated option can trigger its own legal chain.'),
 ('M8','Promise an outcome without promising its route','dresden.M2',
  'E8D names a benefit but lacks a clear distinction between result, means and a person expectation.',
  'Add promised_result, allowed_means and fulfillment_record; curses.C2 is a darker contrast.',
  'A patron fulfills promised courage through teaching or confidence. The record shows whether a stat increase was actually promised.'),
 ('M9','Separate payer, supplier and judge','carl.M1',
  'E8D patron/witness pricing and audience already exist. A sponsor can fund a gift that another authority controls.',
  'Add reward_payer, reward_supplier and authorizer to selected grants.',
  'A sponsor funds a desired tool but dungeon rules reject its delivery; relationship and authorization remain separate.'),
 ('M10','Own, know, equip and activate are separate','elden.M1',
  'Existing research already separates knowledge and execution. An inactive owned artifact adds a useful activation state.',
  'Add activation_state and activator to item-source profiles, with explicit persistence.',
  'An owned rune is inspected, equipped and activated through distinct actions; possession alone does not apply its effect.'),
 ('M11','An oath gate can accept growth','stormlight.M1',
  'E8C has release stages and E8D restriction pricing. A personal truth or accepted Ideal is not an interchangeable sacrifice quote.',
  'Allow affirmation vows with acceptance_gate and milestone, no compulsory traded object.',
  'Repeating a truth without the relevant lived change gives no new stage. A different valid truth can qualify where local rules allow.'),
 ('M12','Make a counter match mechanism, not casting medium','dc.M1',
  'E8 separates mechanism and trigger. The added detail is speech, writing and intent as different carriers of one method.',
  'Record expression_medium, required_parts and permitted alternatives on a technique.',
  'Silence blocks voice casting; a source-permitted written version works at its own cost; an unpermitted alternative does not.'),
 ('M13','A grade is a scoped response policy','worm.M1',
  'E8C already allows institutional grades. Worm adds what a grade tells a team to do, and whose evidence it used.',
  'Store grader, purpose, evidence, date and recommended_response separately from real power.',
  'A scouting team and a duel school issue different assessments of the same power without changing its actual damage.'),
 ('M14','A release clause can be found','fae.M1',
  'E8D release and true-name families exist. Their combination makes investigating a secret a lawful contract exit.',
  'Add release_predicate and discovery_state, with clause visibility separate from its secret answer.',
  'The player discovers the required name and fulfills the clause; inventing a wrong name does not release the claim.'),
 ('M15','Keep an impossible vow set impossible when local rules say so','geis.M1',
  'E8D already lists collisions and the same geis tale. The refinement is not silently choosing a priority that saves the hero.',
  'Add conflict_set, simultaneous_breaches and local_priority; allow no priority, negotiated waiver or escape by circumstance.',
  'A trap offers only acts that break a known duty; show the separate costs rather than auto-cancel one promise.')
]

proposals = [
 ('P1','E8','Separate the power from reports about it',
  'Keep ten axes. Add an optional observation record with observer, source, belief/confidence, evidence time and hidden axes. Add expression medium to mechanism details. This supports Worm grading, belief oaths and Zatanna counters without another universal power tier.'),
 ('P2','E8B','Give sources operational records',
  'Extend existing stored/composed/granted modes with source balances, capacity, quality, refill, ownership, donor connection, activation and compatibility rules. These are details of a source, not a universal new resource. Ordinary banking, outside amplification and revocable grants must differ.'),
 ('P3','E8C','Separate progress, access and appraisal',
  'Preserve eight path parts, but let a person hold independent tracks: trained mastery, reservoir quality, body stage, oath acceptance, class identity and institutional grade. An arc can merge tracks or require two achievements, without assuming every series is an XP ladder.'),
 ('P4','E8D','Split the parties and enforcement stages',
  'Keep all existing core/extra slots. Add payer, beneficiary, liable_target and claim_holder; enforcement.mode; truth_basis; evidence_channels; check_time; acceptance_gate; release_predicate; and versioned fulfillment terms. Consequences can harm a partner, duties can attach to an office and some bindings have no reward.'),
 ('P5','E8 to E8D','Keep rules and exploits local, inspectable and saved',
  'Record source continuity/era, known rule version, actual trigger order and carrier policy. A lawful funny exploit stays possible where the world permits it. Save/reload duplication is a different event. A later patch or court ruling cannot be silently substituted for the terms already promised.')
]

by_id={r['id']:r for r in rows}
all_claims={c['id']:c for r in rows for c in r['claims']}
all_mechanics={m['id']:m for r in rows for m in r['mechanics']}
by_source={s['id']:s for s in sources}

def refs(ids):
    result=[]
    for cid in ids:
        for sid in all_claims[cid]['source_ids']:
            if sid not in result: result.append(sid)
    return result

def links(ids):
    return ', '.join(f"[{sid}]({by_source[sid]['url'] if by_source[sid]['url'].startswith('https:') else '../../novels/'+by_source[sid]['url'].split('docs/research/novels/')[1]})" for sid in ids)

rank_records=[]
for rank,(code,name,mid,delta,addition,proof) in enumerate(ranked,1):
    m=all_mechanics[mid]
    cids=m['basis_claim_ids'][:]
    if code=='M2': cids+=['wheel.C2']
    if code=='M8': cids+=['curses.C2']
    rank_records.append(dict(rank=rank,id=code,name=name,mechanic_id=mid,
        basis_claim_ids=cids,source_ids=refs(cids),delta_from_existing=delta,
        proposal=addition,smallest_proof=proof,status='proposal'))

data=dict(schema_version=1,lane='C',survey_date='2026-10-10',state='research_complete',
    scope='28 assigned subjects; mechanics survey, not full canon certification or gameplay implementation.',
    evidence_policy={
      'verified_reference':'A bounded statement supported by material returned this run; consult source access for page versus indexed excerpt.',
      'remembered_unverified':'Prior recollection only. Not evidence for direct adaptation or top-15 recommendation.',
      'inference':'Analytical mapping or derived use, not an assertion that the source uses E8 field names.',
      'proposal':'Original what-we-take idea; not an accepted decision.',
      'not_found':'No checked gag or loophole in this bounded source pass.',
      'null_slots':'Absent or not established by reviewed evidence; never means a universal prohibition.'},
    sources=sources,series=rows,top_15=rank_records,
    integration_proposals=[dict(id=c,target=t,title=n,proposal=x,status='proposal') for c,t,n,x in proposals])
(OUT/'SERIES.json').write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')

report=['# Lane C: Western power-system survey','',
 'Research complete, 2026-10-10. All gameplay uses below are proposals. No runtime files, shared E8 drafts, saves, build or accepted decisions were changed. Claude owns any later fold-in.','',
 'The strongest addition is an enforcement model. A binding can block an act, punish a completed act, or wait for a person or court to judge it. A promise also needs to say who pays, who benefits, who suffers, what the witness knows and who can inherit the claim. The existing slots hold many of these ideas, but do not yet make those distinctions explicit.','',
 'Coverage: 12 books, Marvel and DC, seven games/tabletop systems and seven myth/vow groups. The structured ledger holds all eight path parts, ten axes, family/source/delivery mappings, E8D slots, cited claims, two proposed mechanics and a gag or abuse status for each subject. A path is a useful comparison here, not proof that folklore or every comic has an in-world progression ladder.','',
 '## Evidence and prior work','',
 'This is a reference survey, not 12 new full-book reads. Worm and Mother of Learning reuse prior reviewed private dossiers with chapter claim locators. Public author statements, official game rules and official comics pages anchor the main comparisons. Other claims rely on encyclopedias, fan references or indexed excerpts. SOURCES.md marks access and limits for each one. No remembered claim supports the ranked recommendations.','',
 'Existing overlap checked: E8 already has shards and power axes; E8B has sources, stored/composed delivery and vow gaming; E8C has path shapes and institutional grades; E8D already has conflicting vows, release and the geis example. The north star already names Cradle, Wandering Inn, HWFWM and Mother of Learning skill growth, and Slay the Spire/Hades combinations. The additions below refine that model rather than restating those headings.','',
 'The live rulebook wins over older draft wording: each world defines its rules, carry requires a carrier and only Weibao can accept a proposal. A lack of a sacrifice in one source is not grounds to invent a compulsory price. An outlier remains an outlier.','',
 '## Top 15 mechanics, ranked by added decisions','',
 'Rank means how much a distinction adds to the current drafts: a new state or decision first, then breadth of reuse, then evidence quality. It is an editorial ranking, not a measured score or implementation queue. Each row is a proposal and includes a bounded future acceptance check.','',
 '| Rank/code | Mechanic | What it adds and proposed fields | Future proof | Evidence |',
 '|---|---|---|---|---|']
for r in rank_records:
    report.append(f"| {r['rank']} / {r['id']} | {r['name']} | {r['delta_from_existing']} **Proposal:** {r['proposal']} | {r['smallest_proof']} | {links(r['source_ids'])} |")
report+=['','## Every subject mapped','',
 'Facts in this table are condensed from SERIES.json claims; shapes and proposed uses are inference. A cited source is not certification of every detail of a franchise. See the JSON for fuel, risk, branches, grader, ceiling and the ten axes.','',
 '| ID/source | Path lens | Distinct mechanic and proposed use | Checked limit |',
 '|---|---|---|---|']
for r in rows:
    report.append(f"| {r['id']}: {r['title']} {links(refs(r['basis_claim_ids']))} | {r['path']['shape']}; {r['path']['gate']} | "+' '.join(m['what_we_take'] for m in r['mechanics'])+f" | {r['limits']} |")
report+=['','## Cross-series vows, contracts and costs','',
 'The slots here are analytical mappings. No general vow was invented for a source that has only a resource cost, class condition or faction relationship. Shared rules do not imply that one member breach punishes every member. Unspecified means this pass did not establish a rule.','',
 '| Subject | Binding and trade | Breach, enforcement and interpretation | Collective rule / succession | Evidence |',
 '|---|---|---|---|---|']
for r in rows:
    for v in r['vows']:
        s=v['slots']
        trade=f"{v['kind']}. Restriction: {s['restriction'] or 'not established'}. Benefit: {s['benefit'] or 'not established'}."
        enforcement=f"{v['enforcement']}. Consequence: {s['consequence'] or 'not established'}. Reading: {s['interpretation'] or 'not established'}."
        collective=v['collective_rules']+' Inheritance: '+(s['inheritance'] or 'not established')+'.'
        report.append(f"| {r['title']} | {trade} | {enforcement} | {collective} | {links(refs(r['basis_claim_ids']))} |")
report+=['','## Funny abuse and counterplay','',
 'Checked examples include splitting a core without doubling fuel, external amplification of a banked attribute, a power bargain fulfilled by confidence, truth spoken from a false belief, a palindrome beating reversal, exhaust feeding random creation, class identity restored by a new meaning and a sealed spirit tricked into demonstrating its own containment. The source IDs and claim status are attached to each JSON example. These are different kinds of ingenuity; not all are jokes or deliberate exploits.','',
 'Carl feet-related rewards are supported by a public explainer rather than a newly read book scene. Hades adds the indexed Bad Call joke: asking aid from the god currently attacking you changes dialogue and earns an achievement. PoE and several other rows include explicitly marked structural inferences instead of invented anecdotes. The Guide gives a checked discussion of narrative tactics, with characters disagreeing; monastic vows have no verified gag in this pass. No claim that every source offers a comic loophole.','',
 'One original worked example: a river spirit pays for a vow never to draw a blade on its bank. Under an exact blade rule, an unarmed shove could be legal; under an intent rule, an assault may count. A town judge may need a witness before ruling, while a magical binder may stop the act immediately. If the spirit promised courage, teaching courage could fulfill the bargain; a fivefold strength boost only follows if that was actually promised. Each version is a different local proposal, not a silent change to one contract.','',
 '## Proposals to fold into E8 through E8D','']
for code,target,title,body in proposals:
    report += [f'### {code}: {target}, {title}','',f'**Proposal:** {body}','']
report+=['## Concrete design limits','',
 'A real monastic profession or knightly duty has social and spiritual meaning; this survey does not treat it as empirical evidence of a numerical buff. A fictional vow order could give housing, teachers, duties and belonging, or supernatural power if that world explicitly grants it. The cited Benedictine vows are not the same as a universal vow of silence. '+links(['O01','O02','X01'])+'.','',
 'D&D pacts do not all sell souls, and the cited Warlock class does not define automatic patron revocation. Faith in Elden Ring is not proof that each incantation requires a moral oath. MTG colors express methods and values, not one good-to-evil scale. These distinctions prevent a single sacrifice template from flattening different worlds. '+links(['N01','E02','A01'])+'.','',
 'One source detail remains remembered only: the exact Dresden Soulfire soul depletion/recovery rule. HWFWM exact advancement thresholds remain open; its rank names now have an independent review source. The Guide narrative-tactics row is supported by a bounded author-serial excerpt and records character judgments, not an infallible victory rule. Blocked-page references remain bounded indexed evidence, especially for Kingkiller, Wandering Inn, Carl, HWFWM and several games. Direct adaptations need a selected era and scene/rule check for the exact behavior being built. The survey deliverables are complete; those narrower canon checks are not gameplay acceptance.','',
 '## Delivery and checks','',
 'Files: SERIES.json, REPORT.md, SOURCES.md and CHECKPOINT.md. INPUT_HASHES.json records starting owner inputs; assemble_survey.py reproduces the public paraphrased ledger. VALIDATION.json records coverage and integrity checks. No full prose, personal saves or source-library changes.','',
 'Validation checks the 28 required IDs, each path part and axis, all E8D slot keys, claim/source references, proposal flags and all 15 ranked mechanics. No build, runtime test or browser gameplay check was run because the assignment excludes them. No gameplay has been implemented by this lane.','']
(OUT/'REPORT.md').write_text('\n'.join(report))

src=['# Lane C source ledger','',
 'Checked 2026-10-10. Own-word mechanics only. Claim IDs and sources are in SERIES.json. Public links below identify the actual reference used; private dossier links remain local and do not disclose raw book text.','',
 '## Access and interpretation','',
 '`page_read` means returned page material was inspected. `search_excerpt` means the evidence was returned through the search index; it is not a claim that a blocked page was read. `local_read` means an existing reviewed derived dossier was inspected. `verified_reference` verifies the narrow paraphrase against that reference, not against an entire novel or every continuity. Author Q&A compilations and fan wikis remain their own evidence layers.','',
 'No chapter crawling, login, purchase or source download was used. Public requests used the browser search/fetch tool, serially; repeated chapter requests were not made. The search service controls its own robots checks and request caching. No claim of an independently timed 4 to 8 second delay for its internal search-index operations. Failed page fetches switched to indexed references or another source.','',
 '## References','',
 '| ID | Reference | Kind / access | Supports | Limit |',
 '|---|---|---|---|---|']
for s in sources:
    src.append(f"| {s['id']} | {links([s['id']])}: {s['title']} | {s['kind']} / {s['access']} | {s['supports']} | {s['limit']} |")
src+=['','## Failures and route changes','',
 '| Host or route | Observed result | Follow-through |',
 '|---|---|---|',
 '| Kingkiller and Dresden Fandom | Robots block during search | Kingkiller uses encyclopedia references; Dresden uses author Q&A. Later broad Dresden search returned an indexed Fandom result; that result was not used as evidence or opened. |',
 '| wiki.wanderinginn.com | Direct classes open returned 403 | Kept previously returned index references; no fresh full-page claim. |',
 '| HWFWM Fandom | Direct essences open returned 402; later indexed FAQ also reported robots block | Index excerpts retained with limitations; no login or bypass. |',
 '| Carl and Guide Fandom | Robots block accompanying later targeted search | Earlier indexed data retained. No subsequent page fetches. Tactical discussion is supported by a later author-serial excerpt; guaranteed outcomes remain unclaimed. |',
 '| Official PoE skills URL | Internal fetch error | Switched to index/data references. PoE wiki page then returned 403; stopped page requests there. |',
 '| Hades Fandom, Spire wiki.gg and Elden Ring wiki.gg page opens | Internal fetch errors | Used separately indexed definitions and official Hades/Elden Ring context; no fetch retry variants. |','',
 '## Local reuse and version boundaries','',
 'W01 and L01 are derived private research, checked by reading their systems/power owners and preserving the cited claim IDs. Worm coverage and Mother of Learning coverage were not rerun or expanded. The local library manifest was checked for duplication; no EPUB or Calibre state was changed.','',
 'D&D uses 2024 revised rules. Dark Souls uses game 1 with version-specific notes. Hades uses game 1; PoE uses game 1; Spire uses the original video game. Comics examples retain issue labels; no animated, film or alternate-universe power tiers were merged. Stormlight deadeye behavior is era-specific. Genie tales are not forced into the Disney three-wish rule.','',
 'The accepted rulebook and E8 owners are inputs, not evidence that these franchise proposals are accepted. All ten axes and eight path parts are the project comparison lens. Null vow slots are deliberately absent or unknown.','']
(OUT/'SOURCES.md').write_text('\n'.join(src))

if __name__=='__main__':
    print(f'Wrote {len(rows)} subjects, {len(all_claims)} claims, {len(all_mechanics)} proposals, {len(sources)} sources and {len(rank_records)} ranked additions.')
