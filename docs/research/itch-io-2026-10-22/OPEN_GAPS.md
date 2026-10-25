# itch research: open gaps for future work, 2026-10-22

Weibao asked to save the remaining gaps from the itch.io research wave so they
can be picked up later. This file consolidates them. Each batch's own "Gap
ledger" keeps the full rows with locators. The
[YAIR gap check](YAIR_GAP_CHECK.md) keeps the YAIR-side verdicts. The
[play queue](PLAY_QUEUE.md) keeps the games and their play checks. Gap diagnoses and proposed implementations are not accepted decisions (AD32);
the later human selection of OG19-OG23 is cited separately below. Codes `OG1`+ are stable; extend them, do
not restart them.

Status words: **open** (readable, not yet done), **blocked** (needs a tool
fix or route first), **implemented** (source and consumers inspected; proof scope stated),
**receipt-proven** (named check reported by its owner, not rerun here), **play** (only play can settle it), **closed-unreachable**
(server-side, download-only or unreadable, recorded so nobody retries blindly).

Current status reconciled on 2026-10-23 in [R2 report](../../gm/dispatch/overarching-reconciliation-2026-10-23/R2_REPORT.md).
Earlier row wording is preserved verbatim in [R2 history](../../gm/dispatch/overarching-reconciliation-2026-10-23/R2_SUPERSEDED.md).
Research/tool receipts, wired source, played behavior and app delivery are separate states.

## OG-A: tool gaps that block several reads

Tool outcomes below qualify the original blockers; recovered code still needs its own reading proof.

