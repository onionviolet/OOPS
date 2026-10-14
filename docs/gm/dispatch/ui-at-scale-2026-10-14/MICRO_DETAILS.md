# U9: micro details with references

## CHECKPOINT

2026-10-14: research and proposal catalog complete. Read COMMON, AGENTS,
PROJECT, user preferences, USER_VISION's standing UI priority, P4 and live
round 6 MI1–MI47. Own only this file and U9_REPORT.md. No implementation,
build, browser, tests, saves, secret files, commit or push. Resume from the
source ledger and ranking below, not from an assumed implementation state.

Target: 1366×768 laptop and 1920×1080 desktop. Visible goal: menus acknowledge
input, results retain their cause, and reading survives updates. Mobile is
deferred. These are INFERRED considerations with a default plus a dial, not
accepted decisions or a new gameplay acceptance gate.

## What this adds

P4 owns the basics. [Round 6](../../../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md#round-6-subtle-micro-details-2026-10-14)
already proposes count-ups, hover ghosts, steady lists, unread dots, sound
categories and calm returns. MX codes add event rules, cancellation, causal
receipts, reading ergonomics and reference limits. The parent MI codes in each
row say what is being extended. Do not build both versions as separate effects.

Costs are comparative estimates, not measured implementation quotes: **XS** is
one existing control/style/copy path; **S** is one component with local state;
**M** needs shared event, knowledge or preview data; **L** needs authored content
or a new presentation layer. An XS/S estimate assumes the named data already
exists. If it does not, move the detail out of the cheap queue. No source audit
here establishes which details are absent from the current game.

All timings and defaults below are INFERRED starting points. Each row's source
ID links to the ledger; its evidence label applies to the reference only.
MEMORY examples are leads, not verified reproduction instructions.

## Input and menus

| Code / parent / reference | What, why and desktop idle fit | Cost / default plus dial | Reduced-motion fallback / secret and reading risk |
| --- | --- | --- | --- |
| MX01 / MI21, MI44 / S01, S02 | Press acknowledgement before a result: give the active button a distinct border/background while pressed, then show pending only if work remains. It makes mouse and keyboard input feel received without inventing success. | XS; immediate static pressed state; dial adds a 1 px inset for pointer input. | Static border. Never encode hidden outcome in press color; do not move the hit target or text baseline. |
| MX02 / MI25 / S04 | Close a detail dialog back to its invoking row; if that row vanished, focus its nearest surviving control. This completes a menu round trip without restarting keyboard traversal. | S; restore by stable control identity; dial retains last focus per panel. | Same behavior, no scroll tween. Resolve only visible controls; a hidden entity ID must not force a secret row into view. |
| MX03 / MI16–17 / S01, S04 | Escape closes the deepest transient detail first and returns to its owner; it does not also cancel the job underneath. Layered panels feel predictable. | S; one layer per Escape; dial offers explicit Close all details. | Instant close. Hidden nested contents stay unmounted; keyboard shortcuts must not become an accidental spend/cancel path. |
| MX04 / MI16 / S01, S13 | Hover emphasis and selected emphasis differ: preview gets an outline, committed selection gets a persistent label/check. It avoids confusing a card under the pointer with the chosen skill or item. | XS; two static states; dial strengthens their contrast. | Same states. A check cannot imply ownership before commit; do not rely on color alone. |
| MX05 / MI9, MI14 / S01 | Clicking a blocked control keeps its explanation beside that control rather than opening a generic error. A known repair can be a separate link, such as Open inventory, without executing it. | S; inline explanation on activation; dial pins explanations while blocked. | Static explanation. Only known blockers get counts; reserve space so the next action does not jump. |
| MX06 / MI23 / S02 | A just-completed row becomes a short receipt in place until the pointer/focus leaves, then retires. A menu does not put a different purchase under the same click. | S; retire after interaction leaves; dial keeps completed rows until explicit clear. | No exit animation. Keep its old identity, not an actionable successor; disclose only the actual known result. |
| MX07 / MI39 / S14, S02 | Give menu headings a small arrival accent, such as an underline settling into place, while the reading body and buttons are already usable. Persona-like identity can live at the edge of the page. | S; static thematic heading; dial adds 120–180 ms accent motion. | Static underline. No tilted body copy, animated hit boxes or concealed controls. Persona timing here is a proposal, not observed evidence. |
| MX08 / MI20 / S04, S06 | Sliders and menu lists stop at their endpoints unless a deliberate second press wraps. A text-speed or effect-strength choice cannot silently jump from minimum to maximum. | XS; clamp, label min/max; dial allows explicit wrap in navigation lists only. | No motion needed. Never wrap spend quantities or assist strength; preserve native keyboard conventions where applicable. |

## Numbers, results and previews

| Code / parent / reference | What, why and desktop idle fit | Cost / default plus dial | Reduced-motion fallback / secret and reading risk |
| --- | --- | --- | --- |
| MX09 / MI1 / S11, S02 | Interruptible count-up: a new gain retargets the visual counter from its current display, while authoritative affordability uses the final value immediately. Big rewards feel like change without queuing seconds of stale digits. | S; 180–300 ms for discrete gains, never routine ticks; dial instant to 450 ms. | Show final value plus static net delta. Exact/focused values stay final; do not animate expenses upward or reveal hidden balances. |
| MX10 / P4 numbers, MI22 / S09, S10 | A precision latch keeps exact digits visible while focused, pinned or near a known purchase threshold. Outside that state, use compact units. Huge idle totals retain their usefulness at the moment of choice. | S; exact in focused detail; dial compact, grouped or scientific. | No motion. Never round affordability up; expose an estimate mark where knowledge is uncertain. Scientific notation must not collapse distinct costs. |
| MX11 / MI1, MI30 / S01, S11 | Pair a discrete delta with its known cause, such as +3 coins · sold herbs, and keep the short receipt accessible after the transient cue disappears. A gain becomes a remembered event. | S with receipt data, M without; one cause line; dial expands known contributors. | Static cause/delta. Never infer a secret contributor from internal arithmetic; avoid redundant announcements of every idle tick. |
| MX12 / MI27, P4 completed work / S01 | Distinguish Requested, Applied and Saved when those states actually differ. A craft receipt can say produced without pretending it reached durable storage. Confidence comes from truthful state transitions. | S with existing result/save events, M otherwise; show save state when relevant; dial expands timestamps. | Static labels. Never fake persistence or manufacture a network wait for a synchronous action. |
| MX13 / MI4, MI6 / S07, S13 | Preview expires on context change: changing target, stock or location invalidates the displayed estimate and recomputes from the same known context as the action. The nice ghost bar stays trustworthy. | M; replace stale preview with Updating preview, then current estimate; dial pins context for comparison. | Static before/after text. Never simulate undiscovered outcomes for display; identify ranges and assumptions instead of borrowing Into the Breach's full knowledge. |
| MX14 / MI4 / S07, S08 | Couple the hovered/focused action to one affected row with a matching marker, so the eye can trace cost or effect across two desktop panels. This adds a causal link to a preview rather than another tooltip. | S if dependencies exposed, M otherwise; static matched marks; dial adds one brief edge cue. | Matching text label/marker. Gate both ends on knowledge; do not light up an undiscovered destination. Limit links to the selected action. |
| MX15 / MI1, MI42 / S11, S15, S16 | A batch payoff has three optional beats: known inputs, applied result, final receipt. Reserve this for prestige or a major craft, not every repetition. It can make an earned outcome legible and satisfying. | M; compact immediate receipt; dial one skippable sequence under 600 ms. | Full receipt immediately. No global hit-stop, screenshake or unskippable tally; internal hidden multipliers stay hidden. |
| MX16 / MI7, MI44 / S01 | A changed quote marks the changed field and offers review rather than a vague failure flash. The player sees why a formerly affordable action no longer matches. | S with prior quote; default static changed label; dial exposes known old/new values. | Same label. Never expose unknown merchant reasoning; do not keep an obsolete quote styled as current. |

## Reading and discovery

| Code / parent / reference | What, why and desktop idle fit | Cost / default plus dial | Reduced-motion fallback / secret and reading risk |
| --- | --- | --- | --- |
| MX17 / MI24 / S02, S12 | Reading anchor uses the top visible entry ID and pixel offset, not raw scrollTop, when earlier entries grow. It preserves the sentence being read in a live journal. | S; preserve while away from live edge; dial freezes all log updates until Resume. | Same behavior. Keep actual text selectable; a redacted entry's expansion must not reveal hidden content or jump the viewport. |
| MX18 / MI29 / S05, S08 | Unlock receipt links directly to the newly readable paragraph, with a New since last visit divider. A codex feels like accumulated understanding rather than a dot hunt. | S with read markers, M otherwise; link only to earned text; dial groups receipts by topic. | Static divider and focus at heading. Do not show locked titles, total secret counts, unearned links or auto-clear on a fleeting hover. |
| MX19 / MI12, MI29 / S08 | Mark a newly learned connection only after both public endpoints and the relationship are earned. A journal can reveal the link as a new insight without rearranging the entire record. | M; static New connection line; dial locally highlights the connecting edge. | Text line with endpoints. Graph shape, empty slots and ordering can reveal hidden structure even without names; no hidden graph in the DOM. |
| MX20 / P4 atmosphere / S12, S17 | Text reveal by paragraph, with Show all and instant reread. Small pauses can separate a skill's observation from its consequence without making every menu a typewriter. | S for prose groups, M for authored beat metadata; default instant routine text; dial 150–400 ms paragraph spacing for scenes. | All available text immediately. Copy/search/accessibility expose only currently earned prose; do not require waiting or advancing world time to finish reading. |
| MX21 / MI30 / S17 | A skill check receipt distinguishes attempt, outcome and retry condition, with known modifiers expandable afterward. The reveal preserves the reason for success or failure without making dice animation mandatory. | M; immediate factual result; dial one skippable reveal beat. | Result and known factors together. No preview of concealed thresholds or random seed; never label uncertain success as guaranteed. |
| MX22 / P4 hover details / S05, S13 | Explain a known keyword in place and retain its short definition beside a choice. Hades' documented codex access during boon choice suggests keeping reference work inside the decision. | S with glossary, M otherwise; click/focus definition; dial pins two definitions for comparison. | Instant definition. No auto-navigation away from choice, secret glossary autocomplete, or recursive tooltip maze. |
| MX23 / MI37, MI39 / S18, S19 | A world-native UI interruption touches one bounded fiction surface, then offers return to ordinary view. Meta flavor can make a power feel unusual while preserving the reader's footing. | L; off until a discovery route earns it; dial local decoration to a replayable scene. | Plain text scene with explicit close. Never imitate real save errors, alter actual settings, steal focus, or reveal changed truths outside their route. |
| MX24 / SB2, MI15 / S06 | An assist toggle explains the changed behavior beside its new state, without grading the player's legitimacy. Small wording choices make customization welcoming and understandable. | XS; concise effect sentence; dial opens mechanical detail. | Static text. State any real achievement/run consequences if they exist; do not invent penalties or change hidden knowledge permissions. |

## Quiet feedback and web craft

| Code / parent / reference | What, why and desktop idle fit | Cost / default plus dial | Reduced-motion fallback / secret and reading risk |
| --- | --- | --- | --- |
| MX25 / MI46 / S20, S01 | A milestone receipt stays in the journal; an optional quiet toast links to it and yields to a required choice. Recognition is revisitable, not another modal. | S with milestone event, M otherwise; journal only; dial one dismissible toast per batch. | Static receipt/toast. Hidden milestones do not get placeholders; refresh/import must not replay earned fanfare. |
| MX26 / MI41–43 / S21, S15 | Cozy feedback uses one low-volume confirmation for a deliberate harvest/craft batch, with visible receipt and no sound per idle tick. Repetition stays comfortable over hours. | S with sound hooks/assets, M otherwise; sound off unless existing preferences permit; dial category volume/cooldown. | Same static receipt; sound mute independent of motion. No pitch cues for hidden quality or rarity; throttle overlapping sounds. |
| MX27 / MI27 / S03 | Loading retains the last useful reading surface. Only a genuinely empty, slow-loading panel gets a static placeholder shaped like its public layout. No skeleton for instant local actions. | S; known content plus Updating; dial static skeleton for first load. | No shimmer. Placeholder geometry must not count secret rows; loading never announces an unearned result. |
| MX28 / MI28 / S01 | Optimistic presentation applies to reversible layout/read preferences; pending gameplay keeps a neutral acknowledgement until the domain confirms it. This keeps input quick without making false reward receipts. | S for local UI state, M for robust rollback; immediate reversible preference; dial shows pending state always. | Static pending/applied/error. A rollback must preserve focus and selection; never optimistically reveal secret facts, spend twice or claim Saved. |
| MX29 / MI25 / S01, S04 | Copy acknowledges in the invoking control, then restores its prior label; failure leaves text selectable. It is a tiny moment of confidence when taking notes from a panel. | XS; Copied for about 1 s; dial persistent confirmation. | Same static label in reserved width. Copy only the visible knowledge projection, never internal IDs, hidden text or save payloads by accident. |
| MX30 / MI29, MI34 / S02, S08 | Effects have one event budget: while reading or after returning, collect routine cues into one known summary instead of replaying all arrivals. User-triggered cues keep priority over passive ones. | M; at most one passive effect per panel at a time; dial quiet, normal, celebratory. | One static summary. Aggregation must not leak hidden counts; required warnings remain separate and readable. |
| MX31 / MI25, P4 recovery / S04 | Reversible presentation edits have a local Undo next to their confirmation. Pin/unpin or hide-panel feedback becomes forgiving without turning game consequences into reversible fiction. | S; Undo only where prior UI state is recoverable; dial extends its availability. | Static confirmation and Undo. Never suggest inventory, travel or story outcomes can be undone if the domain cannot do so. |
| MX32 / MI21, MI39 / S02, S06 | Selection changes preserve a steady reading baseline; reserve decorative motion for border or header accents. It gives world personality without making line tracking work. | XS; steady body and immediate selection label; dial accents only. | Entire state change static. No flashing text, animated paragraph reflow, illegible fictional numerals or hidden data in decoration. |

## Top 15 cheapest high-feel wins

Rank is INFERRED benefit per cost, prioritizing frequent desktop use and no
new content assets. It is a design shortlist, not a claim these are missing or
ready to merge. Rows requiring an absent data hook must be reranked after a
bounded source inspection. These are refinements of the existing MI palette,
not an extra set of simultaneous effects.

| Rank | Code | Cost | Why it earns its place / smallest reviewable result |
| --- | --- | --- | --- |
| 1 | MX01 | XS | Every action feels received; pointer and keyboard show the same honest pressed state. |
| 2 | MX04 | XS | Hover no longer looks purchased/selected; two items can be compared without ambiguity. |
| 3 | MX32 | XS | Reading stays steady through menu selection; world accents stay outside prose. |
| 4 | MX24 | XS | Assist copy describes the effect beside the toggle without shame or mystery penalties. |
| 5 | MX29 | XS | Copy has clear success/failure feedback in one existing control. |
| 6 | MX08 | XS | Endpoint feedback prevents accidental jumps across extreme menu values. |
| 7 | MX02 | S | Closing one detail returns the keyboard to the right row even if its owner disappeared. |
| 8 | MX03 | S | Escape peels one UI layer without cancelling the underlying work. |
| 9 | MX05 | S | A failed activation explains one known repair exactly where it happened. |
| 10 | MX06 | S | A completed row cannot turn into a different purchase under a second click. |
| 11 | MX17 | S | Earlier log growth cannot move the sentence currently being read. |
| 12 | MX10 | S | Focused/threshold values stay exact even when idle totals use compact notation. |
| 13 | MX09 | S | One reward counter is interruptible and never delays affordability or exact inspection. |
| 14 | MX11 | S* | A result retains its cause after its transient cue; *only cheap with receipt data. |
| 15 | MX31 | S | One reversible panel edit gets a real Undo with focus retained. |

MX07 is cheap but lower priority than continuity. MX13/19/21/23/30 can repay
attention, but need stronger data/content contracts. MX15's spectacle is best
reserved for rare events; routine idle output gains little from a tally queue.

## Source ledger and limits

Access date: 2026-10-14. SHOWN means the cited page/source was loaded, not that
the game was played or video watched. STATED means the named claim appears in
developer/documentation/wiki material. MEMORY is unchecked recall. Proposal
reasoning and effect timings remain INFERRED even when their reference is SHOWN.

| ID | Evidence and link | Supported reference / limit |
| --- | --- | --- |
| S01 | SHOWN: [NN/G, Microinteractions in User Experience](https://www.nngroup.com/articles/microinteractions/) | Trigger/feedback framing, status and error prevention; its Asana example separates completion confirmation/Undo from celebratory decoration. Does not prove any YAIRPG timing or satisfaction result. |
| S02 | SHOWN: [NN/G, The Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/) | Brief restrained motion can explain state/navigation; competing animations distract. No universal optimum duration is claimed here. |
| S03 | SHOWN: [NN/G, Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/) | Placeholder layout communicates loading; this is not evidence that synchronous local menus need skeletons. |
| S04 | STATED: [W3C APG, Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Escape closes a dialog; focus normally returns to the invoker, with logical exceptions. MX02/03 adapt this to panels and transient layers. |
| S05 | STATED: [Supergiant, Hades update notes](https://www.supergiantgames.com/blog/hades-updates/) | Codex Index supports viewing Olympian boon lists while browsing the codex or choosing boons. Boon pick motion and codex unlock animation are MEMORY, not established by these notes. |
| S06 | STATED: [Celeste changelog](https://www.celestegame.com/changelog.html) | Assist description revised; stamps changed to tabs; option items no longer auto-wrap; tally can be skipped; selected menu text stops flashing in Photosensitive Mode. Exact assist wording is not quoted or verified here. |
| S07 | STATED: [Subset's Into the Breach page](https://www.subsetgames.com/itb.html); SHOWN: [developer GDC postmortem slides](https://media.gdcvault.com/gdc2019/presentations/Into%20the%20Breach%20Postmortem%20Final.pdf) | Official page states enemy attacks are telegraphed; slides discuss telegraphs. Exact preview UI behavior was not played. Primary page direct open failed, so the developer slides were used as the alternate route. |
| S08 | STATED: [Mobius, Outer Wilds patch 1.0.7](https://www.mobiusdigitalgames.com/news/patch-107-is-now-available) | Ship log defaults to map mode when no new info exists. Specific link-reveal motion remains MEMORY. No plot or altered world truth is reproduced. |
| S09 | SHOWN: [Antimatter Dimensions format.js](https://raw.githubusercontent.com/IvarK/AntimatterDimensionsSourceCode/master/src/core/format.js) | `format` delegates to current notation; `formatInt` treats integer precision separately and comments on misleading abbreviated integers. Source reading only, no running large-number UI. |
| S10 | STATED, search excerpt only: [Melvor Currency wiki](https://wiki.melvoridle.com/w/Currency) | Number formatting can be changed in interface settings. Direct page load failed; exact current cap and hover behavior are not adopted as facts. |
| S11 | SHOWN: [Balatro official store page](https://store.steampowered.com/app/2379780/Balatro/) | Confirms chip/synergy framing. Count-up rhythm, score juice and sound escalation are MEMORY; page text does not establish them. MX09/15 are adaptations, not measurements of Balatro. |
| S12 | SHOWN: [A Dark Room notifications.js](https://raw.githubusercontent.com/doublespeakgames/adarkroom/main/script/notifications.js) | `printMessage` starts opacity at zero and fades to one over 500 ms; module notifications can queue. This proves source behavior only, not native reading comfort. |
| S13 | SHOWN: [Slay the Spire official store page](https://store.steampowered.com/app/646570/Slay_the_Spire/) | Deck/relic choice context verified. Hover previews and intent icon treatment remain MEMORY; not measured or played in this lane. |
| S14 | [Persona 5 official manual](https://atlus.com/persona5/manual/ps4/?pid=14), rendering gap; MEMORY for motion/typography | Image-only manual returned no usable text. Strong graphic menu identity is an unchecked lead, not a timing or accessibility authority. |
| S15 | SHOWN: [GDC Vault, Juice It or Lose It](https://gdcvault.com/play/1016487/Juice-It-or-Lose) | Session page identifies Martin Jonasson and Petri Purho and a live polish demonstration. Video not watched; individual effect recipes remain unchecked. |
| S16 | STATED: [Jan Willem Nijman's own talk index](https://www.jwaaaap.com/) | Lists The Art of Screenshake as INDIGO 2013. Linked video failed to load; no timestamps or measured shake settings. Calling this a GDC talk would be incorrect. |
| S17 | SHOWN: [Disco Elysium official store page](https://store.steampowered.com/app/632470/Disco_Elysium__The_Final_Cut/) | Skill/dialogue context. Skill-check animation and text pacing are MEMORY; exact probabilities, delays and retry rules are not asserted. |
| S18 | SHOWN: [Inscryption official store page](https://store.steampowered.com/app/1092790/Inscryption/) | Reference identity/context only. Specific meta UI tricks are MEMORY and deliberately left undescribed to avoid unnecessary spoilers. |
| S19 | SHOWN: [Undertale official store page](https://store.steampowered.com/app/391540/Undertale/) | Reference identity/context only. Meta UI details are MEMORY; no twist or imitation of real system errors is proposed. |
| S20 | SHOWN: [Cookie Clicker official store page](https://store.steampowered.com/app/1454400/Cookie_Clicker/) | Incremental/achievement context only. Milestone toast behavior is MEMORY; official web main.js failed to load, so store material is the alternate route, not code proof. |
| S21 | SHOWN: [Stardew Valley official store page](https://store.steampowered.com/app/413150/Stardew_Valley/) | Farming/life context. Cozy feedback and harvest sound feel are MEMORY, not perceptual evidence or a verified audio recipe. |
| S22 | STATED, search excerpt only: [publisher's Steve Swink Game Feel page](https://www.routledge.com/Game-Feel-Designing-Touch-and-Movement-for-Interactive-Experiences/Swink/p/book/9780123743282) | Identifies the book and virtual sensation topic. Direct open failed; full book not read. Using its action-game feel ideas for a text interface is INFERRED; no chapter-level claims. |
| S23 | STATED: [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | OS motion preference can be detected through CSS. Actual settings integration and assistive-technology behavior here remain untested. |

## Contradictions and bounded application

| Code | Both sides of the tradeoff / proposed default |
| --- | --- |
| R1 | Juice demonstrations encourage stronger response; NN/G documents the cost of competing motion. Default to one local cue with static receipt. Keep stronger spectacle reachable for a rare, skippable payoff. |
| R2 | MI28 offers optimistic instant actions; P4 requires truthful results. Optimistically show reversible UI edits; acknowledge consequential gameplay immediately but wait for confirmation before reward/knowledge/saved claims. |
| R3 | Into the Breach's public telegraphs make planning clear; an RPG observer may not know exact intent. Project only known intent, source, age and uncertainty. Full preview belongs only where the fiction actually earns it. |
| R4 | MI29 clears on view; a fleeting view may not mean the player read a codex entry. Default to clearing on deliberate inspection with a read boundary, while a dial may keep explicit Mark read. Do not conflate Seen with Resolved. |
| R5 | MI19's hold-to-confirm can reduce modals but adds motor effort and time. Keep ordinary explicit confirmation available, with keyboard access and a readable cost. No hold-only requirement is added by U9. |

Reduced motion defaults to the OS preference plus the existing in-game effects
choice; Effects off suppresses decorative motion. Final factual states, warning
text and focus continuity remain. Do not merely set duration near zero while
leaving animation-dependent cleanup, delayed controls or a waiting tally queue.
No whole-screen shake, prose flashing or idle pulse is a default recommendation.

Secrecy applies before rendering, not just after text is hidden: derive receipts,
counts, highlights, sounds, graph edges, clipboard output and accessibility text
from the same earned knowledge projection. Recheck a queued cue at delivery if
world/body/context changed. No `SECRETS*` file was opened for this catalog.

## Future review route, not work performed

| Code | Observable check if a later implementation is authorized |
| --- | --- |
| V1 | At 1366×768 and 1920×1080, open/close details with mouse and keyboard; remove the invoking row; confirm logical focus return and visible routine controls. |
| V2 | Deliver rapid gains, change selection mid-result, scroll into history and change a quote. Verify current facts, retained causal receipts and stable reading position. |
| V3 | Compare Effects off, OS reduced motion and optional stronger feel. Show identical final facts with no waiting requirement, motion-only information or hidden-tab replay. |
| V4 | Use public test fixtures for unrevealed content. Check visual text, DOM/accessibility, clipboard, sound, counts and queued events for unauthorized disclosure. |
| V5 | Rebuild and use a fresh test origin for behavior claims. If read markers/preferences change persistence, check Save/reload and literal-file import. Keep director taste acceptance distinct. |

This lane's document check does not satisfy any of V1–V5. Sources do not prove
that a detail feels good in this project's rebuilt UI.
