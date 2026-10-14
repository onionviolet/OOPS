# G53-B11 test and acceptance plan

2026-10-14. **NOT RUN.** These are future acceptance cases for [SPEC](SPEC.md),
not test results. This lane ran only the document checks recorded in
[REPORT](REPORT.md). No npm, build, browser or real save was used.

## T1: fixture and evidence policy

Use generated test lives and isolated origins/worktrees reserved by root.
Never load, export, overwrite or examine a real user save. Record source SHA,
build command/hash, served candidate hash, origin, viewport, fixture source,
clock and evidence paths for a later implementation. Distinguish PURE/SOURCE,
REBUILT, SEEDED-NATIVE, NATURAL, SAVE and HUMAN evidence. A fixture that forces
a rare outcome is not natural acquisition proof. No equivalent broad suite
reruns while authoritative CI runs unless reproducing a specific failure.

Use these named fixtures; none exists yet:

| Fixture | Required initial facts |
|---|---|
| `legacy-v05`, `legacy-v06` | No B2/B11; existing omissions/unknown labels, unchanged earned sources, native inventory/money/RNG/conditions. Synthetic old-format envelopes. |
| `b2-r1` | Valid B2 neutral and enabled profiles, split identity/address, no modification owner. |
| `clinic-empty` | New opted-in supported adult native body, Village provider/stock, enough earned native money, no hand-control source, no kit, unsurveyed crossing and inspected anchor. No undisclosed capability fixture. |
| `clinic-trained` | Same packing prerequisites, but existing trained Conditioned grip. Preserve its receipt/mastery and no extra benefit from the modification. |
| `clinic-pending` | Exact unit/bark/fee held at admission, frozen mode/outcome/law/body/template/draw receipts, then separate started/consumed copy. |
| `clinic-outcomes` | Injected draws for established, sore, mosaic and rejected, each somatic/heritable and diagnosed/blind. |
| `clinic-family` | Synthetic real parent/child identity records for pure resolver checks, engineered overlay snapshots, no automatic NPC birth or adopted-to-biological conversion. |
| `clinic-foreign` | Unsupported law/body, parked native body with controlled host, and forced provider/location change. |

## T2: pure state, arithmetic and deterministic behavior

| Case | Required assertion |
|---|---|
| P01 neutral migration | Absent B11 stays absent; B2 r1 lift preserves all values, remains neutral where appropriate; no diagnosis/enrollment/draw/time/knowledge/faculty changes. Normalize twice equals once; original object unchanged. |
| P02 validation | Reject null/array/polluted maps, NaN/Infinity, unsafe IDs/integers, wrong keys, unknown revision/law/handler, dangling body/sample/card/template/source or mismatched acquisition receipt. Input/current storage unchanged. |
| P03 unit conservation | Purchase transfers same vendor unit; stabilization consumes exact initial tail/phial/fee; aggregate duplicate debits fail. Duplicate holder/escrow, consumed unit reuse, fabricated sample key/count or sale while held rejects. Unknown raw-tail provenance stays unknown. |
| P04 capacity | Empty + somatic `(3,2,2)`; +heritable `(4,3,3)`; `(2,2,1)` +heritable `(6,5,4)` rejects M; exact `(6,4,4)` admits. Negative/noninteger loads reject. Suppression/mosaic still occupies full load; rejection releases it. Test independent-axis modifier and later capacity loss without deletion. |
| P05 all outcome edges | Diagnosed `0,6999,7000,8999,9000,9799,9800,9999`; blind `0,3999,4000,7499,7500,9499,9500,9999`. Every integer belongs to exactly one row; row counts sum 10,000. Check unsigned draw 0 and 0xffffffff mapping, no r=10000. |
| P06 draw isolation | Same immutable root/body/unit/cause/revision gives same result before and after save codec roundtrip. Display/diagnosis/export never allocate a cause or draw. Unrelated combat/mixture calls cannot shift keyed B11 outcome. Different authorized paid cause can differ without changing old results. |
| P07 fallback migration | If root selects legacy domain-root alternative, creation occurs once inside successful enrollment; load never calls entropy, failed write publishes no root. Golden vector for chosen shared mixer required before release. Do not compare fallback root with historical seed. |
| P08 modes | Somatic leaves physical.genetics unassigned; successful heritable writes only engineered overlay and correct template load. Mosaic/rejection creates no transmitted allele. Mosaic repair uses same card/edit/draw and adds no duplicate capacity. |
| P09 stacking | Pure hand-control query returns max 1 from trained and edited sources; removing either preserves the other. Explicit inactive mosaic has no contribution. No capability negativity, XP or mastery from application. |
| P10 scoped reversal | Body-only leaves `(1,1,1)` for heritable component; template-only leaves `(3,2,2)`; full leaves zero. Same-target subsequent change fails compare-and-swap without fee. Unknown unrelated quirks, SG/person/profile, injuries, clocks, learned grip and evidence retain values. No-op repeat removal costs nothing. |
| P11 birth resolver | Freeze actual parent templates, exercise slot choices 0/1 independently, one-carrier table 2/4 carrier cases and two-carrier table 3/4. Child snapshots never change with parental reversal. Potential/expression/mastery remain separate; adoption has no genetic draw. Unknown fertility does not become fertile/sterile. |
| P12 B6 qualification | Reject inheriting H02/Seasoned Palms practice, converting H03 knot perception to packing control, copying C01 stored qi into home or treating C06/W06 pact designation as germline. Known card name cannot supply a handler. Qualified generated card keeps tuple, parameters, source and naming receipts unchanged across restore. |
| P13 purity of projections | Snapshot whole input before/after repeated preview; compare deep equality and RNG/cause sequence. Hidden compatibility/outcome, unknown card count and raw IDs absent in rendered text, attributes, tooltips and accessibility tree. Diagnostic claim never changes truth. |

