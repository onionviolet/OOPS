# Installed-game rules and emergence research flow

Saved 2026-10-15 at Weibao's explicit request: continue unread Qud skills/mutations/cybernetics and cleanup, consider further Steam-library decompilation, dispatch decompiler and auditor for Rain World and Dwarf Fortress, and preserve this flow. Research only. This workflow is a reference, not standing permission to launch games, install tools, delegate new work, implement, publish or modify saves.

## Five stages

1. **Recover authority and existing work.** Read PROJECT/USER_VISION and the owning dossier/checkpoint. Inspect active processes and write reservations. Existing workers retain their areas. Record a narrow output directory and exact research question; preserve unrelated dirty state. Use one extraction owner and one independent audit owner when delegation is authorized.
2. **Pin the installed input before extracting.** Resolve the Steam appmanifest to its actual payload; retain app ID, build/depot metadata and binary hashes privately. Do not equate a manifest with usable game content. Compare hashes with prior captures. Reuse matching files; decompile only missing consumers. If the build changed, keep a separate version namespace rather than mixing locators. Avoid retaining account identifiers in public metadata.
3. **Choose the route from actual format.** Managed Mono/.NET: existing ILSpy with update checks disabled, proper reference directory and pinned assembly. Readable scripts/data: preserve complete files and parse structure separately. Native binaries: reuse an existing stable disassembly project or perform a bounded static route with available tools; do not call raw strings or executable bytes recovered source. A native consumer gap stays a gap. Do not run game binaries, touch saves/config or install tools under this research-only packet.
4. **Trace a rule all the way to consequence.** Extract exact rule/data → state and perception → eligibility/AI choice → payment/action → world/effect consequence → feedback/memory → loss/expiry/cleanup. Include event order, integer arithmetic, units, ownership, target identity, random gates, duplicate/reapplication behavior and source loss. Test a claimed combination against both consumers. Preserve full raw bodies privately, exact file/method/line locators, input/output hashes and commands. Full capture is not full semantic reading.
5. **Audit and save a recoverable checkpoint.** An independent auditor checks the same pinned bytes, especially surprising claims, missing gates and cleanup. Label source-shown, inferred and native-unobserved separately. Validate hashes, ranges, links and raw-file ignore scope. Save a joined inventory with captured-only, selected windows, semantically traced chains, unresolved consumers and failed routes. Link to accepted YAIR owners only as comparisons; research findings do not select architecture or new priorities.

## Emergence lens E1-E8

| Code | Question | Example dependency to seek |
|---|---|---|
| E1 | What local rules can operate without a scripted outcome? | Material/body properties, phase, movement, injury, resource transfer |
| E2 | What does the actor actually know? | Current perception, stale tracking, remembered identity, uncertain target location |
| E3 | Which choices compete and when are they updated? | Threat, prey, friendship, weather, injury, utility weighting and update lag |
| E4 | How do actions alter shared world state? | Dropped objects, corpses, liquids/gases, barriers, jobs, social events |
| E5 | How does that state feed back? | Hazard navigation, retaliation, learned relationships, pursuit, needs and resource shortages |
| E6 | Which relationships survive interruption? | Memory versus allegiance, source-dependent effect versus independent timed object |
| E7 | What prevents runaway combinations? | Caps, duplicate guards, target exclusions, clone recursion, ownership and refund policy |
| E8 | What ends or escapes the chain? | Supplier death/removal, abstraction/unload, expiry, lost reference, cancellation, rehydration |

A plausible story assembled from declarations is an inference until execution consumers connect it. An AI offer does not prove planner selection; a selection branch does not prove a successful physical result. Native observation, if separately authorized later, should use disposable state and test one named uncertainty rather than personal saves.

## Output contract

| Artifact | Required contents |
|---|---|
| REPORT.md | Concrete findings, corrections to prior claims, linked deeper traces and limits |
| Private source/data archive | Full selected bodies/tables, receipts, commands, hashes, raw IDs/conditions; never imported into YAIR gameplay code |
| SOURCE_INDEX and read ledger | Exact input/version, source paths/hashes, symbols/ranges, capture versus read status |
| UNREAD and CHECKPOINT | Every captured-only type/file, partial windows, unresolved consumer and next useful bounded read |
| VALIDATION | Artifact consistency checks with named unrun native/save/UI gates |

## Initial lanes and ownership, dated first dispatch

| Lane | Extraction owner/output | Audit/integration output |
|---|---|---|
| Qud continuation | Root, [depth3](../qud-systems-audit-2026-10-15/depth-3/REPORT.md), extending the existing private archive | Root named traces and joined unread inventory; no independent Qud review claimed |
| Rain World | rainworld_decompiler, [extraction](../rain-world/emergence-2026-10-15/extraction/REPORT.md), raw under ~/.codex/research/rain-world-emergence-2026-10-15 | rainworld_auditor, [audit](../rain-world/emergence-2026-10-15/audit/REPORT.md) |
| Dwarf Fortress | dwarffortress_decompiler, [extraction](../dwarf-fortress/emergence-2026-10-15/extraction/REPORT.md), raw under ~/.codex/research/dwarf-fortress-emergence-2026-10-15 | dwarffortress_auditor, [audit](../dwarf-fortress/emergence-2026-10-15/audit/REPORT.md) |

