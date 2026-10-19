# PS-AU1: loss opens fitting recovery stories

> Codes renamed 2026-10-19 from AU1 to PS-AU1 to avoid collision with registered AU (agent usage). See [reserved prefixes](../../../../RULES_INDEX.md#reserved-prefixes-2026-10-19).

2026-10-14. **PROPOSAL ONLY.** Extend root [PS-AU1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#au-defeat-as-story) and [P12 S5 failure-forward](../p12/STRUCTURES.md#s5-failure-forward-open-endings-and-overwhelming-success). [P27 death/after](../p27/DEATH_AND_AFTER.md) owns terminal death/lifecycle; [P31](../p31/CHECKPOINT.md) debt/oath terms; [P19](../p19/) relationships; [P24](../p24/TIME_STRUCTURES.md) clocks. PS-AU1 supplies loss outcome admission and arc hooks, not a second combat, debt, life or custody system.

## PS-AU1.1: what current loss actually means

| ID / source locator | SHOWN/SOURCE finding | Proposed reuse boundary |
|---|---|---|
| F-D1 `src/main.js:3751-3766` | Combat loss increments `total_deaths`, logs consciousness loss, moves to bed/sleep or parent location and adds Recovering for 2 minutes | This legacy counter is not proof of terminal death. Preserve this fallback for unenrolled encounters; do not turn every loss into capture. |
| F-D2 `src/main.js:4991,5416`; `src/titles.js:19-21` | Counter saved/restored and read by consciousness-loss titles | New outcome kinds require explicit counter compatibility; do not reinterpret old totals or revoke titles. |
| F-D3 `src/native_battle.js:26-36,55-67` | Road duel floors health at 1, settles won/lost/withdrawn, retains wounds/stamina and relationship/result, closes pursuit | Best narrow loss receipt seam. A lost contest is not automatic crime, ransom or death. |
| F-D4 `src/party_battle.js:48-59,90-97` | Party settlement retains result/helper status and costs, floors health at 1, releases session participants | Recovery must use actual surviving willing helpers; a released/exhausted helper is not an automatic rescuer. |
| F-D5 `src/causal_story_host.js:327-337` | Player capture of a subdued NPC binds actual rope custody and a release receipt; bag/sources remain separate | This is an NPC custody precedent, not an implemented player-capture journey. Captor/property/body states need their actual adapters. |
| F-D6 `src/chronicle.js:16-18,102,120`; `src/main.js:7223` | Optional mortal lifespan ending differs from consciousness loss and changes alive state | Terminal story must follow selected life law; recovery arc cannot quietly resurrect it. |
| F-D7 `src/npc_lives.js:9-10,28-30,42` | Dated NPC death events and known-life projections exist | NPC date/history is not a native combat terminal-outcome resolver. |

INFERRED gap: inspected loss paths lack one typed player defeat-to-recovery admission contract. Existing custody, debt and nonlethal results are useful building blocks. Neither a log line nor `total_deaths` can reconstruct who captured the hero, stole a bottle or paid a ransom.

## PS-AU1.2: outcome first, interpretation later

Proposed outcome envelope references encounter/social-contest ID, scope/clock, actual participants, intent, supported loss kind, resulting body/vitals/life/custody/stock refs, applied costs, witnesses, recovery access and durable receipt. It is staged with the existing host's result. Classify `yielded`, `unconscious`, `withdrawn`, `captured`, `disqualified`, `lost_position`, `insolvent`, `injured` and `terminal` only when their actual consumers execute. Multiple consequences can coexist where compatible.

Recovery hooks read the settled new state and an eligible interested actor. They preserve loss. A mentor offers real training rather than retroactive victory; rescue changes custody rather than restoring spent potions; debt remains in P31/economy until paid/released under terms. A grudge belongs to the relevant actor's goal/belief, not a compulsory status for every loser.

## PS-AU1.3: six arc families with concrete requirements

| Hook | Preconditions and generated content | Reachable routes / boundary |
|---|---|---|
| Capture | Living captive, actual captor with restraint/site/control and reason to keep alive | Escape through supported means, negotiate, ransom, rescue, serve agreed terms, wait for transfer or lawful release. Strong actors may break restraint; do not invent universal prisons. |
| Ransom | Captor demand plus actual payer/recipient, negotiation channel, frozen terms | Pay from real purse, bargain, obtain a funded loan, arrange exchange or reject. A printed demand is not a paid debt; confiscated property keeps exact custody. |
| Rescue | A person actually learns of loss, has access/means and chooses to act | Ask allies, hire specialists, self-rescue, negotiate with a witness. Rescue does not require romance or erase the rescuer's separate goals. |
| Debt/service recovery | Explicit accepted treatment/loan/repair terms and supported settlement | Pay, work, barter, persuade creditor, contest disputed amount or take another provider. No surprise permanent obligation from an unaccepted offer. |
| Mentor/new practice | Interested qualified witness recognizes a specific real gap | Paid/reciprocal lesson, self-study, new technique, team preparation, ordinary work or refuse. Body/source prerequisites survive the lesson. |
| Grudge/rematch/reform | Actor interprets actual loss and adopts a goal with means | Rematch, apology, negotiate credit, expose cheating, cooperate, change institution or retire. No mandatory revenge/escalation. |

Idle-safe recovery offers can wait/expire by their shown game-time policy. A captured hero still needs actual useful allowed actions, a fitting safe automation/resume policy and an exit witness if the first slice promises recoverability. Grim worlds can have sourced terminal risk, but no unannounced offline execution or hunger death. Danger severity follows selected world adjectives, not an extra ignorance or global punishment roll.

## PS-AU1.4: world-fit menu and canon qualifications

Every generated arc below is INFERRED/ORIGINAL proposal. A candidate canon scene is a source gate, not a claim it was reread here.

| World / evidence locator | Proposed loss routes | Local distinctions |
|---|---|---|
| Original Village, AU-V1 | Lost duel → specific witnessed weakness → optional funded lesson/rematch; failed commission → rework/negotiation | Existing recovery remains reachable; no random bandit captivity in an agreed spar |
| Cultivation/sect worlds | Trial defeat → repair/treatment, sect service bargain, mentor, rival challenge; hostile loss → hostage exchange where captor has means | Realm/body/pill law separate from public list. No universal cultivation realm reset, forced face grievance or fixed once redemption |
| D&D setting, [P13 DND](../p13/DND.md), exact edition gate | Captivity, ransom, healing/service debt, rescue, retreat and selected death/resurrection routes | Edition/setting rules determine unconsciousness, stabilization and spell access. No rules formula asserted here; resurrection requires actual sourced means, not generic arc selection |
| HP, Rowling; candidate Chamber of Secrets ch16-17, Philosopher's Stone ch16; [P13 HP](../p13/HARRY_POTTER.md) | School contest loss → practice/mentor/disciplinary hearing; hostile confinement → assistance/escape where supported | Distinguish defeat, detention, harm and terminal death. No easy resurrection inferred from magical setting |
| MHA, Horikoshi; candidate anime episode8 battle-trial aftermath, exact scene gate OPEN; official episode 87 supplies only ranking context | Training loss → peer/teacher critique, support-equipment repair, team exercise; hostile capture → informed professional rescue | Public chart loss, licensing and Quirk/body are different. Losing a practice bout does not automatically demote a hero |
| Worm, Wildbow; STATED-inherited [P26 WRM3](../p26/WORM.md), W179-C03 p021-030,p101-176; W294-C02 p031-050,p069-081, bounded rescue/retreat shape | Detention/legal negotiation, rescue/extraction, repair work, uneasy truce or rival debt where actual means support it | Capture does not imply ownership of powers; classifications do not ensure survival. Source canon harshness is not authorization for invented permanent losses |
| ORV, singNsong; STATED-inherited ORV-003-02/004-02/009-02, scenario-specific failure law; ORV-010-03 early regressor identification | Scenario loss, audience bargain, rescue, sponsor debt, new alliance or an explicitly supported regression branch | A nonlethal defeat hook cannot overwrite a sourced terminal scenario condition. Rescue, reset, reincarnation and world restore are distinct carriers/policies |
| MoL, Kurmaic; [P13 MoL](../p13/MOTHER_OF_LEARNING.md), [P16 loops](../p16/LOOPS_AND_RESETS.md) | Failed practice/research → revised method/mentor; detention/rescue; reset only in a declared supported loop | Existing continuous guest campaign stays continuous. Remembering failure does not refund matter or preserve native body by implication |

Capture/ransom are options where the world permits them, not required dramatic content in every world. Peaceful losses, overwhelming victory and ordinary fallback recovery remain legitimate complete outcomes.

## PS-AU1.5: narrow first slice and future gates

AU-V1 starts at the agreed road contest loss, retaining current one-HP result/costs. An actual present qualified observer offers a narrow paid practice for the measured gap, followed by a lawful new contest occurrence or settlement conversation. Player may decline and recover normally. Sibling social/crafting owner supplies any real repair/product/teacher consumer; a new generated tonic name is not recovery proof.

All gates OPEN: outcome binds actual loss and observer knowledge; duplicate/failed settlement creates no offer, debt, custody or refund; win/withdraw control does not create loss-only hooks; stronger lawful escape/ordinary recovery remains possible; terminal control cannot receive nonterminal resurrection. Save/reload/literal-file Import before loss, after loss and during accepted recovery retain exact wounds/costs/property/source/terms/next draw, including spent-vial effect references if P2 is included. Rebuilt desktop shows consequence, affordable or free recovery route and ordinary actions. Capture/ransom/rescue need separate paid custody/transfer proof; a mentor-first slice does not certify them. Human severity/fiction acceptance remains separate.
