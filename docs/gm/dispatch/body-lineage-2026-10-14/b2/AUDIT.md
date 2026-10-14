# B2 source audit, 2026-10-14

Status: read-only source inspection on `codex/gameplay-foundations`. Other
workers have dirty files in this checkout. Locators describe the observed source,
not an immutable commit. No build, tests, gameplay, private save or browser used.
Paths below are relative to the repository root; references use `file:line`.

Authority: [COMMON](../COMMON.md), [PLAN](../PLAN.md), [B2](../B2.md),
[G17–G25](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md#g17-physique-the-ordinary-body-has-working-parts),
[prior integration](../../body-lineage-expansion-2026-10-11/INTEGRATION.md).
Read the full G1–G42 palette, linked life-sim sex/body/person/checklist sections,
PROJECT priorities and USER_VISION's desktop and food direction. B2 extends
G24 with G24-B2 codes; it does not accept the palette as game rules.

## F1 Creation, biography and address have separate consumers

| Source locator | Shown in source | Consequence for implementation |
|---|---|---|
| `src/character_creation.js:15`, `:23`, `:28`, `:70` | Race buttons and optional height tooltips; three gender options; confirmation writes race/age/gender/height directly then calls run | New record creation must happen after final selections, before run; changing startup flags alone misses the chosen values |
| `src/components/bio_component.js:3`, `:11` | Constructor owns four fields; getBio explicitly serializes four fields | An extra property added elsewhere is not automatically saved |
| `src/data/character.js:21` | Native hero starts with an empty bio | Missing data is a supported path to consider, not evidence of a particular sex |
| `src/character_bio.js:12`, `:16`, `:28`, `:34`, `:41` | Pure view of earned sources, temporary conditions, observed techniques and visible training; inactive faculties filtered | Extend this projection; preserve its secrecy and purity contract |
| `src/character_bio_ui.js:3`, `:9`, `:15`, `:25` | Appends keyed history sections to existing bio panel; practice links and skill buttons | Put summary and optional body details here; do not create another window |
| `src/main.js:8462` | Native skills are translated into biography training influences | Body record is additional context, not a replacement for skill XP |
| `src/main.js:2105`, `:2122` | Dynamic translation `gendered playful` tests gender exactly equal to male, then age exactly middle-aged | Preserve the two exact comparisons for old saves, including ambiguous using the nonmale branch |
| `locales/english.js:216`, `:217` | Two miller reward lines invoke that dynamic key | Exercise actual dialogue interpolation as well as helper tests |
| `locales/english.js:733` | Gender tooltips describe NPC assumptions; ambiguous suggests varied assumptions | Text is broader than executable behavior. No random NPC gender inference was found |
| `src/local_livelihood_content.js:95`, `src/foundation_start_content.js:39` | Start descriptions promise the native name/gender remains | Extend data without silently changing identity or recreating the hero |

Repository search covered `gender`, `bio.gender`, pronoun/honorific and the dynamic
key in source, locales and tests. The only executable address branch found was
`get_dynamic_translation`. No pronoun resolver or identity-based romance filter
was found in that search. `src/data/locations.js:1274` is NPC descriptive prose,
not a player gender consumer. Gender UI selection/serialization is not pronoun
logic. The scope of this negative finding is the checked files, not future packs.

Creation writes age "middle aged" (index.html:110), but the address branch
checks "middle-aged". Most creation-selected older characters therefore take
the younger address branch. Preserve this exact mismatch during migration.

Exact legacy address matrix:

| Legacy value | age = middle-aged | All other ages, including missing |
|---|---|---|
| male | Jii-san | Onii-san |
| female | Baa-san | Onee-san |
| ambiguous | Baa-san | Onee-san |
| missing or an unrecognized old value | Baa-san | Onee-san |

## F2 Race and height tables work through additive methods, disabled today

| Source locator | Shown in source | Consequence |
|---|---|---|
| `src/config.js:36` | Both use_racial_bonuses and use_height_bonuses false | Current default save behavior is cosmetic for those bonuses |
| `src/races.js:25`, `:44`, `:58`, `:241` | Race data, centimetre offsets and assigned race IDs | Height offsets describe display size; relative height bonuses are a separate table |
| `src/models/person.js:19`, `:28` | Height estimate values; short/tall relative stat maps | Do not interpret tall as a fixed cross-species centimetre threshold |
| `src/models/person.js:213`, `:255` | Methods add flat bonuses and multiply into existing race/height buckets | Repeated calls can accumulate. Reconcile by replacing owned buckets |
| `src/models/stat_haver.js:44`, `:60` | Separate race/height flat and multiplier dictionaries | Reuse buckets rather than a duplicate global stat system |
| `src/models/person.js:608`, `:617`, `:637` | All stat multiplier buckets composed; missing vitals preserved; race XP composed separately | Reconcile before final stats and missing-vital restoration; retain identity XP in this slice |
| `src/main.js:8185`, `:8480` | Startup and real-loader probe separately invoke bonus methods | Both must use the same idempotent resolver; creation needs an explicit reconciliation too |
| `src/display.js:5779`, `:5801`, `:5843`, `:5861` | Native bio labels, config-gated race/height tooltips and gender tooltip | Both creation and bio must show resolved world effects, not a different raw table |

Existing race stat maps, all multiplicative, omitted entries = 1:

| race | agility | dexterity | strength | max_health | stamina_efficiency | magic | max_mana | source |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| human | 1 | 1 | 1 | 1 | 1 | 1 | 1 | `src/races.js:59` |
| nekomimi | 1.2 | 1.2 | .7 | .7 | 1 | 1 | 1 | `src/races.js:64` |
| nezumimi | 1.2 | 1.2 | .6 | .6 | 1 | 1.1 | 1 | `src/races.js:84` |
| inumimi | 1.1 | 1 | 1 | .9 | 1.1 | .8 | .7 | `src/races.js:97` |
| kitsunemimi | 1.1 | 1.1 | .8 | .8 | 1 | 1.1 | 1.2 | `src/races.js:119` |
| usagimimi | 1.2 | 1 | 1.1 | .7 | 1 | 1 | 1 | `src/races.js:141` |
| lizardkin | 1.1 | .9 | 1 | 1.1 | 1 | 1 | 1 | `src/races.js:152` |
| elf | 1.1 | 1.1 | .9 | .7 | 1 | 1.1 | 1.1 | `src/races.js:162` |
| half-elf | 1.1 | 1 | 1 | .8 | 1 | 1 | 1.1 | `src/races.js:184` |
| dwarf | .7 | 1.1 | 1.1 | 1.1 | 1 | .7 | .7 | `src/races.js:202` |
| half-dwarf | .8 | 1 | 1.1 | 1.1 | 1 | 1 | 1 | `src/races.js:222` |

Commented XP maps are not active race content. Height short = strength/health
.9 and agility/stamina efficiency 1.1; tall reverses those; average is empty
(`src/models/person.js:28`). These tables are existing data, not tested balance.

## F3 Existing body records are real, narrow owners to preserve

| Source locator | Shown in source | Integration rule |
|---|---|---|
| `src/body_progression.js:15`, `:32`, `:65`, `:71` | Inherited latent balance, trained grip, acquired mark; conditions; explicit enrollment | Migration must not enroll simulation, grant these sources or invent ancestry |
| `src/body_ui.js:4`, `:18`, `:27` | Body & recovery actions in Local actions, eligibility preview and cancellation | Keep actions here; new bio section reports body state rather than duplicating controls |
| `src/capabilities.js:4`, `:9`, `:39`, `:62` | Validated positive capabilities, origin labels and pure max/sum query | Not a signed multiplier or penalty engine; do not encode a .95 multiplier as capability amount |
| `src/backlog_expansion_body.js:29`, `:89`, `:123`, `:179` | Physical forms, trusted human-only native input, optional backlog proof record, native body binding | A race label is not enough to override active anatomy; do not rename this record |
| `src/backlog_expansion_body.js:469`, `:488`, `:520` | Possession gates native actions; projection distinguishes parked stats and controlled body; validators enforce custody | New physical data remains attached to native body while person identity stays with player |
| `src/main.js:495`, `:505` | Native world adapters already ask for body form/id/ownership | Resolve actual body first, not bio.race alone |
| `src/simulation.js:58`, `:579` | Simulation people can own body data; body reset deletes it | Keep B2 native record separate and define reset/continuation policy; no blind spread into simulation |

## F4 Concrete action hooks exist, but generic stealth does not

| Family | Existing consumer | B2 insertion seam |
|---|---|---|
| Sleep | `src/main.js:2819`, `:7428` | Scale final native health/stamina sleep recovery after furniture, before vital cap; preserve timer and Sleeping XP |
| Eating | `src/main.js:4665`, `:4671`, `:4674`, `:4717` | Resolve only tagged food's incoming effect durations before add_active_effect; preserve native consumption, effect replacement and fullness behavior |
| Poison example | `src/items.js:4254`, `:4338` | Explicit Slight food poisoning effect exists; avoid inventing allergy tags already in runtime |
| Combat | `src/models/person.js:597`, `src/models/combat.js:347` | Scale native attack_points in an owned quirk bucket before hit calculation; this reaches real combat |
| Stealth | `src/pursuit_content.js:16`, `src/simulation.js:84`, `:175`, `:209` | Modify quoted/reserved stamina of pursuit.conceal consistently; no invented stealth stat or hound sense |
| Detection exclusions | `src/pursuit.js:88`, `:131`, `:151` | Preserve actual witness/signature rules and authority ignoring ordinary concealment |
| Crafting | `src/main.js:4206`, `src/display.js:3077`, `:3487` | Apply percentage-point delta after Work Ledger chance in preview and execution; preserve materials and native craft transaction |
| Craft rollback | `tests/native_craft_transaction.test.js:41`, `:69` | New record/discovery publication must participate in existing rollback and durable-batch semantics |

`src/combat_math.js:43` is shared by several other battle hosts. Editing it
alone does not prove native `src/models/combat.js` behavior. Body quirks in this
spec initially target native actions plus the named pursuit command; other
battle hosts remain neutral unless separately adapted.

## F5 Persistence and tests require explicit integration

| Source locator | Shown in source | Required change in later code |
|---|---|---|
| `src/main.js:4935`, `:4957`, `:4968` | Character bio saved; stats omitted; missing health/stamina recorded | Serialize body_record explicitly; derive effects, not accumulated totals |
| `src/main.js:4797`, `:4833` | Active effects use native replacement/group-priority rules | Preserve actual used-flag/consumption behavior, not an assumed extension-only rule |
| `src/main.js:6736`, `:6745` | Loader restores missing health/stamina with health floor 1 and stamina floor 0 | Preserve exact old fallback; reconcile new maxima before these assignments |
| `src/main.js:5284`, `:5290`, `:5299`, `:5371` | Envelope checked, legacy save prepared, current bio keys copied | Validate and normalize body record before mutation; explicit assignment bypasses four-field copying trap |
| `src/save_migration.js:3` | Clone; pre-v0.6 personal/bio merged over defaults; legacy hero not recreated | Run B2 migration after that merge, preserving exact resulting old gender/age semantics |
| `src/save_files.js:40`, `:99`, `:108` | Envelope has component/legacy checks but no B2 domain validator | Add optional B2 validation; do not rely on permissive unknown-field acceptance |
| `src/save_files.js:158`, `:176`, `:185` | Unicode/legacy decode, UTF-8 export, validate then real preflight then write | B2 must survive actual getBio/create_save and real loader, not only JSON stringify |
| `src/main.js:415`, `:5228`, `:5255`, `:7056`, `:7075` | Guarded durable writer; export may reward; manual/local/file routes | Use same optional record on all routes; account for ordinary export reward in comparisons |
| `src/import_probe.js:1`, `:36` | Disposable iframe runs actual loader, cannot play/save | Record migration and reconciliation must be deterministic and write-free during probe |
| `src/save_files.js:194` | 4 MiB shared-origin UTF-16 budget; UTF-8 also measured | Record budget needs both encodings and other stored keys |
| `tests/character_bio.test.js:10`, `:17`, `:27`, `:38` | Pure hidden/known, training, source retention, observed technique cases | Extend these without deleting non-disclosure assertions |
| `tests/body_progression.test.js:24`, `:31`, `:70`, `:104` | No implicit enrollment, latent traits, tick/reload equivalence, failed persistence | Add B2 alongside these owners; they do not test B2 today |
| `tests/v06_migration.test.js:12`, `:40` | Component/UTF-8 fixtures and legacy biography idempotence | Expand fixture matrix; existing component fixture can omit bio |
| `tests/save_files.test.js:11`, `:20`, `:34`, `:43` | Codec, reject-before-write, preflight/storage failure, successful import | Add B2 domain corruption and no-partial-write cases |
| `tests/pursuit.test.js:38`, `:42`, `:72` | Real stamina/time, frozen advancement, authority exception | Add quirk modifier without weakening detection guarantees |

The observed suite resides under `tests/` (98 files at inspection); `test/` was
absent. This is an inventory, not a pass count. No dedicated gender split,
world-scaled race/height or body-record suite was found. Existing tests are
source evidence only until executed in an authorized implementation checkout.