## T3: transaction, time and compatibility failures

| Case | Required assertion |
|---|---|
| X01 admission failure | Stale sequence/body/template/law, missing input, known incompatibility, overbudget, another busy action or insufficient coins leaves all owners/clock/draws/storage unchanged. |
| X02 failed durable write | Inject quota/storage/validator failures at diagnosis, procurement, stabilization, admission, start, settlement, mosaic completion and reversal. No partial debit, body/source/template/evidence, success message or time publication. Last stored bytes unchanged. |
| X03 post-write UI failure | Saved state is authoritative after successful write; render recovery reloads it without another application, draw, cost or reward. Native publication must already be prepared and nonthrowing. |
| X04 timing | Minute-step and one long played-time advance agree at admission/start/due/soreness expiry. Close clinic view, keep actor idle in Village, and still settle. No job advancement merely from panel polling or reload. |
| X05 cancellation | Before start returns held sample/bark/fee exactly; resumed same plan reuses retained result. After start consumes inputs, applies 12-minute soreness, writes aborted with no allele/source. Same-cause duplicate cancel is inert. No free reroll or duplicate sample. |
| X06 interrupts | Normal travel/body swap/another occupied action blocked with actual reason. Forced location/provider/body/life change pauses without settling into the wrong body; supported resume or explicit abort preserves frozen result and conservation. |
| X07 other owners | Old grip, natural balance, inventory/custody, P2 oral products/exposures and unrelated engine RNG remain exact. If P2 is integrated, a product debit and edit must never use two independent writes. |
| X08 restore validation | Unsupported revision/resolver, forged budget/template, duplicate source ownership, mismatched card receipt, double-held sample or invalid pending times fails local load and literal Import before active state/storage mutation. No silent body repair/reroll. |
| X09 size | Measure full envelope UTF-8/UTF-16 deltas with 1 edit and 10 cycles, referenced consumed samples and Unicode text. Engineering target overflow does not discard data; actual guard/quota rejection preserves the saved life and export recovery. |
| X12 clinic rest without body enrollment | With local services enrolled but body.enrolled false, B11-caused soreness can clear through b11.rest_hands in three minutes; trained grip, edits, unrelated scrapes and body.enrolled remain unchanged. |
| X11 new-life compatibility | On a synthetic new-life transition, retain shared archive and real vendor/chest/player holdings, retire old edits/source bindings, allocate distinct new body ID and grant no old body bonus. An archived parent template remains addressable by a conceived child. This is source/save compatibility evidence, not native hereditary birth. |
| X10 content updates | Old pinned resolver produces same pending/settled state; incompatible revision blocks safely. No rebalancing from importing under a new catalog. Removed cards retain historical severed binding; historical source refs cannot activate them. |

## T4: rebuilt desktop and native causal journey

Root selects/reserves an isolated implementation branch before these commands.
Run meaningful focused pure/native-adapter tests, then the relevant save/import,
capability/condition, inventory and current P2 integration regressions. Build
the selected candidate once those pass. Serve those bytes from a fresh fixture
origin; record served hash against the rebuilt artifact. This lane must not run
build/npm in the shared checkout.

