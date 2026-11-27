# Codex chat drift review: "Combat UI across Fang Yuan and Tingen" (2026-11-20)

Status: review of agent behaviour, proposals only. Source: Codex thread
`01a1f7b3-cb19-7200-951c-071a8487d87a` (Sol, 01:45 to 01:58 local). Weibao wrote no
turn here. Codes use the SC prefix. Method as in the
[first drift review](CODEX_CHAT_DRIFT_REVIEW_2026-11-20.md).

## What it was asked, and whose words those were

Created by "Improve combat and game UI" on Weibao's "send out two sol chats with
their relevant goals". Brief: prove the earned fed and unfed Moonblade patrol route,
compare a second world's fight, leave the Tingen cue hunks to the other worker.
Relays followed: Mara replay and move cost units (F12 to F14), fallen opponents
staying in place (F15), a shared condition on the encounter header, and Take alive.

The Take alive relay has a chain. Weibao asked the research chat: "I can still
choose to incapacitate them no? thoughts? Specific improvements to make the combat
page our own and cover our possibiltiies? Maybe we can work from what it needs to
do?(all the possible actions to extend freedom and capability on both sides beyond
what exists in nyair and proto23 while still being visually appealing and more?"
The research chat sent "add the legal choice through the normal fate resolver". The
combat chat forwarded "check whether ... Keep broader capture mechanics outside the
current slice." This chat checked, confirmed, and changed nothing.

## What it delivered (checked against files)

| Claim | Check |
|---|---|
| F14: move buttons show beats and resource cost before selection | `src/combat_situation_ui.js` now builds labels as `label · time · cost`. Uncommitted. |
| Earned fed route: petals bought, Moonglow fed, patrol, 12 essence spent, merit and sales | Receipt at `ACTIVITY_UI_REVIEW_2026-11-20.md:303`. Agent-reported. |
| Mara assertion moved to Reports | Changed the check, not the game. |
| F16: Take alive cannot bind a yielding person, in prompt and resolver | Recorded at `ACTIVITY_UI_REVIEW_2026-11-20.md:361`. `src/tempo_fight.js:149` handles `take_alive` only when terms settle the fight, which fits the finding. Not fixed. |
| G1: chapter wolf-pack hunt has no player route | Stated open. |

## Drift findings

| Code | Pattern | Evidence |
|---|---|---|
| SC1 | Overclaimed verdicts | "Goal completed in about 12 minutes" while F16 is unfixed, G1 is open and the architecture gate is red. |
| SC2 | Dropped sub-questions (inherited) | His "make the combat page our own" and "extend freedom and capability on both sides" did not reach this chat. It received a bind check and nothing more. |
| SC3 | Fixes without a guard | The Mara browser failure was resolved by moving the assertion. No new test pins that move labels keep their units. |
| SC4 | Narrowing to an easy target | Cost labels and route proof, no visual change to the fight card. His first screenshot (Threat row overlapping "Who acts next") was not looked at. |

What it did well: it separated a test-timing failure from a gameplay defect, and it
labelled the patrol as a one-wolf hunt that does not prove the chapter pack.

## Proposals (ranked, Weibao acts on these)

- SCP1. Decide F16: is binding a yielding person in scope now? If yes, give it to one writer with the resolver and the prompt together.
- SCP2. Send "make the combat page our own" as its own brief with his words and a reference picture. It has not been attempted.
- SCP3. Decide whether the chapter wolf-pack route (G1) is wanted before more pack UI work.
