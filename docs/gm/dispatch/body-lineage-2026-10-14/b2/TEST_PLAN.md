# G24-B2 test and playable acceptance plan

All cases below are specified, NOT RUN. This docs-only lane ran no npm, build,
source tests or browser journey. Use a later authorized implementation checkout,
generated fixtures and separate fresh browser origins. No real private saves.
Source evidence is in [AUDIT](AUDIT.md); exact behavior in [SPEC](SPEC.md) and
[MIGRATION](MIGRATION.md).

## G24-B2.T1 Migration and identity assertions

| ID | Setup/action | Required assertion |
|---|---|---|
| M01 | Each male/female/ambiguous x young/adult/middle aged/middle-aged legacy bio | Identity preserves old value; address matches exact legacy branch. Space/hyphen mismatch retained |
| M02 | Missing gender; unknown legacy string; v0.6 omitted bio fixture | Independent SG1/SG2 unspecified, SG3 unspecified where missing/unknown, pronouns null, exact nonmale address fallback, no fabricated raw bio fields |
| M03 | v0.5 personal + overlapping bio, then existing prepareV06Save and B2 normalization | Existing precedence/defaults preserved; is_hero_created not reopened; source input deep-equal; M(M(x)) = M(x) |
| M04 | Every supported race and short/average/tall, body domain absent | Neutral buckets, exact prior stats/XP/vitals, zero new quirks, no RNG/clock/sequence changes |
| M05 | Edit body sex, identity and address independently on generated fresh record | Sex edit affects neither identity nor address; identity edit preserves explicit address; address changes native dialogue only through resolver |
| M06 | Explicit neutral/custom pronouns including Unicode | Plain text survives save/export/import; no HTML interpreted; playful form independent; null not rendered as assumed pronouns |
| M07 | Latent balance, trained grip, palm mark and tender condition | No automatic enrollment/source grant/discovery or ancestry; existing body biography and timing unchanged |
| M08 | Active possession, reedling and installed BL-01 generated compatible fixtures | Exact ownership/custody/vitals/gates preserved; no human quirk leaks into host; native physical record retained while identity stays with player |

Extend tests/v06_migration.test.js and tests/character_bio.test.js. Add focused
body_record migration tests, not copies of normalization internals. Legacy
fixtures must compare observable stats/address/actions with the old baseline,
not merely compare two runs of the new code.

## G24-B2.T2 World profile and stat arithmetic

| ID | Setup/action | Required assertion |
|---|---|---|
| D01 | Human average, each profile | Existing-table entries all identity; native health/stamina mechanics otherwise unchanged |
| D02 | Short nekomimi, gentle | Health factor .87875, strength .87875, agility 1.1025; unmodified base 60/12/8 gives 52.725/10.545/8.82 within numeric tolerance |
| D03 | All 11 races x 3 heights x three authored profiles | Formula matches pinned tables; zero scales = exact identity; full scale = original raw factors; XP unchanged |
| D04 | Reconcile repeatedly, equipment swap, same-world load and probe load | No cumulative race/height/quirk bonuses; changing profile clears all previous owned entries |
| D05 | Gentle -> unsupported world/body -> home -> legacy | Unsupported neutral, return restores same factors, legacy removes them; no trait/profile/history/RNG mutations |
| D06 | Wounded/tired, saved missing values 0/positive/equal/greater/null | Match native load floors at main.js:6736/6745. Adoption respects health >=1, stamina >=0 and existing maxima; identity edits heal nothing |
| D07 | Profile change during craft/job/combat/sleep and failed idle storage write | Busy reason prevents change; no altered reserved values; write failure leaves model/buckets/stored bytes exact |
| D08 | Change current race table without changing supported profile revision fixture | Historical r1 profile keeps pinned r1 values; unsupported revisions reject instead of silently rebalance |

Numeric unit tests are insufficient for native application. Later browser proof
must include one enabled nonhuman race/height combination and one unchanged
legacy comparison. No equivalent source suite substitutes for actual native stats.

## G24-B2.T3 Quirks through real consumers

| ID | Existing route and comparison | Required assertion |
|---|---|---|
| Q01 | Sleep in actual unlocked housing, early/late variants at each time boundary | Stamina increment equals furniture-adjusted base x proposed factor, capped; health/time/XP unchanged; day crossing and split/reloaded ticks agree |
| Q02 | Sleep with snorer and at full health/stamina | Only stamina x.98 when missing; no overfill, surprise pursuit or leaked speech; disable returns identity |
| Q03 | Eat Stale bread with bread_sensitive, hunger off then on | Basic meal 60 -> 54 incoming duration; real item count follows native used flag; no new damage or hunger penalty; existing fullness/consumable XP unchanged |
| Q04 | Food applying Slight food poisoning 20 and 45 with tolerance | Duration 16 and 36; other beneficial duration intact; existing group/replacement behavior retained; no bonus Resistance XP |
| Q05 | Native combat in normal light with sharp_eyes enabled/disabled | attack_points x1.03 in actual native fighter; identical seeded draw stream in controlled unit test; hit outcome can differ at a chosen threshold; ordinary random play need not guarantee victory |
| Q06 | Same fight in non-normal light or unsupported battle host | Factor 1, no stale bucket or knowledge leak. Do not claim other hosts adapted |
| Q07 | Arrange Neri's real trail test, preview/start pursuit.conceal with faint_scent | Preview and debit 1 stamina instead of 2; due remains +2 min; actual trail conceal effect unchanged; no new smell sense. Cancel keeps the disclosed spent stamina |
| Q08 | Concealment without quirk, authority pursuit, stale/remote request | Native ordinary costs/gates unchanged; authority still ignores ordinary concealment; invalid action spends nothing |
| Q09 | Native items craft with steady_hand, recipe chance .70 and .99 | Shared preview/execution .72 and 1.00 after Work Ledger, before native count/XP arithmetic; components/equipment unaffected |
| Q10 | Recursive craft batch success followed by failed write; discovery update included | Earlier durable batch retained; rejected batch restores stock/output/XP/body evidence; no post-rejection message or rerolled trait |
| Q11 | Multiple modifiers, suppressed instance, profile off, repeated query | Typed products/sums once, clamp once, pure query; same state/RNG/clock/knowledge before and after previews |
| Q12 | Unknown/hidden trait active through supported consumer | Effect works but UI/log/DOM/ARIA expose only observed symptom; no sealed name, ID, unseen counts or ancestral claim |

