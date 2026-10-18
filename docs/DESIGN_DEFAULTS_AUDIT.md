# Rules we never established: design defaults audit (2026-10-10)

> **Archived 2026-10-18: finished, kept as history.** All rows were applied on
> 2026-10-10 and the outcome lives in Rulebook 1–12 and AD5. Not a live rule
> source. It stays at this path because AGENTS, PROJECT and others link here.
> See [Retired and archived](RULES_INDEX.md#retired-and-archived).

Weibao: "What are other rules like that that we never established?" after
finding that "no universal rank" was presented as accepted when he never
accepted it. A read-only audit across the design docs (a Sonnet reader,
checked by Claude) found 24 agent-made constraints written as rules. This
file records them and proposes each as a **default with a dial**, in line
with the accepted "anything is possible, reasonably" (PROJECT.md,
2026-10-09).

**Status (2026-10-10):** all 24 rows and both smaller cases were rewritten
in the design docs as defaults with dials, per Weibao's direction; see the
change log under "Applying it". The built heir carry stays as built until a
gameplay slice. A new rulebook is proposed in
[RULES_FROM_SCRATCH.md](RULES_FROM_SCRATCH.md). Line numbers in the table
are from before the rewrite and may drift. "Earliest" means the earliest
place found, not a git-blame result.

**Abbreviations:** NS = `docs/LIFE_SIM_NORTH_STAR.md`; WC =
`docs/WORLD_CARDS.md`; UV = `docs/USER_VISION.md`; ORIG =
`docs/worlds/ORIGINS_AND_WORLD_TIMELINES.md`; CAMP =
`docs/worlds/CAMPAIGN_FRAMEWORK.md`; LORE =
`docs/worlds/LORE_AND_CONTINUITY.md`; DS = `docs/DIRECTION_SYNTHESIS.md`;
EMG = `docs/EMERGENT_SYSTEMS.md`; GMP = `docs/GAME_MASTER_PROMPT.md`.

## How this happens

A Weibao question or option gets paraphrased by an agent, the paraphrase
becomes a "principle" in a proposal doc, and a later doc cites it as
"accepted" or "the rule". The universal-rank case went: Weibao's question
(UV:738), then a Codex note that withheld acceptance of a ladder
(`docs/gm/PROJECT_LOG.md:592`), then Claude's world-card draft (WC:575),
then Claude's north star calling it "the accepted rule".

**Proposed habit for every agent:** a constraint is "accepted" only if it's
in PROJECT.md's accepted decisions or is Weibao's quoted words. Everything
else is written as "default" with its dial named.

## How to readjust a rule (Weibao, 2026-10-10)

Weibao: "remove the rules reasonably, after all the first rule is that
everything is possible, and then everything makes sense in a way? Duping is
allowed in some way. Absolute terms like 'one way past is ALWAYS another
world' don't have to be the case or be so absolute."

**The pattern.** Every design constraint is rewritten as:

> **Default:** what usually happens. **Dial:** what can change it (world
> card, cheat, storyteller, origin, difficulty, player choice).
> **Reasonably:** the in-world reason and cost when it changes.

**Word swaps:**

| Absolute | Becomes |
|---|---|
| never, no, cannot | by default not; unless (a world, cheat or choice) allows it |
| always, every, must | usually; by default |
| the rule, accepted rule, principle | the default |
| "stays off" without a reason | reachable through a cheat, meta unlock or cost |
| one way past is always X | one common way past is X; others exist |
| exactly one, at least N, at most N | typically; no fixed count |

**Two levels that stay firm, and why they're not design limits:**
- **Engineering integrity:** reload exploits, save corruption and
  accidental dupes from bugs are fixed as bugs. That protects the save,
  not the fiction. In-fiction duplication is a cheat or world law.
- **Real-world guardrails:** real ethnicities never carry stats; private
  saves and attribution stay protected. These are authoring policy, not
  game rules.

**Duping, as an example.** Default: items and unique rewards don't copy.
Dials: a duplication cheat (rate, grade limit), a copying world law, a
mirror realm, a forger's craft, a system shop that sells copies. Reasonably:
copies may be flawed, traceable, unstable, unable to copy uniques above
the copier's grade, or attract market and authority attention. A pure
copy cheat with none of these exists too, as a rare find.

**Caps, as an example.** Default: a world's ladder may have a cap. Dials:
caps are optional per world; if one exists, ways past include another
world, a treasure, a cheat, a tribulation, a teacher, a sacrifice, an
insight, or nothing known yet. None is guaranteed to be the only one.

## The 24 constraints

| # | Constraint as written | Where | Origin | Shown as accepted? | Conflicts with "anything is possible"? | Proposed reframe |
|---|---|---|---|---|---|---|
| 1 | Heir keeps one lesson; no skills or power | NS:52, NS:318; built in `docs/gm/life-sim-experience-2026-10-07/SYNTHESIS.md:7` | Claude, then a Codex lane; Weibao only said to leave inheritance of trust open (UV:1006) | Implied, and built | Yes | One lesson by default; bloodline, tutor, cheat or world law raise it |
| 2 | No automatic predecessor-power inheritance on reincarnation, transmigration or role-taking | ORIG:41; Paradise `PLAYER_CONTRACT.md` | Master GM; Weibao's UV:1220 was one option, not a mandate | Yes | Partly | Default for fresh starts; "inherit the host's powers" origins selectable at a cost |
| 3 | No free carries; no generic conversion | NS:98, NS:316; `src/feature_expansion_book_roster.js:385` | Codex data text | Yes | Partly; hard-coded | Per-edge carry dial, free carry on friendly edges or for cheats |
| 4 | Knowledge always crosses | NS:103, NS:806 | Claude | Written as absolute | Partly; contradicts amnesia mode and loss on arrival | Default; worlds, cheats and amnesia can strip or fade it |
| 5 | No sex or gender stat differences by default; real-world ethnicity never carries stats | NS (sex and gender, bodies, genetics guardrail) | Claude's view; Weibao asked for differences and "really cutthroat" (paraphrase) | No, but recommended | Partly | No difference by default; symmetric body trade-offs and harsh societies as world dials. Keep the ethnicity guardrail as an authoring policy |
| 6 | Fate protects survival not victory; established future protects, potential doesn't; severing doesn't kill | NS draft D2a | "Fated to survive unless severed" is Weibao (UV:129-130); the rest is Codex wording; he said "D2 seems reasonable but we can take more look" | Draft used as settled | Partly | Per-world fate card; scope and future-vs-potential are dials |
| 7 | Every world has at least 2 absences and at most 3 signature laws | NS (every idea somewhere), WC:16-17 | Claude | Format rule | Yes | Absences and signature laws are defaults with a way around; no count cap |
| 8 | Home world stays humble: no concepts above Intent, no revival, no system panels, Grandmaster cap, imports weakened | NS, WC:47-72 | Claude | Implied | Yes; UV:1018 "I want the original world to be fully expanded too" | Modest defaults; rifts, cheats and late events unlock more |
| 9 | No offline advancement; absent worlds freeze; no aging while closed | NS:803; CAMP:31,127,161; LORE:163; ORIG:72; DS:32,375 | Codex GMs ("draft default"); NS:287 says offline is undecided | Implied | Yes, for an idle game; UV:1006 "make time have meaning" | Foreground-only default; offline catch-up, banking or harsh loss as opt-in modes |
| 10 | Away-time and action caps presented as design | NS:804; `docs/ENGINE_EXPANSION.md:683` | Claude, Codex | Implied | Partly; UV:160 "Why are there caps?" | Engineering defaults, not world rules; caps can rise |
| 11 | No live rollback; eras are separate branches; replays bounded | CAMP:27; LORE:78; DS:225,235 | Master GM (feasibility framed as design) | Implied | Partly; UV:402 asks for chances to go back in time | No rollback by default; regression and loop cheats or worlds grant it at a cost |
| 12 | Rewind anti-farming: no fresh rolls, no spendable replay rewards | DS:235,239,331,345 | Codex | Implied | Yes; Weibao (paraphrase) wants farming possible in some circumstances | Guards are defaults; a farming-cheat tier or world removes them |
| 13 | Absolute cheats need an exclusion list; contradictory absolutes can't coexist; a perfect cheat can't make friends or stop aging | NS pure cheats | Claude, reinforced by a lane; Weibao (paraphrase) asked for "no drawback" and "no exceptions" | Labelled proposal, read as flat | Partly | Exclusion list as default; exceptionless cheats stay available; collisions per case |
| 14 | "No general tier-wins table" (the correction became a ban) | NS pure cheats and power scaling | Claude, then the power-scaling lane | The correction reads as a rule | Partly; the S0-S7 system ladder is itself a ladder | Tier-wins is an allowed default for worlds that want it |
| 15 | Leftover copies of the universal-rank rule | GMP:~47; CAMP:99; DS:82; LORE:128; `docs/worlds/PROGRESSION_AND_ASSEMBLY.md:27`; `docs/worlds/MULTIVERSE_STRUCTURES.md:32` (NS:75, NS:2081 and WC:575 fixed 2026-10-10) | Derived from UV:738 | Mixed | Yes | Default, not a ban; verse equalization as the dial |
| 16 | Never auto-scale threats to the player | NS:3667; CAMP:101; GMP:~47 | Codex GMs, a lane | Implied | Partly; UV:1168 "balance can be scaled by power scaling" | Fixed worlds by default; scaled threats as a difficulty or world dial |
| 17 | A threat always has a counter or a way to flee | EMG:480 (E5 already makes it a dial) | Claude | No | Mostly no; the EMG:480 wording reads unconditional; UV:1168 "very unfair, like Caves of Qud" | Say "default" in EMG:480 |
| 18 | The director picks when, never what; never writes events | EMG:448; `docs/emergent/E5_STORYTELLER_AND_FATE.md:60` | Claude; Weibao: "it can be 'fate'... storyteller instance" | Goal text | Partly | Steady director by default; a fate or world storyteller instance may inject events |
| 19 | No LLM decides mechanics or irreversible NPC choices | EMG:897; `docs/ENEMY_PROTAGONISTS.md:158`; `docs/emergent/E6_LORE_LAYER.md:511` | Claude | Implied | Partly; UV:530 asks about AI-played clones | Deterministic by default; an optional LLM-proposer mode behind a setting |
| 20 | No duplicated items, sources or unique rewards | CAMP:157; `PROGRESSION_AND_ASSEMBLY.md:43`; `ABILITY_AUTHORING.md`; DS:345 | Codex (save integrity) | Implied | Partly; NS has an item-copy jar cheat | Ban reload and exploit dupes; in-fiction duplication is a costed cheat or world rule |
| 21 | Entry and creation options without an in-world reason stay off; extra routes need a reason | ORIG:21; NS creation sections | Claude, from Weibao's "should make sense" and "how the book does it" | Yes | Partly; "stays off" is a block, not a cost | Without a reason, reachable through a cheat, meta unlock or cost, not off |
| 22 | Every ladder has a cap; one way past is always another world | WC:578; NS tiers and limits | Attributed to Weibao with no quote; "a way past" fits him, "a cap must exist" isn't shown | Yes | Partly | Caps optional per world; if one exists, it has a priced way past |
| 23 | Death stays final unless the setting has a method; "no revival" as an absence in 6 of 9 cards | `docs/RIVALS_IDENTITIES_AND_FATE.md:213`; LORE:202; WC absences | Codex, Claude | Implied | Partly | Final by default; revival via cheat, ritual or world law at a cost |
| 24 | Consent, knowledge and cost-ledger gating on companions, teaching and dialogue | CAMP:155; LORE:157; `docs/worlds/DIALOGUE_AND_INTERACTIONS.md:40,85` | Codex lanes; NS:316 admits they're applied so strictly they become bookkeeping | Implied | Partly; inconsistent with possession and coercive routes | Defaults that coercion, possession or cheats can bypass; ledgers move to tooltips |

**Two smaller cases of the same pattern:**
- Parallel counterparts: "similarity never transfers memories, debts or
  rank" (LORE:54,96) sits against "same people, different memories of
  you" (NS:87).
- Luck "never a flat multiplier" (NS; RIVALS:193) sits against the 100x
  simple cheats Weibao asked for.

## What is actually accepted (for contrast)

1. Anything is possible, reasonably (PROJECT.md, 2026-10-09).
2. Vanilla stays intact; the original UI is the baseline; new story is
   opt-in.
3. First milestone: one realm and one prestige layer, sequencing delivery,
   not capping vision.
4. Defeat stays unconsciousness; true death, run endings and rewind remain
   proposals.
5. Book worlds recreated directly with free premises, in a private pack.
6. The expanded setting is its own branch of YAIRPG.
7. Your Chronicle's expansion and balance principles as review criteria.
8. Quote-backed intent: protagonists fated to survive unless that fate is
   severed (UV:129-130); multiple versions of one ability are fine
   (UV:1208); very unfair play is fine (UV:1168).

**Attributed but not verified as his words:** several "Weibao:" lines in
the north star after 2026-10-06 are agent paraphrases with no verbatim
quote in USER_VISION (limits and tiers, pure cheats, rewind farming,
aptitude change, staged rescues, difficulty both ways).

## Applying it

Weibao authorized the doc rewrite on 2026-10-10. The change log is below.
Code-level constraints (#1 heir carry as built, #3 carry and conversion
text in `src/feature_expansion_book_roster.js`) are gameplay changes: they
stay as they are until a build slice changes them with a browser check.


### Change log (2026-10-10)

Two passes: the audit's reframes, then Weibao's updated direction (remove
#7 and #8, invert #4, allow #5, leave #6 per book, point #9 to
[RULES_FROM_SCRATCH.md](RULES_FROM_SCRATCH.md)). Line numbers are after
the edits. Abbreviations as above, plus CHEAT = `CHEAT_COSMOLOGY.md`.

| # | Where (file:line) | Change |
|---|---|---|
| 1 | NS:52 | Heir power off by default; bloodline, tutor, cheat or world law pass some |
| 2 | ORIG:43, ORIG:108 | Default for fresh starts; inherit-host-powers origin selectable at a cost |
| 3 | NS:100-107, NS:325, NS:1521; CHEAT:129 | Carry and conversion are per-edge dials; src strings noted inactive metadata |
| 4 | NS:108, NS:819; WC:576; CHEAT:131 | Inverted: knowledge crosses only when soul, cheat, record or rules carry it |
| 5 | NS:2216, 2221, 2370, 2451, 2506 | Sex/gender stat differences allowed per world, species, body, setting; ethnicity guardrail kept |
| 6 | NS:4597, NS:4637 | Fate unsettled, per world as each book does it; pointer to Fate by book |
| 7 | NS:887, 890, 913, 1067; WC:15-16 | Count rule removed; absences and signature laws are optional fields |
| 8 | NS:919, 933; WC:43, 52, 62, 75, 477, 484 | Humble caps removed; home is the first world lived in, any depth |
| 9 | NS:816; ORIG:72, 90; CAMP:31, 161; LORE:163; DS:32, 375 | Freeze and no aging while closed stay defaults; offline modes opt-in |
| 10 | NS:816; ENGINE:683 | Caps labelled engineering defaults that can rise |
| 11 | CAMP:27; LORE:78; DS:225 | No rollback by default; regression or loop cheats or worlds grant it |
| 12 | DS:235, 331, 345 | Anti-farming guards are defaults; farming-cheat tier or world removes them |
| 13 | NS:1345, 1401, 3674, 3695; CHEAT:169 | Exclusion list is the default; exceptionless cheats stay; collisions case by case |
| 14 | NS:1370 | Per-collision rule is the default; a world may use tier-wins |
| 15 | GMP:47; CAMP:99; DS:82; LORE:128; PROG:27; MULTI:31; ENGINE:895 | Separate ranks by default; verse equalization is the dial |
| 16 | NS:3702; CAMP:29, 101; GMP:47 | Fixed threats by default; scaled threats a difficulty or world dial |
| 17 | EMG:483 | Counter-or-flee is a default; harsh worlds and fairness off drop it |
| 18 | EMG:450; E5:60 | Director picks when by default; fate or world instance may inject events |
| 19 | EMG:901, 909; E6:511; ENEMY:158 | Deterministic by default; opt-in LLM-proposer mode behind a setting |
| 20 | CAMP:157; PROG:43; DS:345 | Save-protecting dupe ban kept as integrity; in-fiction duplication is a costed cheat or law |
| 21 | NS:2589, 2606, 2627; ORIG:22 | Unreasoned options reachable through cheat, meta unlock or cost, not off |
| 22 | NS:428; WC:585 | Caps optional per world; several priced ways past, none the only one |
| 23 | WC:33; LORE:202; RIVALS:213 | Death and "no revival" are defaults; revival via cheat, ritual or law at a cost |
| 24 | CAMP:155; LORE:157; DIALOGUE:40 | Consent a default that coercion, possession or cheats bypass at a cost |
| Parallel counterparts | LORE:54, 96 | No transfer by default; resonance law, cheat or authored link can |
| Luck | NS:4322; RIVALS:195 | Scoped luck by default; a flat 100x luck cheat is a dial |
| Extra absolutes | NS:642, 915, 2324, 2331, 4052; WC:576 | "Never", "must", "always" in nearby design rules softened to defaults |

**Skipped, and why:**
- `src/feature_expansion_book_roster.js` (#3) and the built heir carry
  (#1): code; needs a build slice with a browser check.
- `ABILITY_AUTHORING.md` (#20): already says "no duplicated source by
  default".
- `docs/gm/book-world-player-agency/PLAYER_CONTRACT.md` (#2): it records
  the built Paradise delivery, so rewording it would misstate the build.
- Engineering integrity lines kept as written: reload never rerolls,
  re-entry never repeats payment, component custody, RNG stream rules.
- Historical logs, USER_VISION quotes, E8 and novel folders: out of scope.
- Not edited, outside the listed files: `gm/world-implementation/IMPLEMENTATION_PLAN.md:194`
  ("never auto-scaled to player level"); `ENCOUNTERS_AND_PURSUIT.md:19`
  already says "need not".
