# Five novel leads and power-family proposals

2026-10-10. Research report, with source gaps. No gameplay changes.

**F1. All five title leads and authors are resolved. F2. The first mirror attempt
found no usable source. F3. The addendum yielded ten official free Fanqie chapters
from each of B2 and B3, now read and reviewed.** The initial book sections below preserve the
metadata-only pass. The addendum section records actual chapter evidence and
coverage separately. B1/B4/B5 remain source-limited. No full-book read is claimed.

## Titles and coverage

| Code | Chinese title | Author | Platform evidence | Chapter coverage |
|---|---|---|---|---|
| B1 | 巫师你好，我是伪人 | 软糖鸢尾蓝 | Yuewen catalogue and Qidian promotion; exact original book ID unresolved | Initial pass: 0; see addendum coverage below |
| B2 | 一年抽取一词条，模拟的也可以？ | 六大六子 | Official Fanqie book page | 10 downloaded, 10 read; chapter 11 locked |
| B3 | 咒回：特级的我去死灭打宿傩了！ | 皮卡堂布拉特 | Official Fanqie book page | 10 downloaded, 10 read; chapter 11 locked |
| B4 | 全人类的继承者 | 万里万雪 | Yuewen catalogue and Qidian book listing | Initial pass: 0; see addendum coverage below |
| B5 | 废土边境检查官 | 斤斤斤 | Indexed Qidian listing; book 1044920002 | 0 downloaded, 0 read; official access limits retained |

Private title evidence, request receipts, tooling, notes and coverage are in
`docs/research/novels/ttks-novels-2026-10-10/`, outside git.

## Initial acquisition result

Installed `lightnovel-crawler` 4.14.0 with pipx. Its installed source adapters
were inspected. The default network layer documents refusal escalation and
address rotation, so it was not run. A private wrapper supplies plain urllib
traffic to parser methods, with one process, serial requests, random 4 to 8
second gaps, robots checks, a disk cache and a 300-chapter host cap. Chapter
extraction and EPUB/TXT book export remain unverified because acquisition
never reached a chapter. No accounts, purchases, proxies, browser control or
challenge-solving tools were used.

| Route | Evidence in this run | Result |
|---|---|---|
| ttks.tw and ttkan.co | Assignment marks both closed | No direct requests |
| novel543 | Matching B2 and B3 mirror listings found by search; robots.txt returned 200 and disallows `/` for generic clients | Novel and chapter pages not fetched |
| 69shuba | robots.txt returned HTTP 403 with challenge content | Stopped host before site search |
| ixdzs | robots request failed certificate verification with an expired certificate | Stopped route; TLS checks retained |
| shuhaige | robots request ended with a remote disconnect | Stopped route |
| trxs | Homepage fetched; one title search returned no matching content; cached HTML then revealed passive Cloudflare challenge scripts | Closed host; no chapter request |
| uukanshu, piaotian, xbanxia and 27k | Search pass did not establish an exact title/author/book URL match | No direct crawl; existence is unknown |

The first detector missed trxs's passive challenge script, so one search POST
followed the homepage before it was recognized. The detector now includes
`challenge-platform` and `__CF$cv$params`, and the host is closed in the saved
state. This is a recorded client defect, not evidence of a clean first-challenge
stop on that host. No script was executed and no challenge was solved.

Supported-source search absence does not prove that a book is absent from a
site. Search results for other books, unsafe routes and unsupported mirrors
were not substituted for the assigned source. Cached search excerpts from
closed hosts were not treated as read chapters.

## B1: hidden identity and ways to detect it

