# World absorption rules

Weibao, 2026-10-17: "create a set of rules to absorb worlds accordingly? Or
expand what we have? Code to implement rules? More to consider?" This followed
the recommendation to turn each book into data that a shared engine reads,
instead of hand-coding every world.

Answer: both. This rulebook is new because no existing owner covers the step
from a read source to playable data. It composes the existing owners rather
than restating them:

| Owner | What it keeps | Used here as |
| --- | --- | --- |
| [Source deep dive playbook](research/SOURCE_DEEP_DIVE_PLAYBOOK.md) | How to read a source once and save evidence | Stage 1 |
| [World core kit](worlds/WORLD_CORE_KIT_2026-10-14.md) K1–K24 | What a world needs, floor and deep | The parts every record sorts into |
| [Completion standard](WORLD_COMPLETION_STANDARD.md) S00–S14 | Detail ledger, joins, evidence states | Acceptance and ledger shape |
| [Generation rules](GENERATION_FOUNDATION_RULES_2026-10-14.md) GR1–GR17 | Generator contract | Stage 4 gap filling |
| [Architecture rules](ARCHITECTURE_RULES.md) AR1–AR16 | Runtime seams, saves, proof | Landing and proof |
| [Rulebook](RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10) 2–3, AD1–AD5 | Worlds set their own rules | Authority for world law |

Status: proposal from 2026-10-17, written at Weibao's request; it becomes
standing when he accepts it (AD32). Until then agents use the WA rules as the
recommended way to absorb a world once a world is selected. They do not
select a world, accept lore, or authorize implementation of any world's slice.

## The pipeline

Read once, sort, encode, fill gaps, prove. Each stage reads only the one before
it. Nobody rereads the book to build the game.

1. **Read.** Deep dive playbook. Output: a private fact ledger with locators.
2. **Sort.** Every fact lands in a kit part (K1–K24) as a pack record.
3. **Encode.** Laws become rule modules or engine facts; things become tagged
   records; the world's loop names the shared verbs it uses.
4. **Fill gaps.** Generators produce what the book never named, under that
   world's laws, labelled as generated.
5. **Prove.** Lint the pack, then play the world's signature loop in a rebuilt
   browser with save, reload and import.

## Rules (WA)

Each rule is a default with a dial and a reason. A world may propose an
exception and must say why.

### Shape

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WA1 | **A world lands as a pack: data plus rule modules over shared verbs.** New code is written only for a verb no world has yet, and that verb joins the shared engine. | A world whose signature mechanic is truly unique keeps a local domain module (AR12); the pack names it | Six bespoke files per world (`book_world_mol_*`), so world N+1 costs as much as world 1 |
| WA2 | **The pack cites, it does not quote.** Records carry fact IDs, locators and short paraphrase. Raw text and full tables stay in the private ledger (AD35). | Direct recreations stay in the private pack (AD1) | Copyrighted prose in commits; packs that need the book to be understood |
| WA3 | **Every fact and record carries a canon status:** source, supplement, inferred, authored, generated or fan. Source, supplement and fan cite a locator or a cited fact. | Status can be upgraded only by new evidence, never by repetition | Agent guesses passing as canon; fanfiction filling book gaps silently |
| WA4 | **A law is a rule, not a sentence.** Each world law names a rule module or engine fact and gives the player-readable reason it blocks or permits. Prose-only laws do not count toward K2. | A law can stay prose while it is texture (T1) | "Magic costs mana" written in a brief and enforced nowhere |
| WA5 | **The engine owns verbs; the world owns nouns, numbers and laws.** Study, craft, fight, trade, travel, learn and appraise are shared. A world changes what they cost, need and produce. | A world can retire a shared verb (no trade in a world without exchange) with an in-world reason | Each world reinventing crafting; fixes that help one world only |
| WA6 | **Floor before deep.** K2 laws, K3 power, K6 cast, K8 daily life and K13 signature loop reach their floor before any other part goes past T2. The pack declares a tier per part. | A slice focused on one part may push it deeper first if the slice brief says why | Deep item tables in a world nobody can live in yet |

