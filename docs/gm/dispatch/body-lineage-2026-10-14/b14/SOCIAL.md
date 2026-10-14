# B14 social body play: G64

2026-10-14. Original implementable proposals, docs only. Extends SS1-SS7;
SS8-SS9 are proposed additions for root reconciliation. [REPORT](REPORT.md)
owns evidence and ranked recommendations. [EVENT_SHAPES](EVENT_SHAPES.md)
owns admission, seed, expiry and transaction rules. No build is selected.

## State owners and joins

Owner shorthand below is an explicit reference, not a new subsystem:

| Owner | Existing authority or proposed contract | B14 use |
|---|---|---|
| B2 | [SPEC §G24-B2.2-3](../b2/SPEC.md#g24-b22-persisted-shape) | Physical/person paths and scoped body observations; native-player proposal, not current runtime |
| B7 | [LEVELS §L2-3](../b7/LEVELS.md#g48-b7l2-illustrative-demand-bundles), [CONSISTENCY §C1/C5](../b7/CONSISTENCY.md#g48-b7c5-observer-claims-remain-outside-generation-truth) | Qualified NPC/body refs, demand materialization and observer split; friendship does not reveal anatomy |
| P19 | [CONTRACT §C1-2](../../procgen-2026-10-13/p19/CONTRACT.md#c1-identity-and-ownership-before-social-writes), [GOSSIP §G5.2-3](../../procgen-2026-10-13/p19/GOSSIP.md#g52-truth-claim-transmission-and-belief) | Directed opinions remain in existing relationship owners; episodes/contact/bonds reference them. Gossip joins P14 claims/beliefs and P11 transit |
| P23 | [INNER_LIFE §M1a](../../procgen-2026-10-13/p23/INNER_LIFE.md#m1a-experience-proposes-an-interpretation-the-player-chooses-a-commitment) | Private interpretation, separate from an observer's reading or a public declaration |
| P24 | [INFORMATION §O2.2](../../procgen-2026-10-13/p24/INFORMATION.md#o22-claims-and-corrections-remain-attributed) | Dated scope, corrections and independent evidence; no duplicate rumor store |
| B13 | [PAIRS LA1/LA4/LA11/LA12](../b13/PAIRS.md), [BREADCRUMBS BC4-BC7](../b13/BREADCRUMBS.md) | A cue can justify an enquiry or practical adjustment before it proves a mechanism |
| B12 | [HOOKS](../b12/HOOKS.md), [NO_CONSUMER](../b12/NO_CONSUMER.md), [FLAVOUR_LINES](../b12/FLAVOUR_LINES.md) | Delivered micro-consumer proposal: MP3/MP4 wording and MG/MB receipt joins; no new modifier implemented |

Current narrow carriers: `simulation.knowledge[observer]`,
`simulation.relationships[from][to]`, actor facts and witnessed simulation events.
They are suitable for a finite authored episode, not a complete social web.
Rows that need new metadata extend P19/P14/B7 through versioned adapters.
Root chooses envelope placement; no body record stores a second relationship axis.

## Row contracts

All costs are actual choice costs or contingent consequences, not taxes for
having an unusual body. Unlisted world/body profiles default to quiet texture
and no mechanical social delta. Dials may be zero, local or decisive with a
world rule. A reaction reads the observer's belief and motive, not private truth.

| Code / row | State needed and owner | Player delivery and useful consequence | Default + per-world dial, in-world reason and cost |
|---|---|---|---|
| SS1 Expectations follow bodies | B2/B7 bodyRef and perceived capacity evidence; P19 request issuer, task, promised terms, audience and directed response; real job owner holds capacity/reservations | Offer E01: “Mara asks if you can move the long crate.” Accept, name a fitting method, ask for help or refuse. Later dialogue recalls the actual response, not a strength score | Default one optional work request, refusal need not offend. Dial `expectationNorm`: Frontier professional; ASL military assignment authority only if sourced; TTKS school/clan expectation if qualified. Time/load and any promise are disclosed. A resentful issuer may react to refusal; a considerate one may accept it |
| SS2 Small cues | Actual visible cue or received observation under B7; P19 ContactEpisode cause if retention matters. NPC intent can remain unknown; no envy/fear axis invented from a glance | E02 ambient line: “The clerk pauses over the sleeve measurement.” People memory only if witnessed; optional ask-dialogue explains or leaves uncertainty. No modifier from text alone | Default texture, `cueFrequency` scene-relevant. HP records/robes, D&D equipment fit, MoL workshop hands are adaptation proposals. Dial silence to repeated local recognition; attention/exposure is the possible cost, no mandatory reputation loss |
| SS3 Body etiquette | P19 versioned culture/institution norm, roles, local contact and learned etiquette; B2 person.address and visible presentation. B7 observations do not infer SG1 from clothing | E03 greeting card or dialogue variant offers ask, follow known custom, decline or use an alternate channel. Record who saw it and that observer's reaction | Default teachable local custom. Dial `etiquetteForce`: D&D species-specific gesture; HP office address; TTKS sect ceremony. All source-fit pending. A misunderstood gesture may cost access or an apology with that audience; no universal taboo or anatomy test |
| SS4 Secrecy as capital | B7 scoped observation; P19 explicit disclosure terms and actual recipient; P14 claim/account and P11 message references; sample custody stays outside knowledge. Private trust is not access control | E04 private disclosure offer shows scope and recipient. E12 leak report arrives only through contact. Bio shows self-known facts; People shows the received account. Later favor/blackmail requires a capable actor holding evidence | Default voluntary named recipient and no automatic onward sharing. Dial `discretionPolicy`: MoL research confidentiality, LOTM/COI guarded practice, ASL official record, original open clinic. Scope/breach rule requires selected source. Cost is foregone privacy or negotiated service; no guaranteed betrayal |
| SS5 Envy and condescension | P19 directed assessment, known comparison and repeated actual episodes; P23 holds that NPC's private interpretation if modeled. Do not derive feelings from aptitude truth | E05 attributed remark: “You make that look easy,” with ask, redirect to practice or leave it. Subsequent teaching/help willingness reads the relevant NPC direction. A warm remark can remain sincere | Default an ambiguous remark with no automatic delta. Dial `comparisonSensitivity`: TTKS exam cohorts, HP house/family expectations, D&D guild rivalry or a supportive local culture. Cost can be strained collaboration or time explaining; privileged body does not require envy |
| SS6 Token and showpiece | P19 institutional office/issuer, offer terms, display audience, withdrawal clause, recognition claim; B7 disclosed trait scope; economic owner holds payment and appointment | E06 exhibition offer previews access/pay versus public exposure and duties. Accept limited display, negotiate demonstration, provide a substitute, decline or challenge coercion under local means. Later dialogue references actual terms | Default voluntary limited demonstration. Dial `displayAuthority`: original academy showcase; ASL commissioned examination; LOTM covert patron only if qualified. Harsh coercion is a sourced world route, not default. Costs are time, exposure and accepted duties; access can be a genuine benefit |
| SS7 Rumor distortion | P19 ContactEpisode + P14 original claim/version/root source and per-listener belief; P11 transit; B7 body observation remains unchanged. Transformation operators act on claims | E07 hearsay card: “The porter says the market story has grown.” Ask source, give scoped correction, ignore or exploit under world law. Later hiring uses listener belief and actual funded offer | Default one attributed exaggeration at a real contact. Dial `fidelity`/`fanout`: Frontier market relay, D&D tavern/letter, HP local notice, LOTM restricted channel. No preset maximum hops. Time/channel/exposure are costs; repeated copies do not corroborate or repeatedly debit trust |
| SS8 Accommodation without diagnosis, NEW | B7 observed difficulty plus requested accommodation, not a genome diagnosis; P19 agreement/relationship; tool/site/job owner holds actual adjustment | E08: ask for a wider grip or a quiet written exchange without revealing why. A fitted tool changes the named job only when its adapter exists. Dialogue can remember respectful help | Gap: practical help currently risks waiting for a diagnostic label. Default accept a supported practical request. Dial `accommodationAccess`: Frontier tailoring, D&D alternate communication, MoL instrument fit; institution may demand a certificate. Cost is real material/service/time, waived if means remove it; no compulsory cure |
| SS9 Recognition repair after body change, NEW | B2/B7 old/new body binding, person.address disclosure and observer's prior identity claim; P24 correction account; P19 institution recognition/credential authority | E09 old badge/new voice card offers introduction, a scoped witness, record amendment or a new identity. Bio preserves person identity; old accounts stay dated. Access changes only after the gatekeeper receives adequate evidence | Gap: body swap does not update other people's knowledge or legal record automatically. Default one local correction route. Dial `identityProof`: HP office witness; ASL roster; D&D seal; TTKS clan recognition. Verification effort and disclosed evidence are costs, not an automatic betrayal or loss of self |

## World profile bindings

These are original adaptation settings, not asserted canon. Each selected world
pins source/era/AU and jurisdiction before enabling a row. Rows' knobs compose
with these profiles; unresolved supernatural/legal law leaves the stronger
reader off while ordinary texture and practical work remain reachable.

| World/profile | Default social reading | Dial and fitting cost |
|---|---|---|
| Frontier | Known craft/work cues; professional requests | Exact tailoring or stronger local prestige from actual service; material and appointment costs |
| Harry Potter | Address, uniform, family/office claims as attributed information | Source-qualified record access or magical recognition; actual holder, test scope and disclosure |
| D&D | Local species/culture, not one universal society | Setting/edition-specific etiquette, supernatural senses or accepting settlement; translation/tools/travel where needed |
| A Soldier's Life | Work needs and local institution records | Selected unit/era duties and available examination; authority and time/stock must be sourced |
| TTKS | Teaching, peer comparison and local recognition | Qualified faculty/clan display rather than invented universal purity law; teacher access and exposure |
| Mother of Learning | Workshop/school reports in the existing continuous visitor branch | Research privacy, alternate acquaintances or sourced loop premise later; communication and appointment time |
| LOTM | Attributed reputation and limited-disclosure contact | Source-qualified disguise/sense/organization reach; no automatic secret recognition |
| COI | Same information discipline, separate setting/source profile | Boon/identity/organization rules qualified separately from LOTM; no borrowed disclosure law |
| Shadow Slave | Known local evidence and practical requests | Qualified status/sense/social rules; no assumed flaw or universal recognition |
| Anime/manga worlds | Local original contact texture unless a selected adaptation is sourced | Bind each series and era separately; JJK/FMA/etc. do not share body-reading physics |
| Other worlds | Neutral practical interaction | Local authored norm or explicit AU; stronger dials need its own law and real cost, including none |

## Live consumer audit and limits

**F1 SHOWN/SOURCE:** `src/people_knowledge.js:6-15,28-39` filters introduction
and earned evidence, deliberately excludes craftsman private state, and carries
`body.feedback.*` into that person's memories. Do not route all new body cues
through that prefix or misattribute another observer's evidence to the craftsman.
`src/people_knowledge.js:81-103` merges domain views by ID and supports attributed
book accounts. A new row provider must use qualified projected IDs and recipient
checks; current merge-by-ID does not itself distinguish branches.

**F2 SHOWN/SOURCE:** `src/simulation_content.js:81-85,105-111` shows costs,
knowledge, directed trust/respect and a shower offer with expiry. This is a
usable authored pattern. Its fixed `maxOccurrences:1` and `once` examples are
current code, not proposed universal limits for SS content. New causes may recur.

**F3 SHOWN/SOURCE:** `src/simulation_effects.js:281-292` retains one knowledge
record per key/stage and the last 32 directed memories, with cause-axis dedup.
Use separate claim IDs for contradictory reports; combine deltas on the same
cause/from/to/axis. Actionable confidentiality/recognition terms outlive prose.

**F4 SHOWN/SOURCE:** `src/npc_lives.js:5-22,33-42` contains an authored family
and yearly public news, not gossip contact or hidden medical data. Its saved
`parents`/`spouseId` are not permission to publish ancestry/genetics or merge
household Neri with the route apprentice. The qualified identity adapter is OPEN.

**F5 INFERRED PROPOSAL:** SS1/SS2/SS3 can use finite authored commands/accounts
before a general P19 planner. SS4/SS7 require actual recipient/transit/claim
adapters for general propagation. Source seams do not prove either route playable.