The indexed description places Logan in a magical London in 2010. He becomes
a mimic that can replace people, while wizards, ordinary society and other
mimics threaten him. The setting names seven spiritual channels and seven
routes of advancement. Its stated survival tests use signs in speech, gaze
and doubles. This makes it a strong lead for imperfect detection and powers
whose social use can expose their holder. The channels' names and mechanics
have not been read. [Catalogue evidence](https://www.rongshuxia.com/bqx/qbjdclhvwzur).

| Family | Split supported by description | What differs | Missing chapter evidence |
|---|---|---|---|
| Observation | Ordinary social signs versus concealed nonhuman identity | Visible behavior is evidence about identity, not direct access to it | Accuracy, false positives, disguises and expert counters |
| Growth paths | Seven channels and seven advancement routes are named as setting structure | Several routes exist | Their names, facets, costs, overlap and transfer rules |
| Copying | Mimicry and replacement are part of the premise | Looking like someone is not enough to establish all their faculties | Body, memory, soul, method and authority boundaries |
| Foresight, shards, immortality | No qualified taxonomy found | Unknown | All types, limits and exceptions remain unread |

E7 fit: a clue can support a belief without confirming an identity. E8 fit:
separate detecting a disguise, identifying a species and learning its method.
Neither mapping establishes novel canon beyond the description.

## B2: annual traits and growth inside a simulation

Chen Yi receives one trait draw per year, but lacks the aptitude needed to
train. At eighteen he draws a simulator. Years within a simulation also yield
traits, and the description says the traits and martial realm return when it
ends. Surviving longer inside therefore changes growth outside. This is a
lead for several kinds of time-based reward and for distinguishing a simulated
future from a live timeline. Detailed slot rules, forecasts and later powers
are unread. [Official book page](https://fanqienovel.com/page/7583949514948496409).

| Family | Split supported by description | Axis | Missing chapter evidence |
|---|---|---|---|
| Trait rewards | Low-grade traits versus very rare mythic traits | Draw quality and growth stage | Full grades, odds rules, pity rules and active capacity |
| Growth | Live years versus years inside the simulator | Which clock earns a reward | Start/end conditions, outside time spent and repeat limits |
| Inheritance | Traits and martial realm gained in a simulated life | What returns to the real character | Complete return list, choice rules, losses and exceptions |
| Aptitude | Possessing an aptitude versus lacking it | Whether training is possible | Can copied knowledge replace the body requirement? |
| Foresight | Simulator is advertised; no certainty model is established | Simulation versus actual future | Which events stay true after intervention? |
| Shards and immortality | No qualified taxonomy found | Unknown | Unread |

E8 fit: a power can change how another power grows. North star fit: retention,
equipped execution and body gates should be distinct. A trait is not proven to
be a shard, and a simulated death is not proven to resurrect the live body.

## B3: repeated attempts against a fixed threat

Jie Jian enters a Jujutsu Kaisen fan-fiction setting after an online challenge
and receives special-grade strength. The mirror's indexed description advertises
a death reset before defeating Sukuna, with rewards based on performance.
That supports a loop of attempts against a named threat rather than a generic
level-scaled enemy. It does not establish what an attempt preserves, whether
others remember, what ends the protection, or how later worlds work.
[Description lead](https://www.novel543.com/0517690568/),
[official title and author](https://fanqienovel.com/page/7628071472921054233).

| Family or world rule | Supported at description level | Axis | Missing chapter evidence |
|---|---|---|---|
| Revival | Death returns the lead to the starting point while the stated goal is unfinished | Trigger, anchor and goal condition | True-death exceptions, reset extent and soul continuity |
| Growth | Performance changes the reward after an attempt | Reward cause | Which actions count, duplicate rewards, retention |
| Threat | A named opponent defines the initial goal | Fixed task rather than implied scaling | Local threat rules, escape, alternative routes |
| Observation | Past attempts could yield knowledge, but retention is not confirmed here | Memory versus prophecy | What is remembered and which changes invalidate it |
| Law facets and shards | No qualified taxonomy found | Unknown | Fan-fiction-specific rules cannot be filled from franchise memory |

The mechanically distinct world lead is a goal-gated retry loop. Its barriers,
participant rules, normal work and later world transitions remain unverified.
No claim that every resident has the same reset is supported.

## B4: access to the remains of humanity

Yu Le, a human from the modern era, enters a world where humanity has ended
and others prize being close to human. The description links that closeness
to use of old human AI, other legacies and stronger psychic power. The useful
idea is eligibility to use a dead civilization's assets. It does not yet show
that he inherits all human skills or memories, chooses a dead donor, or owes
an ancestor a debt. [Yuewen catalogue](https://www.readnovel.com/bookquery/zfycosskosnj),
[Qidian listing](https://book.qidian.com/booklist/detail/642322/).

| Inheritance question | Supported at description level | Unknown |
|---|---|---|
| From whom? | The past human civilization | Named donors, owners and factions |
| What? | AI and other human legacies; psychic capability is also linked to human closeness | Specific assets and whether each grant is access, possession or learning |
| Chosen how? | Human closeness is a stated gate | Appearance, ancestry, biology, recognition and credentials may differ; their exact checks are unread |
| Limits? | The gate varies with human closeness | Per-device thresholds, local exceptions, rival claims and compatibility |
| Cost? | No definite price established in the description | Maintenance, obligations and hidden costs must not be invented as canon |

E8 fit: inheritance should state whether it gives a source, knowledge,
permission or ownership. E7 fit: an observer's belief about ancestry can differ
from a machine's actual access check.

## Design proposals for E7 and E8

**All P rows are original proposals.** They are not book findings, selected
designs or implemented powers. Some refine existing E8 examples rather than
adding a new power. Metadata leads explain why a distinction is useful; they
do not establish its detailed rules.

| Code | Proposal and axes | Two cases that play differently | Owner fit |
|---|---|---|---|
| P01 | Split danger sensing by object: bodily harm, loss of goods, or harm to a named person | A bridge collapse threatens the body; a quiet theft threatens only the purse | E7 observation; E8 object/trigger |
| P02 | Split identity reads into shape, life signature and continuity of memory | A mimic passes the shape test; a real friend with lost memory fails the continuity test | E7 K4/K5; B1 description lead |
| P03 | Make signs evidence, with source and confidence, rather than a truth tag | Odd speech raises suspicion; a second independent test confirms or rejects it | E7 Notebook; B1 lead |
| P04 | Separate intent, ability and committed action | Seeing a wish to steal does not show that the thief can open the lock or will choose to try | E8 intent observation |
| P05 | A warning may reveal danger without its cause, time or safe response | The same alarm comes from poison or an ambush; testing food can resolve one | E8 certainty/scope; E7 study |
| P06 | Define sampled futures, likely futures and fixed futures as separate contracts | A likely route changes after hiring a guard; a pinned event needs an explicit power to change | E8 foresight; E1 contracts |
| P07 | Bind a forecast to an event and its assumptions, not just the next RNG draw | Walking away leaves the forecast tied to that encounter; a new stranger is not silently assigned its result | E8 stream-access proposal; E7 knowledge provenance |
| P08 | Distinguish warning before harm, seeing one's death and learning from a failed attempt | Warning permits one dodge; death sight may omit earlier wounds; an attempt record covers only what happened | E8 trigger/scope; B2/B3 leads |
| P09 | Give simulation return separate channels: memory, skill, aptitude, source and possessions | Knowing a spell survives; the fuel source may still be absent. A clean pack may retain both | North star cheats; B2 lead |
| P10 | Give observers and readers different gates when both detect the same disguise | A scent reader needs proximity; an identity ward needs its local authority | E7 senses; E8 mechanism/limit |
| P11 | A law facet grants named operations, not a percent of generic power | Heat warms a forge; spread carries flame across oil; hearth keeps a home warm without setting it alight | E8 facets; north star concept tiers |
| P12 | Shard sets may be repeated strength, distinct facets or stages of a procedure | Two heat shards strengthen heating; heat plus spread enables a different action | E8 shards; E4 rule layers |
| P13 | A copied method, stolen source and inherited permission travel separately | Copying the manual does not supply the artifact; holding the artifact does not make its ward accept you | E8 copying/inheritance; B4 lead |
| P14 | Separate agelessness, healing, delayed revival and rewind by what survives | No aging does not heal a wound; healing keeps current history; rewind may undo it | E8 immortality; E6 history |
| P15 | Revival declares body, memory, soul, gear, debts and world history retention | A shrine restores a body in the changed world; a rewind restores an earlier world state | E8 persistence; B3 lead |
| P16 | Separate inheriting an asset from becoming eligible to operate it | A scavenger owns an engine but cannot start it; a qualified stranger can operate it without owning it | E8 inheritance; B4 lead |
| P17 | Fragment origin, will and transfer are independent settings | An inert broken tool has no agenda; a patron shard can remember a pact and reject a sale | E8 shards; north star cheat fusion |
| P18 | Keep cost and defeat condition optional, explicit fields | An ageless body may have no use cost; an absolute local immunity need not gain an invented weakness | E8 price/limit; north star clean cheats |

**F4. E8 was read after it appeared during this run.** It is still a proposal.
Three details need care before using it as an authoring contract:

| Code | Live proposal issue | Proposed refinement |
|---|---|---|
| R1 | Future sight as future RNG draws alone does not state what happens when choices, eligibility or draw order change | P06/P07: declare the event, assumptions, determinism and invalidation rule |
| R2 | Shards are described as having will; not every broken power needs an agenda | P12/P17: make origin, facet and will separate fields |
| R3 | The immortality catalogue asks every kind for a price and kill condition; the north star also permits clean cheats | P18: record `none` or `unknown` honestly; add a cost only for a chosen world rule |

These are document-level design observations, not a runtime audit. No shared
owner was edited, and no proposal was promoted to an accepted decision.

## Needs WebToEpub in Weibao's browser

B1, B4 and B5 need local text. B2 and B3 have ten cached official free
chapters each; their later web chapters are locked. The exact index links below
come from the user-supplied SOURCE_REQUESTS.md S1–S5. They replace the earlier
guessed URL shapes. The links were not requested because TTKS remains closed.

| Code | Supplied TTKS index URL | Remaining source need |
|---|---|---|
| B1 | https://ttks.tw/novel/chapters/wushinihaowoshiweiren/index.html | All chapters |
| B2 | https://ttks.tw/novel/chapters/yinianchouquyicitiaomonideyekeyi/index.html | Chapter 11 onward; reuse cached 1–10 |
| B3 | https://ttks.tw/novel/chapters/zhouhuitejidewoqusimiedasunuole/index.html | Chapter 11 onward; reuse cached 1–10 |
| B4 | https://ttks.tw/novel/chapters/quanrenleidejichengzhe/index.html | All chapters |
| B5 | https://ttks.tw/novel/chapters/feitubianjingjianchaguan/index.html | All chapters |

Weibao will fetch EPUBs himself and put them in `docs/research/novels/inbox/`.
Agents do not operate his browser or pass bot checks. No new permission to use
a login, purchase, paid/locked reader or app API is implied.

When a local edition is available, hash it, record its actual chapter/member
range, then read the opening and all power introductions and contrasts within
that range. B3 chapter numbers restart in indexed catalogues, so preserve order,
title and member path rather than relying on chapter number alone. Per-book
private NOTES.md files preserve the current leads and exact unanswered lens.

## Checks and remaining gate

Verified tooling installation, request and stop receipts, robots denial,
private-file ignore status, and the report's separation of metadata, unread
chapters and original proposals. No novel prose was copied into this report.
No source edits, build, save access or commits were performed.

The remaining gate is a readable local edition or an exact free supported
mirror that permits this client. That was the initial-pass state. The addendum below supersedes it: ten official
free chapters of each book were acquired and read. Whole-lens
and whole-book coverage must still be bounded by actual receipts. The acquisition attempt and proposal report are complete within the
assignment's skip route; the deep read is not complete.


## Addendum: official free routes and distinct 69shu domains

Status: free-range acquisition and reading complete; deeper source coverage
remains unavailable. Shared project code and design owners
remain untouched. E8B vow pricing and E8C paths were read before this pass.

| Route | Actual result | Action |
|---|---|---|
| Fanqie | Robots allows all; B2/B3 catalogues and normal free `/reader/` pages return article text | Read only chapters whose catalogue and reader both show free/unlocked flags |
| Qidian www/read | Robots requests return HTTP 202 empty HTML with `probe.js` | Stop these challenge routes; no scripts or reader pages requested |
| Qidian book | Robots forbids ChatGPT-User and GPTBot | Do not use a generic identity to avoid the exclusion; B1/B4 stay unavailable |
| 69shuba.cx | Robots route redirects to already-closed www.69shuba.com | Stop at redirect without requesting closed destination |
| 69shu.me | Robots request fails DNS | Stop domain |
| www.69shu.com | Robots route redirects to already-closed www.69shuba.com | Stop at redirect |
| www.69xinshu.com | Robots request fails DNS | Stop domain |
| www.69shu.pro | Robots allows the search route; first title search redirects to ww17.69shu.pro and connection resets | Stop route; no matching book obtained |
| www.69shuba.pro | Robots request fails TLS trust check | Stop domain; retain certificate verification |

These six alternate domains come from the installed crawler adapters, not a
claim that all are current official mirrors. Each distinct robots URL was
attempted once. ttks.tw, ttkan.co and challenged www.69shuba.com were not retried.

### Local font decoding

The normal free Fanqie reader serves text through a SourceHanSansSC subset font.
The referenced font was fetched once through the same wrapper. A static mapping
was extracted as data from a public code file, without executing its downloader.
Twelve sample glyphs were rendered locally and compared with their decoded
characters; all matched. Both opening chapters have no unmapped private-use
characters. Method, source, font hash and review image are in private TOOLING.md
and B2/sources/. No app API, device spoofing or paid-content route was used.
[Mapping source](https://github.com/techoc/fanqie-novel-api/blob/master/conver.go).

The old detector falsely treated Fanqie's bundled CAPTCHA SDK URL as an active
challenge. Inspection of the cached correct-title page and its full catalogue
showed normal content. The false closure was removed without refetching that
page. Active challenges still stop the host. This correction does not reopen
any genuine challenge route.

### Chapter findings established so far

These are narrow free-range claims, superseding the earlier metadata gaps only
where stated. System promises remain distinct from witnessed results.

| Code | Chapter anchor | Claim and distinction | Evidence type |
|---|---|---|---|
| C2-01 | B2 chapter 1 | Five trait grades have distinct draw odds; realm growth is said to raise good-drop odds and equipped capacity. The initial live loadout has three slots | Interface and narration |
| C2-02 | B2 chapter 1 | Reduced pain leaves the injury in place; hunger tolerance and shoulder strength are separate small functions | Narration plus a witnessed strike |
| C2-03 | B2 chapter 1 | The simulator occupies an equipped slot. Removing it ends the simulation; later runs need a task or cooldown, while the first is exempt | System rule statement |
| C2-04 | B2 chapter 1 | The return list is traits, memory, realm, methods and skills. Possessions are not listed | System promise; later returns still need review |
| C3-01 | B3 chapter 1 | The system offers unlimited death returns before the goal is completed, retaining skills, experience and memory; performance affects extra rewards | System statement |
| C3-02 | B3 chapters 2–3 | Repeated fall deaths grant small energy/durability rewards. Eventually the tougher body survives water impact | Witnessed results; no universal reward ceiling established |
| C3-03 | B3 chapter 2 | The barrier chooses among nine entry points, including airborne ones. The system says it cannot rewrite this barrier rule | Narration and system limit |
| C3-04 | B3 chapter 3 | Extreme fear and will to survive permit energy reinforcement; it fades after emotional relief | Witnessed outcome and narrator explanation |

[B2 official opening](https://fanqienovel.com/reader/7583949571730965017),
[B3 official opening](https://fanqienovel.com/reader/7628129551142355518).
Later claims will retain exact item IDs, title, volume, ordinal, line anchors
and hashes in the private notes. Downloads alone are not reviewed coverage.

The strongest design distinction already supported is **no terminal death
versus no pain**, and **owning a growth cheat versus owning the world's rules**.
B3's system lets the lead return and grow while still declining to alter the
barrier. B2 separates equipped execution from the larger acquired collection.
All earlier P proposals remain proposals; these claims do not select a design.


### Final official-free coverage

| Book | Catalogue entries observed | Downloaded/read/reviewed range | Stop |
|---|---:|---|---|
| B1 | No permitted catalogue reached | None | Qidian challenge/agent robots limits |
| B2 | 665 | Chapters 1–10, all ten read; claims checked against source | Catalogue chapter 11 has `isChapterLock: true` |
| B3 | 429 | Chapters 1–10, all ten read; claims checked against source | Catalogue chapter 11 has `isChapterLock: true` |
| B4 | No permitted catalogue reached | None | Qidian challenge/agent robots limits |

Both lock entries have `needPay: 0`. This shows a **locked web-reader boundary**,
not proof of a price or VIP classification. Neither chapter 11 was requested.
The shared Fanqie total is 20 chapters, below the 300 cap. No background
downloader is running. Full-book coverage has not been achieved.

One GPT-6 Luna medium leaf read the chapters in bounded ranges. Its first-five
B3 sample was checked before the rest was assigned. The coordinator checked
consequential passages and caught incorrect chapter anchors and evidence types
in the next B3 report; those were sent back for focused repair. Final notes
retain the checked hashes, line anchors, source types and unresolved claims.

### B2: actual power variants and inheritance

| Family | Variants actually present | Axes and subtle difference | Anchor |
|---|---|---|---|
| Body and comfort | Shoulder strength, hunger tolerance, less felt pain, swimming | Pain reduction leaves injury; swimming changes escape options rather than damage | Chapters 1–2 |
| Luck and growth | Guaranteed rare-or-better draw at certain old ages; effort gives some progress; low aptitude enables cultivation | Better draw odds, steady growth and permission to start training are distinct functions | Chapters 4–6 |
| Burst damage | A basic unarmed hit can gain up to tenfold destructive force; martial techniques do not qualify | Covers recoil bone injury but loses a hair per use; that is not general invulnerability | Chapter 6; use in chapter 8 |
| Collection and execution | Many acquired traits, few equipped effects | Realm growth raises slot count and draw odds; the simulator still consumes an active slot | Chapters 1, 2, 7 |
| Repeated lives | Simulated body ages and dies; owner receives progress | Owner gains detailed events without the simulated person's pain or grief | Chapter 6 |
| Reward quality | A premium draw guarantees a positive effect, not a rare or well-matched one | A common positive trait can still fail the owner's present goal | Chapters 7, 9 |

The first simulation's return is witnessed through the system award and the
owner's changed body/panel. This upgrades C2-04 from an untested opening promise
to a demonstrated partial return: traits, memories, realm and a learned method.
It does not prove transfer of goods, emotions, other people or the simulator
to a new owner. The system lists 62 years of memories, while the next narration
calls the experience 63 years; that small count mismatch stays unresolved.
[Return chapter](https://fanqienovel.com/reader/7583950228093420057).

There is no explicit future-sight power, law-facet taxonomy or shard system in
these ten chapters. Simulation supplies conditional foreknowledge and keeps
progress; it is not demonstrated as a fixed prophecy or revival of the live
owner. The second run's different choices change its course.

### B3: vows, domains, techniques and world rules

| Family or rule | What the author actually supplies | Evidence state and limit | Anchor |
|---|---|---|---|
| Binding vow | A spoken cue gives one minute of control of another body; the lead describes its planned use for a new incarnation | Character's account of a prior/source-story pact, not a witnessed new bargain | Chapter 7 |
| Vow gaming | The lead calls the pact a trap | Full terms, harm clauses, exchange price and loophole resolution are not supplied here | Chapter 7 |
| Joke vows | No silly abstinence-for-power bargain appears | Comic dialogue and death rewards are not proof of joke-based vow pricing | Chapters 1–10 |
| Domains | Narration describes user amplification and enemy suppression; a rival confirms he lacks one | No domain cast, clash or counter is exercised in this free range | Chapter 8 |
| One-use technique | Narration says the rival's technique can be used once in a lifetime, blocking practice toward a linked domain | A path gate distinct from ordinary strength; exact technique effect is not shown | Chapter 8 |
| Technique acquisition | System promises probability-based similar-technique rewards after defeating technique users, without a stated count cap | Stated personal cheat, not a proven world-wide copying rule or witnessed drop | Chapter 5 |
| Rule edits | Spend 100 game points; assistant checks conflict with prior rules; accepted rule is broadcast | Acceptance and later barrier crossing are witnessed. This is rule-edit authority, not a personal vow | Chapters 7, 9–10 |
| Information and mystery | Remembered franchise history, world-assistant queries, visible clues and lived attempts | An apparent future is an expectation; intervention can change what other people choose | Chapters 4–10 |
| Incarnation | Soul stored in a cursed object then embodied in a host; narrator says the old sorcerer can use host memories to drive | A different return method from the lead's death reset; not evidence of a generic consent or identity rule | Chapters 7, 10 |

[Vow account](https://fanqienovel.com/reader/7628130655137694270),
[domain/path explanation](https://fanqienovel.com/reader/7628130881189724734),
[rule enactment](https://fanqienovel.com/reader/7628131023552791102),
[barrier crossing and host memory](https://fanqienovel.com/reader/7628131183817130558).

The author presents a domainless fighter's confidence beside a broad narrator
claim that domains usually decide fights. That does not establish a guaranteed
win or loss. The narration also states a 19-day score-change penalty; having
already scored is not explained as immunity from its future deadline.
Those limits remain source questions rather than being filled from JJK memory.

Changing travel rules early also changes the value of prior plot knowledge:
targets may leave before the expected fight. The lead notices this possible
after-effect, then the pair actually cross the barrier. A remembered plot is
therefore useful information with assumptions, not an omniscient lookup.

### Additional proposals for E8B and E8C

All six are original proposals grounded in the distinctions above, not accepted
changes or an implementation request.

| Code | Proposal | Observable distinction | Owner |
|---|---|---|---|
| P19 | Record vow terms, trigger, bound person and benefit separately | A one-minute control grant is not a permanent body transfer; each needs its own authority | E8B vows, E8 persistence |
| P20 | Separate personal vow pricing from authority to edit a shared rule | One grants a holder strength; the other changes access for everyone after a stated acceptance check | E8B contracts, E4 layers |
| P21 | Treat a single-use power's practice gate separately from its combat output | Someone can be strong in the shared toolkit yet unable to rehearse a domain tied to their gift | E8C paths |
| P22 | Distinguish temporary emotion-driven execution from learned stable control | A frightened learner can reinforce once; mastered control works without recreating that crisis | E8C growth, E3 moods |
| P23 | Allow memory transfer to choose event facts, bodily feeling and emotional state independently | A returned technique memory can be vivid without importing decades of grief | E8 inheritance, E7 knowledge |
| P24 | Price vows by the selected world's rule, and label invented joke pricing | Literal, absurd or patron pricing can honor a cheap taco vow; these chapters do not prove that rule for this fan-fiction world | E8B Gaming vows and rules |

### Remaining handoff and limits

The TTKS handoff list above remains the full-edition handoff for all five books.
B2/B3 now have ten locally cached free chapters each, so reuse those rather than
download them again. Their remaining chapters are locked in the observed web
catalogues. B1/B4 have metadata only. Further chapter reading needs an accessible
permitted free source or user-supplied local text. No browser, login, paid chapter
or app-API route is authorized by this report.

The addendum's allowed routes were tried, all available unlocked official
chapters reached were read, and the expanded lens was answered within that
range. Deeper vow bargains, joke vows, domain fights, later power families and
B4 inheritance mechanics remain unavailable, not absent from the books.


## Addendum 2: B5 and inbox editions

### B5 identity and official route

**F5. B5 resolves to 废土边境检查官 by 斤斤斤, Qidian book 1044920002.**
Indexed Qidian chapter headers and a Qidian book listing agree on the title
and author. The precise edition behind the supplied closed TTKS index remains
unverified until local text arrives. The similarly named Fanqie book
废土：边境检查官 by 猫捉老虎 is a different work and was not substituted.
[Official listing evidence](https://book.qidian.com/booklist/detail/532405/),
[official title/author/book-ID evidence](https://www.qidian.com/chapter/1044920002/858388697/).

Qidian official free-reader access was checked against the saved route evidence:
book.qidian.com robots excludes OpenAI agents; www.qidian.com and read.qidian.com
remain closed after the earlier empty HTTP 202 probe pages. Those same limits
apply to B5. No fresh request to a closed host, VIP chapter or TTKS was made.
Indexed chapter previews qualify identity only and count as zero chapter reads.

### Premise and taxonomy leads, description only

Cheng Ye works at a wasteland city's border, inspecting arrivals for infection.
The book description names varied infected life and a civilization collector:
cooperative subjects can yield copied information, goods, skills, attributes,
abilities or facilities. Failed searches can still earn points toward upgrades
that also need materials. Its hook combines inspection, unusual creature rules
and improvement of a shelter. This is a description-level lead; costs, exact
copy results, ownership and execution gates have not been read.
[Qidian description](https://book.qidian.com/booklist/detail/532405/).

| Family | Split advertised by the description | Axes to inspect in the book |
|---|---|---|
| Observation and copying | Information versus skills, stats, goods and facilities | Learning a fact, gaining a method and making a usable copy may differ |
| Acquisition | Subject cooperation versus failed searches earning points | Threshold, what failure means, point supply and retry limits |
| Revival | Dead revived by tentacles and sustained by obsession | What survives, how obsession sustains it, what ends it and whose price applies |
| Spread and attack | Infection spread versus biological decomposition rays | Delivery, range, target and counter |
| Reactive growth | A creature grows stronger by making others laugh | Trigger, audience, persistence and ways to interrupt it |
| Foresight, law facets, shards | No chapter-backed taxonomy available | All remain unknown |

No row is verified chapter canon. Neither a collector's description nor a word
like “cooperation” establishes consent, ownership, effortless cloning or a
universal copying rule. The stated failed-search reward also needs its actual
limits before it can be treated as an infinite resource loop.

### B5-linked original proposals

| Code | Proposal | Different play cases | Owner fit |
|---|---|---|---|
| P25 | Split appraisal, method copying and source copying | You can identify a ward, learn its method, or obtain its power source; each result changes a different next step | E7 knowledge; E8 copying |
| P26 | Give failed research a declared result channel | A failed copy can yield practice or a clue without granting the target power; repeated failures follow the chosen source rule | E7 study; E8 growth |
| P27 | Let sustaining causes distinguish revival variants | Obsession, a fixed anchor and an intact backup keep different things alive; learning the sustaining cause changes preparation | E8 immortality |
| P28 | Observation can affect the thing observed through an explicit trigger | A gaze-triggered creature differs from a laughter-triggered one; inspecting it can supply evidence while also feeding its power | E7 consequences; E8 trigger |

These are proposals prompted by metadata, not decisions or mechanics proven
by B5. The existing chapter-backed B2/B3 findings stay distinct.

### Inbox intake

The inbox was empty at intake. No EPUB was hashed, moved or read, and no
watcher or scheduled task was started. The existing twenty decoded official
free chapters remain private and keep their read/reviewed receipts.

When an EPUB is present during this lane's work: inspect its title, author and
source metadata; hash its bytes; record the source and destination; move a
confidently matched edition into the matching B1–B5 `sources/` directory.
Then record the OPF, spine, member paths and actual chapter coverage, and read
with the original lens plus the B3 vow/domain lens. An ambiguous or unfinished
file stays in the inbox. Compare B2/B3 overlap with the cached free text instead
of silently counting it twice. No complete-book claim follows from an EPUB
filename, a displayed chapter total or a successful move.

The remaining source gate is the inbox editions listed in S1–S5. B5 identity,
source limits, metadata leads and proposal mappings are complete for this pass;
its chapter research is still pending.

## Addendum 3: full-text deep dives, 2026-10-10

Weibao asked for the browser route on ttks and full reads. All five books were
fetched in his Chrome by an in-page script (same-origin fetch of each chapter,
one at a time, 5 s apart, robots.txt allows `/`), saved as JSON, hashed and
read in full: B1 by three Sonnet readers, B2–B5 by detached Codex readers
(19 runs). No bot check was met. Earlier "closed host" limits are superseded
for this lane by his request.

| Code | Chapters read in full | Deep dive (private) |
|---|---|---|
| B1 | 1–110 (111 members) | `docs/research/novels/ttks-novels-2026-10-10/B1/DEEP_DIVE_2026-10-10.md` |
| B2 | 11–665 (1–10 earlier, Fanqie) | `.../B2/DEEP_DIVE_2026-10-10.md` |
| B3 | 11–429 (1–10 earlier, Fanqie) | `.../B3/DEEP_DIVE_2026-10-10.md` |
| B4 | 1–206 | `.../B4/DEEP_DIVE_2026-10-10.md` |
| B5 | 1–668 members | `.../B5/DEEP_DIVE_2026-10-10.md` |

Headline findings (paraphrase; full locators in the private files):

- **F5. B1** runs two power tracks: seven veins, each a route with three innate
  domains and two schools, specialised three ways and deepened into a domain at
  senior rank; and mimic powers held in twelve themed chalices with upstream
  ownership, clashes and fusion. Its death loop keeps memory and soul gains,
  not items, and costs sanity. About a dozen observation variants with
  distinct limits.
- **F6. B2** is a complete simulator-prestige loop: a yearly trait draw with
  realm-scaled odds and slots, a settlement whitelist (memory, realm, traits,
  arts; never items, feelings or relationships), rising cooldowns with bypass
  quests, and forecasts that decay as the real world diverges.
- **F7. B3** is a multi-world challenge board: projected attempts, an archive
  of the best result, irreversible submission that makes a world real, free
  later visits without rewind, and per-challenge contracts (lives, loadout,
  win condition).
- **F8. B4** separates use, ownership, knowledge and command of a dead
  civilisation's legacies; purity and golden ancestry are different axes; each
  machine has its own purpose and ethics. This confirms P13 and P16.
- **F9. B5** makes inspection a craft: many detection channels with named
  blind spots, consent-gated copying through a cooperation meter, copies that
  lose a grade without their substrate, shard sets (3 of 6 blessings for a
  seed), and infection sources as tiered gifts with lifespan debts.

Cross-book pattern worth a rule (P29 below): every book makes a copy
weaker than or different from its original — B3's "related redesign", B4's
copied tech at a tenth of the power, B5's downgrade without substrate.

| Code | Proposal |
|---|---|
| P29 | A copy declares what it lacks (substrate, materials, owner rights) and degrades accordingly; never a perfect duplicate by default |
| P30 | Prestige runs keep a declared whitelist (memory, realm, traits, arts) and drop matter, feelings and relationships (B2) |
| P31 | Archive-and-submit: best run banked, submission makes a world canon and visitable without rewind (B3) |
| P32 | Each detection channel names its blind spot and false-positive source (B1, B5) |

All P rows remain proposals. No runtime, build, save or commit was touched.
