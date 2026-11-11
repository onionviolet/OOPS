# Mind meters digest: Cultist Simulator and Book of Hours (FRC48, 2026-11-10)

Digest of what the two games' captured notes say about dread, fascination, despair, fatigue and soul-style meters, for MND and RCL5. Paraphrased; no source text copied.

**Source limit (read first).** The private snapshots these notes point to (`~/.codex/research/cultist-simulator/build22090405`, `~/.codex/research/book-of-hours/22091683`) are not on this disk now. Everything below comes from the committed notes ([Cultist FINDINGS](FINDINGS.json) F2, F3, F4, F7; [Cultist REPORT](REPORT.md); [Book of Hours FINDINGS](../book-of-hours/FINDINGS.json) BH02, BH06, BH07, BH08; [BoH REPORT](../book-of-hours/REPORT.md)), which carry file names, record IDs and line numbers from the earlier decompile. Labels: SHOWN = a committed note records it from definitions or code with a locator; STATED = the note says it without a locator; INFERRED = mine. No game was launched. Claims here are only as good as those notes; a later pass with the snapshot back should spot-check the numbers.

## Cultist Simulator: the two mind meters

Both are ordinary cards (elements) with a lifetime, not hidden counters.

| Meter | Fills from | Drains by | At threshold | Locators (private path, record id) |
|---|---|---|---|---|
| Dread (and its despair-inducing mark) | A seasonal despair risk starts a risk recipe; Dread carries a mark that induces despair (SHOWN, F3) | Spending one Contentment removes one induced-despair mark (SHOWN); card lifetime of 180 time units (SHOWN) | Three despair marks select an ending route that takes 60 units, with a last window to abate it; two marks only change the prediction shown (SHOWN) | `content/core/recipes/hazards.json` ids despairrisk (line 4), despairactive (25), despairabate (64), despairdeath (68); `time.json` despairrisklink; `elements/abilities.json` dread (315), contentment (697) |
| Fascination | It sits in a parallel risk beside despair (SHOWN, F3); what raises it is not traced in the notes (occult study is INFERRED) | One Fascination plus one Dread removed together by the visions-abate recipe, or a Fleeting card spent instead (SHOWN); lifetime 180 | Reaching the limit selects the same 60-unit ending route (SHOWN) | `hazards.json` visionsabate; `dream_rest.json` reducefascination (198), reducedread |
| Contentment | A produced card (source not traced in the notes) | Spent to cancel despair marks; lifetime 60 (SHOWN) | None found | `abilities.json` contentment (697) |
| Fatigue | Overwork or exertion (INFERRED from F2 wording) | Returns to Health by itself after a 60 unit lifetime (SHOWN) | If Health and Fatigue both run out the body can end (SHOWN, F1) | `abilities.json` fatigue (183) |
| Illness and injury | Sickness season and the damage-health effect (SHOWN) | One Funds or one Vitality plus the Dream verb (60 units) (SHOWN) | Untreated: affliction lifetime 180, injury 150, then decays to Decrepitude, a lasting remnant (SHOWN) | `abilities.json` injury (117) |
| Ghoul hunger | First feeding sets hunger 1 on the committed desire card; the seasonal craving adds one when already present (SHOWN, F7) | Reduce-hunger branches subtract one (SHOWN) | At hunger 7 the ambition can choose a victory ending (SHOWN) | `ghoul.firsttaste`, `ghoul.hunger1`..`7` |

How the mix works (SHOWN unless marked):
- The same cards serve defence and occult use: Dread and Fleeting reduce Fascination on purpose, and the spontaneous hazard draws on the same cards as the dream-rest recipes. The hazard reserves cards greedily and then gives a last intervention window.
- Surviving the hazard produces a Fleeting card (a reward from the danger).
- Risk and active recipes run on 60-unit warmups; the meters are cards that expire, so ignoring them does not hold them still. Decay type differs by meter: fatigue heals, illness hardens into a remnant, despair marks accumulate toward an ending.
- Display: the meters are visible cards on the table, and the warning at two marks changes the prediction text (SHOWN). No numeric bar. Exact UI text is not read.
- Seasonal ambition (F4): a power desire upgrades to a craving that must be fed with Funds each season; failure steps it back and can injure Health. Strain belongs to the commitment, not to the player (SHOWN).

## Book of Hours: soul, fatigue and malady (no dread or fascination)

- Each reader or helper has a soul resource. Work fatigues it: failed study (exhausted opportunities) gives fatigue, a consolation, and soul-specific malady risk links (SHOWN, BH02). Collaboration fatigues the supplied soul (SHOWN, BH06).
- Fatigue and malady are different things (SHOWN, BH07). Phost fatigue becomes the tired form; dawn restores the fresh form. A malady is a separate state: weaker useful aspects (reduced Lantern) and a cure that needs Nectar 5 at a bed action. Curing leaves the soul tired, not fresh; recovery is a second step.
- Day boundary: daybreak restores soul and separately forgets memories and sends helpers away (SHOWN, BH08). Numa (a special season) pauses the ordinary season and later forces forgetting; uncommitted skills can be dropped or reduced then.
- Memories are consumable inputs (a memory boost consumes the memory and sets a once-per-day marker). The notes do not show a dread-style rising meter in this game.
- Not established: every soul malady, contamination rules, closed-app elapsed time, whether any threshold ends a run.

## Five findings most useful for MND

1. A mind meter can be a pile of expiring marks, not a number. Despair and Fascination are cards with 180-unit lifetimes; threshold is a count of marks (three), with a warning at two. (SHOWN, F3)
2. A relief currency with its own lifetime. Contentment (lifetime 60) is spent one-for-one against despair marks, so relief must be kept fresh, and Fleeting, a reward from survival, buys down Fascination. (SHOWN)
3. One resource serves defence and ambition: the cards that calm the mind are also the occult fuel, so calming costs progress. (SHOWN, F3)
4. Different decay for different harms: fatigue heals alone, illness becomes a permanent remnant, despair counts toward an ending. A "mind" meter should say which of these it is. (SHOWN, F2/F3)
5. Cure is not recovery (Book of Hours): curing a malady leaves the reader fatigued; fresh capacity comes at dawn. Treat treatment and rest as two steps with their own costs. (SHOWN, BH07)

## What this does not give MND

No source here shows sanity as a single meter, a temperament, a mood-by-thought system or per-person traits: both games treat the protagonist alone. For those, see other digests in the research folder. Unfinished gap: Cultist's contentment source, the exact despair-ending text, and Book of Hours' malady list need the private snapshot back.
