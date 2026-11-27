# OOPS end goal

*Owner of where OOPS is heading and how the Codex lanes line up behind it. Set by the OOPS coordinator on 2026-11-26 from Weibao's words. Direction itself lives in [USER_VISION](USER_VISION.md); this file sequences it. Replace a milestone's status line when it changes.*

## The goal, in his words

> Keep OOPS a progression RPG with idle play

(2026-11-26 01:50.) You live different lives under each world's rules: a protagonist, a minor character or an ordinary local, with choices that change a shared world ([player-directed lives](USER_VISION.md#player-directed-lives)).

Current direction for the next one to two weeks:

> Foundation and making atlas actually reflect my vision? Standardizing UI and more?

Pace: "As much as needed as we get a good quality." [Nov 26 direction](USER_VISION.md#nov-26-coordination-direction)

## Milestones

A milestone is done only when every done condition has a commit and a capture or replay from the normal game entry (the [checkpoint rule](../PROJECT.md#current-focus)). Status reflects the last landed commit.

| # | Milestone | Done when (observable) | Status |
| --- | --- | --- | --- |
| M1 | **Nov 26 direction wave lands** | (a) One Gu foundation slice runs as data over the shared law and is played from the normal entry, with `gate:save` passing. (b) Every Atlas section names its vision theme or playable gap, and each entry's playable, partial or reading-only label matches its receipts on the adopted archive. (c) The ordinary-day screens of Fang, Klein and Harry follow the [shared UI standard](../DESIGN.md#shared-ui-standard), each with a before/after pair at 1366×768 and 1920×1080. | Met. Done so far: `gate:save` (c9441cdba), Atlas vision map (600360dd0), Nox consumer (5aca1498b), Harry library and Capability runs on the standard (b4226af6e, ea471bd05). Atlas duplicate homes folded to one each (dbb1f93b3, [audit](audits/ATLAS_DEDUPE_2026-11-26.md)). Gu wall exchange priced per activation from catalogue data, with a revision 1 save resuming mid-exchange (c3954e713). **M1a met.** The shared Gu law settles the wall exchange from data, the bespoke wall count fell from 1 to 0, and the normal-entry replay and all four save-gate fixtures passed. [Wall outcome proof](representations/evidence/gu-wall-outcome-2026-11-26/README.md) OQ5 fixed with Graphite tokens; Klein office day and Fang kitchen on the standard (ef01bd5a6, 48bde9bf3, b135cd2f7). **M1c met.** [Fang kitchen](representations/evidence/fang-kitchen-standard-2026-11-26/README.md), [Klein office day](representations/evidence/klein-office-day-standard-2026-11-26/README.md) and [Harry school day](representations/evidence/harry-school-day-standard-2026-11-26/README.md) each have before/after pairs at 1366×768 and 1920×1080. **M1b met.** Systems links census mechanisms and evolution policies to source records and scoped play receipts. The adopted archive passes the label check, and Systems and its Find entries were replayed at both sizes. [Systems proof](representations/evidence/atlas-systems-2026-11-27/proof.json) A2’s Weightlifting specialization remains playable. A2b adds in-place forms for Iron skin and a grade climb for Sleeping, with both routes proved in the browser. [Proposal](PROGRESSION_GATE_RULES.md#skill-evolution-proposal-2026-11-26) · [A2b proof](representations/evidence/skill-evolution-ev2-ev3-2026-11-26/README.md). A2c adds Counterstep fusion and Quiet recovery consolidation, each replayed at both desktop sizes with the shared Growth queue and all save routes. [A2c proof](representations/evidence/skill-evolution-ev4-ev5-2026-11-26/README.md). A2d adds skin effects through armor and Mentor path evolution through Growth. Both routes have rebuilt browser and persistence receipts at both sizes. [A2d proof](representations/evidence/skill-evolution-armor-ev6-2026-11-26/README.md) A4 adds earned and bankable Village recovery points with upkeep and respec. [SM1 proof](representations/evidence/litrpg-sm1-sm5-2026-11-27/proof-sm1.json) A4 also adds a timed active sleep ability slot with continued recovery during swaps. [SM5 proof](representations/evidence/litrpg-sm1-sm5-2026-11-27/proof-sm5.json) |
| M2 | **An idle return is worth coming back to** | For each lead life, a replay leaves the game idle for at least 8 game hours, returns, and shows what the routine produced, what it cost and one consequence to act on. Save, reload, export and import keep it. | Not started. Named as a gap in the [Atlas vision audit](audits/ATLAS_VISION_COVERAGE_2026-11-26.md). |
| M3 | **Ordinary and inherited starts are playable** | A local and an inherited start in two worlds reach a first ordinary day from the new-game screen, each with its own receipt. | Not started. Same gap list. |
| M4 | **Verified on Weibao's route** | The installed Tauri app runs the M1 to M3 routes. The full suite passes on an idle machine. A check confirms no long verbatim book text is in the public tree. | Open. Installed app, 8 GB target and full suite are open in the [Nov 26 intake](gm/ABSORB_2026-11-26.md#open-checks). |
| M5 | **`v0.1.0`** | The work meets the [YAIR release scale](reviews/YAIR_RELEASE_SCALE_2026-11-08.md) and Weibao says yes to the push. | Waiting on M1 to M4. |

<a id="future-rpg-view-with-a-map"></a>

## Future RPG view with a map (consideration)

Weibao, 2026-11-26: "for all implementations to also be able to serve a rpg view with a map in the future". A design consideration for every slice, not a gate on current milestones. [His words](gm/USER_VISION_LOG_2026-11.md#keep-a-future-rpg-view-with-a-map-possible-2026-11-26)

- **R1 · Loop-neutral rules.** Mechanics settle through the kernel's quote, settle and receipt, with the same result whether time passes in one jump or step by step. A mechanic never assumes it is driven by an idle timer.
- **R2 · One active proof.** A new mechanic shows its effect once through an interaction the player drives, such as a choice, a scene or a fight turn, as well as through idle routine.
- **R3 · Places carry position.** A new place, route or encounter records where it is and what it connects to (the existing place and travel data), so a map view can draw it later without new rules.
- **R4 · Views read one model.** Screens read the same observer-safe read model (DSG11), so a later RPG or map view is another view over it, not a second copy of the facts.

The YAIR development merge includes upstream's canvas map prototype. In the game, open Data, then Open YAIR data viewer, then Map. It reads the registered YAIR locations and their connections, travel times and authored azimuths. This shares location records with play for R4. The prototype still shows the developer graph. A player map needs the observer-safe location projection. [Upstream merge](UPSTREAM_DIRECTION.md#2026-11-27-yair-development-merge-u1)

The idle game stays the product ([standing direction](USER_VISION.md#nov-26-coordination-direction)). These keep a later RPG front end a choice of view rather than a rewrite.

## Codex lanes

One Codex writer per lane, run one at a time in the primary checkout because every lane rebuilds `dist/bundle.js`. Each lane commits its own paths after a normal-entry proof.

| Lane | Serves | Owns | First slice |
| --- | --- | --- | --- |
| **A · Foundation** | M1a, then M2 | `src/gu_*`, Gu world packs, the kernel per the [foundation plan](PROCEDURAL_FOUNDATION_PLAN.md) | Moonglow and Water Shield wall exchange: give the essence debit an exact cost owner and a compatible save revision, then move it to the Gu law. |
| **B · Atlas** | M1b | `prototypes/world-atlas/`, Atlas docs | Fold the three surfaces built twice by the merge into one home each ([OQ1](OPEN_QUESTIONS.md)). Then audit each section's status labels against receipts on the adopted archive. |
| **C · UI standard** | M1c, then M3 | Screen CSS and renderers one screen at a time, DESIGN.md's standard | Klein's office day and Fang's kitchen on the standard, one commit each. |
| **D · Verification** | M4 | Gate scripts, receipts | Idle-machine full suite and the installed-app replay of M1 routes. |

Questions that wait for Weibao go to [OPEN_QUESTIONS](OPEN_QUESTIONS.md) with a recommended default.
