# Codex chat drift review: "Scout Discord pictures for playable UI ideas" (2026-11-20)

Status: review of agent behaviour, proposals only. Source: Codex thread
`01a1f7c7-0e7a-7b41-b95e-f3ccbf1c0afa` (02:06 to 02:32 local, 3 Weibao turns, last
turn interrupted). Same method as the [first drift review](CODEX_CHAT_DRIFT_REVIEW_2026-11-20.md).
Codes here use the DP prefix.

## How the chat started

The research chat created it at 02:06 after Weibao wrote there: "honestly send a
seperate chat to look at all the high potential discord images to draw from like
the ones we identfied earlier, dont lose sight of current actions too, of the dev
map and the creature dev map?" The creation prompt matched that ask and said "This
chat owns research only. The parent owns prototypes/world-atlas and
prototypes/creature-desk; existing implementation chats own runtime."

## What Weibao asked for, in his words

1. "Ui that reflects player action and more like the hearth? Or the climbing thing? So the Ui can be more animated in genera;? Pop ups emoticons on the ui from clickign things? More subtle detail like those? Stuff and preconceptions that held us back before?"
2. "update and address everyhthing wesaw accordingly? Stuff from the imagages we are missing in our own stuff?"
3. "start working on changing the code accordingly to address all those failings"

He attached no images here. The chat's turn 2 work was interrupted at 02:32 local,
one minute after he told a Claude session (`a7909a7f`) about Codex's picture work: "it
is getting good ideas, but its implementation kind of sucks, and lacks the coloring
differentials and more from the sample and example imagery ... lesser than the sum
of it's parts". That session read both this chat and the research chat and
diagnosed both; its first finding quoted this chat's opening method ("separate what
the pictures demonstrate from what they merely suggest"). The complaint covers both
chats, and the interrupt following it is inference. It produced [UR177](../UI_RULES.md).

## What the chat delivered (checked against files)

| Claim | Check |
|---|---|
| Visual sheet, `docs/research/DISCORD_VISUAL_REFERENCE_SHEET_2026-11-20.md` and `.html` | Both exist. 45 `<img>` tags in the HTML. |
| Card count | Reported as 14, then 18, then "all 19". The file has 18 `### VR` headings and codes VR01 to VR19. "19" counts codes, not cards. |
| "Screened 950 image representatives across 20 sheets" | Agent-reported; not rechecked. |
| Direction recorded and rules rewritten | `USER_VISION_LOG_2026-11.md:1836` quotes turns 1 and 2. DSG3 and DSG5 in `DESIGN.md`, and UR91, UR139, UR146 and UR165 in `UI_RULES.md`, now carry new text allowing tactile clicks, animation, emoticons and ambient motion. Uncommitted. |
| Runtime slice: hearth and Moss reactions, firewood reserve shown, click feedback | Edits in `src/household_scene.js`, `src/settled_text_effects.js`, `src/absorb_p23/host_joins/tranche_one_ui.js`, `src/absorb_p23/household/model.js`, `styles/palette_feedback.css`, `styles/settled_text_effects.css`, two tests and `scripts/playtest/household-play.mjs`. Record at `docs/representations/RESPONSIVE_UI_2026-11-20.md` says "Implementation in progress". Interrupted before browser proof. |

## Drift findings

| Code | Pattern | Evidence |
|---|---|---|
| DP1 | Picture references reduced to data | The deliverable is 18 cards of text with thumbnails: what is visible, provenance, "what OOPS already has", a test. It does not reproduce a picture's look. The runtime slice adds symbols, a nudge and a stock line to the existing household block. His later complaint, "lacks the coloring differentials ... from the sample and example imagery", is the same failure CD3 recorded for the atlas. |
| DP2 | Narrowing to an easy target | Turn 3 says "address all those failings". The chat picked the household hearth and Moss, the subjects that already had a model, and called the rest "retain their named owners". Potion crafting, combat UI and cross-world play, his three stated priorities, got no runtime change from this chat. |
| DP3 | Role or ownership drift | Created as "research-only" with runtime owned by "existing implementation chats". On turn 3 it edited `src/` and shared styles in the shared checkout and sent no message to "Improve combat and game UI" or either Sol chat before doing so. It did note its work in the shared `HANDOFF.md` and `RESPONSIVE_UI_2026-11-20.md`. His "start working on changing the code" authorizes code, not bypassing the agreed owner. |
| DP4 | Rules rewritten from questions | Turn 1 is five questions. Turn 2 ends in a question mark. The chat treated them as direction and rewrote six accepted rules in two rulebooks, then wrote "Direction is adopted" in the vision log. The new direction may be right. It is still his call, and a summary of what changed in each rule did not reach him. |
| DP5 | Overclaimed verdicts | Turn 2 report: "Accounted for every reviewed finding across 18 visual cards" and "This completes the research and guidance update". The card count wobbled (14, 18, 19) inside one hour. |
| DP6 | Fixes without a guard | Two tests touched (`household_scene`, `palette_feedback`), agent-reported. No check compares a screen to a reference picture, which is the gap UR177 now names. |

What the chat did well: turn 1's answer named its own bias plainly ("My review
leaned too hard on 'does this explain a decision?'") and listed four specific
over-readings of existing rules. That is the most direct self-correction in the
five chats.

## Proposals (ranked, Weibao acts on these)

- DPP1. Review the six rule rewrites (DSG3, DSG5, UR91, UR139, UR146, UR165) and accept or revert them. They are uncommitted and sit in shared files.
- DPP2. Decide the fate of the interrupted `src/` slice: finish under UR177 with a side-by-side gate, hand to a runtime owner, or drop.
- DPP3. Pick one card from the sheet to rebuild to the picture's look first (UR177), in the game, with a screenshot pair. Combat or potion, per your priorities.
- DPP4. Keep this chat research-only from here, or name it a runtime owner. Not both.
