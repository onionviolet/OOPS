# Surface types, world-start menus and the drawing board

2026-10-15. Round 4 of the [format and view decision audit](FORMAT_AND_VIEW_DECISION_AUDIT_2026-10-14.md). Weibao:

> Wait I just found the button but it wasnt obvious what it was so that is the issue, Consider menus like World start and stuff, maybe they should be seperate and a pop up or designed in some other way? More to consider? We can move alot of stuff back to the drawing borad to be implemented properly?

> One assumes it would be on the bottom but it is in the center of the villige mixer, but is it even logical to have a villiage mixer? maybe a apothecary? more to consider?

> menu stype mismatch stuff and more? / like the drop downs... (screenshot of Village Local actions)

Consideration run. Already acted on: Q6 is now a discoverability fix, and the running [UI foundation lane](gm/dispatch/ui-foundation-2026-10-15/COMMON.md) has the corrections (bottom-pinned "← Village" back bar plus Esc; one component each for group rows, info blocks and buttons). Everything below is a proposal.

## Why the Village screen feels like a pile

**SF1.** About 28 source modules each mount their own block into `location_actions_div` (grep of `getElementById('location_actions_div')` across `src/`). Each wave added its feature where the player stands. The result is one long column mixing routine actions (Talk, Find work), occasional services (Waypost clerk), unaccepted proposals (Meadow pen · care proposal, Mistglass conservatory), settings (Optional pacing) and one-off decisions (world entry lives in the right column). The screenshot's three visual grammars (rounded group boxes, raw unframed text, dashed and solid buttons) are the visible symptom; the cause is that no rule says **what kind of thing goes where**.

## Surface types: one home per kind of decision

| Code | Type | Examples today | Proposed home | Form |
| --- | --- | --- | --- | --- |
| ST1 | **Routine** | Talk, Find work, gather, train, rest, travel | Center, Local actions | Flat rows, keyboard numbers; at most about 7 visible |
| ST2 | **Place service** | Mixing, repair notes, trade, teaching | A named place with a keeper, entered from Local actions | Center mode with the bottom back bar; the keeper sits in the focus panel |
| ST3 | **Threshold decision** | Visit A Soldier's Life, Your beginning, starts, rebirth/prestige, character creation (parked) | Its own full-screen screen | Preview → compare → confirm → arrival. Rare, weighty, needs full attention and space |
| ST4 | **Quick confirm** | Spend coins, cancel a batch, leave with unsaved work | Small modal | One question, two buttons, Esc cancels |
| ST5 | **Ongoing obligations** | Patrol & custody, Work ledger, agreed duties | Side panel or ledger tab | Status rows with due times |
| ST6 | **Reference** | Bestiary, Anthology, known people, memories, years remembered | Journal tabs | Read-only, searchable |
| ST7 | **Settings and pacing** | Optional pacing, layout, colors, effects | Settings drawer | Out of play space |
| ST8 | **Unaccepted proposals** | Meadow pen care proposal, Mistglass conservatory, Elemental preparation, Waypost clerk (until accepted) | **Projects drawer** | Playable, clearly labelled proposal, never in Local actions until Weibao promotes it |
| ST9 | **Ambient** | Events, combat numbers, rustling | Full-height log column | Colored nouns, filters |

**Pop-up or separate screen?** Use a modal (ST4) only for one-question confirms. World start is not a pop-up decision: it changes where your life happens and deserves a full screen (ST3) with what you keep, what stays behind, the world's rules and a clear "Not now". A side-sheet drawer suits things you want to compare against your inventory or stats (ST2 previews, ST8). Never put a threshold decision in a permanently visible side panel, which is where "Optional worlds" and "Your beginning" sit now.

Proto23 precedent: its staged reveal keeps the screen small until a thing is earned, and its `???????` tabs promise more without listing it. The same thinking applies to ST3 and ST8: hidden until relevant, announced when they unlock.

## The drawing board: triage, not deletion

Weibao asked whether a lot can go back to the drawing board to be done properly. Yes, with one guard: **parking presentation must not delete working gameplay or break saves.** Proposed triage for every surface, applied in the order the foundation lane migrates them:

| Code | Verdict | Meaning | Applies to (first pass, from the Village screen) |
| --- | --- | --- | --- |
| TR1 | **Keep, restyle** | Correct home already; tokens fix the look | Vitals, belongings, character, Talk, Find work, log |
| TR2 | **Rehome** | Works, wrong surface type | Optional worlds and Your beginning → ST3 screen; Optional pacing → ST7; Remembered years / Village neighbors / travelers → ST6 and People |
| TR3 | **Drawing board** | Works, but its design is unclear enough to redo; parked in the Projects drawer with a design note | Village mixing counter (see AP below), Waypost supply clerk, Meadow pen, Mistglass conservatory, Elemental preparation, Village practice and familiar ground |
| TR4 | **Retire** | Superseded or proof-only, no player value | Candidates only after a source check; none named here |

