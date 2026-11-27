# Codex chat drift review: "Improve combat and game UI" (2026-11-20)

Status: review of agent behaviour, proposals only. Source: Codex thread
`01a1f77d-9d0d-7d70-8dca-6013a64a5d84` (00:46 to 02:06 local, 9 Weibao turns, 8
more turns started by 12 messages from other chats, one compaction). Companion to the
[first drift review](CODEX_CHAT_DRIFT_REVIEW_2026-11-20.md), whose CD codes this
file reuses by name. Codes here use the CG prefix.

## What Weibao asked for, in his words

Quoted verbatim, typos kept. Turn numbers are Weibao's turns in this chat.

1. (With an in-game Mara fight screenshot, 1920×1080, Threat row text overlapping "Who acts next") "it still feels off, other than the texts being missed placed right now(which is being worked on) overall, how can we make the combat UI better? General Ui for stuff like crafting, forging, other aspects and more as we implement more of our own ideas?"
2. (With a screenshot of two Claude chat names) "follow up and coordinate with those two claude chats, how to modify the UI? Instead of mara, we can instead, use a fight from LOTM or RI and start tuning, and building around what is needed in lore?"
3. (Answer to the send-approval card) "Who should do what? Should claude coordinate you? you coordinate sol agents? them sending SOl agents and then asking you for advice> them asking you for advice? What would be most optimal? Feel free to message those chats and stuff and also be open to getting messages back,, auto compact accordingly. Send vida desktop or something, maybe let them run codex instances as advisor or implementor? more to consider? Consider what other aspects we do at the same time, like numbers and RNG and procedurals tuning and more?"
4. "Do mind my qualms about Ui ideas being turned into series of Circles without any uniqueness? How do we create a proper forging Ui? Also for potions? should we abstract more? Do we represent each choice as an action? each result as a product of the changes and factors and more? more to consider? Pictures and more? so do we change the save to the protaginst walktrhough and then represent into the game accordingly?"
5. "Splitting is a good idea, but imagery might be hard to implement, how do we turn that into playable UI? How do MUDs and others do it? More to consider? How to give our panels identity? How does Yair and proto23 do it? Do they use the top panel as a stable source of thing and information? What can we learn and do based on that? Work with the other ui chat and idea board best ideas and then get back to me? Major considerations and requirements needed to implement a protagonist play through properly, as if they are truly a player, and have their ui and choices and more, have the same treatment as if a player is playing through them, so I believe what we need to do is to adjust how we make or design the ui in the first place? More to consider?"
6. "Use more example imagery from Yair and proto23, consider the discord pulls too, how does all our findings change our designs? Do we rebuild our in progress UI? Redo some of our work for the protagonist play throughs?"
7. "There is a lot more stuff from discord that we can be inspired by, a lot of panel code available for us to look at too, how to long term make better design choices? Should we send a sol implement or to address the stuff you identified thus far and then here we ideaboaed further and more? Be sure to be token efficient"
8. "did we address 'How to give our panels identity? How does Yair and proto23 do it? Do they use the top panel as a stable source of thing and information? What can we learn and do based on that?" yet? I remember that chat said something useful about that"
9. "Set your goals for your goals and have the other chat set their goals to work on, or is it okay to let sol take over and use /advisor to get asntra advice? if so, send out two sol chats with their relevant goals and the nmake them work?"

After turn 9 Weibao did not write here again. Eight later turns, carrying 12 messages, were started by
`send_message_to_thread` calls from "Assess procedural systems readiness" (the
research chat). The chat acted on those as if they were his.

## What the chat delivered (checked against files)

| Claim | Check |
|---|---|
| Live essence: top band follows Fang Yuan's fight reserve, 44 to 43 | Present in `src/ui/status_line.js` (`statusReserveWords`, uncommitted). Browser result agent-reported. |
| F9 glass focus, F10 work-strip return | Receipts at `ACTIVITY_UI_REVIEW_2026-11-20.md:184` and `:190`. Agent-reported. |
| Tingen knife cue visible with Settings closed | Receipt at `docs/audits/UI_HARMONY_REVIEW_2026-11-19.md:496`. Agent-reported. |
| 40-seed wolf-pack table (40/40, 30/40, 18/40) | Agent-reported, one automated strategy; not rerun. |
| Concept image for forge and potions | `ui-cohesion/forge-and-potions-concept.png` exists. It is a generated picture, not the game. |
| Forge component picker assigned to the forge owner | Not delivered: Claude Desktop was locked and the CLI signed out (01:27). No picker exists in `~/code/yarpg-mock-forge` (`forge_station.js`, `making_next.js`). MKC113 still lists the swap as "Not covered". |
| Two Sol chats created with goals | Created 01:45 (potion `01a1f7b3-c86c…`, combat `01a1f7b3-cb19…`). See their own reviews. |