Q05 uses src/models/combat.js, not just rollCombatStrike. Q07 extends
simulation preview, actual reserved costs and pursuit tests. Q09 extends the
native transaction tests with a real body evidence field, rather than only
calling the chance helper. Treatments other than profile suppression are
extension proposals and receive no false implemented acceptance case.

## G24-B2.T4 Save, reload, export, import and rejection

Use a generated pre-v0.6 baseline, a v0.6 baseline, a new enabled record, an
unenrolled record, an active body-practice job and a compatible possession
fixture. Run each through the actual envelope and selected browser journeys.

| ID | Operation | Required result |
|---|---|---|
| P01 | Manual Save -> refresh same origin while paused | Exact body state and split fields, pinned profile, native observable stats/address, paid job costs/due and preexisting resources retained; no reroll or replay |
| P02 | Real Export button -> capture file -> decode | character.body_record exists exactly once and Unicode preserved; bio compatibility fields retained; ordinary export reward isolated or accounted for |
| P03 | Select that literal exported file with Import on fresh candidate origin | Actual input handler, iframe preflight, guarded write and page reload complete; compare body record and native observables, not merely returned decoder JSON |
| P04 | Export imported life -> import again | No duplicate cards, receipts, enrollment, NPC evidence or cumulative multipliers |
| P05 | Malformed body/null/schema2/revision999/duplicate card/invalid path/NaN-like invalid numeric/string payload/unsupported profile | Rejected before storage or active mutation; last-save bytes and current life retained |
| P06 | Real-loader failure after structural validation; quota failure at guarded write | No target-save replacement, no migration grant or post-durable message; read-only competing tab cannot publish |
| P07 | UTF-8, old unmarked Latin-1, v0.6 unmarked UTF-8 imports | Existing codec support remains; normalized legacy profile identical through all paths |
| P08 | Record with eight quirks (one LQ3 variant active), two physique/two constitution cards and Unicode observations | Measure actual UTF-8 and UTF-16 envelope delta against SPEC targets; larger valid record retained; shared-origin budget counts backups/other keys |
| P09 | Body record at target size in origin near 4 MiB limit; export after storage-full | Last stored life untouched on failure, export remains recovery route; no silent truncation |
| P10 | Suspended missing optional pack, then export | Existing suspended-envelope export retains opaque body record; no fresh defaults invented while content unavailable |

Use tests/save_files.test.js failure spies and existing real-loader preflight.
Add validation before live load mutations. Compare model snapshot, storage string
and write counts on rejection. Date/export-reward/life-record observations are
separate expected native changes, never excuses for differing body state.

## G24-B2.T5 Desktop UI and delivery gates

| ID | 1366x768 candidate journey | Observable gate |
|---|---|---|
| U01 | Fresh enabled creation -> bio, then legacy import -> bio | Independent identity/address/body information; exact resolved factors and truthful neutral message; no stale cosmetic promise |
| U02 | Default Workspace, existing saved layout, widened character module | Visible useful summary, readable 14 px body text, independent action panels preserved; no forced geometry reset |
| U03 | Expand body details and long known biography | Internal reading scroll, keyboard reachability, no overlap/clipped apply controls; no new separate window |
| U04 | Current action with known/unknown quirk; actual profile apply | Appropriate unit and source explanation; hidden data absent from DOM/ARIA/tooltips; busy reason is actionable |
| U05 | Keyboard and laptop 150% zoom/text enlargement | Focus visible and returns correctly; controls usable without hover; no mobile workstream required |

Recommended later execution order: focused migration/dial tests, affected native
body/pursuit/craft/save regression slice, one candidate build, then fresh-origin
native play and literal-file persistence. Run the repository's broader required
checks once when integration is ready. This lane does not authorize a shared
checkout build or claim any proposed test passes.

Technical completion requires real native consumer evidence and actual
Save/reload/Export/literal Import on the same candidate. Source test success,
built assets, served assets and browser behavior are distinct evidence layers.
Human balance/fiction/layout acceptance remains separate. Mobile, broad genetics,
all-world social laws and hereditary prestige are outside these gates.
