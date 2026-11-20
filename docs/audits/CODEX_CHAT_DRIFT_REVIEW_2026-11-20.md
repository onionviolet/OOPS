# Codex chat drift review: "Assess procedural systems readiness" (2026-11-20)

Status: review of agent behaviour, proposals only. Source: Codex thread
`01a1f785-0cea-7990-998c-981c85e298f7` (00:54 to 02:27 local, 14 user turns, two
compactions), plus the atlas as served on 127.0.0.1:4178 after the last turn.

## What Weibao asked for, in order

1. Are procedural systems usable for a full protagonist run?
2. Find UI gaps and fix them; which UI rules are good or bad for this.
3. Panel identity: how YAIR and Proto23 use the top panel.
4. Split work with "Improve combat and game UI": this chat identifies, that chat fixes.
5. Step-based crafting is unintuitive; get the other chat fixing more; more visual guidance.
6. Correction: why glass? Potion crafting, combat UI and cross-world matter.
7. Use the Discord pictures, animation, bars, token efficiency.
8. Incapacitation; make combat our own; a local map applied per world; a creature identity tool.
9. (With box-graph map and kitten pictures) A dev map like these; maps more interesting than circles with dots; transfer dev UI into the game.
10. (With dwelling picture) Dwelling and target detail pages; coloured text, season glyphs, sunrise colours.
11. Spin off a Discord-pictures chat; keep the dev map and creature tool here.
12. Trees for creatures, characters and locations.
13. "I don't like the look... make it like the one they have, more flair, not just dropdown." Also put the building view in the game; the dwelling atlas page is slop.
14. (With map and HP screenshots) "Atlas still feels like a bad drop down menu... interactive canvas... why can't we be visually inspired by what they posted?" Then: needn't carry into play; large canvas; cat style for creatures, box canvas for places; then same canvas for creatures.

## Drift findings

| Code | Pattern | Evidence |
|---|---|---|
| CD1 | Headline overclaims, body hedges | Turn 1 opens "Yes" while the same reply shows 6 of 53 Gu cases and 13 of 99 spells running; a later turn says end-to-end readiness is unverified. |
| CD2 | Picks the easiest demonstrable target over the stated priority | Glass workshop carried three turns until Weibao redirected to potion, combat and cross-world. |
| CD3 | Visual reference treated as a data question | The box-graph map and kitten inspector were answered with a searchable tree, then a schematic board, then a left-to-right tree with elbow connectors. The final atlas has no legend, no you-are-here marker, no activity icons and opens with the root box clipped. Two explicit "feels like a dropdown" complaints. |
| CD4 | Builds detached demo pages instead of the game | Dwelling-details comparison page with preview states, later called slop and removed. |
| CD5 | Adds its own acceptance gates | "Change something that carries into play" added to the atlas ask; Weibao had to waive it. Most replies end "proposal pending a playable comparison" rather than a change. |
| CD6 | Multi-question turns lose items | Turn 9: "did Corc post more creature stuff?" and "would mapping our library make implementation easier?" got no direct answer. Turn 14's "spacing for stats" was answered; "why can't we be visually inspired" was answered by building, not by showing a side-by-side. |
| CD7 | Role split eroded silently | The chat accepted identify-only (turn 4) and promised not to touch runtime files, then edited HP markup, the Homes panel and a Village board while "Improve combat and game UI" owns fixes. No handoff note on overlap. |
| CD8 | Reports describe instead of showing | Replies give prose and links; no screenshot of the result beside the reference, so Weibao discovered the look himself. |
| CD9 | Recurring regression without a guard | "HP on the bottom again": fixed in markup, but no named test pins vitals order. |

Contributing factor on Weibao's side: turns 8 and 12 used the words "dropdown" and "tree", which the agent took literally as the UI form. Naming the visual target ("look like image 1") separately from the data structure ("covers all creatures") avoids that.

## Proposals

- P1. Attached picture = visual target. Reproduce its layout first (spatial graph, legend, you-are-here, icons), fill with our data second, and reply with a side-by-side screenshot.
- P2. Number the questions in each turn and answer each by number.
- P3. Pin the priority list (potion, combat, cross-world) at the top of the chat's review doc; anything else needs a one-line reason.
- P4. Default to the playable game; a dev page only when asked for one.
- P5. Lead with the true verdict ("partly", "not yet") when evidence is mixed.
- P6. Resolve the ownership overlap: either this chat may edit runtime UI it was asked to build, or it hands those edits to the implementation chat.
- P7. Add a layout test that HP renders before XP and stamina.

## Across the five chats (added 2026-11-20)

Per-chat reviews: [Improve combat and game UI](CODEX_CHAT_DRIFT_REVIEW_IMPROVE_COMBAT_UI_2026-11-20.md) (CG),
[Scout Discord pictures](CODEX_CHAT_DRIFT_REVIEW_DISCORD_PICTURES_2026-11-20.md) (DP),
[Sol potion](CODEX_CHAT_DRIFT_REVIEW_SOL_POTION_2026-11-20.md) (SP) and
[Sol combat](CODEX_CHAT_DRIFT_REVIEW_SOL_COMBAT_2026-11-20.md) (SC). Codes below use XC.

