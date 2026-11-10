# Mind rules

Working defaults 2026-11-10 under AD56 (ideas that open possibilities are welcome), adjustable; the lines listed in the [limiting lines review](audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals until Weibao answers. Drafted as proposals the same day (AD32). Requested by Weibao ("Draft FRC1–FRC3 rulebooks", [log](gm/USER_VISION_LOG_2026-11.md#three-more-rulebooks-and-making-rules-reach-implementation-2026-11-10)). Rows marked **(restates)** repeat a rule that already binds through its own code and add no authority.

Covers the mind as a carrier: personality and traits, mood, stress and strain, sanity and madness, LOTM's loss of control and digestion, powers that act on minds (charm, compulsion, memory editing, possession), will, and identity across bodies and lives. A world may set any line differently with an in-world reason and cost (AD5, AD38); each row gives the default, the dial and the reason.

His words that bear on it: lore numbers are fixed points and the fit covers "personality" (AD49); "Hidden stats like Sanity stat?" (2026-10-08, routed to a palette, no decision); one continuing self by default, with possession, shared minds and several bodies possible (USER_VISION, Starts); "no forced weakness should honestly apply to everything" (AD55, 2026-11-10). No accepted sanity or personality rule exists beyond these.

Owners and neighbours (linked, not restated): AD49, AD50, AD51, AD55; BHR2, BHR3, BHR9, BHR17–BHR18, BHR29, BHR31–BHR34 and SLR36–SLR39 in [domain rules](DOMAIN_RULES.md); ABR15 and AB13, AB14, AB27–AB31, AB37 in [ability rules](ABILITY_RULES.md); [TIE12, TIE18, TIE24](RELATIONSHIP_RULES.md); [KNW5, KNW12, KNW18, KNW19](KNOWLEDGE_RULES.md); WER3 and ST6 in [world entry](WORLD_ENTRY_RULES.md); [CHT5, CHT14](CHEAT_RULES.md); LSD393–LSD407 in the [lead-life design](gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md); the [temperament brief](gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR3_TRAIT_TEMPERAMENT_BRIEF.md) (implemented, below floor). Palettes: [afflictions](AFFLICTIONS_AND_WEAPON_PROPERTIES_CONSIDERATIONS_2026-11-03.md) AFW6, [selves and echoes](SELVES_AND_ECHOES.md), [cheat catalogue](CHEAT_CATALOGUE.md) CTC9, CTC10, CTC47.

## Terms

| Term | Means | Not |
| --- | --- | --- |
| Trait | A lasting word about a person (patient, grudging, curious) that tunes how they remember, trust and act | A mood |
| Mood | A short-lived state derived from recent events | A stored meter |
| Strain | Pressure on the mind or a power carrier from a real source (an act, a potion, a place) | A sanity tax |
| Loss of control | The world's own end of strain (LOTM's lost stage, a heart demon, Gu corruption) | A generic madness |
| Mental power | An effect that changes another mind: charm, compulsion, memory edit, possession, mind reading | Persuasion by talk (`social_contest.js`) |

## Traits and mood

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| MND1 | **The mind is a carrier** (restates BHR2, BHR3). Mind facts follow the mind; body facts follow the body. | Default: know-how, recall, identity and temperament are mind facts (BHR29, BHR33). Dial: a world where mind and soul are one carrier. Reason: possession and body swaps need to know what moves. | BHR2, BHR3, BHR33 |
| MND2 | **Traits are dials on behaviour, read from one port.** A person's traits tune memory fade, recall, trust, telling, forgiveness and slant through `person_temperament.js`. | Default: `createTemperamentPort` is the reader; trait words come from canon where shown (LSD404), from role otherwise; the temperament is derived and not saved (LSD393). Dial: a world registers its own trait words. Reason: one port keeps a "grudging" person grudging in every system. | LSD393, TIE12 |
| MND3 | **Traits show by working.** The player learns a trait by seeing it act, not from a label. | Default: LSD399; known traits start empty. Dial: a means (empathy, a dossier) reveals more. Reason: AD8; people are learned. | LSD399, KNW6 |
| MND4 | **Traits drift only by events.** A trait changes through a dated cause (a betrayal hardens, a kindness softens). | Default: static until an event writes a delta (LSD400, LATER). Dial: drift rate per person, or none in a faithful lore run. Reason: AD49; canon people keep canon temperaments unless something happens to them. | LSD400, AD49 |
| MND5 | **Mood is short-lived and derived.** It comes from recent events (hunger, loss, praise, fear) and fades by the person's tempo. | Default: a derived read with a half-life in days; not saved. Dial: a world's own mood sources. Reason: LSD397 (memory follows mood), XC19 (hunger costs a mood) and gossip all need it, and none should store a meter. | LSD397, XC19, TIE12 |
| MND6 | **The player's traits do not override the player's choices.** | Default: the lead has traits only where a world or start gives them; they tune the lead's own memory and how others read them (LSD403), and never pick an action. Dial: a start may let the player choose traits. Reason: forcing behaviour on the player would be a forced weakness (AD55) and takes away play. | AD55, LSD403 |

## Strain, madness and loss of control

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| MND7 | **No sanity tax.** Madness, corruption or loss of control exist only where a world's mechanism produces them. | Default: no generic sanity meter; a world with a real mechanism (LOTM potions, Gu, curses, heart demons) declares it. Dial: per world. Reason: AD55; "sanity costs fit a LOTM-style world" is a world's choice, not a rule for all. | AD55, ABR15 |
| MND8 | **One exposure, read twice.** Strain from many sources accumulates in one carrier; the world decides how it reacts. | Default: AB27's shared accumulation with a reaction local to each tradition; aligned sources do not warp their user (AB28), so LOTM acting digests rather than strains. Dial: the reaction table per world. Reason: AB30; two counters for one danger disagree (see open details). | AB27, AB28, AB30 |
| MND9 | **Loss of control is a run-ending threat with exits** (restates AD50). | Default: stages are visible to someone with the means to read them; at least two exits on different means; nothing ends while away (BHR18, RLEE8). Dial: thresholds and harshness per world, by strictness setting (AD21). Reason: AD50. | AD50, BHR18, AB31 |
| MND10 | **Digestion and acting stay in LOTM until a second world needs them.** | Default: the acting count in the LOTM files; a shared seam only when a second consumer arrives (cultivation insight, a warlock patron, Gu), per AD51. Dial: none. Reason: AD51 asks for a second world before abstracting. | AD51, AB13 |
| MND11 | **Temptation needs a mechanism.** A power that tempts its holder does so through a cause the world states. | Default: no temptation pressure until modelled (`LOTM_CAUSES.temptation` is unmodelled). Dial: per world. Reason: a pressure with no cause is a hidden penalty. | AD38, AD55 |
| MND22 | **Recovery follows the world's own record, before the line and past it.** In LOTM, pre-signs can be pulled back (ritual stabilising, guided attention, acting); full loss is never reversed in the books: it ends in death, a sealed item or a leftover characteristic. | Default: the carrier eases below the line and holds past it, with a grace before the end and only rest, care and travel open (RCL5). What the book shows at higher sequences (a Spectator soothing pollution, faith anchors, a purifying pathway, a destroyed characteristic losing its pollution) are means a life can reach, not defaults. Dial: a world, a means or a cheat may lower or lift the hold with an in-world cost. Reason: canon calibration (AD49, WKR21); Weibao asked 2026-11-10 how people recovered and whether the base cheat should change it (LLR32 holds the base-cheat question). | AD49, AD50, MND8, LOTM_RULES L7 |

## Powers that act on minds

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| MND12 | **Mind reading is appraisal** (restates SLR38). It reads through means and stops at sealed truths' discovery routes. | Default: the reveal names its layer and precision (BHR9, KNW12). Dial: per means. Reason: SLR38. | SLR38, KNW12 |
| MND13 | **A memory edit states what it reaches** (restates SLR36, SLR37). Taken memory is conserved; loss removes understanding, not fluency. | Default: SLR rules; the player's own loss is forewarned and recoverable with a record (SLR39). Dial: per means. Reason: SLR36–SLR39. | SLR36–SLR39 |
| MND14 | **Charm and compulsion are conditions with an actor, a duration and an exit.** | Default: a condition (the `charmed` id exists in `effect_dsl.js`) that names who applied it and how it ends; it bends regard (TIE18) or forces an act, never both silently. Dial: strength and duration per power. Reason: a charm with no source cannot be broken or blamed. | TIE18, AD6 |
| MND15 | **The player is affected only through named means, with an exit.** | Default: a hostile mind power on the lead is forewarned where it could be noticed, names its source, and offers an exit (resist, break, wait, help); loss of agency is time-limited unless the world has a stated reason. Dial: the world's power ladder. Reason: SLR39 and AD50 applied to the mind; Weibao is the only player. | SLR39, AD50 |
| MND16 | **Possession splits by carrier** (restates BHR33). Body facts stay with the body; mind and soul facts go with their carrier. | Default: the possessed body keeps its scars and fluency; the possessor brings its memories and will. Dial: a world where possession merges. Reason: BHR3, BHR33. | BHR3, BHR33, CTC47 |
| MND17 | **Will is a resistance a world may define.** | Default: no forced player check; where a world has will (a cultivator's resolve, an Ironsworn vow), it is a spend or resistance used for the exits in MND15. Dial: per world. Reason: AD55; a check that only the player must pass is a forced weakness. | AB37, AD55 |
| MND18 | **NPCs face the same strain and powers** (AD6). | Default: rivals use the same carrier rows and costs; canon people in a faithful lore run follow canon (STY32, AD49). Dial: whether canon exemptions apply in an open run. Reason: AD6. | AD6, STY32 |

## Identity

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| MND19 | **The self is the memory and soul carrier.** One continuing self by default; possession, shared minds and several bodies are possible by mechanism. | Default: "same person" follows memory and soul (BHR33); a new body or a new name does not change who it is. Dial: a world's own metaphysics (a soul that splits, a copied mind). Reason: USER_VISION, Starts; WER3 and ST6 keep remembered identity apart from the inherited record. | BHR33, WER3, ST6 |
| MND20 | **Echoes and other selves are separate people.** Past, future and shadow selves are distinct records with their own ties. | Default: SELVES_AND_ECHOES (proposal). Dial: per world. Reason: two people sharing one record would break ties and knowledge. | SELVES_AND_ECHOES |

## Noticing control

Added 2026-11-10: Weibao agreed with MND15 and asked that control "should be noticible, mght be hard to implement tho, consider different avenues and more".

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| MND21 | **Control of the lead is noticeable, at the latest afterwards.** Noticing comes from consequences and observers, so the power itself needs no forced tell (AD55). | Default: the player can find out by at least one route below, and always after the control ends; how early is the dial. Dial: per world and power, from "felt as it starts" to "found after the fact". Reason: his 2026-11-10 words; SLR39 (forewarned, recoverable, recorded). | MND15, SLR39, AD55 |

Avenues, cheapest first (agent proposal; pick per world and power):

| Avenue | What the player sees | Built on |
| --- | --- | --- |
| Marked acts | Acts done under control are tagged at write time; Reports and the recap show them in a different voice ("You found yourself at the docks") | A `controlled` condition with source and window (MND14), the layer tag idea (STY30), RPT voice rules |
| Lost time | The clock moved and the recap names a gap the character cannot account for | TMR10 recap; the stop list (TMR8) |
| Discrepancies | Notes, journal or held items disagree with memory: a letter you do not remember writing, money missing | KNW16 texts, ITM3 custody records, `personal_journal.js` |
| Others notice | A companion or friend reacts ("you weren't yourself"); a rival boasts | TIE6 readers, `reactionLine` |
| Means | A ward warms, a divination shows a thread, a cheat's quiet sense twitches, self-appraisal finds a foreign mark | KNW12, CHT19, STY29 traces |
| World tells | Where the world has them: voices, a compulsion's itch, a smell, a cold spot | Per-world rows, as LOTM's voices |
| Resisting | A moment to resist, shown as a choice with its odds, when the power's strength allows | MND17 will, UR40 chances |
| Afterwards | When control ends, a recap of what was done and, if knowable, by whom | TMR10, KNW4 sources |

Hard cases, settled as defaults: hidden long-term control (a planted suggestion) is found by discrepancies, others or means, and at the latest when it ends; control while away stops the routine at the first controlled act (TMR8); an NPC under control follows the same tags, so the player can notice it in others too.

## Building a mind slice

1. Name the carrier (MND1) and the world mechanism that makes it matter (MND7).
2. Read traits through `createTemperamentPort` (MND2); derive mood, do not save it (MND5).
3. For strain, use the one accumulator (MND8) and declare at least two exits (MND9).
4. Tests: `tests/person_memory*.test.js`, the LOTM harm tests; browser proof at the desktop viewport (AD43).

## Open details

- Resolved 2026-11-10 (RCL5): the two LOTM loss accumulators are one `harm` power carrier; cause rows write an inbox that drains onto it at 1.5x, lost holds, and the 30-minute grace runs in play only.
- `harm_state.js` has body parts but no mind or soul part (MND1).
- No mood state exists (MND5); LSD397 is blocked on it.
- The trait registry tunes memory, trust and gossip and nothing else yet; temper and risk dials are unwritten (MND2).
- No code for compulsion, memory editing or possession beyond the `charmed` id (MND13–MND16); no `controlled` condition or act tag for MND21 yet.
- The temperament slice (MR3) is implemented, below floor: its browser gate and commit are still owed.