### Gaps and truth

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WA7 | **Gaps are generated under the world's own laws.** Generated records name their generator; generators follow GR1–GR17, name their table as `id@rev` and the action that reads them. Generated output never claims source truth. | A world can forbid generation in a part (a fixed canon cast) | Canon contaminated by procedural filler; write-only generators |
| WA8 | **Unknown stays unknown.** An unresolved source detail is recorded as an open question, not filled as canon and not treated as forbidden. | An authored answer can fill it, labelled authored, with the question kept | Silent gap fills that later contradict the book |
| WA9 | **Stable namespaced IDs.** Every ID sits in the world namespace. Released IDs never get renamed; content changes bump revisions. | An existing world keeps its released prefix (`book.mol.`) | Saves breaking when a list is reordered or a name is fixed |
| WA10 | **Pin the source and the pack.** A pack names its source snapshot and represented boundary, and carries `id@revision`. Saves record the pack revision they used. | A pack may cover several editions if each record says which | Patch day quietly rewriting a save's past (GR10) |
| WA11 | **Secrets are sealed in the pack too.** A sealed record's public fields hold only ID, discovery route and status; the truth lives in a sealed owner. | Public franchise twists are not sealed | A pack file or inspector spoiling the world for Weibao |
| WA12 | **Truth and knowledge are separate records.** The pack holds world truth; what a start knows is its own list per start (AD6, AD7). | A foreknowledge start (reader, regressor) lists what it knows and how sure | Every character knowing the whole pack |

### Crossing and time

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WA13 | **Starts are coherent packages** with body, means, debts, access and knowledge (K4, AD23). | Specific starts depend on means | Random bags of traits that cannot do anything on day one |
| WA14 | **Carry is declared per edge.** What crosses in, what is suppressed and how locals read an outlier are records (K15, Rulebook 5). | A world can suppress or amplify any import with an in-world reason | Imported powers working everywhere by default |
| WA15 | **Canon events are causal.** Each event lists its preconditions; averting a cause can avert it (AD2). | Authored plot versus simulation varies by world and mode | Forced plot, or plot that ignores what the player did |

### Proof and process

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WA16 | **Declare budgets.** A pack states its record ceiling; each generator states entity and daily draw budgets (GR11). | Budgets rise with demonstrated need | Idle catch-up generating ten thousand people |
| WA17 | **Converting a hand-coded world is a structural move.** It changes no gameplay and is proved by the same journey before and after (AR9). | Behavior changes follow in a separate change | A "cleanup" that quietly changes Cyoria |
| WA18 | **Continuity is a label, not a fork.** Canon, divergent, AU, fan and original continuities share one pack shape and differ by records and status. | AU overlays add, remove or reweight records instead of copying the pack (GR8) | Seven forked copies of one world drifting apart |
| WA19 | **Lint passing means "pack valid", not "absorbed".** Absorbed means the signature loop was played in a rebuilt browser with save, reload and import (AR10). | None | Clean data reported as gameplay |
| WA20 | **A second, different world proves the format.** Revise the format after it absorbs a world unlike the pilot (AR11). | The format may change freely before that second world ships | A format shaped by one world that every later world works around |
| WA21 | **A pack is plain data.** It survives a JSON round trip and hashes to a fingerprint that saves can record next to `id@revision` (added round 2). | A JS builder may assemble a pack (the Cyoria pilot does), but its output must be plain data | Functions hidden in content; a changed pack under an unchanged revision |

## Code that enforces it

[`src/world_pack.js`](../src/world_pack.js) is a pure lint and coverage read
model. It owns no state, save slice, tick or UI, and adds nothing to `main.js`.

- `lintWorldPack(pack, {registry, facts})` returns every issue at once, each
  tagged with its WA code. It checks namespaces and duplicates (WA9), canon
  status and locators (WA3), prose-only laws and law reasons (WA4), law modules
  through the shared `validateRuleModule` (WA4), generator table, reader and
  budget (WA7, WA16), generated records claiming source truth (WA7), sealed
  fields and opaque sealed IDs (WA11), causal event preconditions (WA15), carry
  records (WA14), tiers that claim depth without records (WA6), summary length
  (WA2), fan content in a canon continuity (WA18), confidence labels (WA3),
  plain data (WA21) and, given `engineFacts`, laws that name a fact nothing
  reads (WA4).