| Code | Gap | Blocks | Next step | Done check |
| --- | --- | --- | --- | --- |
| OG1 | Shared decoder now accepts v100 and v101 (inspected `SUPPORTED` and version guard); registry updated. | Cartographomancer, CHROMA, Alchemyst Apprentice decoding unblocked | [W3 tooling receipt](W3_TOOLING_NOTES.md#og1-godot-43-bytecode-v100-in-the-shared-decoder-done) reports 90/17/32 decoded with zero errors plus v101 regression; no rerun here | **receipt-proven** decoder done check; reading recovered logic remains separate |
| OG2 | Method-body recovery remains blocked. The W3 receipt supersedes the earlier blanket support claim: Cpp2IL advertises some newer metadata support, but its Levers v106 attempt failed; v108 was not found. | Slime Reborn, Surviving Magic Academy, Terraformental; Beggar's Life | [W3 tooling receipt](W3_TOOLING_NOTES.md#og2-newer-dumpers-for-metadata-v39--v108-and-wasm-report-only), dated results rather than a fresh release/version claim | **blocked**: no method bodies recovered; listed v39/v108 titles not retried |
| OG3 | Dumper runs now recorded: Looper v31, Path Past v29 and Astroecologist v24.2 yielded names/fields/RVAs; Stoneheart and Levers remain blocked or strings-only. | Looper, EXPLORE, ECONOMY | [W3 tooling receipt](W3_TOOLING_NOTES.md#og3-il2cppdumper-on-saved-metadata); preserve empty-body distinction | **partial receipt-proven**: three type/name dumps; method bodies and two builds open |
| OG4 | Craftomation 101's pack is encrypted. The published engine key failed in three byte orders. | CRAFTING | Low priority. Retry only if a key route appears. | n/a |

## OG-B: readable work not yet done

The original survey recorded that these five sessions had not received the
gap-pass message. Batch verification lines remain the reading baseline; the
W3 reading and tooling receipts below qualify the current rows:

| Code | Batch | Open gap |
| --- | --- | --- |
| OG5 | [CULT_REST](BATCH_CULT_REST.md) | [W3 reads ledger](BATCH_W3_READS.md#gap-ledger) reports Idle Xanxia combat and Qinghe battle model read. Dao timed out, Nivrael is Telegram-only, Text Cultivation native-only, Left Hand outside cultivation; no longer four readable untouched titles. Reader locators were not independently source-checked by that coordinator; pacing still needs play. |
| OG6 | [LIFE_A](BATCH_LIFE_A.md) | [W3 reads ledger](BATCH_W3_READS.md#gap-ledger) reports Incremortal unlocks, Lifeidle events, Lowmoor graph, Town Tycoon fishing/ski and God of Ashes events read. Lowmoor travel prose in `lowmoor-boot.js` remains unread; Beggar's Life remains OG2-blocked. Receipt is reader-reported except its YAIR routine spot-check. |
| OG7 | [POTION](BATCH_POTION.md) | OG1 decoding is now receipt-proven for CHROMA and Alchemyst Apprentice; the recovered logic still needs reading. Hidden Grimoire and the Unity titles retain the batch's limits. |
| OG8 | [PROCGEN](BATCH_PROCGEN.md) | [W3 reads ledger](BATCH_W3_READS.md#gap-ledger): Eigengrau creation/leader partly read; faction types/allies/rivals/stability and plot-hook content open. Talk of the Town `person.py` read, knowledge hooks found rather than a model; `relationship.py` unread. Nothing Beside Remains text recovery unchanged. Reader locators not independently rechecked here. |
| OG9 | [SCOUT](BATCH_SCOUT.md) | Peasant to King beyond its help text. Whether Noble's player build calls its LLM client is still undetermined. |

From the ledgers that do exist, the open and readable items worth doing:

| Code | Batch | Open gap |
| --- | --- | --- |
| OG10 | [BROAD](BATCH_BROAD.md) | [W3 reads ledger](BATCH_W3_READS.md#gap-ledger) reports spouse-pay source traced; pay opt-out remains untraced. Static reader receipt, not executed or independently source-verified by R2. |
| OG11 | [MAGIC](BATCH_MAGIC.md) | W3 recovered the `Clause` Effect/Aspect/Target shape and grading signatures; the actual rune-to-consequence table remains in stripped serialized assets. **open**, narrowed by [tooling receipt](W3_TOOLING_NOTES.md#what-the-dumps-show). |
| OG12 | [EXPLORE](BATCH_EXPLORE.md) | Still not located after three searches per [W3 reads ledger](BATCH_W3_READS.md#gap-ledger). Its suggested next lead is Path Past's credits link; no further search selected here. |
| OG13 | [BROAD](BATCH_BROAD.md) | Promote any of the about 23 listing-only titles (the screen table's later rows) if a later topic needs them. |

Items marked low value in the ledgers stay there and are not repeated here.

## OG-C: needs play

Static reading cannot settle these. They are tied to rows in the
[play queue](PLAY_QUEUE.md):

- Feel and pacing for every decoded game. No game code was ever executed.
- Idle Fantasy Shop: is the acceptance breakdown shown to the player?
- Medieval Merchant Simulator: what the serf and free status does to loyalty.
- Hacksmith: does the shaping step read as shaping?
- Age of Iteration: wear decay feel.
- Runemaster: does compatibility actually prune the build menu?
- Looper: does the rune's aspect affect the outcome?
- DRGN scene variety, Grim Brood hide reading, Cat Cove Inn matching.
- Path Past The Mountain: the pedometer error model.
- Cartographomancer: noise on walkers.
- Stoneheart: do restored settlements change on revisit?
- Emerald Woods: does the per-run explanation change?
- Path of the Idle Cultivator: real-time arena, Weapon God fights, Archon
  scripts.
- Great Expanse: the AI-assisted claim (needs the developer's statement or
  play).
- Parser and detective games (Hadean Lands, Anchorhead, Teide and others):
  story files are not readable source.

## OG-D: closed-unreachable

Recorded so nobody retries blindly. Reasons are in each ledger.

- **Server-side:** the Fate system and duels in Path of the Idle Cultivator;
  Ascension Tower's rules; Coop Catacombs (PHP/MySQL); princi-pal judging;
  Beanlings Wildlands; DOGMA++; The Liars' Line; Office Immortal sync. Also
  Heavenly Path's Living Jianghu and Sects Become Real, which are not in the
  served build.
- **Download-only or no web build:** Sovereign Tower, Flawed Heist, The Gods
  are Hungry, Alchemyst Apprentice's Windows zip, and six magic titles listed
  in BATCH_MAGIC. These would need Weibao to download them; agents do not
  download native builds.
- **Unreadable as served:** Path of the Idle Cultivator's changelog before
  0.3.5 and its Steam mod loader; Little Chef recipe values (IL2CPP, not
  serialized); Terraformental localisation CSVs; Godot wasm engine binaries.

## OG-E: YAIR-side gaps (design follow-ups, not research)

The original [YAIR gap check](YAIR_GAP_CHECK.md) counted 74 claims: 33 gaps,
25 partial, 11 existing and 5 unclear. Those are dated survey totals, not current
absence counts. OG14-OG18 retain their original gap identity with current status:

| Code | Gap | Related proposal | Status (2026-10-23) |
| --- | --- | --- | --- |
| OG14 | Original gap: chronic conditions or isolation effects absent | IM30/IM31; EMERGENT | **implemented** aging/contact domain and native configuration; earlier implementation receipt does not close long-life IM31/IM53 or companion-contact proof |
| OG15 | Original gap: one successor without inheritance law or parentage traits | IM3, IM8 | **wired; bounded receipt-proven** law/heirloom/codex journey in [lives receipt](../../gm/dispatch/itch-wiring-2026-10-23/lives-carry-wiring.md). Newer lineage producer and `heirLine` consumer exist; kin fallback in that older receipt is historical, not proof that no producer exists. Specific kin-law journey remains unverified here; events tracked at OG19 |
| OG16 | Original gap: no standing routines/completion unlocks | Incremortal | **wired**: `home_domain.js` invokes household staging; `routineCounts` reads actual completions, `runRoutines` stages funded services. This reconciliation adds no runtime or browser proof |
| OG17 | Original gap: no credit, insurance, market memory or faction tiers | IM32; ECONOMY | **wired**: trade imports standing host, domain registers save/load, panel and tick; loans, insurance and memory in source. Generic venue/status bundle and crossing policies IM37/IM46 remain separate gaps; persistence not rerun here |
| OG18 | Original gap: no cross-life discovery codex | IM21 | **wired; bounded receipt-proven** `lives_carry_domain.js` registers codex and ledger, imported by `ui_extras.js`; [lives receipt](../../gm/dispatch/itch-wiring-2026-10-23/lives-carry-wiring.md) covers heir/save roundtrip. Paradise crossing and every-world carry are not established |

Unclear items to resolve:

- **G08:** the flat-gauge run (IM31).
- **G38:** a delayed-letter evidence route. An event feed exists in
  `src/event_feed.js`, but no letter route was found.
- **G45:** a mood, feature and terrain prompt triple.
- **G66:** "7 files" of weight modifiers. This claim is probably wrong.
- **G11:** the lethal-task guard for away time. Largely moot under AD16 and
  AD19.

Added 2026-10-23: Weibao asked for the leftover items despite AD33
([record](../../USER_VISION.md#leftover-itchio-items-built-as-small-per-world-dials-2026-10-23)).
They were selected as small per-world dials; the inspected implementation and
remaining gaps below supersede the blanket open status. Design interactions stay in
[round 4](../ITCH_IO_IDLE_SCREEN_2026-10-22.md#more-to-consider-round-4-2026-10-23-leftover-items-and-interactions):

| Code | Leftover item | Status | Round 4 |
| --- | --- | --- | --- |
| OG19 | Orphan, grief and came-of-age events | **wired; receipt-proven** hardship-Village events, choices and persistence at 1536/1920 per [W3 events](W3_EVENTS_NOTES.md). Introduce/mend and default grief browser gaps, heir reset and simulation-person gaps remain. IM47's exact contact/obligation invariant is not established by this receipt | IM39, IM47 |
| OG20 | Genetics and companion wishes | **wired, implemented-unverified here**: `lineage_domain.js` panel/save, `heir_inheritance.js` lineage handoff; `companion_roster.js` wish/absence/return consumer. Qualities are descriptive, not stat grants. Referenced `W3_LINEAGE_NOTES.md` is absent at inspection, so no matching desktop/persistence receipt is claimed | IM33; tests exist for wishes, not run here |
| OG21 | Diplomacy and schism | **wired; bounded receipt-proven** generated history events and request-time old-shape upgrade in `lore_history_state.js`, shown through story insight per [W3 institutions](W3_INSTITUTIONS_NOTES.md). Playable negotiated diplomacy and oath-creditor obligations (IM49) are not proved by history events | IM41, IM49 |
| OG22 | Skill floor | **wired; receipt-proven** default-off per-world rust and near-miss records via `configureSkillRecords`, native bonus bucket and story insight per [W3 institutions](W3_INSTITUTIONS_NOTES.md). Full floor unit-only; no Skills-panel visual proof or shared aging-floor owner established | IM40, IM48 |
| OG23 | Spatial homes (authored, not procedural) | **wired; receipt-proven** manor 4x3 fixture grid, paid move, household bed-score consumer and save roundtrip at 1536/1920 per [W3 spatial](W3_SPATIAL_NOTES.md). This differs from IM50's proposed rooms: no per-person beds/doors/walls, no other homes; keyboard proof retains pointer interception gap | IM43, IM50 |
| OG24 | Panels stating reasons in parts (IM27) | audited; gaps listed, wording fix closed for the Treat button | panel audit table |

The earlier line "spatial homes stay deferred" is kept as dated history: it
held until 2026-10-23.

## OG-F: proposal backlog

The LATER / DELEGATE rows in the
[screen report](../ITCH_IO_IDLE_SCREEN_2026-10-22.md) are the build-side
follow-ups, each with level, effort and done check:

- IM8 to IM13 (round 1)
- IM21 to IM26 (round 2)
- IM31 to IM33 (round 3)
- IM34 to IM53 (round 4; IM34 done)

Pick by sequencing against PROJECT.md priorities, not by this list's order.


## Cultivation absorption refinement, 2026-10-24

The requested [mechanic-by-mechanic current OOPS check](CULTIVATION_ABSORPTION_CHECK.md) maps 42 named reference entries through 154 rows, with six source-limited cultivation entries and one non-cultivation exclusion. Its **CG01–CG30** ledger saves the missing or partial mechanisms without restarting OG/IM codes. The [evidence manifest](CULTIVATION_ABSORPTION_EVIDENCE.json) binds the current dirty source inputs and search scope.

This supersedes old cultivation-side absence shorthand where the new report inspected a live consumer: pledges/tempering, crafting tolerance, lineage, household awakening/routines, spatial sleep and trust are wired at bounded scopes. It does not close their remaining effect, gameplay or cross-life proof gaps. A descriptor, recorded trait, reference guide or old passing receipt is not complete absorption. Source comparison and documentation only; no new gameplay or app-delivery proof, implementation dispatch, commit or push.
