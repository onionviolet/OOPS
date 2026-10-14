# U10: reveal and teaching across a long run

2026-10-14. Research and considerations, not accepted decisions or implementation.

## CHECKPOINT

Complete: shared brief and live owners read; requested reference set compared;
RT1-RT16 have a default and dial; ten recommendations ranked; document checks
recorded in [U10_REPORT.md](U10_REPORT.md). Resume at the report's open evidence,
not by repeating U1 or U4. This lane owns only this file and its report.

Target: 1366x768 laptop and 1920x1080 desktop. Proposed visible outcome: new
systems arrive with a usable next action, while known explanations stay easy
to recover after hours, absences and world changes. Mobile, general navigation
design, accessibility design, runtime work and new gameplay scope are deferred.
No rebuilt browser evidence is claimed or required for this research delivery.

## F1-F4: what matters over tens of hours

| Code | Finding | Implication for this palette |
| --- | --- | --- |
| F1 | **INFERRED:** learning has several moments: notice a system, use it, combine it with something known, then recover forgotten context. | PC2's first sentence starts teaching; it cannot finish it. A long run needs later lessons without replaying the opening. |
| F2 | **SHOWN/STATED:** Factorio and RimWorld separate contextual recommendations from a library that can be reread; CK3 documents resettable reactive advice. Sources E7, E9, E10 below. | A dismissed tip is not proof of understanding. Reading, demonstrated use and the player's request to mute help should have distinct meanings. |
| F3 | **SHOWN:** Antimatter Dimensions gates many help topics and even grows its abbreviation list with progress. Some topics remain ungated. Source E4. | A help library can grow with discovery, but the entire entry, title, links and examples need the YAIRPG discovery filter. The reference does not prove strict spoiler safety. |
| F4 | **INFERRED:** sparse openings and large late games pose different teaching problems. | Early lessons explain one action; late lessons explain changed rules, interactions, automation and the player's own abandoned plans. Keep the known route rather than making the player rediscover its location. |

## Existing authority and root-code mapping

The incumbent is [the root palette](../../../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md),
especially SC3, PL3, PC2 and FR4. [Panel kit](../../../PANEL_KIT.md) already
separates discovery from current eligibility and forbids names, counts and
settings before discovery. These proposals extend those owners, not replace
them. [Intro considerations](../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md)
TE1-TE9 already cover first cues, people teaching, requested leads, fading
hints and cheap failure. FH2 keeps an idle loop early; VA2 compresses repeats.
The intro document's other rounds were skimmed by headings.

| Root code | Support | Qualification or conflict, both ways | U10 extension |
| --- | --- | --- | --- |
| SC3 | Reveal through character/world facts prevents a screen full of irrelevant domains. | Hiding undiscovered systems is correct. Hiding a *known* system merely because it is inactive loses the player's memory aid. Panel kit resolves this with a known entry and a specific unavailable reason. | RT1, RT3, RT6, RT12: help uses the same discovery boundary; known inactive help stays readable. |
| PL3 | Promotion can mark meaningful growth from row to panel or tab. | A promotion can teach a new capability. A layout-only move needs a breadcrumb, not another full tutorial; it also must respect saved placement. | RT7: teach the changed capability, preserve the previous known route. |
| PC2 | One sentence on meaning and one on action keeps first reveal small. | Good default for one concept. Compound decisions need optional detail and safe practice; forcing exactly two sentences everywhere could omit costs or exceptions. | RT2, RT4, RT5, RT8: concise cue, expandable help, practice and feedback. |
| FR4 | Updates explain changes only to discovered systems. | Version notes can re-teach a changed known rule. A global feature list, newly named hidden topic or link can reveal more than the current branch knows. | RT10, RT11: branch-safe updates and world-rule deltas. |

No product direction changes here. Meals remain useful benefits with comfortable
ordinary unfed play; hunger death is not a teaching device. No new prestige
layer or world activation follows from this survey. Sealed source files were
not opened. U1 owns broad game/navigation patterns; U4 owns accessibility and
input. This lane links their work without making a second catalogue of either:
[U1](GAME_REFERENCES.md), [U4](ACCESSIBILITY_AND_INPUT.md).