| Journey | Required observed evidence |
|---|---|
| N01 natural supply/read/apply | At 1366x768, naturally earn coins/reach Village, read body, buy an actual finite vendor vial, assay it, select somatic and commit with visible costs/capacity/risk/reversal. Show stock/coin/material debit and timed result. Do not edit state to obtain an established outcome and label it natural. |
| N02 useful action | With native anchor/no-kit/unsurveyed prerequisites, compare packing preview before/after, then pay and complete the changed packing action, consume resulting kit in its real downstream route. Frozen accepted duration and output match preview. A new separate fresh fixture covers the before comparison if the crossing has already been surveyed. |
| N03 trained-control comparison | In a fixture with genuine earned Conditioned grip, treatment grants no second minute reduction; remove only treatment and retain the earned source and its work benefit. |
| N04 alternate GD1 mode | Separate fixture chooses heritable; observe different payment/time/load, template establishment and scoped reversal choices. This proves present template state, not native birth. |
| N05 seeded rare leaves | Separate clearly labeled fixtures exercise sore/mosaic/rejected and blind risk display; observe actual tenderness duration modifier, rest/recovery, same-edit mosaic repair and rejected lack of source/template. No repeated natural retries required to collect rare evidence. |
| N06 reversal use | Apply body-only/template-only/full removal in separate suitable fixtures; observe released load, retained evidence/learned grip, exact fees and no restored unrelated history. Reapply after full reversal using fresh actual supply. |
| N07 source route distinction | Native hunt-tail → stabilization route is independently verified or explicitly marked OPEN. The paid-vial loop does not prove hunting/tool access. Trade/chest whole-unit transfer/split invalidity receives its own fixture evidence. |
| U01 laptop fit | Initial, blind, diagnosed, pending, mosaic, reversal, overbudget and long-provenance states at 1366x768. Apply/Back/GD1/risk/reversal readable; independent vitals/inventory remain useful. No horizontal page scroll or hidden action row. |
| U02 desktop/accessibility | Wider desktop, restored module layouts, laptop zoom/text enlargement, keyboard radio/tab/Back/focus behavior, screen reader labels and no poll-induced resets. Mobile deferred. Human layout/balance acceptance separately OPEN. |

If a natural draw rejects, record that exact result and its recovery. A later
newly paid attempt may proceed within the selected implementation's play budget;
a controlled established-outcome fixture can test mechanics but does not replace
natural positive acquisition evidence. Keep those statuses separate.

## T5: Save, reload, Export and literal-file Import matrix

Each row uses the game's visible **Save**, reload, visible **Export** to an
actual file, then literal file selection through **Import** into another fresh
fixture origin on the same candidate. Do not use a dev-state assignment or
copied object as an import substitute. Pause at matched game clocks. Preserve
the original export and both body-domain snapshots. Report source/build/native
and persistence evidence separately.

| Checkpoint | Exact state to retain after Save/reload and Export/Import |
|---|---|
| R01 before B11 adoption | Optional absence, old gameplay/stats/person/bio, inventories, sources, conditions, unrelated RNG unchanged. No B11 root allocated. |
| R02 acquired unknown vial | Exact unit/lot/template/provenance/custody and unknown observations; no hidden label/assay caused by loading. |
| R03 diagnosed, pre-apply | Bounded body/sample claims with original evidence refs, same preview costs/budget/risk; no new reading fee. |
| R04 pending before start | Held inputs/fee, mode/due, root/namespace/draw/result/card spelling; no immediate settlement or reroll. Cancel once returns exact resources. |
| R05 started, before due | Consumed unit/bark/fee, remaining time and frozen result; no refund or second consumption on restore. |
| R06 established/sore | Exact edit/card/source/faculty, origin/receipt/load, template present or absent, condition cause/expiry, known claims; packing result matches. Retain consumed sample definition despite zero stock. |
| R07 mosaic/rejected | Inactive mosaic budget and no allele, or rejected zero budget/source/allele with recovery condition; repair/removal retains original result, no reroll. |
| R08 reversed components | Exact surviving body/template load and older immutable snapshots, severed binding/history, trained grip intact. No reactivation or sample refund. |
| R09 offspring resolver fixture | Parent/conception snapshots and chosen allele/draw receipts, developmental potential and no parental mastery. This is PURE/SAVE fixture evidence until a native conception consumer exists. |
| R10 continued future decision | First subsequent genuinely paid procedure after roundtrip gets the same keyed outcome/card as an un-reloaded control with matching causes/inputs. Other stream cursors stay matched. |

Compare canonical body/card/template/receipt/source/knowledge/inventory/escrow
fields, not whole raw envelope bytes when `saved_at`, playtime or normal Export
rewards legitimately differ. Explain each allowed difference in evidence;
never mask currency differences caused by an edit. Failed import cases require
unchanged active model **and** previous stored bytes.

The authoritative first playable gate is N01/N02 plus R02-R08 on the rebuilt
desktop candidate, with failure-path/source coverage. Native heritable birth,
natural hunt procurement, generated-card variants, all-world methods and human
fiction/balance acceptance are separate gates; do not promote unit tests into
them. Every gameplay gate in this file remains OPEN for this docs-only return.