- `worldPackFingerprint(pack)` returns `id@revision#hash` for saves and receipts.
- `worldPackCoverage(pack)` reports records per kit part, declared tiers,
  canon mix, laws encoded as rules, unknowns and whether the WA6 core floor is
  met.

[`src/world_pack_mol.js`](../src/world_pack_mol.js) is the pilot. It derives a
pack read-only from the existing Cyoria content. It lints clean and shows two
real gaps: K2 laws (two of Cyoria's laws are engine facts, the rest are prose
in briefs and bespoke commands) and K8 daily life (jobs, meals and prices exist
as commands but are not yet pack records). The lint also caught one real
overlap: `book.mol.formula_operator` is both a technique source and a power.

Tests: [`tests/world_pack.test.js`](../tests/world_pack.test.js).

Status: engine ready, not integrated (AR10). No runtime reads a pack yet.

## More to consider, round 1 (2026-10-17)

### ACT NOW (done)

- **WAC1 Duplicate ID across sources and powers.** Pilot lint found it. Handled
  in the adapter with one record per ID; the runtime sharing is left as is.
- **WAC2 Namespace dial.** Cyoria's released IDs use `book.mol.`, not its world
  ID. WA9 gained the released-prefix dial instead of renaming released IDs.

### ACCOUNT FOR NOW

- **WAC3 Two kinds of "rule".** `rule_modules.js` is built around the village
  mix resolver (one parameter target, a small fact set). World laws mostly need
  gates and observations, which it already supports; parameter laws for other
  targets need the resolver to grow before packs can use them. Packs should
  prefer engine-fact laws until then.
- **WAC4 Loader shape.** When a runtime reads packs, it lands through the domain
  registry (AR2) as one domain that installs records into existing owners
  (people, items, powers). It must not become a second truth store (AR3).