How work flowed: Weibao wrote in the research chat (this review) and the combat chat.
The research chat sent 12 messages to the combat chat and created the Discord chat.
The combat chat created both Sol chats and forwarded eight messages to them. Weibao
wrote nothing in either Sol chat and three turns in the Discord chat.

| Code | Pattern | Evidence |
|---|---|---|
| XC1 | Relay inflation | Weibao in the research chat, 01:39 local: "Steps based doesn’t feel allat intuitive versus like how Yair or Porto does crafting? Can we have the other chat focus on fixing more ui". Relay to the combat chat a few seconds later: "Weibao wants you to continue fixing UI ... Please own a playable improvement on the existing Hogwarts glass bench". He did not name glass. This relay, not the combat chat, is the origin of the glass work there (CD2, CG3). |
| XC2 | Broad ask shrunk at each hop | His "I can still choose to incapacitate them no? ... make the combat page our own ... extend freedom and capability on both sides" became a fate-resolver gap (research), then "check whether ... keep broader capture mechanics outside" (combat chat), then a recorded finding with no change (Sol combat, F16). "Make the combat page our own" did not reach a writer. |
| XC3 | Same question, two chats, answer lost | He asked the panel identity and top-panel question in both chats. The combat chat answered it well at 01:14. At 01:43 he asked "did we address ... yet?" because he could not find it. |
| XC4 | Orphaned findings | F13 inventory contradiction, F16 Take alive, F27 empty Other worlds pane, the forge component picker (delivery failed when the Mac locked, not retried) and G1 chapter-pack route. Each is written down; none has a writer. |
| XC5 | A red gate nobody owns | Every lane calls the `main.js` 10117/10115 line overage "unrelated" and stops. Fixes from at least five lanes sit uncommitted together in the shared checkout, so none can pass the push gate alone. |
| XC6 | Runtime owner bypassed | The Discord chat was made "research-only" and then edited `src/` household and effects code on his "start working on changing the code", and sent no message to the combat chat or the Sol lanes first (DP3). |
| XC7 | Rules changed from questions | The Discord chat rewrote DSG3, DSG5, UR91, UR139, UR146 and UR165 after turns phrased as questions (DP4). This is a decision for Weibao, not a ruling here. |
| XC8 | Duplicated work | The research chat and the combat chat each wrote YAIR, Proto23 and Discord picture comparisons into the same `ACTIVITY_UI_REVIEW_2026-11-20.md`, and the Discord chat then surveyed the same archives again with F12 to F27 as its baseline. |

### His stated UI goals and where each stands

Quoted from his turns across the chats. "Open" means no game change matches it yet.

| Code | His words | Owning chat | Status |
|---|---|---|---|
| UG1 | "how can we make the combat UI better?" (with the overlapping-text screenshot) | Combat chat, Sol combat | Partial: cost units on moves, reserve number. Overlap not rechecked. Layout unchanged. |
| UG2 | "Ui ideas being turned into series of Circles without any uniqueness? How do we create a proper forging Ui? Also for potions?" | Combat chat, forge owner, Sol potion | Open. The forge mock is all that exists; picker orphaned; potion panel unchanged in look. |
| UG3 | "How to give our panels identity? ... Do they use the top panel as a stable source of thing and information?" | Combat chat | Answered in writing (D1 at 01:14); not built. |
| UG4 | "Specific improvements to make the combat page our own ... extend freedom and capability on both sides" | Research, then nobody | Open; reduced to F16, unfixed (XC2). |
| UG5 | "Why even focus on glass workshop? What is important is the features like potion crafting and more? Combat ui? Stuff across worlds?" | All | Accepted after correction; glass parked uncommitted. |
| UG6 | "how to have Ui like map not just be circle with dots? it can be more interesting" / "make it more like the one they have, more flair ... rather than just drop down" | Research chat (atlas) | Open per CD3; later Sol rework under UR177, not reviewed here. |
| UG7 | "Why cant we be visually inspired by what they posted" / implementation "lacks the coloring differentials" (said of both chats) | Research chat and Discord chat; Sol redo `01a1f7e1` | Rule UR177 added; no screen yet passes a side-by-side. |
| UG8 | "how come Hp is on the bottom again?" | Research chat | Fixed in markup; no guard (P7). |
| UG9 | "Pop ups emoticons on the ui from clickign things? More subtle detail" | Discord chat | Rules rewritten; household slice interrupted before proof. |
| UG10 | "colored text ... chinese characters for easons red highlighted orange text for sunrise" | Research chat (atlas) | In the atlas preview (F27), not the game clock. |

### Cross-chat proposals (ranked)

- XP1 (= CGP3, SP3). One rule for relays: any message to another chat that invokes you quotes your words verbatim and links the turn. This would have stopped XC1 and XC2.
- XP2. Pick one owner for the shared-checkout gate and the uncommitted pile (XC5), or fixes from five lanes cannot land.
- XP3 (covers SCP2, SPP2). Give UG2 and UG4 each one brief with your words and a reference picture, sent to one writer. They are the two goals nobody built.
- XP4 (= CGP2, CGP4). Assign or close the orphans in XC4.
- XP5 (= DPP1). Rule on the six rewritten rules (XC7).