The [U5 surface inventory](gm/dispatch/ui-at-scale-2026-10-14/SURFACE_INVENTORY.md) already maps 177 surface families from the design docs. Reuse it for the full list instead of starting a new census; add a runtime column (where each one mounts today) and a TR verdict.

## AP: Village mixer or apothecary?

A "mixing counter" is a mechanic with no person or place behind it. That is why it feels odd. **Proposal: make it a place with a keeper.**

- **AP1.** The Village apothecary (or herbalist's shed): a named keeper who sells ingredients, teaches methods, buys good vials and keeps opening hours. Their relationship and memory lines use the same focus panel as travelers. Mixing becomes "work at the apothecary's bench", either with permission or for a fee.
- **AP2.** Your own bench later: once you own a mortar and still, mixing at home becomes possible. This follows the existing home and workshop direction, and the apothecary teaches you the way there.
- **AP3.** Per world, the same structure in local dress: a xianxia pill furnace and elder, a Potions classroom or apothecary shop in the Harry Potter world, an alchemist's guild in D&D. Each world keeps its own rules; only the place-with-keeper pattern repeats.
- **AP4.** Save safety: rename the label and place framing only. Keep internal ids (`village.mixtures@1`, `MIXTURE_ID`), products and learned methods unchanged, so existing saves load as they are.
- **AP5.** The pattern generalizes: **every workstation lives at a place, and most places have a keeper.** Repair notes belong to the smith or the waypost clerk's office; training belongs to a yard with a trainer. This feeds the scene panel (people present), the focus panel (keeper) and causal stories (the keeper can be away, ill or owed a favor).

## More to consider

**ACCOUNT FOR NOW**

- **MA1.** The foundation lane's S3 Projects drawer implements ST8. TR2/TR3 moves beyond that wait for Weibao's go on this triage, so the lane does not redesign world-start menus (already written into its brief).
- **MA2.** Unlock announcements: when something moves into a drawer, the player still needs to hear about it. Use one log line plus a dot on the drawer, like Proto23's new-item blink. Nothing should be silently hidden.
- **MA3.** Labels: name buttons by destination or outcome ("← Village", "Mix one vial · 3 min"), not by mechanism ("Back to local actions"). That also fixes Q6-type confusion elsewhere.
- **MA4.** The threshold screen (ST3) is also the right home for future prestige, rebirth and the parked hero creation, so it is worth designing once.

**LATER / DELEGATE**

- **ML1.** A surface triage pass: add runtime mount points and TR verdicts to U5's inventory. Suits a read-only Codex lane after the foundation lane's S1 lands.
- **ML2.** Threshold screen design for world entry, starts and rebirth: one design doc, then a slice.
- **ML3.** Apothecary conversion (AP1, AP4) as a small slice once the focus panel exists.

## Questions

**Answered 2026-10-15:** Weibao accepted Q7, Q8 and Q9. Triage and apothecary are queued after the UI foundation lane: [dispatch](gm/dispatch/ui-triage-apothecary-2026-10-15/COMMON.md).

| Code | Question | Default if confirmed |
| --- | --- | --- |
| Q7 | Adopt the surface types (ST1–ST9) as the placement rule, with world start as a full screen? | Recorded; future features must declare a type |
| Q8 | Go ahead with TR2/TR3 triage (rehome and park in the drawer), saves untouched? | Accepted; queued after NAV and the later Shell variant |
| Q9 | Turn the mixing counter into a Village apothecary with a keeper (AP1–AP4)? | Accepted; after TRIAGE |

### Delivery and queue, 2026-10-15

S3/C1 and the [NAV correctness slice](gm/dispatch/ui-triage-apothecary-2026-10-15/NAV_REPORT.md)
are technically checked; visual acceptance remains open. NAV fixes the Projects
opening hang and adds named navigation, shared headers/history, list bearings
and linked notices without a save schema change. The newer user-authorized
[Proto23 Shell variant](gm/dispatch/ui-foundation-2026-10-15/PROTO23_SHELL_VARIANT.md)
follows NAV before TRIAGE/APOTHECARY. Root holds the queue and assigns the next
writer after NAV release. These reports establish technical state, not visual
acceptance of C1 as the final look.

Historical queue wording: Q8 previously said "Triage lane after S1" and Q9
"Small slice after S3". The accepted sequential NAV → TRIAGE → APOTHECARY queue
superseded those early slice references, then the later Shell instruction placed
that bounded variant between NAV and TRIAGE. Earlier consideration text above
is preserved as the dated analysis that led to the accepted placement rules.
