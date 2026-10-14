# P25: episodes and chapter recaps

2026-10-14. **PROPOSAL ONLY.** Extends root [T1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#t-presentation) and [E3](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#e-player-control-and-idle-fit). [P14 CHRONICLE C1-C5](../p14/CHRONICLE.md) owns evidence selection, coverage and recap editions; [P12](../p12/) owns sifted threads; [P15](../p15/) owns original rendering. P25 adds editorial boundaries and presentation. Field names are logical integration offers, not existing APIs or selected save schemas.

## T1.1: a session is a reading boundary

Group a played interval into an episode without requiring that a quest finishes during it. A chapter can span several episodes and several threads can span a chapter. Opening a tab, refreshing, importing, leaving a panel and closing the app are different from advancing the world's clock. Closing an episode creates no reward, world tick, deadline or character action.

Proposed boundaries: player chooses **Close episode**, a life/branch/world transition offers a close, or a return recap identifies a new reading session after a saved acknowledged cursor. Quiet played intervals may be folded editorially; urgent matters remain live and visible. Do not mint an episode on every autosave or every browser visibility change. A close checkpoint should capture the last committed sequence, then freeze a supported P14 edition. A failed write leaves the previous edition/cursor intact. A crash leaves an open episode resumable, rather than needing a reliable unload handler.

Logical editorial reference: episode ID, life/branch/instance scope, coverage interval and clock mapping, start/end sequence, included P14 edition and P12 thread refs, title/recap renderer revision, known-evidence revision and closed/open status. Cross-world journeys use separate local intervals linked by an actual crossing receipt; never subtract unrelated world clocks. Store no second receipt archive here. Old saves begin episode coverage at enrollment; retained legacy biography stays labelled **legacy summary**, with no reconstructed missing scenes.

## T1.2: generate titles from what is known

Use a deterministic P15 template over projected retained outcomes, with stable time/ID ties. Prefer a player's pin, an actual turning point or an ordinary shared pursuit. Proposed original patterns: **A promise kept**, **The repaired cart**, **Work beside the river**. They require their named basis; a warning without a completed rescue cannot produce a rescue title. Failed attempts, quiet training, refusal and unresolved work have their own neutral patterns. The fallback is **Episode 4: Village, recorded interval**, not an invented dramatic event.

Title generation is editorial content creation beyond choosing an event card. It does not select the next event, foreshadow an unread card, consume gameplay RNG or read a hidden candidate list. If a future literary title grammar uses variety draws, P15/P1 must freeze an editorial draw/result at close, separate from gameplay streams. Preview never draws. Changing titles or reading again cannot reroll anything. Player rename is an annotation with the old generated title retained, not a deed or power grant.

A title stays fixed as that edition's historical heading. Later knowledge may support a separately requested revised edition, with a correction note. No retroactive revelation in the old heading. Source horizons and spoiler settings apply to title, synopsis, filenames and contents entries, not only paragraphs. Sealed records stay ID/route/status only in agent reports; an undiscovered secret does not cause a suspicious title or missing-entry count.

## T1.3: recap in three short parts

Reuse P14's cursor/coverage contract: **What changed**, **Newly learned**, **Still open**. Show two to four factual sentences as a proposed reading density, expandable to the full episode. Completed work, received reports and live pending matters have different labels. If actual recorded time stayed frozen, say **No recorded world time passed**; if coverage was lost, say **This interval has no retained detailed record**. Neither means the hero did nothing.

Original synthetic fixture: the hero accepted a repair, supplied timber and completed it with a maker. A later report disputes who deserves credit. Recap: **The cart repair finished with the maker's help. You later received a disputed account of the work.** Each clause links its supporting receipt or claim. It must not invent an apology, reconciliation, admiration, paid reward or private motive. Firsthand receipt evidence is SHOWN; a speaker's account is STATED and attributed; an editorial interpretation is INFERRED. Confidence is separate from source mode.

**Still open** reads current owner state, stamped **as of now**. It links to the actual response panel. Closing/acknowledging a recap marks only a reading cursor; it does not accept a choice, spend goods, excuse a missed obligation or move an expiry. A previously known event learned through a new correction belongs under **Newly learned**, with occurrence and learned dates separate.

## T1.4: desktop sketch and graceful absence

Proposed 1366x768 workspace inside the existing shell. Reserve roughly 80 px for shell/navigation; use the available ~680 px for bounded independent panes. Comfortable body text, approximately 16 px and 60-75 characters per reading line; measurements require rebuilt verification.

```text
Stories > Episodes    Life: current    Branch: current    [Export preview]
+----------------------+--------------------------------+---------------------+
| Episodes  ~240 px     | Reading pane ~680 px           | Evidence ~350 px    |
| 04  Work by the river | Episode 04 [Rename] [Close]    | Basis of selection  |
| 03  A promise kept   | Recorded: local day 3, 08-11h | SHOWN: repair R17   |
| 02  Quiet practice   | What changed ...              | STATED: account C2  |
| [Open episode]       | Newly learned ...             | [Show receipts]     |
|                      | Still open: [View responses]  | Coverage: partial   |
| independent scroll   | [Read full chapter]           | independent scroll  |
+----------------------+--------------------------------+---------------------+
```

At 1600x1000 keep the text measure similar; grow the episode list and evidence pane, and show more rows vertically. Do not stretch paragraphs across the whole desktop. Evidence can collapse into an in-pane drawer at 1366 if enlarged text requires room, while list and reading remain side by side. Mobile optimization deferred.

| Missing input | Proposed degradation |
|---|---|
| No episodes/new enrollment | Welcome line and current live matters; no invented earlier chapter |
| No sifted arc | Group known receipts by interval with **Ungrouped moments**; no artificial plot closure |
| No title basis/renderer | Stable episode number and safe known place/date; omit unknown place/date |
| No retained receipt detail | P14 safe summary with **summary only** and coverage; disable exact reconstruction |
| Missing source pack/revision | Retained approved safe edition remains readable if its policy permits; unsupported controls unavailable; no current-source substitution |
| No clock mapping | Display clock-domain-labelled order/interval; no guessed calendar date |
| Long episode | Short recap first, paged sections and search over visible text; no silent factual truncation |

## T1.5: future gates

All OPEN: repeated view/close/reload retains boundaries, title and next gameplay draws; late reports revise knowledge without backdating occurrence; crash/failed-save leaves cursor honest; pending/closed episodes survive Save/reload and literal-file Import; unsupported older coverage is labelled. At rebuilt 1366x768 and 1600x1000, read a recap, inspect basis, reach an open matter and return without lost focus. Export gates in [EXPORTS U0.2](EXPORTS.md#u02-one-export-gate-for-every-format) apply to episode extracts and recaps too. Human title/prose/pacing acceptance is separate.