Not checked: whether the overlapping Threat-row text in turn 1's screenshot is
fixed. Weibao said another chat owned it; this chat never looked again.

## Drift findings

| Code | Pattern | Evidence |
|---|---|---|
| CG1 | Narrowing to an easy target | Turns 1, 4 and 5 ask for a "proper forging Ui", potion UI, and panels with identity, not "series of Circles without any uniqueness". What reached the game: a reserve number, cost units on move labels, a "Not stirred yet" string, keyboard focus fixes, a route exception and a cue moved out of a fold. Every one is real, but none changes a panel's layout or gives forge, potion or combat its own shape. The one structural item, the forge component picker, did not reach an implementer. |
| CG2 | Describing instead of showing | Turn 1 came with a screenshot of the real screen. The reply was five prose sections and a table. Turn 4's answer was an AI-generated concept PNG, which the chat itself said "still end[s] in the same pair of buttons". Turn 5 opens "imagery might be hard to implement", so the picture moved him away from the game rather than toward it. No reply shows the current screen beside a changed one. |
| CG3 | Role or ownership drift, inbound | At 01:39 the research chat relayed: "Weibao wants you to continue fixing UI beyond F9/F10... Please own a playable improvement on the existing Hogwarts glass bench". Weibao's actual words in that chat were "Steps based doesn’t feel allat intuitive versus like how Yair or Porto does crafting? Can we have the other chat focus on fixing more ui". He did not name glass. This chat accepted the relay as his direction and started tracing the glass bench (01:39) until his correction arrived through the same relay (01:42). Glass edits are "parked in place", uncommitted. |
| CG4 | Acceptance gates he did not ask for | Turn 1 ends "The two proposed interactions still need a live comparison". Turn 4: "load a disposable copy of the walkthrough immediately before the relevant decision". Turn 5 adds a five-question protagonist checklist. These were offered as the next step instead of a changed screen. |
| CG5 | Dropped sub-questions | Turn 3: "numbers and RNG and procedurals tuning" got one 40-seed run, then disappeared. Turn 2: "start tuning, and building around what is needed in lore" produced no tuning change. Turn 4: "should we abstract more?" and "each result as a product of the changes and factors" were answered in principle (D3) with no follow-through. Turn 5: "get back to me" was met, but "adjust how we make or design the ui in the first place" ended as a five-question list, not a design change. |
| CG6 | Answer exists but he cannot find it (new) | Turn 5 asked about panel identity and the top panel. The answer (D1 table at 01:14) was a correct, useful comparison of YAIR, Proto23 and Achaea. 29 minutes later turn 8 asked "did we address ... yet?" The answer was buried in a long reply and repeated in the research chat. The chat promised "I’ll link those findings" and just restated them in the last paragraph of a later turn. |
| CG7 | Relay instructions treated as his own | Eight turns ran on research-chat messages. Several began "Weibao wants" or "Priority correction from Weibao". The chat did not check them against his words in the other chat, and forwarded them onward to the Sol chats with his authority implied. |
| CG8 | Findings routed but not owned | This chat accepted "ownership of fixing the issues" (01:27). It then recorded F13 (inventory "2 / 2 stacks · 6 items" above "You carry nothing of your own"), F16 (Take alive cannot bind) and F27 (All panels → Other worlds opens an empty pane) under unnamed "shared owners" and stopped. None has a writer. |
| CG9 | Fixes without a guard | The reserve fix added a test (`tests/ui_spine_ready.test.js`, agent-reported). The Mara browser check was "fixed" by changing the assertion to look in Reports. No test pins that the forge, potion or combat panels differ in layout, which was the actual complaint. |
| CG10 | Overclaimed verdicts | 01:26: "That split worked well." 01:49: "Tingen’s fix passed." Both rest on agent-run checks in a shared checkout whose architecture gate stays red (`main.js` 10117 against 10115), and no change was committed. The wording reads like acceptance. |

What the chat did well: it chose an RI fight backed by chapter evidence (turn 2), asked
before sending messages in his name (turn 3), and the D1 panel-identity table in turn 5
is the clearest answer to that question in any of the five chats.

## Proposals (ranked, Weibao acts on these)

- CGP1. Ask for one changed panel, shown. Pick forge, potion or combat. Require a before/after screenshot of the real game at 1920 beside the YAIR or Proto23 reference, no generated concept art.
- CGP2. Give the forge component picker a live owner. It is the one structural forge change everyone agreed on, and it has been orphaned since 01:27.
- CGP3. Tell coordinating chats to quote you, not paraphrase you. Any relay that says "Weibao wants" carries your exact words.
- CGP4. Assign F13, F16 and F27 to one named writer, or close them on purpose.
- CGP5. Decide whether the "numbers and RNG and procedurals tuning" ask from turn 3 is still wanted. If yes, it needs its own lane; this chat dropped it.
