# R14 follow-up considerations: crowded combat and Reports color, 2026-10-15

[Proto23 / YAIR side-by-side review](http://127.0.0.1:19115/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/r14-proto23-review/index.html) · [Round 5: icons and UI comparison](#round-5-icons-and-ui-to-ui-comparison-2026-10-15)

Proposals from a Claude review of R14 evidence and source. Not accepted decisions; nothing implemented.
Evidence: `evidence/r14/after/{combat,reports-live}-1366-14.png`, `src/village_workspace.js` (renderEnemy),
`styles/ui_tokens.css` log rules (~868–1122).

## Findings

| Code | Finding | Evidence |
| --- | --- | --- |
| F1 | Cards number identical opponents (1 · 2 · 3) but Reports drop the number: "Starving wolf rat takes 1.3". With 8–9 copies the log cannot say who was hit or who died. | reports-live screenshot |
| F2 | Above 3 opponents at <40em Focus width, the view auto-switches to the compact roster, which hides per-opponent stats. Only R7's edge script ever restored 8 opponents; R8–R14 matrices test 3. No 5/8/9 or mixed-type evidence at 1366×768. | `renderEnemy` line ~46; `check-r7-edge.cjs` |
| F3 | Defeated opponents stay as normal cards reading "0/20 hp", same frame and weight as live ones. | reports-live screenshot, cards 2–3 |
| F4 | Odd last card spans the full row and switches to row layout, so card 3 has a different shape from 1–2. Mixed enemies with different known-fact counts would also give uneven heights. | `cardEm` rule, combat screenshot |
| F5 | Hero and opponents share one actor color (#8fe8ff). Ally vs hostile is not separable at a glance. | `.log-subject`, `.log-actor` |
| F6 | Text contrast is fine (9.6–15:1 on #24153b, above WCAG AA). The problem is category separation: role colors are all pale pastels. Actor vs prose 1.22:1, value vs prose 1.11:1, value vs loss 1.39:1, so they differ by hue only. | computed from tokens |
| F7 | Per-type line colors (enemy attacked, hero attacked, victory) exist at ui_tokens.css ~876–881, then later rules (~1081, ~1122) flatten every line to `--p23-log-prose` and a quiet border. This follows UR44 restraint, but it also removed the only hostile/ally cue. | rule order |
| F8 | Repeated lines ("Hero evaded an attack" ×8 in one view) will flood the stream with 9 attackers. | reports-live screenshot |

## Proposals

| Code | Proposal |
| --- | --- |
| A1 | One slot marker per opponent (number badge, optionally a shape) shared by card, compact roster, Focus heading and log subject: "Wolf rat 2 takes 1.3". Only when names collide; unique names stay bare. |
| A2 | Defeated state: dim card, strike or "Defeated" label, move to the end or collapse into "2 defeated". Stable slot numbers so the log still matches. |
| A3 | Test matrix adds 1, 5, 9 identical and 9 mixed (long names, unknown facts, one boss-sized) at 1366×768 14/21px and 1920×1080. Decide the 4–9 layout from those shots: compact grid of mini cards (name, hp, cycle) plus the inspected one expanded, instead of dropping to a list. |
| A4 | Split actor into `--p23-ally` and `--p23-hostile` tokens. Separate value roles by lightness as well as hue, and add a non-color cue (dealt vs taken direction, crit mark) per UR37. |
| A5 | Collapse consecutive identical lines into one with "×N", and consider a per-round combat summary when 4+ opponents act, keeping full lines available under Filters. |
| A6 | Check hp text over bar fills (card hp label overlaps teal fill) for contrast, and run the log under each player palette. |

## More to consider: Proto23, upstream YAIR, The Climb and other games

Weibao: "other aspects of proto23 and YAIR that we can learn from? what about ui style from the climb and other games?"
Already covered elsewhere and not repeated here: Climb/MR2 sourcing U1–U8 and M1–M7
(`docs/research/climb-mr2-playtest-2026-10-15/UI_SOURCING.md`), Proto23 Vivid V1–V16
(`docs/research/proto23/VIVID_AND_UI_FLOW_CONSIDERATIONS_2026-10-13.md`). Those passes did not look at
combat group or log color. This section does.

Evidence labels: **SEEN** = saved screenshot inspected this pass
(`docs/research/proto23/UI_AFTER_DIFFICULTY_2026-10-13.png`,
`docs/research/climb-mr2-playtest-2026-10-15/private/climb-{training,equipped}.jpg`);
**SOURCE** = existing comparison doc; **RECALLED** = general knowledge of a game, not re-verified this pass.

### What the references do

| Code | Reference | Mechanism | Lesson for YAIR |
| --- | --- | --- | --- |
| G1 | Proto23 log (SEEN) | `Straw dummy -> 6 (body)`: attacker, arrow, number, hit location. "You missed" in muted gray. Loot lines: notice color label + item in its rarity color. | Direction is carried by syntax, so color can stay quiet. Misses **recede** (muted) rather than vanish. Our "Hero evaded an attack" uses full prose weight. |
| G2 | The Climb log (SEEN) | Whole line colored by direction: incoming hits pink-red, outgoing green, kills and stat gains yellow/teal, EXP lavender. Thick dividers between exchanges. All / Combat / Item tabs. | Exactly the ally/hostile cue F5/F7 found missing. Exchange grouping makes a busy fight scannable. Weakness (their F6): routine hits still bury milestones. |
| G3 | The Climb panels (SEEN) | Each stat label has a fixed color (STR red, INT blue, DEX green, DEF pink, MDEF violet) in both player and target panels. Target shows kind tags (W:Neutral, A:Earth, R:Plant). Neutral gray ground. | A stat keeps one identity everywhere. Kind tags give mixed groups a second sort key. Their gray ground is why semantic colors pop; ours is saturated navy/teal/purple (accepted Proto23 baseline, UR12), so role colors must separate by lightness, not just hue (F6). |
| G4 | Proto23 enemy panel (SEEN) | One opponent; title line (`lvl:1 'Evil'`), `rank: ???` for unknown, "Pause next battle", area progress bar. | Unknown facts are shown as unknown, not hidden. Proto23 has **no** group model (SOURCE: `PROTO23_VS_YAIRPG_2026-10-10.md` F5), so 8–9 enemy layout must come from YAIR or other games. |
| G5 | Upstream YAIR (SOURCE) | Native groups up to 8 with independent attack cooldowns and stances. | 8–9 is a real native case, not an edge. The R7 8-enemy edge script is the only prior evidence. |
| G6 | Dragon Quest / Final Fantasy (RECALLED) | Duplicates get letter suffixes ("Slime A, B, C"). DQ lists a group row as "Slime ×3" and expands on targeting. | Cleaner than "1 · Wolf rat". Letters stay stable when one dies; numbers invite reading as order. Group rows are the compact roster for 6+. |
| G7 | Slay the Spire (RECALLED) | Each enemy shows its next intent and damage above it. | Our attack-cycle bar is the honest native equivalent. With many enemies, "who hits next" sorted or highlighted is the useful fact, not every stat. |
| G8 | Melvor Idle, RuneScape (RECALLED) | Hit splats anchored on the struck panel; log is secondary. | Fits UR38 effect anchors: damage shows on the card that took it, so the log can be calmer. Must never be the only record. |
| G9 | Diablo / Path of Exile (RECALLED) | Monster tier by name color (normal, magic, rare, unique). | For mixed groups, a frame/name tier marker separates boss from minion, **only** when the player knows it (M3 knowledge rule). |
| G10 | Caves of Qud / WoW combat text (RECALLED) | Hostile names in one color family, friendly in another; incoming damage red, outgoing white/yellow. | Confirms A4: ally and hostile tokens, direction tokens. |

### Dispositions

**ACCOUNT FOR NOW** (constraints for whichever round takes A1–A6):

- C1. One disambiguation token per duplicate opponent (G6 letter or A1 number, pick one), used identically on card, roster, Focus heading, hover and log. Stable across deaths and reload.
- C2. Log color comes from roles, not line types: ally/hostile name tokens plus dealt/taken value tokens (G2, G10). Keep UR44 restraint by coloring tokens, not whole rows, and dim misses/evades (G1) before collapsing them (A5).
- C3. Role colors on our saturated ground must differ by lightness as well as hue; target at least 1.5:1 between any two roles that sit side by side, and keep a non-color cue (arrow, sign, label) per UR37.
- C4. Unknown facts render as `???`-style placeholders (G4), never as invented tier, kind or intent (G7, G9).
- C5. Test cases at 1366×768: 1, 3, 5, 8 (native max per G5), 9 identical, and 8 mixed with one known boss.

**LATER / DELEGATE** (proposals, not authorized):

- L1. Stat identity colors (G3) shared by You, opponent cards and tooltips. Small token addition; risk of rainbow noise, so trial on labels only.
- L2. Exchange grouping in Reports (G2 dividers): a thin rule per combat round when 3+ actors act.
- L3. Anchored hit splats on opponent cards (G8), reduced-motion off, after the VFX anchor work.
- L4. Group rows for 6+ identical opponents ("Wolf rat ×6 · 4 alive", G6) as the compact roster's default.
- L5. ~~Next-to-act highlight (G7)~~ Superseded 2026-10-15: intent is unknown by default; see K2.
- L6. ~~Tier colors (G9)~~ Not needed now (Weibao 2026-10-15). Replaced by special-monster name effects, S1–S4.

Suggested capability for a lane taking C1–C5 + A1–A5: strong UI model, high effort; done check = C5 matrix
screenshots plus a log contrast table, no gameplay or save change.

## Round 3: knowledge, individual duplicates and special monsters, 2026-10-15

Weibao: enemy intent is usually unknowable without experience fighting them; use Proto23 style and extend hover
details; duplicates share one label but opponent 1 and 2 can differ; tier colors not necessary, special effects on
special monsters' names instead.

### Findings from source

| Code | Finding | Evidence |
| --- | --- | --- |
| F9 | Opponent cards show Atk, Spd, Hit you, Evade, Defense and Your hit from first sight. No experience gate exists in the UI layer; facts are read straight from the native enemy rows. | `src/combat_focus.js:15`, `src/village_workspace.js:36` |
| F10 | Individuals already differ: combat zones have `enemy_stat_variation`, and the R7 fixture varies health. So "Wolf rat A" and "Wolf rat B" are genuinely different bodies. | `src/main.js:9713`, `check-r7-edge.cjs` |
| F11 | Existing owners to reuse: bestiary kill counts (`enemy_killcount`), enemy `tags`, `settled_text_effects.css` and the `opponent-name` effect anchor, and the shared fact hover text (`factHelp`). | `src/enemies.js`, `src/display.js`, `styles/` |

### Knowledge from experience (K)

- K1. Each fact is learned from its own evidence, Proto23 `???` until then. Attack: after being hit. Speed: after several attacks seen. Hit you / Evade: after enough hits and misses. Defense: after landing hits. Early readings are fuzzy words or ranges ("light hits", "~3–5"), sharpening to exact numbers with more samples or a skill.
- K2. Intent and special moves are unknown by default. The attack-cycle bar is observable wind-up, so it can stay; what the attack *does* ("can cause Bleeding") appears only after you have witnessed it. Supersedes G7/L5.
- K3. Species knowledge vs individual reading: species facts come from experience across fights; the individual card shows what you can see now (its health, that it is bigger or limping). Hover separates the two: "Wolf rats (fought 12): ~4 dmg · This one: larger than usual".
- K4. Proto23-style hover, one projection reused by card, roster, Focus heading, log subject and Bestiary (UR47): known facts, `???` rows for unlearned ones (shows there is more to learn without values), and how you learned each ("seen 30 attacks").
- K5. Means and worlds change the rule, not the UI: an appraisal skill, Status-window world or cheat can reveal everything at once; a world without them stays experiential. Knowledge belongs to the character and world; carryover across death/rebirth follows that world's adjectives.

### Duplicates that differ (D)

- D1. One base label per species with a stable letter (Wolf rat A, B, C) for the encounter; reinforcements take the next letter; letters never reshuffle on death.
- D2. Noticed individual traits become a prefix or hover line, not a new name: "Wolf rat B · scarred". Traits come from native variation or tags, observed, not invented. Pairs with `docs/emergent/E8F_ADJECTIVES.md`.
- D3. An individual that flees and returns could keep its identity (a recurring rival). LATER; ties to `docs/RIVALS_IDENTITIES_AND_FATE.md`.

### Special monsters (S)

- S1. Name effect = what the character perceives, so it shows before its meaning is known: a glowing, smoldering or flickering name. The meaning ("champion", "corrupted") arrives through K-route knowledge. Driven by enemy `tags`, rendered through `settled_text_effects.css` on the existing name anchor (UR38).
- S2. Rarity budget: effects only on genuinely special opponents, or they stop meaning anything. One effect per name.
- S3. Readability first: the effect never lowers name contrast; reduced motion gets a static variant; in the log only the name token carries it, and only a subtle form.
- S4. First sighting earns a log line ("A glowing wolf rat appears") linked to its card (UR29).
- S5. Sealed secrets: an effect may hint, never reveal a sealed truth in its class name, tooltip or log text.

### Other aspects (O)

- O1. Allies use the same model: helpers like those in `feature_expansion_battle_host.js` can be several, need ally tokens, letters if duplicated, and the same hover.
- O2. People as opponents keep proper names (no letters); knowledge of them can come from dialogue as well as fighting.
- O3. Targeting stays separate from inspection. Once players know which wolf rat is dangerous they will want to choose a target; that is a gameplay change, LATER.
- O4. Verification needs a dev-only true-vs-known inspector and fixtures at 0, 1 and 10+ kills, so a lane can prove gating without playing for hours.
- O5. Persistence: start from existing kill counts and log-derived evidence; any new per-species observation store needs a migration (AGENTS.md safety rule).

### Dispositions

- **ACCOUNT FOR NOW:** C4 extends to K1–K2: a round that touches opponent cards must not add more first-sight facts, and the hover/fact projection should be one function so gating can land later without rework. C1 uses D1 letters.
- **Decision for Weibao:** F9 means today's cards show more than an inexperienced character would know. Gating them (K1) hides info players currently see.
- **LATER:** K3–K5 projection and hover, D2 traits, S1–S5 effects, O1–O5. Suggested lane: strong model, high effort; done check = fixtures at 0/1/10 kills showing `???` → fuzzy → exact on card, hover and Bestiary, plus one special-effect opponent at 1366×768 with reduced motion on and off.

## Round 4: stat knowledge, attributes, gear, status effects and finish, 2026-10-15

Weibao: unsure how enemy stats should work (learn or fight to see, estimates that can be wrong, ranges, or just
general levels early); attributes as a standard set with a dropdown for all, not full width; gear that looks
embedded, and how other games do it; most pleasing and informative styles; hover popups for special
names/titles/traits; status effects.

### Findings from source

| Code | Finding | Evidence |
| --- | --- | --- |
| F12 | Enemies carry honest coarse data: `size` tag, `xp_value`, `rank` (bestiary order only) and levelable stats. A relative threat word can come from these without inventing a level. | `src/enemies.js:50–90` |
| F13 | Hero effects already reach the shell as one header chip ("Bleeding +2") built from the native effects tooltip. Enemies have **no** native status effects; the opponent readout states it supplies no level, intent or enemy effects. | `src/proto23_shell.js:267`, `src/village_workspace.js` enemyName title |
| F14 | Gear is a collapsed "Gear · N" disclosure; secondary attributes already auto-fit by measured space (R11). Context stat sets were deferred in R14. | `src/proto23_shell.js:102–108, 260, 297` |
| F15 | Proto23 draws You and the opponent with the **same panel structure** (name, title, hp bar, stat row). Learning one teaches the other. Ours differ: You is a stat grid, opponents are cards. | Proto23 screenshot, R14 combat screenshot |

### Enemy stat knowledge (E): recommended ladder

| Stage | What you see | Source | Can be wrong? |
| --- | --- | --- | --- |
| E1 First sight | Impression words: size, "looks weaker / even / dangerous" relative to you; Proto23 `???` for numbers | `size` tag, `xp_value`/stats vs hero | Yes. Traits or deception can skew it; worded as impression |
| E2 Estimate | `~3–6 dmg` style ranges before data, from impression | Seeded per species and character, so stable across ticks and reloads | Yes; marked with `~` and "est." (non-color cue, UR37) |
| E3 Observed | Range from real samples: min–max damage taken, hits/misses counted | Actual combat events | No, only incomplete (a crit may not have appeared yet) |
| E4 Known | Exact numbers | Enough samples, an appraisal skill, Status-window world, cheat or Bestiary study | No |

- E5. Percentages (Hit you, Evade) stay words ("often hits you") until observed; exact % only at E4.
- E6. Your own stats are always exact; you know yourself. Levels appear only in worlds that have them (LitRPG/status worlds, Proto23-style `lvl`).
- E7. When an estimate turns out wrong, say so once in hover ("Looked weak; hits harder than expected"). That moment is the fun of learning.

### Attributes (A)

- A7. Default "Standard" set: core attributes plus the few combat lines that matter now. A dropdown (Standard / Combat / Crafting / All) swaps the set; All lists every possible attribute grouped (Offense, Defense, Resources, Multipliers), zero or unlearned ones dimmed. Reuses R11 measured fitting and the existing Attributes inspector; picks up the deferred context stat sets.
- A8. Not full width: stats as a two-column label/value block about 55–60% of You, freeing the right side for gear and status effects (Climb and Proto23 both do this).

### Gear embedded (G)

How others do it: Proto23 named-slot grid inside You with `LOCKED` slots (SEEN); The Climb icon paper doll beside vitals (SEEN); Diablo, RuneScape and Melvor silhouette dolls (RECALLED); text-list RPGs like Kingdom of Loathing (RECALLED).

- G11. Proto23-style named slot grid beside the stats, not a separate disclosure: Weapon, Shield, Head, Body, etc. Empty slots show faintly so you learn what exists; locked ones say why on hover. Names over icons (M5 discoverability).
- G12. Hover a slot = the existing item preview; click = item route; equipped items get the faint rarity glow (V14).
- G13. Slots come from the body, not a fixed list: nonhuman starts have different body plans. Read slots from the native equipment frame.

### Special names, titles and traits (P)

- P1. Hover a special name, title or trait opens one popup component: what you perceive, known meaning, `???` for the rest, how you learned it. Same component for your own titles (Proto23 `'Nobody'`; 108-title catalog idea) and opponents (`'Evil'`).
- P2. The popup frame echoes the name effect (S1) subtly; keyboard focus opens it too; pin on click (UR41–UR43).

### Status effects (X)

- X1. Effects row under the vitals on both You and opponent cards: short name or glyph chip, stack count, remaining time as a thin draining underline. Buff vs debuff by shape or border, not color alone. Debuffs first, overflow `+3`.
- X2. Hover = source, effect, remaining time; anchor the chip near what it affects (poison by HP).
- X3. Apply and expire already reach the log ("edged claws leave a bleeding wound"); link that line to the chip (UR29).
- X4. Your own effects are exact. Enemy effects need gameplay first (F13); when added, knowledge applies: you see a wolf rat bleeding, not its duration.

### Finish and subtle details (V)

- V17. Mirror You and opponent panels in one structure: name, title, bars, stat block, effects row (F15). One component, two sides.
- V18. Tabular numerals (`font-variant-numeric: tabular-nums`) so ticking values don't jitter; one number format (no `1.0` beside `1`).
- V19. Hover breakdowns on any derived stat: base + gear + effects + skills.
- V20. Estimated values in a lighter weight with `~`; observed in normal; exact in full weight. Knowledge state is readable at a glance.
- V21. Bar text sits on a solid backing or outside the fill (A6 contrast).

### Dispositions

- **Recommendation for Weibao:** use the E1–E4 ladder. Early on you get impressions and general threat, fighting earns real ranges, study or skills earn exact numbers. Estimates can be wrong but are always marked as estimates.
- **ACCOUNT FOR NOW:** any opponent-card work builds one fact projection with a knowledge state per fact (`impression | estimate | observed | known`), even if every fact is `known` at first. Any You-panel work avoids hardcoding equipment slots.
- **LATER:** A7–A8, G11–G13, P1–P2, X1–X3, V17–V21 as one You/opponent panel round. E-ladder gating and X4 enemy effects are gameplay plus persistence (observation store needs a migration). Suggested lane: strong model, high effort; done check = 1366×768 shots of You and opponent at 0/1/10 kills, Standard vs All attributes, gear with an empty and locked slot, two active effects, reduced motion on.

## Round 5: icons and UI-to-UI comparison, 2026-10-15

Weibao requested another more-to-consider pass: placeholder icons, other gaps, and YAIR beside Proto23.
This round delivers a reference viewer and considerations, not a gameplay/UI implementation or acceptance.
The prior E1–E4 ladder, A7 stat modes and G11 embedded gear remain proposals. The earlier rounds mix
quoted user direction with recommendations; neither a recommendation nor this comparison accepts a formula.

### Comparison surface and evidence

Review surface: standalone local evidence viewer, outside the game. Target: paired **1366×768 source captures**
with fit, 100% pixels and scrollable panel details. Current YAIR evidence is the rebuilt **R14 candidate**,
not a claim that today's entire dirty working tree has been rebuilt. No game source, save, layout key or
candidate bytes changed in this pass. Mobile, new artwork, gameplay knowledge/effects and production UI
changes are deferred. Shared source remains with its live owner.

[Open viewer](http://127.0.0.1:19115/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/r14-proto23-review/index.html).
The six comparisons cover combat/populated Reports, place/actions, crafting, skills/attributes, journal
and settings. Each image links to its original pixels. Panel detail changes the viewport onto the original
image rather than editing it. Paired states have different progression and content; Skills versus Stats
compares hierarchy only, not feature equivalence.

Reference provenance: `evidence/c1-reference.json` records visible introduction/Normal selection, source hash
and no debug mutation. The other source captures are **DEV SEEDED native-rendered** menus, described in
`evidence/parity-r7/proto23-audit.json` and R7_REPORT. R14 captures use synthetic restored saves; Reports
contains 30 native rendered combat ticks. This pass inspects those preserved pixels and current source.
It does not replay the native journeys or establish natural progression, hover behavior or new runtime proof.
`evidence/r14-proto23-review/manifest.json` pins the exact viewer inputs and inspected source bytes.

### Findings and consequences

| Code | Evidence | Consequence and disposition |
| --- | --- | --- |
| F16 | **Several different things look like placeholder icons.** `src/panel_kit.js` assigns generic role glyphs (`⚔ ◆ ▤ ≡ ✧`), but `styles/ui_tokens.css` hides those role icons under parity `r3`. `src/display.js` uses the same `check_box_outline_blank` glyph for dialogue, trade, work and travel rows. `src/village_workspace.js` uses `♨` for every temperature and a generic `◈` fallback for an unmapped season. `index.html` loads Material Icons from Google Fonts. | **ACCOUNT FOR NOW:** make an inventory of visible symbols and their actual meaning before replacing art. Label-first rows already carry the action; remove a redundant square or use a meaningful small symbol where it improves scanning. The steam glyph at an ordinary temperature can imply heat that is not present. Decorative glyphs must remain nonessential. Font failure is a source-backed dependency risk, **not a reproduced failure**. A future correction should use local existing assets or inline SVG and retain accessible names; no icon generation or new art system is needed for this review. |
| F17 | **Control chrome competes with the world.** R14 screenshots show global navigation, local Actions/Options, a sentence strip with Open local controls, a travel row, pinned Village Back, bottom local tabs and footer controls. The footer includes Authoring and a dummy hit counter in the captured fixture. Proto23 concentrates local modes along the center bottom and leaves most panel area to the subject. | **LATER:** review these controls by scope and frequency. Keep UR21 direct global paths and UR22 Back; judge each repeated control by its distinct job. Inspect whether Authoring and the dummy counter belong only to the dev fixture before proposing player-facing removal. The two Village routes may have different travel/navigation semantics; do not merge them based on wording alone. A question-mark tab needs a discoverable name/tooltip, not an ornamental replacement. |
| F18 | **You has numbers but weak equipment presence.** Proto23 puts a small stat strip and named equipment slots inside You; R14 has a much larger stat grid and `Gear · 0` disclosure. The source uses existing native equipment nodes; at laptop size, measured fitting gives the stats priority. | **LATER:** prototype the already proposed A7/G11 together, using a compact Standard set and native named gear slots. Compare gear closed/open, equipped/empty and 14/17.5/21px before selecting a default. `Gear · 0` must not be mistaken for zero available slots. Empty, unavailable, unknown and locked are distinct; only show a locked slot/reason if native body/equipment rules supply one. Do not import Proto23's anatomy or lock progression. |
| F19 | **Combat repetition obscures identity.** In R14, three opponents share one name in Reports, while cards distinguish them by number. Repeated evasion rows take similar space to damage and defeat. Proto23's compact stream gives outcomes a shorter reading rhythm, but its own bright colors and cryptic ranks are not requirements. | **ACCOUNT FOR NOW:** any log/card work must retain the existing proposed stable identity token across surfaces, recorded on events rather than resolved to whichever opponent exists now (UR48). **LATER:** trial quieter miss/evasion tokens and concise direction/value phrasing before hiding or grouping events. Keep filtering, unread/follow, keyboard previews and a complete event record. This extends C1/C2 and A5; it is not a second log owner. |
| F20 | **Category strips and consistent alignment matter more than more artwork.** Proto23 exposes inventory category tabs above its list; R14 uses a category dropdown plus sorting, search and count. Both retain named text rows. The reference menus group their central task within a stable frame; YAIR's extra workflows need that hierarchy without losing native commands. | **LATER:** P2/A5+B8 category tabs remain the existing next ranked candidate in UI_NEXT, preserving count/search/new markers and 21px fit. No new priority is selected here. Apply the same label/value gutters, title/status roles and selected/disabled cues across You, opponent cards, rows and menus, using shared tokens. Preserve explicit native Craft/readiness rather than copying a superficially simpler source recipe list. |

### Constraints to carry forward

**ACT NOW, completed for this review:** provide the UI-to-UI viewer, label unequal and seeded states,
and distinguish visible placeholder-like symbols from hidden ornaments and an untested font dependency.

**ACCOUNT FOR NOW:** earlier E1/E2 proposals cannot use hidden `xp_value`, true combat stats or a seeded
error model as if those were already character observations. A threat impression needs an authorized
observer-visible input; otherwise show unknown. Kill count alone does not prove which attack or special
effect was witnessed. Named enemy stat/knowledge work stays with its gameplay and persistence owner.
Likewise, a symmetrical effects row never authorizes invented enemy effects. These constraints keep a
presentation cleanup from silently becoming new mechanics.

**LATER:** keep UI_NEXT's ranked queue. If a cosmetic finish slice is selected, bound it to visible action,
condition and footer symbols plus shared row alignment. Use the existing panel kit and UI tokens, with
one source writer after live ownership recovery. Suggested capability: strong UI model, high effort only
for the combined You/gear experiment; the icon-only slice is a routine bounded UI change. Done check:
rebuilt fresh-origin 1366×768 populated idle and combat, 14/17.5/21px, keyboard names/focus, no icon font
available, and native item/action routes still correct. Reduced motion applies only if effects change.
No equivalent full test suite is required merely to view this report. Human visual selection remains open.

## Round 5: menus, equal opponent cells, control strips and a long-term box, 2026-10-15

Weibao, with an upstream YAIR screenshot: is every top menu implemented; make opponents take the same board room
instead of one stretching full width; condense and add bottom bar options; move dropdowns into their own area like
YAIR so they don't compete with selectables; a separate box for quests and long-term stuff; how to consider these in depth.

### Findings

| Code | Finding | Evidence |
| --- | --- | --- |
| F16 | Every top route has an owner module, but on the R14 synthetic save several render only a heading: Ledger 25 chars, Projects 28, Travelers 37, Notebook 69. No empty-state text says what belongs there or how to start it. Worlds is disabled. | `evidence/r14/after/nav-1366-14/sweep.json`; `src/{projects_drawer,work_ledger_ui,generated_people_ui}.js` |
| F17 | Journal, Bestiary, Books, Data and Notebook are five top buttons that open one panel with sibling tabs. 14 top items for what is about 9 destinations. | same sweep |
| F18 | Upstream YAIR (screenshot): every panel ends in a **control strip**: sort row (`Sort by name / value / type`) above category tabs (`All / Equipment / Usable / Other / Favs`; `Skills / Stances / Magic`; log `Levels / Events / Crafting / Combat / Loot`). Content above, controls below, never mixed. Character uses `Stats / Equipment / Tools` tabs, so gear is a tab, not a disclosure. Quests have their own column. | user screenshot |
| F19 | Ours mixes them: Inventory puts `All items / Name / Reverse` dropdowns **above** its title; Reports has two control rows (Filters, Follow dropdown, Latest, Stop combat log, Clear); the global bottom bar holds Save, Export, Import, settings, version, help, Authoring, Layout, Density, hit counter and links. | R14 screenshots |
| F20 | The odd opponent card spans full width with a different layout (F4). | R14 combat screenshot |

### Opponent board room (B)

- B1. Every opponent gets the same cell size and internal layout at a given count. No card stretches.
- B2. An odd leftover cell becomes the **encounter cell**: area progress, groups left, clears, Pause next battle (Proto23's enemy-panel footer). Useful, not empty.
- B3. Count steps: 1 = one large card (Proto23 mirror of You, V17); 2–4 = 2×2 equal cells; 5–8 = compact equal cells (name, letter, hp, cycle, effects row) with the inspected one detailed in hover or the encounter cell; groups for 6+ identical (L4).

### Control strips (K)

- K6. Standard panel anatomy, YAIR style: header (title, count) → content → control strip (sort/filter row, then category tabs). Dropdowns and toggles live only in the strip. One shared component so every panel reads the same.
- K7. Prefer visible segmented tabs for 2–5 choices (YAIR) and a dropdown only for 6+ or rare choices.
- K8. Reports strip: category tabs (All, Combat, Loot, Events, Crafting) replace the hidden Filters menu; Follow, Latest, Stop and Clear condense into one row with a `⋯` menu for rare ones.

### Bottom bar (M)

- M8. Condense the global bar: `Save ▾` (Save, Export, Import, autosave state), `View ▾` (Layout, Density, Authoring), help; version, links and the hit counter move to Settings › About.
- M9. Freed space holds things players use every minute: game speed or pause, a clock, unread notices, or the pursuit tracker below. Choose by use frequency, not by what fits.

### Long-term box (Q)

- Q1. A **Pursuits** box drawing from existing owners: active quests (Journal), chosen projects, ledger obligations, pinned recipes and reminders (Factorio U5). One to three pinned lines, each linking to its owner. No new quest system.
- Q2. Placement options at 1366×768, to mock and compare: (a) the encounter/idle area of Focus when not fighting, (b) a short strip at the bottom of the Inventory column, (c) a tab beside Inventory, YAIR style. Never inside the log column (UR11).
- Q3. It makes the sparse routes (F16) visible only when they have content, so Projects and Ledger stop being empty top buttons.

### Menus (N)

- N1. Group the top bar: Character (Stats, Equipment, Skills), Records (Journal tabs: Quests, Bestiary, Books, Data, Notebook), People (People, Travelers), Work (Projects, Ledger), World (Beginning, Worlds), Settings. Already deferred as "global nav grouping/labels" in R14.
- N2. Empty routes: hidden or dimmed until they have content, Proto23 "UI grows as you learn" (A6/V10), with an empty-state line saying how to start ("Projects appear when you plan something bigger than one craft").

### How to consider these in depth

1. **Control census** (no source edits): every control in every panel and bar, with owner, what it does, how often a player uses it and whether it changes state. Saved as a table.
2. **Placement by frequency × consequence**: always visible → panel strip → `⋯`/dropdown → Settings.
3. **Two or three mockups** at 1366×768 on a populated save (YAIR strip, Proto23 compact, hybrid), each with the same states: fight with 3 and 8 opponents, inventory with filter set, Reports busy, pursuit pinned.
4. **Side-by-side** with upstream YAIR and Proto23 captures of the same states.
5. Weibao picks; the pick becomes a UI_RULES entry so later lanes follow it.

### Dispositions

- **ACCOUNT FOR NOW:** any round touching opponent cards uses B1 equal cells; any new panel control goes in a bottom strip (K6), not above content.
- **LATER / DELEGATE:** census and mockups (steps 1–4) as one research lane: medium model, medium effort; done check = census table plus three mockup sets at 1366×768 with matching YAIR/Proto23 references. Then B2–B3, K6–K8, M8–M9, Q1–Q3, N1–N2 as an implementation round.


## Reconciled follow-up, 2026-10-15

Current actionable synthesis: [next parts refinement](NEXT_PARTS_2026-10-15.md#refinement-grouping-chrome-and-the-complete-journey-2026-10-15).
Weibao permits considering effective grouping; no specific grouped default is accepted.
He rejects retaining the counter/links merely for attribution or precedent. Credits can
live elsewhere. M8's About direction is eligible again; the proposed gameplay footer
needs no counter. Earlier round-specific wording above remains proposal history.
The blanket round-5 instruction that every new panel control goes in a bottom strip
is superseded by UR54: compare placement for the task. No implementation is dispatched.
