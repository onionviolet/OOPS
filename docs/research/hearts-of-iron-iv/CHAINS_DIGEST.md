# Campaign-chain digest

Scope and counts: [REPORT](REPORT.md). Paths are relative to its HoI4 installation root. SHOWN script declarations are not runtime proof.

## H-F1: Grammar and composition

SHOWN: Clausewitz text uses named assignments, nested braces, repeated keys, scalar lists, quoted strings, numeric comparisons and `#` comments. It is not JSON: repeated `focus`, `option`, `path`, `modifier` and other fields are meaningful. Script constants such as `@1936` occur in `common/technologies/NSB_armor.txt:4`. Read triggers in the scope where they run; a country tag block, state number, `ROOT`, `FROM` or `PREV` can change which entity an effect or test addresses. See `documentation/effects_documentation.md:2943` and `events/Germany.txt:242`.

| Part | Author fields / join | Evidence |
| --- | --- | --- |
| Focus tree | `id`, weighted country selector, default/reset policy, shared-node references; each focus has layout, cost, prerequisites and completion reward | `common/national_focus/generic.txt:18` |
| Focus gate | `available`, `bypass`, `mutually_exclusive`, multiple prerequisites, AI weights | Same file:76, 391, 594; `common/national_focus/germany.txt:14825` |
| Decision | Category plus stable decision ID; allowed/visible/available, cost, repeat delay, active duration, modifiers and completion/removal effects | `common/decisions/_generic_decisions.txt:65`; `common/decisions/_documentation.md:1` |
| Mission | Explicit activation, timeout duration, cancel trigger, completion/timeout/removal effects; mission extension can use variables | `common/decisions/GER.txt:92`; `documentation/effects_documentation.md:661`, 1051 |
| Event | Namespace and ID, event kind, trigger or explicit dispatch, MTTH, immediate effects, options and AI chance | `events/Germany.txt:5`, 234, 702, 10057 |
| Hidden event | Suppresses an event window while executing immediate scripted work; differs from hidden_effect, which hides effect display | `events/Germany.txt:10057`; same file:430 |
| Scripted effect | Named reusable effect body called by identifier; nested if/else_if avoids accidental multiple level advances | `common/scripted_effects/GER_scripted_effects.txt:3` |
| Scripted trigger | Named predicate body centralizes game-rule/content or capability gates | `common/scripted_triggers/diplomacy_scripted_triggers.txt:34`; `00_scripted_triggers.txt:1280` |
| On-action | Engine lifecycle hook contributes effects or weighted random events, with hook-specific actor/target scopes | `common/on_actions/_documentation.md:1`; `00_on_actions.txt:1`, 378 |

INFERRED: tree edges let authors structure long objectives; decisions handle nearer, repeatable work; events carry responses and off-screen consequences; macros share bounded operations; on-actions connect authored content to engine lifecycle. These families compose rather than form a single linear quest engine.

Focus prerequisites have an OR-within-group / AND-between-groups pattern in usual HoI4 authoring. SHOWN this install repeats prerequisite blocks (`generic.txt:597`) and lists multiple focus references within some blocks; the exact evaluator is native and not read here. Treat that grouping interpretation as INFERRED, not a reason to implement it blindly. `available` and `bypass` must be separately specified in an adaptation.

## H-F2: A traced diplomatic chain

SHOWN, `common/national_focus/germany.txt:14825` to 14968: the pact focus requires another focus, excludes the opposing pact, tests government/subject/military conditions, then schedules `germany.11` for SOV after one day. Completing the focus initiates an offer; it does not itself prove acceptance.

SHOWN, `events/Germany.txt:234`: event `germany.11` is triggered-only. The accept option applies claims, a 730-day idea, a global acceptance flag and delayed `germany.12` to GER. Refusal costs political power, records an opinion change and schedules `germany.13`. AI chance has base and conditional multipliers. See lines 430, 441, 468 and 497.

SHOWN, same file:476: accepting response installs a non-aggression relation, other-country opinion changes, a 60-day USA flag and a delayed news event. Later conditions can use the saved result instead of replaying the offer. `germany.14` has an MTTH block at line 702; MTTH is a stochastic waiting parameter, not a promised deadline. Its exact polling/hazard formula is not exposed by the read scripts.

INFERRED YAIRPG fit: a Village institution can fund work, send an offer to an actor, retain refusal and alter the next route. Save the actual recipient and committed response so a reload or different world's similarly named event cannot pay twice.

## H-F3: Mission loop with durable consequences

SHOWN, `common/decisions/GER.txt:92`: the MEFO mission is explicitly activated despite `allowed = always no`, carries a 180-day timeout, cancels when its modifier ends, and uses flag/variable branches on timeout. Its continuation branch updates the bill counter and reactivates the mission. The cancel decision below it is repeatable and calls a named stopping effect. This is a better repeatable-work reference than assuming every HoI4 objective is permanently once-only.

SHOWN source also contains `fire_only_once`. Do not copy that as an account-wide YAIRPG rule. PROPOSAL: separate idempotence of an already committed instance from availability of a new fitting instance. Scope cooldowns and exclusions to world, actor, institution or branch.

## H-F4: How authors limit collisions

| Layer | What it prevents | What it does not prove |
| --- | --- | --- |
| Namespace / ID | Same numeric event suffix can exist in different namespaces | Cross-world scope safety or correct references |
| Country/state flags and variables | Record actor-local phase, magnitude and timing | That global flags are safely isolated |
| Triggered-only event | Avoids autonomous trigger polling for an explicitly dispatched step | That its caller dispatches once |
| Focus prerequisites and exclusions | Restrict progression paths | Permanent exclusion is desirable for our solo game |
| `allowed` / visibility / availability | Restrict eligible actors and explain current blockers | UI discovery and hidden truth are automatically safe |
| Scripted gate and effect reuse | Reduces repeated logic and centralizes capability alternatives | Macro body is correct or atomic |
| AI plan enable/abort and weights | Biases an eligible choice and stops an invalid plan | A weight is an eligibility condition or legal command |

STATED shipped decision docs distinguish update cadence: allowed at start/load, target prefilters daily, visibility and availability at UI refresh. They recommend narrow state selectors to avoid testing every target each frame. `common/decisions/_documentation.md:6` to 51. PROPOSAL: YAIRPG can cache admission and narrow candidates while rechecking commit legality through the existing command owner. Do not treat cached UI state as authority.

## H-F5: Contradiction to retain

SHOWN, `common/on_actions/00_on_actions.txt:384`: the nuke hook sets `first_nuke_dropped`, then tests NOT has that same flag before calling `generic.8`. INFERRED under sequential effect semantics, that branch appears unreachable as written. No launch was performed to prove the symptom. This is evidence against assuming thousands of authored scripts are automatically collision-free.

PROPOSAL: lint named transitions for write-before-test mistakes, missing targets, conflicting exclusions and duplicate effects. Validate one actual chain from eligible start through aftermath and save/import. Do not add another scheduler or universal rule engine solely because HoI4 has many macros.