Existing bf-caves-of-qud and bf-dwarf-fortress processes were observed at dispatch. Their older aspects areas remain separately owned. In particular, the new Dwarf Fortress lane reuses ongoing native-analysis results read-only instead of creating a competing native import. This ownership observation is dated, not a permanent process reservation.

## Native follow-through, saved from round2

The [current continuation](CURRENT.md) extends this method with actual native consumers. Use the evidence ladder explicitly: string/data anchor → valid decoded instruction/reference → exact binary/function boundary → identity through RTTI or a connected caller → concrete state writes and called cleanup helpers → dispatcher/expiry/source-loss behavior. Each step can be established without establishing the next.

For stripped MSVC C++ builds, type-descriptor strings, complete-object-locator RVAs, vtable backpointers and PE unwind ranges can locate methods more reliably than a nearby string. Confirm signedness, operand width, overflow behavior, compare direction, wildcard selectors, vector erase widths and caller order against independent disassembly when pseudocode controls a substantive claim. Preserve the raw outputs and exact byte hashes. A decompiler may return useful pseudocode with empty xrefs or a one-byte inferred function body; record those deficiencies and use independent bounds rather than claiming its function graph is complete.

Inspect IL for managed code when a surprising finding depends on sign or branch reconstruction. Check the exact linked math/helper implementation too. Keep finite-value assumptions and native-runtime behavior separate. No scripted bug reproduction or game launch is authorized merely because static analysis found a candidate.


## Queue, refund and save analysis, saved from round 3

Follow every request to the actor that owns the result. A success Boolean may mean no work requested, in-memory composition, a queued write, a completed callback or a physical action. Record each return and exception boundary separately. For persistence, trace snapshot admission and order, encoding, storage queue, actual backend, error propagation, decoding, entity creation, reference resolution and physical admission. A checksum mismatch can be reported while payload parsing continues. A backend can catch a write exception and permit an outer completion path. Preserve the exact conditional scope.

A transient collection needs explicit ownership analysis: how entries enter, leave their prior cell/inventory/scheduler, become active again, resolve on success, retry or disappear on failure, and survive owner expiry or serialization. Do not assume a generic contents walk visits arbitrary private fields. Separate serializer exclusion from proof that no other owner can retain or serialize the same actor.

For jobs, distinguish reservation acquisition, consumption, stack splitting, produced output, cancellation, ordinary reference release, accounting refund and physical material restoration. Bilateral unlink proves reference cleanup; only an actual quantity/resource delta and its caller policy establish a refund. For timed effects, definition destruction and active actor expiry are distinct. Recover timing fields, clock updates, terminal comparisons, source identity, contribution removal and recomputation, including overlap with another source.

Use independent reviewers for surprising decompiler branches. A single successful reconstruction may duplicate an attachment record while the next ordinary release removes all duplicates. Do not infer unbounded growth from one transition. Keep the next unread consumers and exact source windows in the lane owners linked from [CURRENT](CURRENT.md).


## Alternate ownership and snapshot order, saved from round4

When a transient queue is omitted, follow other saved owners before inferring loss. Distinguish a full-body enrollment, a token reusing enrolled identity, an ID-only link, world placement, activity admission and reconstructed queue membership. Check body-table and reference-wrapper serialization order. A damage-history field can preserve a contextless actor while a social-memory filter rejects it; names alone do not establish retention. Deserialization may reconstruct data without making an NPC physically present or eligible for turns.

Trace every output count to the pointer receiving it. A new object's positive count assignment is not a refund to an input; an actor's post-work counter is not an item stack. A function called cancellation can serve ordinary completed-work cleanup too. Recover return registers and separate output bytes from actual caller instructions when the decompiler signature omits them. A bounded negative refund result should name the exact next case-specific failure/restore edge, not trigger another broad neighboring decompile.

For save timing, identify when nested data becomes immutable strings versus live references. A top-level serializer can combine an old NPC snapshot with freshly computed progression. Follow intervening callbacks, custom extension hooks and special modes before stating the scope. Returned transfer queues require an actual consumer: latch, clear, parse, tick, admit, realize and durable acknowledgement are separate steps. A field named spawned can record attempts without any success reader. Preserve partial-failure order and current-process versus last-on-disk state separately.


## Recovery selectors and exception ownership, saved from round5

Recovery needs both a retained actor and an actual selector/caller that can supply it to placement. A command scanning cell occupants cannot select a detached object merely because some relationship or attribution field preserves its body. Effects, HP, credit and metadata can remain live on a contextless body without physical activity. Record capability, selection, attempted action and checked placement separately. Compare postconditions when AddObject-style APIs return the input even after rejection.

For refund searches, trace quantity and dimension changes on exact pointers. Splitting and output consolidation have positive counts without restoring a consumed input. Follow exception metadata and exact cleanup funclets to identify which allocation is freed; freeing new output is not input rollback. Absence of a local handler does not prove absence of outer compensation. Switch from failed huge decompilation to bounded instructions, and retain the failed receipt and warning rather than laundering it into complete source.

Outer exception handling must enclose the specific call. An unrelated catch elsewhere in Update is not a transfer retry. Distinguish same-process latch state, pending-process resume, newly allocated process, revived in-memory starvation state, retained backend key and durable disk/cloud read. For extension callbacks, inspect base implementation, registry mutation/registration evidence, invoke order and exception restoration. A static main-assembly absence is not proof about a live registry or external plugins. Separate core and campaign save requests even when one method issues both.