- **WAC5 Save identity.** A save that used Cyoria before packs has no pack
  revision. Old-save compatibility is deferred for now
  ([2026-10-17](USER_VISION.md#old-save-compatibility-deferred-2026-10-17)), so
  the loader may reset such state and say so; new pack refs still survive save,
  reload, Export and Import.
- **WAC6 Inspector only after a consumer.** Coverage is a read model for an
  author inspector. Building the panel waits for the loader, since it would
  otherwise report on data nothing plays.
- **WAC7 Tiers are claims.** Declared tiers are author claims; they should later
  be checked against evidence (a T4 loop needs a recorded journey), not trusted.

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| WAC8 | Cyoria conversion: install people, items and techniques from the pack instead of `book_world_mol_content.js` | Strong coder, one focused session, structural only (WA17) | Same rebuilt journey before and after, save/reload/import identical |
| WAC9 | Encode Cyoria's remaining K2 laws (5–10) as engine facts or gate modules | Designer plus coder, small | Pilot coverage shows K2 at T2 with laws as rules |
| WAC10 | Map K8 jobs, meals and prices into pack records | Coder, small | Coverage K8 at floor |
| WAC11 | Second world through the format, contrasting with Cyoria (LOTM pathways or Worm powers) | Coordinator plus readers under AU13 | Pack lints clean; format changes recorded here (WA20) |
| WAC12 | Ledger to pack scaffolder: turn a deep dive's fact ledger into draft records with status and locators | Coder, medium | A saved ledger produces a pack that lints with only WA4 law gaps |
| WAC13 | Evidence-checked tiers: tie a declared tier to a recorded journey ID | Coder, small, after WAC8 | Lint flags a T4 claim with no journey |

## More to consider, round 2 (2026-10-17)

### ACT NOW (done)

- **WAC14 Sealed IDs leaked truth.** IDs are public, so `secret.king_is_a_dragon`
  spoils its own secret. WA11 now requires an opaque ending such as `.s2`,
  matching the S2-style references in AGENTS.
- **WAC15 Fan content in canon.** Nothing stopped a fan fact or record inside a
  canon continuity. Lint now refuses it (WA18).
- **WAC16 Confidence was free text.** It now uses the research lens labels
  (shown, stated, inferred) plus `translated` for unverified or machine
  translated sources, the (U) mark in the entry matrix.
- **WAC17 Code could hide in a pack.** New WA21: packs must be plain JSON data.
- **WAC18 Laws could name facts nothing reads.** Given `engineFacts`, lint
  flags them. The pilot test now collects the facts Cyoria's definitions
  actually read and confirms both pilot laws point at real ones.
- **WAC19 No content identity.** `worldPackFingerprint` hashes the pack
  through the shared `gen_kit` address, so a missed revision bump shows up.
  The first test run caught a real formatting bug in it (`hash64` returns two
  halves, not a string), fixed before saving.

### ACCOUNT FOR NOW

- **WAC20 One ledger, not two.** The completion standard already keeps a
  detail ledger (Frontier's `COMPLETION_LEDGER.json`). Pack records hold the
  content; ledger rows track evidence and cite pack record IDs. Neither copies
  the other (AD7).
- **WAC21 Law reasons are truth.** AD3 starts a world's special rules hidden. A
  law's `reason` is author truth; what the player sees goes through the
  projection (AR8). Before discovery the player gets a plain grounded result
  ("the lamp stays dark"), not the law text.
- **WAC22 Build-time versus run-time generation.** `generated` records in a
  pack were produced by an author run and reviewed. Run-time output freezes into
  the save on reveal (GR3) and never writes back into the pack.
- **WAC23 Local units only.** Packs keep their own units (mana, crowns,
  ratings). There is no universal power scale; conversion happens only at
  crossing edges through carry records (AD27, AD28, WA14).
- **WAC24 Private packs.** Direct recreations (AD1) live in a gitignored pack
  path. A committed pack paraphrases; lint cannot see file location, so the
  task record states which kind it is.

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| WAC25 | Serials and retcons: facts gain `supersededBy`; a source update bumps the pack and lists contradicted records | Coder, small | A superseded fact cited by a live record is flagged |
| WAC26 | Pack diff tool: changed, added and removed records between two revisions, with which ones saves may have frozen | Coder, medium, after a loader | Diff of the pilot against an edited copy lists exactly the edits |
| WAC27 | Canon contradictions: a `conflicts` list on facts and the reading the pack chose, keeping both sources (unbiased lens) | Designer, small | A record citing one side of a conflict names the chosen reading |
| WAC28 | Lint every registered pack inside `npm test` once packs have a registry | Coder, small, after WAC8 | Adding a broken pack fails the suite |
| WAC29 | Author CLI: `node scripts/lint_world_pack.mjs <pack>` printing coverage and issues by WA code | Coder, small | Running it on the pilot prints the K2 and K8 gaps |
| WAC30 | Native-script names and aliases for translated sources (Reverend Insanity, LOTM) so readers and packs match terms | Designer plus coder, small | Two translations of one term resolve to one record |

## Cross-audit application, 2026-10-18

WA6 floors describe authoring readiness, not a prerequisite bundle for every
selected playable feature. Its slice exception remains usable. WA8/WA12 keep
source uncertainty, character knowledge and implementation coverage distinct:
"unknown in source", "unknown to this character" and "not built" are different
facts. A pack coverage read cannot enforce fictional impossibility (AD38).

WA14 crossings resolve the actual origin, carrier and destination mechanisms;
origin tags are provenance rather than automatic permission or suppression.
WA15 events retain causal prerequisites, including an intervention's committed
intermediate effects. A content-edge pause follows the existing
[RLCE owner](RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md#rlce-content-edges),
with an observer-safe explanation and exact time/resource settlement
([G26–G30](reviews/SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18)).
WA's proposed status and current world/layout/NPC deferrals remain unchanged.