## Reference evidence: teaching mechanisms only

Evidence recorded 2026-10-14. **SHOWN** means an actual loaded page or inspected
source, not a playtest. **STATED** means a documented description or developer
statement. **INFERRED** means the adaptation or comparison. **MEMORY** is
unchecked game recall. Historical diaries show their documented design at that
date, not current release parity. All transfer/cost cells are INFERRED.

| ID / reference | Observed or documented mechanism, with source | Transfer to YAIRPG and limit |
| --- | --- | --- |
| E1 A Dark Room | **SHOWN:** [room.js](https://raw.githubusercontent.com/doublespeakgames/adarkroom/master/script/room.js), loaded lines 11-56 and 1056-1060, attaches in-fiction availability messages to craftables and avoids an availability notification when already built. | A mentor can say why a useful action appeared. Do not infer complete reload suppression from this small source slice, or copy its later story revelations. Supports RT2/RT13. |
| E2 Candy Box! | **SHOWN:** [original-game markup](https://candybox2.github.io/candybox/) and [tabs.js](https://candybox2.github.io/candybox/scripts/tabs.js), inspected raw lines 180-190: tabs initialize disabled and the first is selected. [shop.js](https://candybox2.github.io/candybox/scripts/shop.js), lines 158-165, reacts to a false-to-true shop state. Exact earn thresholds and later sequence not checked. | Interface growth can itself be a reward. A new affordance still needs a readable purpose. Small finite adventure growth does not establish how fifty persistent systems stay learnable. Supports RT1/RT2; no Candy Box 2 behavior is attributed to Candy Box!. |
| E3 Universal Paperclips | **SHOWN:** [creator-hosted HTML](https://www.decisionproblem.com/paperclips/index2.html) contains production controls and project-oriented surfaces. Extraction includes hidden markup, so it does not establish initial visibility. **MEMORY:** upgrades progressively transform what the player manages; exact triggers unverified because the project script fetch failed. | A meaningful phase change could teach a new resource relationship and retire obsolete decisions. Keep a record of changed rules. This recommendation also has independent support from E4/E7; it does not depend on unverified Paperclips timing. RT7/RT10. |
| E4 Antimatter Dimensions | **SHOWN:** [h2p.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/master/src/core/secret-formula/h2p.js), raw source inspected at lines 224-251, 433-480 and 484-547: abbreviation content expands with progress; Infinity and challenge help have progress predicates; Autobuyers help has an always-true predicate. | Grow explanations as knowledge grows, including vocabulary. This is evidence for selective help gating, not a blanket sealed-secret guard. Filtering only top-level topics misses details inside general entries. RT3/RT12. |
| E5 Kittens Game | **SHOWN:** [game.js](https://github.com/nuclear-unicorn/kittensgame/blob/master/game.js), raw source inspected at lines 2816-2817 and 3176: non-Bonfire tabs start hidden; library-tab visibility on load derives from buildings/research. The wiki extraction was empty. | A building or research step gives a causal reveal. Unlocking a tab does not demonstrate that the player understands its resource loop, seasonal risk or use. Add a first useful action and later combination lesson. RT1/RT5/RT14. |
| E6 Melvor Idle | **STATED, limited:** historical [v0.21 notes](https://wiki.melvoridle.com/w/V0.21) and [syndicated developer notes](https://www.tuxdb.com/game/8765%26gamenews%3D1), search excerpts only, describe Tutorial Island with basic tasks and a skip option. Direct wiki/source and mirror loads failed. The quoted 10-20 minute duration is a developer estimate, not this lane's measurement. | A short sample loop can teach selecting work, output and using the output before opening the full choice set. Skip should remain available. An initial island does not solve a returning player's forgotten specialization. RT5/RT6/RT15. |
| E7 Factorio tips and tricks | **SHOWN/STATED:** [FFF #361](https://www.factorio.com/blog/post/fff-361), 2020-10-09, describes a topic index/search, rendered simulations, mini-tutorials, prerequisite tips and railway research gating. [FFF #362](https://www.factorio.com/blog/post/fff-362), 2020-10-30, confirms simulations in the preceding design. | Teach advanced systems when prerequisites and a relevant action meet; keep a replayable explanation. Built-in examples cost authoring and maintenance. Factorio's read dependencies should not become mandatory reading gates on YAIRPG actions. RT1/RT3/RT4/RT5. |
| E8 Dwarf Fortress Steam tutorial | **SHOWN/STATED:** [developer store description](https://store.steampowered.com/app/975370/Dwarf_Fortress/) promises in-game tutorials for the basics. This lane did not run the Steam tutorial or verify coverage of specific fortress tasks. | A bounded playable start is a reasonable reference for learning a first loop. It is weak evidence for late-game re-teaching. Do not equate finishing basic lessons with learning a whole simulation. RT5/RT6. |
| E9 RimWorld learning helper | **SHOWN/STATED:** [Learning helper wiki](https://rimworldwiki.com/wiki/Learning_helper), loaded description: circumstance or slow timer activates lessons, required interactions can mark them learned, manual marking exists, and lessons can be searched. Many table rows have no named learning opportunity. Community documentation, not inspected game code. | Distinguish use from dismissal and let veterans say they know a lesson. A timer can surface overlooked basics, but irrelevant timer advice would interrupt chosen idle play. Default to relevance or a requested refresher. RT4/RT6/RT9. |
| E10 CK3 tutorial and Game Concepts | **SHOWN/STATED:** [Dev Diary #16, syndicated developer text](https://www.reddit.com/r/CrusaderKings/comments/fcuo7j/dev_diary_16_tutorials_tooltips_and_encyclopedias/), 2020-03-02, describes guided teaching, reactive advice, resettable advice, suggestions that can be disabled, nested concept tooltips and a searchable encyclopedia containing lesson recaps. It says descriptions are generated from script data. | Separate a useful next action from a concept definition, and keep both recoverable. Reuse rule data for facts; retain local fictional voice. Its broad searchable encyclopedia is not evidence for YAIRPG's discovery restrictions. RT3/RT4/RT6/RT15. |
| E11 Stellaris situation log | **SHOWN/STATED:** [developer diary #417 via Steam](https://store.steampowered.com/news/posts/?appids=281990&enddate=1777469190), loaded first article, describes unified entries, collapsible categories including tutorial entries, player pins, and a separate findings tab. This is a 2026 diary, not a historical/current-version playtest. | A player-chosen lead can survive a long break without replaying all reminders. Learning entries should not bury urgent consequences. Borrow continuity and pinning, not a mandatory mission list. RT6/RT9/RT16. |
| E12 Outer Wilds | **SHOWN/STATED:** [Kelsey Beachum's GDC 2021 session abstract](https://www.gdcvault.com/play/1027368/Independent-Games-Summit-Sparking-Curiosity) describes diegetic, player-directed curiosity instead of assigned missions. **MEMORY:** the ship log collects discovered clues and unresolved threads; exact flags not inspected. Slides failed; the talk was not watched. | Help can recall an observation or known unanswered question without supplying the answer. Curiosity and procedural help need different levels of detail. Strict clue handling comes from Panel kit, not assumed Outer Wilds internals. RT12/RT16. |
| E13 Hades | **SHOWN/STATED:** [Supergiant FAQ](https://www.supergiantgames.com/blog/hades-faq/) documents permanent progression and challenge modifiers. [Greg Kasavin interview coverage](https://www.gamedeveloper.com/design/how-supergiant-weaves-narrative-rewards-into-i-hades-i-cycle-of-perpetual-death), 2020-02-13, reports reactive narrative and making death/restart feel worthwhile. **MEMORY:** successive runs give practice with changing combinations; no exact lesson schedule verified. | Repetition can change context and reinforce one known rule while revealing another. Never import compulsory death or repeated loss as a prerequisite for learning an idle game's ordinary work. RT8/RT14/RT15. |
| E14 Slay the Spire | **SHOWN/STATED:** [developer store description](https://store.steampowered.com/app/646570/Slay_the_Spire/) describes discovering cards each attempt and relics whose effects can alter the deck. **MEMORY:** card text, enemy intent and run feedback help players learn combinations; exact UI behavior unchecked. | Teach a combination when the player actually holds its ingredients. Do not prescribe a best build or reveal future rewards. Card discovery supports sampling depth; intent-specific design remains a later evidence gap. RT14. |
| E15 Disco Elysium | **SHOWN/STATED:** [Meet the Skills: Physique](https://discoelysium.com/devblog/2018/04/11/meet-the-skills-physique), 2018-04-11, gives skills voices, biases and sometimes poor advice. The [developer store page](https://store.steampowered.com/app/632470/Disco_Elysium__The_Final_Cut/) describes skills and the Thought Cabinet. **MEMORY:** failed checks may produce worthwhile scenes; individual outcomes not verified. | A mentor, inner voice or Clerk can make a rule memorable. A confident speaker is not an omniscient fact source. Separate observed outcomes, verified mechanics and speculative advice. RT8/RT13. |
| E16 Portal design talks | **SHOWN/STATED:** [Swift/Wolpaw GDC 2008 session](https://gdcvault.com/play/197/A-PORTAL-Post-Mortem-Integrating) verifies the talk and speakers; [loaded postmortem coverage](https://www.gamedeveloper.com/game-platforms/best-of-gdc-the-secrets-of-i-portal-i-s-huge-success) describes story/gameplay integration and iterative playtesting. **MEMORY:** constrained early chambers introduce mechanics before combinations. The talk itself was not watched. | Make a first situation demonstrate a rule with a small variable set, then apply it in a new context. This specific sequencing also has primary slide support from E18, so no unseen Portal lecture is being treated as proof. RT5/RT13/RT14. |
| E17 Celeste assist mode | **SHOWN/STATED:** [official changelog](https://www.celestegame.com/changelog.html), loaded historical notes, says Assist Mode can always be toggled at file select. This lane did not test individual assist settings. | Help or practice support can be reversible rather than a one-time identity choice. Explanation intensity and gameplay assistance are separate dials. U4 owns the actual assist/input comparison; RT15 only concerns teaching. |
| E18 GDC onboarding and disclosure | **SHOWN:** [George Fan's 2012 slides](https://media.gdcvault.com/gdc2012/slides/Design%20Track/Fan_George_How%20I%20Got.pdf), extracted pages 34-58 and 83-127, advocate doing, safe practice, spreading mechanics over play, fewer words and unobtrusive/adaptive messages. **STATED:** [Asher Vollmer's GDC 2014 abstract](https://www.gdcvault.com/play/1020512/Prime-Teach-Observe-Tutorializing-Innovative) describes priming, internalizing and iteration; [Deathloop GDC 2022 announcement](https://gdconf.com/article/learn-how-deathloop-created-its-mind-blowing-opening-chapter-through-ux/) documents user research shaping the first hours. Those videos were not watched. | Progressive disclosure needs an observable exercise and feedback, not simply delayed panels. Use these as design rationale, not numerical proof of an ideal interval. RT1/RT2/RT4/RT5. |

## RT palette: default plus dial

Every RT row is **INFERRED**, offered for root-owner reconciliation. Dials can
change teaching intensity or presentation; they cannot grant discovery, expose
sealed truths, spend resources or silently change world rules.

| Code | Consideration and default | Dial | Root / intro mapping |
| --- | --- | --- | --- |
| RT1 | **Reveal at a useful opportunity.** Use a saved discovery fact plus a real current reason to offer a lesson. Availability and affordability differ: a known expensive action can be explained before the player can buy it. Default teaching order follows current activity and causal prerequisites, not hours played. | Quiet cue; contextual short lesson; fuller guided start. A player can defer optional lessons while keeping the unlocked action. | SC3, PC2; TE1, FH2 |
| RT2 | **First cue answers why and what next.** Default: one sentence names why the known system appeared; one names a currently reachable action. Add Help/Later at its known home. Do not cover an existing action or move the player's selection. | Minimal cue, short prose, expanded example on request. More detail may explain cost/risk without introducing undiscovered mechanics. | PC2; TE2/TE3 |
| RT3 | **Help grows in place.** Default: first revealed help contains purpose, current rules, one example and its current home. Append discovered vocabulary and advanced sections later. Each section and cross-link has its own discovery check. Keep already known inactive entries with a specific reason. | Context-only help, all known entries, player-pinned pages. Never all sealed entries. | SC3, PC2, PL3; TE7 |
| RT4 | **Reading, dismissal and use mean different things.** Default: a performed operation quiets its basic hint; dismissing suppresses the cue without deleting the help. Acknowledge or mute explicitly. Successful use is evidence for hint suppression, not a claim of mastery. | Auto-quiet after use, manual marking, replay this lesson. No gameplay gate requiring a tutorial completion badge. | PC2; TE5/TE6 |
| RT5 | **A first use has legible feedback.** Default: offer an ordinary small reversible action with known cost, result and a rule recap. Optional practice uses a clearly separate example when the live action is costly. Never spend automatically or quietly refund a supposedly real consequence. | Show an example; guide one live step with explicit costs; unguided play. A sandbox, if later built, must identify what carries over. | PC2/PC3; TE8, FH3 |
| RT6 | **Return help recalls the player's own state.** Default: after a substantial absence offer one compact optional card: last chosen lead, running work, relevant changed known rule and one route to resume. It does not declare the player has forgotten. Known lessons stay available without resetting discovery. | Never auto-offer; offer after a player-selected absence interval; ask for a recap anytime; fuller refresher. No mandatory restart tutorial. | PC2/PC1, FR4; TE5 |
| RT7 | **Teach the delta when a system grows.** Default: at a PL3 capability promotion, explain the newly possible choice and link to the new home from the old known home. Plain layout moves only need a location cue. Prior beginner lessons remain quiet. | Quiet breadcrumb, short delta lesson, guided advanced example on request. Player docking preferences win. | PL3, PC2 |
| RT8 | **Failure explains an observed cause and a possible response.** Default: name the known reason, actual loss and one reachable alternative. Random failure is labeled random; hidden causes stay unknown. Early authored practice failures are cheap, but ordinary fiction keeps its promised stakes. | Brief receipt, detail on request, optional practice/assistance in the existing difficulty owner. Never forced death to unlock a lesson. | PC2/PC3; TE8, EH1-EH7 |
| RT9 | **Forgotten systems get a relevant reminder.** Default: remind only when a known unused option could address a current chosen task, with a per-topic cooldown and dismiss control. Deliberate non-use, slow saving and idle time are not evidence of confusion. | Silent; contextual suggestions; player-set periodic review of known topics. Snooze or permanently mute a topic without hiding its control. | PC2, SC3/SC5; TE5/TE6 |
| RT10 | **Update notes re-teach known changed rules.** Default: FR4 lists only materially changed discovered systems for this branch, with before/after behavior and links to known help. Refresh facts without replaying all discovery effects. | One summary card, details on request, archive-only. Optional later capability sections remain gated. | FR4, PC2 |
| RT11 | **World switches teach differences.** Default: compare the selected world's *known* rule with the last known version: what carries, what changes, what is inactive and why. Reuse familiar controls; teach a new rule variant even when the label is familiar. A veteran profile does not grant this character hidden knowledge. | Short delta; contextual first-use reminders; replay available local basics. Separate world knowledge from player preference to suppress help. | SC3/SC4, PC2, FR4; TE9, VA2 |
| RT12 | **Every teaching route respects discovery.** Default: apply Panel kit's boundary to help titles, search, completion totals, links, examples, reminders, recaps and patch notes. An encountered rumor is labeled unverified and teaches only how to follow its known lead. | Procedure-only; hints about encountered clues; explicit known-clue recap. Deeper revelation requires its legitimate discovery route, not a verbosity setting. | SC3, PC2, FR4; TE7 |
| RT13 | **Fiction teaches through an available speaker.** Default: a mentor, Clerk or system window gives a local cue backed by the same known rule facts as plain help. Identify speculative advice as that speaker's view. If the teacher is absent or the system window is down, known help retains a suitable notebook/record route. | Fiction first, mixed voice plus concise rule, concise rules first; dialogue recap on request. Never make vital known controls depend on rereading a scene. | PC2, SC3; TE4/TE9 |
| RT14 | **Combination lessons arrive with the ingredients.** Default: after the player has encountered and used relevant components, show one meaningful interaction at a chosen task. Explain the tradeoff rather than a universal optimal build. Automatic work can still demonstrate a result; no mandatory manual grind. | No unsolicited combinations, one contextual example, deeper known-rule breakdown on request. | PC2, PL3; FH2, VA2 |
| RT15 | **Teaching intensity can change mid-run.** Default: contextual short help with skip, replay and topic mute. Repeat lives suppress familiar procedural cues but newly encountered or changed rules remain teachable. Help intensity does not change difficulty or unlocks. | Silent known help, concise cues, guided examples. Assistance remains a separate existing setting; changing one need not change the other. | PC2, FR4; TE6, VA2 |
| RT16 | **Carry one player-chosen lead forward.** Default: let a discovered task or unanswered encountered question be pinned with the player's own reason. Return help offers it as a possibility. No generated checklist of all future systems. | No pin, a few chosen leads, private note plus known-clue recap. Exploration mode favors questions; procedural mode favors next actions. | SC3, PC2/PC1; TE5, FH7 |

## A long run's teaching rhythm

**INFERRED illustrative sequence**, not a timetable, XP curve or commitment to
new mechanics. Hour ranges describe possible play sessions. Starts, idle work,
prior familiarity and player choices can move a beat earlier or later.

| Beat | What makes a lesson timely | Proposed visible teaching | What waits |
| --- | --- | --- | --- |
| B1 Arrival, roughly first 5-15 active minutes | The player can start ordinary work and observe its first output. | Teach selecting an action, what keeps running and where its result appears. Leave a useful idle loop running early. | Settlement, automation policy, prestige and undiscovered powers. No tour of every menu. |
| B2 First session, roughly first hour | A person, item or result exposes one new choice. | Reveal cue plus first small use. A failed known action can teach a recoverable limit. Let the player choose a lead. | Detailed variants and future optimal strategies. Meals can teach benefits without introducing hunger death. |
| B3 Several sessions, roughly hours 1-5 | The chosen activity creates a reason to use another known system. | Introduce the connection: output to equipment, work to a known duty, or a known resource to a known upgrade. | Unrelated systems stay discoverable through their own routes. No rule that all players must follow one curriculum. |
| B4 Deepening, roughly hours 5-20 | Repeated work makes a richer control or supported automation capability relevant. | Teach the newly possible choice, a small known example and its ongoing cost. Keep the earlier home link. | Advanced policy clauses until a concrete need or requested reading. Do not invent unlocked automation. |
| B5 Mature play, hours 20+ | A new domain appears or a familiar rule changes. | Use delta lessons, known-rule comparison and interaction examples. Known help supports both glance sessions and deliberate reading. | No repeated beginner tutorial solely because elapsed time crossed a threshold. |
| B6 Return after a break, any hour | A player comes back to unfinished intentions and running results. | Optional resume card; player asks for deeper refresh. Actual deadlines use existing consequence handling. | A flood of historical tips, assumed confusion and hidden future unlocks. |
| B7 World/branch/life switch, any hour | Local capabilities and knowledge differ from the last context. | Show known carryover and changed rules. Fresh local discoveries can receive their own cue; profile familiarity may quiet procedural explanation. | Another branch's private discovery, sealed route or assumed character knowledge. |

The pace is **reveal, act, read the consequence, vary, combine**, with room to
repeat or leave a system aside. More complicated late systems may need a few
small lessons, not a larger first popup. A player taking a side path should
receive a relevant lesson there rather than be returned to a prescribed path.

### Concrete cue examples, all proposed and conditional

| ID | Earned context | Short cue or recap | Follow-through |
| --- | --- | --- | --- |
| X1 | Repair is genuinely discovered and locally available. | "Your boots need repair. Open Village repair to see its cost before choosing." | Help explains current wear and actual known options. If the player lacks money, say so without claiming a purchasable action. |
| X2 | A known job completed while away. | "Your queued work finished. Open its receipt to see the output and what was spent." | Link the receipt and the last chosen lead; do not queue more paid work automatically. |
| X3 | A known status capability actually advanced. | "Your window can now compare these two known effects. Open Compare from the same window." | Teach comparison; do not list the window's undiscovered future stages or origin. |
| X4 | A known attempt failed through observed fatigue. | "You stopped because energy ran out. Rest restores it; the receipt shows the time already used." | Use the real loss and reachable rest route. If the cause was hidden or random, this explanation must change. |
| X5 | The player revisits a discovered world with a changed known rule. | "This world's known work rule has changed since your last visit. Read the short comparison before repeating the job." | Provide specific known before/after facts. A generic warning alone is not enough to teach. |

## Teaching state, restoration and burst handling

**INFERRED design distinction**, not a proposed save schema or source audit:
discovered here, usable now, cue offered, lesson dismissed/read, operation
performed and help preference are separate facts. Restore reconstructs known
help from authoritative discovery without firing live arrival effects. An
explicit replay button may repeat a lesson without pretending it is a new
discovery. Any later persisted lesson ledger needs its own save compatibility
decision, save/reload and literal-file import evidence.

World-specific rule variants matter more than a single profile-wide "trained"
flag. A profile may remember the player's desire for fewer hints. A branch
must still decide which concepts and details it can expose. When rule facts
change, re-teach the delta rather than clearing every lesson acknowledgement.

For offline progress, imported mature saves or a new pack with many *known*
capabilities, default to one compact "new relevant choices" summary and a
recoverable list at known homes. Show the next lesson when its operation is
used. Do not serialize twenty popups or make reading them a condition of
resuming. A stale queued cue must be checked again in the current branch and
world before display. Urgent irreversible decisions keep their existing
consequence handling; a teaching queue cannot delay them.

## Discovery-safe teaching and fiction

| Check code | Boundary | Example of what to avoid |
| --- | --- | --- |
| S1 | Gate the entire help surface and each newly appended detail. | A generic glossary whose example names a sealed power. |
| S2 | Filter search suggestions, page counts and links before display. | "17 of 60 secrets taught", locked silhouettes or a search hit for an unknown topic. |
| S3 | Build recaps and update notes from this branch's known state. | Another world's diary naming a private revelation, or a global patch headline doing the same. |
| S4 | Teach the observed operation without explaining a hidden cause. | The Clerk's helpful remark turning an unknown origin into confirmed lore. A rumor is a rumor. |
| S5 | Hint only about encountered clues; deeper help follows earned routes. | An inactivity detector solving an undiscovered puzzle or suggesting an undiscovered profession. |

Fictional teachers can be unavailable, mistaken or biased. Plain procedural
help should remain accurate about known costs, controls and observed results,
while uncertain world knowledge keeps its qualifier. This retains discovery
and lets a character voice be interesting without making learning unreliable.
A status window's help must not explain its sealed nature merely because it
is the current teacher. The Clerk can teach a known operation without naming
who or what is behind it. No secret's truth or identifying route is invented
in this document.

## Ranked top 10 for the root owner

Rank is an **INFERRED priority**, based on fit, effort and failure cost, not
measured retention. "Adapt" means recommend for a later authorized slice.

| Rank | Code | Disposition / reason | Cost and observable future check |
| --- | --- | --- | --- |
| 1 | RT12 | **Adapt.** Make every teaching route honor the existing discovery boundary. Leaks elsewhere would undo SC3. | Review every help emitter, including search and patch summaries. Unknown titles, counts, examples and links remain absent in fresh and switched branches. |
| 2 | RT1 | **Adapt.** Time lessons to an actual choice and reason. Better fit than an hours-played unlock script. | Author a trigger and useful reachable follow-up per chosen system. A side path and an idle path both receive relevant help without compulsory reading. |
| 3 | RT2 | **Adapt.** Give a new reveal meaning and a next action with very little interruption. | Write/maintain short copy. At both target desktop sizes the cue and relevant control are reachable together. |
| 4 | RT3 | **Adapt.** Preserve and grow known help so PC2 keeps working at hour 30. | Topic content and detail gates need upkeep. Reread an inactive known topic and a newly appended known section without exposing future content. |
| 5 | RT4 | **Adapt.** Quiet familiar hints without treating dismissal as mastery. | Distinct acknowledgement/use semantics and compatibility work if stored. Dismiss, use, reload and replay give distinct truthful outcomes. |
| 6 | RT6 | **Trial.** Rebuild context after a break using the player's own intentions. | Needs trustworthy state/receipt/lead inputs. A returning player can identify current work and resume one chosen lead without a full tutorial. |
| 7 | RT11 | **Trial.** Teach local differences rather than repeating all universal controls at every world switch. | Author rule variants and branch checks. A familiar label with changed behavior is explained; another branch's discoveries stay hidden. |
| 8 | RT7 | **Adapt.** Use promotion to teach new depth while keeping the learned route. | Capability deltas and breadcrumbs. A row-to-panel promotion teaches only the new choice and respects saved placement. |
| 9 | RT8 | **Adapt.** Turn setbacks into understandable choices with honest losses. | Curate cheap early situations and accurate cause text. Failure distinguishes randomness, observed cause and unknown cause; no invented hunger death or required sacrifice. |
| 10 | RT10 | **Adapt.** Give FR4 a useful re-teaching role after updates. | Known-rule comparisons and versioned facts. A mature save gets relevant before/after help with no discovery replay or sealed headline. |

RT9/RT13/RT14/RT15/RT16 remain reachable options. RT13 already has strong TE4/TE9
direction; the new work is factual backing and availability fallback. RT9's
automatic reminders and RT14's unsolicited combinations should be trialed
after the first five recommendations avoid unwanted interruptions. RT15's
skip/replay controls fit any selected trial. RT16 can reuse an existing lead
or notebook rather than require a new quest UI. No code or build request is
implied by this ranking.

## Failure modes and next acceptance evidence

| Risk | Why it matters | Default response and unresolved evidence |
| --- | --- | --- |
| R1 Reveal debt | Many unlocks earned away from the screen produce a popup backlog. | Group known arrivals, prioritize the current action, preserve the rest for lookup. Trial a mature restore and an offline burst. |
| R2 Help drift | Prose/examples can outlive a balance or control change. Factorio explicitly describes screenshot maintenance costs. | Draw factual values from the same known rule data where feasible; separately review voice and examples. No current YAIRPG help-data architecture is asserted. |
| R3 Hint overreach | Saving resources or choosing another activity can look like being stuck. | No automatic intervention merely for elapsed time. Trial intentional non-use and slow idle play, with mute respected. |
| R4 Hidden prerequisites | A cue that says "do this" but has no reachable path teaches frustration. | Explain the known blocker or an actual reachable alternative. Check zero-money, wrong-location and known-inactive cases. |
| R5 Overguided play | A lesson chain can erase curiosity or make every run repeat its chores. | Optional procedure help, encountered-clue hints, repeat compression and player-chosen leads. Trial both a guided novice and a quiet veteran route. |

Future selection needs an authorized bounded trial at 1366x768 and 1920x1080,
using early, mature, returning and switched-world known states. Observe whether
the player can name the new choice, perform it, explain the outcome and later
find help. Do not use tutorial completion or tip clicks alone as a retention
measure. Rebuilt browser behavior, persistence/import, secret filtering and
human taste remain separate evidence gates. No such gate was run in U10.
