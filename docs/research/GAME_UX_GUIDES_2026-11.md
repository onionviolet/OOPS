# Game UX and interface writing guides, 2026-11

Accessed 2026-11-10 and 2026-11-11. Scope: established guidance that bears on the pitfall catalog PF1-PF31 and the unknown marks UK1-UK7 in [the core audit, rounds 6 and 7](../audits/PLAYER_EXPERIENCE_CORE_AUDIT.md). Research only: proposals, not accepted rules (AD56: nothing here narrows a dial until Weibao answers).

Labels: **[S]** stated by the source (paraphrased, quotes under 15 words); **[I]** my inference for this game. Where a page could not be read, the section says so and its points are marked **[I]** or "secondary".

Source reach summary:

| Source | Reached | Note |
| --- | --- | --- |
| NN/g ten heuristics | yes | full page |
| NN/g progressive disclosure | yes | full page |
| NN/g modal and nonmodal dialogs | yes | full page |
| NN/g microcopy | yes | Informational microcopy and command labels read on the publisher site |
| Hodent, *The Gamer’s Brain* | author material and EPUB | Author’s framework and onboarding transcript read. Local EPUB verified and selected passages checked. Full reading pending |
| Game Accessibility Guidelines | yes | full-list page (basic and intermediate items) |
| Xbox Accessibility Guidelines | yes | index plus XAG 101, 112, 116, 117 in full |
| GOV.UK | partly | content-design page now redirects to a "tone of voice" page that returned only a notice; A to Z style guide read | <!-- slip-ok: summarized source guidance, not a design rule -->
| Microsoft Writing Style Guide | partly | scannable content, simple words, writing tips read; the error-message pages 404ed |
| *Writing Is Designing* | publisher excerpt and EPUB | Chapter 1 read on the publisher site. Local EPUB verified and a Chapter 4 passage checked. Full reading pending |
| Apple HIG | yes | Modality, Motion and Popovers via Markdown. Alerts via Apple’s DocC data |
| Material Design 3 | yes | Motion physics on the official site and Android implementation docs for legacy timing and dialogs |

---

## 1. Nielsen Norman Group

Links: [ten heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/), [progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [modal and nonmodal dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/), microcopy articles: [3 C's](https://www.nngroup.com/articles/3-cs-microcopy/), [3 I's](https://www.nngroup.com/articles/3-is-of-microcopy/), [UI copy](https://www.nngroup.com/articles/ui-copy/).

Rules:

1. **Show state, promptly (heuristic 1).** Keep people informed about what the system is doing. [S] Bears on PF16, PF19, PF21 (a view that moves or loses state without saying why), PF27 (a block with no stated reason).
2. **Use the player's words and a logical order (heuristic 2).** [S] PF1, PF3, PF5, PF9 (engine words, ledger shorthand, raw minutes are all system language).
3. **Same word, same action, same place (heuristic 4).** [S] PF11, PF20, PF12.
4. **Prevent errors first; when they happen, name the problem and offer a fix (heuristics 5 and 9).** Plain language, no codes, precise cause, a way forward. [S] PF8, PF12, PF27, and every disabled button (PF12).
5. **Recognition over recall (heuristic 6).** Keep options and context visible instead of making people remember them. [S] PF14 (hiding things must not hide the options), PF19, UK2/UK3 (slots visible with ? marks).
6. **Minimalist design (heuristic 8).** Extra elements compete with what matters; this is about relevance, not a flat look. [S] PF2, PF4, PF11, PF13, PF14, PF15.
7. **Help should be concise, task-focused, in context (heuristic 10).** [S] PF2, PF4 (a manual where a hint belongs), PF15.
8. **Progressive disclosure: two levels is the practical maximum; defer rare options, keep related things together.** More levels usually leaves users lost; staged disclosure of steps that depend on each other forces bouncing back and forth. [S] PF14, PF13, PF18; also UK2 (five levels of knowing is a data model, not five screens; show at most two visible depths) [I].
9. **Pitfall: vague labels on the path to deferred options, or several routes to the same secondary option.** [S] PF14, PF25 (a menu reopened after every move).
10. **Modals only for critical warnings, required input, short wizards or high-value quick questions; they cover the content needed to answer them and train people to ignore them.** Nonmodal when work should continue. [S] PF18 (a task that takes the whole centre), PF23. <!-- slip-ok: summarized source guidance, not a design rule -->
11. **Informational copy gives the reader the facts they need in few words.** NN/g puts clarity and concision ahead of tone or humor and distinguishes copy that informs from copy that supports interaction. Command names identify the action and use consistent wording across surfaces. Confirmation buttons say what pressing them will do. [S] PF4, PF5, PF11, PF24, PFG7. [I] Review “Worth a try” as a hint and “Set up this try” as a command. The command needs to make clear that it fills the inputs for review. Use a word count to flag copy for review when useful. <!-- slip-ok: summarized source guidance, not a design rule -->

---

## 2. Celia Hodent, *The Gamer's Brain*

Primary sources: [Hodent’s framework and Fortnite case study](https://celiahodent.com/understanding-the-success-of-fortnite-ux/), [Hodent’s onboarding talk transcript](https://celiahodent.com/gamers-brain-ux-onboarding/). The [publisher’s book page](https://www.routledge.com/The-Gamers-Brain-How-Neuroscience-and-User-Experience-Can-Impact-Video-Game-Design/Hodent/p/book/9781003199519) identifies the book. The following claims come from Hodent’s public work.

1. **Usability and engage-ability are distinct.** [S] Hodent’s usability framework covers cues and feedback, clarity, form that signals function, consistency, workload, avoiding and recovering from errors, and flexibility including access. Engage-ability considers motivation, emotion and game flow. PF4, PF14, PF19, PF26–PF28.
2. **Give the player an action and a legible response.** [I] At the counter, look at the same task before and after setting up a suggested mix. Can a new player tell what changed, what will spend ingredients and how a sip adds evidence? Test the perception and memory burden (PF14, PF19), then check that the experiment still leaves something worth discovering (UK1, UK2, UK4).
3. **Check whether the control’s shape and placement explain its use.** [I] Test the `?` and the fold with keyboard and pointer. The player should be able to identify which ingredient and effect the hint refers to and reach it from the cell (UK1, UK5, PFG5, PFG10).

---

## 3. Game Accessibility Guidelines

Link: [full list](https://gameaccessibilityguidelines.com/full-list/). Levels as the source marks them.

Rules:

1. **Default text is large and readable without adjustment (basic).** [S] PF24 (wrapping), PFG1.
2. **Plain simple language for instructions and dialogue; clean uncluttered, scannable layout (basic).** [S] PF1, PF2, PF4, PF14.
3. **Text and UI stand out from the background; no essential information in a fixed colour alone (basic).** [S] PFG1, PFG4.
4. **Let players advance text prompts at their own pace and adjust game speed (basic).** [S] PFG3 (toasts), PF17; also bears on the idle clock [I].
5. **Avoid flicker and repetitive patterns (basic); option to hide background movement (intermediate).** [S] PFG2, PF16, PF17.
6. **Make interactive elements obvious (intermediate); big and well spaced (basic).** [S] PFG10, PF24, PF23.
7. **Show control reminders and current objectives in play (intermediate); contextual help and tips (intermediate).** [S] PF3 (where the how-to lives), PFG13, PF14.
8. **A progress summary for long, complex stories (intermediate).** [S] PFG13, UK3 ("3 of 7 known").
9. **Let players resize and rearrange the interface (intermediate).** [S] PF14, PF16 (layout choices forgotten after reload, UR58).
10. **Highlight key words so important terms stand out (intermediate).** [S] PF2, PF13, UK6.
11. **Practice mode or sandbox where learning is free of failure (intermediate).** [S] UK2 ("tried" level of knowing), PF28 [I].

---

## 4. Xbox Accessibility Guidelines (version 3.2, 2023-06-08)

Links: [index](https://learn.microsoft.com/en-us/gaming/accessibility/guidelines), [XAG 101 text display](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101), [XAG 112 UI navigation](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/112), [XAG 116 time limits](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/116), [XAG 117 visual distractions and motion](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117). XAG 102 (contrast) and 103 (additional channels for cues) were identified in search but not opened.

Rules:

1. **Minimum default text size on PC: body height at least 18 px at 1080p, 36 px at 4K; scalable to 200 percent without losing content or needing two-direction scrolling.** [S, XAG 101] PFG1, PF24. Our target is 1920x1080 desktop (AGENTS.md), so 18 px is directly checkable [I].
2. **Text blocks: line width under about 80 characters, leading at least 1.5, paragraph spacing at least twice the leading when no setting exists; sentence case, not all caps; left-aligned, not justified or centred.** [S, XAG 101] PFG12, PF4, PF15 (long preambles are worse at wide measure).
3. **Settings carry over to every text surface, including error messages, toasts and overlays.** [S, XAG 101] PFG1, PF23.
4. **Content that auto-updates, blinks, scrolls or moves unprompted can be paused, hidden, or throttled; backgrounds behind text can be made static or opaque.** [S, XAG 117] PFG2, PF16, PF17, PF21.
5. **Avoid camera shake, bobbing and repeated side-to-side motion unless core to play; offer an off switch.** [S, XAG 117] PF17 (ease-ins), PFG11.
6. **UI time limits only when essential; elements that disappear on a timer (toasts, tutorial windows, chat) can be extended to at least ten times default or turned off, and text advances on input.** [S, XAG 116] PFG3, PF10 (history keeps text), UR88 (notices that open themselves).
7. **UI is fully reachable by keyboard alone; focus order is logical and matches the visual layout; repeated components keep the same order on every screen; a persistent route back exists from every submenu.** [S, XAG 112] PFG5, PF19, PF25, PF23.
8. **Complex sets of pages (bestiaries, quest logs, big inventories) offer more than one way to find content (filter tabs plus search).** [S, XAG 112] PF13, UK3, UK6.
9. **When an input method changes meaning (for example a remap mode), say how to leave it.** [S, XAG 112] PF23.
10. **Do not scroll in two directions after text scaling; reflow instead.** [S, XAG 101 and 112] PF24, PF16.

---

## 5. Interface writing

### 5a. GOV.UK

Link: [A to Z style guide](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/). The content-design and tone pages redirect and returned no rules; only the A to Z guide was read.

1. **Plain English; explain a technical term on first use.** [S] PF1, UK2 ("seen" gets a plain description).
2. **Active voice; skip "please"; write negatives out in full; avoid semicolons.** [S] PF1, PF2.
3. **Avoid metaphors and abstract verbs (hub, portal, deliver, transform, tackle); name the thing.** [S] PF1.
4. **Review any sentence over 25 words; one idea per sentence.** [S] PF2, PF4, PF15. Cheap lint candidate [I].
5. **Link text is front-loaded, specific, and covers only the relevant words.** [S] PF3, PF6 (names in sentences), PF11. <!-- slip-ok: summarized source guidance, not a design rule -->
6. **Say "select" rather than "click", because not everyone clicks.** [S] PF3 (interface instructions inside world text), PFG5.

### 5b. Microsoft Writing Style Guide

Links: [scannable content](https://learn.microsoft.com/en-us/style-guide/scannable-content/), [simple words](https://learn.microsoft.com/en-us/style-guide/word-choice/use-simple-words-concise-sentences), [writing tips](https://learn.microsoft.com/en-us/style-guide/global-communications/writing-tips). The UI-text and error-message pages 404ed.

1. **Lead with what matters; put key words at the start of headings, table rows and paragraphs.** [S] PF4, PF15, PF11.
2. **Short headings, sentences and paragraphs; three to seven lines is a fair paragraph.** [S] PF2, PF15, PFG12.
3. **Use one term for one concept, and avoid noun-verb words (file, post, mark, screen, record, report) where meaning could split.** [S] PFG8, PF11, PF1.
4. **Cut adverbs, "in order to", and stacked modifiers.** [S] PF2, PF4.
5. **Keep articles and verbs in short UI labels where clarity needs them ("Access is denied", not "Access denied").** [S] PF5 (ledger shorthand), PF9.
6. **Replace complex sentences and paragraphs with lists and tables.** [S] PF2 (digit-dense paragraphs), PF13 (a table beats a grid of unknowns only if rows carry content).
7. **Same sentence structure for similar items; bold only for UI labels in procedures.** [S] PF11, PF12, PF24. <!-- slip-ok: summarized source guidance, not a design rule -->

### 5c. *Writing Is Designing* (Metts and Welfle)

The [publisher’s Chapter 1 excerpt](https://rosenfeldmedia.com/sample-chapter-writing-is-designing/) covers writing as part of interaction design and evaluates it for usability, usefulness and responsibility.

1. **Design the words with the route they refer to.** [S] The chapter compares a search instruction with a direct link to search. [I] “Set up this try” should sit by the suggestion and prepare the proposed inputs in one step. Explain a genuine consequence at the point of commitment (PF3, PF4, PF22).
2. **Check clarity, user control and truthfulness together.** [S] The chapter asks whether people can use the copy, whether it serves their goals and whether its claims are true and inclusive. [I] For a guessed effect, review the visible label and accessible name together. Both should say what the character suspects and preserve uncertainty (UK1, UK4, UK5).

---

## 6. Platform motion and dialogs

### 6a. Apple HIG

Links: [Modality](https://developer.apple.com/design/human-interface-guidelines/modality), [Motion](https://developer.apple.com/design/human-interface-guidelines/motion), [Popovers](https://developer.apple.com/design/human-interface-guidelines/popovers). Read [Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts) through [Apple’s DocC data](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/alerts.json).

1. **Add motion for a purpose; gratuitous animation distracts.** [S, Motion] PF17, PFG11.
2. **Make motion optional and never the only way to convey important information.** [S, Motion] PFG11, PF16. <!-- slip-ok: summarized source guidance, not a design rule -->
3. **Keep feedback animation brief and tied to the action; avoid motion on frequent interactions; let people cancel it, especially when repeated.** [S, Motion] PF17, PFG11, PF16.
4. **Use modality only for a clear benefit; keep modal tasks short; avoid a modal that feels like an app within the app; always give an obvious dismiss; title the modal with its task.** [S, Modality] PF18, PF23. <!-- slip-ok: summarized source guidance, not a design rule -->
5. **Confirm before closing a modal only when it would lose the player's work.** [S, Modality] PF23, PFG6.
6. **One modal or popover at a time, never a cascade; nothing over a popover except an alert.** [S, Modality, Popovers] PFG6. <!-- slip-ok: summarized source guidance, not a design rule -->
7. **A popover is for a small amount of content, points at what it describes, and should not cover that element or essential content.** [S, Popovers] PF22, UR111.
8. **Do not warn in a popover (easily missed or closed); autosave on light dismiss; discard only on an explicit Cancel.** [S, Popovers] PF23, PFG6, PF19. <!-- slip-ok: summarized source guidance, not a design rule -->
9. **Animate a popover's size change so it reads as the same popover.** [S, Popovers] PF16, PF17.
10. **Do not name the widget in help text ("the popover"); name the task.** [S, Popovers] PF3, PF1.

11. **Match interruption to stakes.** Apple favors contextual status for routine information and reserves alerts for moments with a useful action, such as preventing an accidental loss that cannot be undone. Alert copy names what happened. Action buttons describe the result, and a destructive alert offers a clear Cancel. Apple allows OK for acknowledgment in informational alerts. [S, Alerts] PF23, PFG6, PFG7, PFG9. [I] Put a missing ingredient beside Mix. Consider a confirmation for an unusual irreversible loss when an accidental choice is plausible. <!-- slip-ok: summarized source guidance, not a design rule -->

### 6b. Material Design 3

Primary sources: [M3 motion physics](https://m3.material.io/styles/motion), [Android motion implementation](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md), [M3 dialogs in the Android component docs](https://github.com/material-components/material-components-android/blob/master/docs/components/Dialog.md).

1. **Separate spatial motion from visual effects.** The newer M3 Expressive guidance uses spring schemes with fast, default and slow variants for each family. It describes this system as replacing the previous approach based on easing and duration. [S] PF16, PF17. [I] Evaluate a fade and spatial movement independently at 1920×1080. Leave the side columns and currently focused action in place.
2. **Android’s older timing tokens are implementation examples.** The Android motion docs list 50, 100, 150 and 200 ms for the four short tokens. [S] PF17. [I] UR152’s 140 ms is the project’s existing choice. Check how it reads on a real route with motion enabled and reduced. The Android token values establish no timing requirement for YAIRPG.
3. **A dialog can carry a decision or critical information.** The Android component docs distinguish basic and full-screen dialogs. [S] PF23. [I] Use the Apple and NN/g material above to decide whether to interrupt a particular desktop task. A routine stock shortage can appear inline.

---

## Gaps the catalog misses

Pitfalls these guides name that PF1-PF31 and UK1-UK7 do not.

| Code | Gap | Source | Why it matters for this game |
| --- | --- | --- | --- |
| PFG1 | **Text below a floor or contrast, with no scale** (18 px body at 1080p PC; scalable to 200 percent; contrast; carry-over to overlays and toasts) | XAG 101, GAG basic | Desktop 1920x1080 first; dense panels tempt 11 to 12 px. The Proto23 look is compact, so a floor is a real dial [I]. |
| PFG2 | **Ambient or auto-updating motion with no pause** (live counters, auto-ticking clocks, moving backgrounds under text) | XAG 117, GAG | An idle game updates constantly; PF16 covers layout shifts but not motion the player cannot stop. |
| PFG3 | **Notices that vanish on a timer** | XAG 116 | Reports, toasts and "opens itself mid-read" (UR88); the default should hold until dismissed, with the dial at a duration. |
| PFG4 | **State carried by colour alone** (known/unknown, affordable/not, disabled) | GAG basic | UK1 and UK2 mark knowing; a ? must not be the only difference between tried and known. | <!-- slip-ok: summarized source guidance, not a design rule -->
| PFG5 | **Keyboard and focus order** (logical order, same order on repeated components, a persistent way back, focus kept after redraw) | XAG 112 | UIC120 is on the watch list; PF19 covers lost state but not tab order or a back route from every view. |
| PFG6 | **Stacked or warning-carrying overlays** (two sheets open, a popover on a popover, a warning in a hover) | Apple, NN/g | UR150 covers dismissal but nothing says "one at a time" or "warnings never live in hovers". UK5 hover detail must not hold a warning [I]. | <!-- slip-ok: summarized source guidance, not a design rule -->
| PFG7 | **Buttons labelled OK, Yes, Confirm instead of the outcome** | NN/g UI Copy, Apple Alerts | "Begin", "Buy 1" are good; generic confirms creep in on rare dialogs. |
| PFG8 | **One concept, several words** (and one word, several concepts) | MS, NN/g heuristic 4 | Four worlds, many names: "mix", "brew", "combine"; "held", "carried", "stock" (PF5 shows this in the mixing counter). |
| PFG9 | **Blocked actions that say what but not why or what next** | NN/g heuristics 5 and 9 | PF12 and PF27 cover the repeated reason; the gap is a reason that names the way forward. |
| PFG10 | **Interactive things that do not look interactive** | GAG intermediate | Folds, ? marks, hover details; a UK1 mark that cannot be seen to be clickable is a dead end [I]. |
| PFG11 | **Animation that cannot be skipped, repeats on frequent actions, or is the only signal** | Apple Motion | UR152 eases views in; for a daily action it becomes a toll. Needs a cancel and a Reduce Motion respect (`prefers-reduced-motion`). | <!-- slip-ok: summarized source guidance, not a design rule -->
| PFG12 | **Text measure and paragraph walls** (over about 80 characters per line, leading under 1.5, paragraphs over about 7 lines) | XAG 101, MS | Talk, Notebook and Reports are prose in wide centre views at 1920 px; line width grows with the screen. |
| PFG13 | **No way to see where you are** (current objective, progress summary for a long chain) | GAG intermediate | The work line hidden by a view (UR11) is one case; also UK3's "3 of 7 known" and a progress summary after a long absence. |
| PFG14 | **A single route to complex content** (bestiary, notebook, herb lore with no search or filter) | XAG 112 | UK3 pages grow large; there should be a second route (filter or find) before the list is long [I]. |
| PFG15 | **Three or more disclosure levels** | NN/g progressive disclosure | UK2's five levels of knowing plus folds inside folds (PF14) could stack depth; cap visible depth at two [I]. |

---

## Candidate rules and checks

Each is default, dial, reason. All **[I]** proposals; sources are in the sections above. "Check" says what a cheap automated test could be: **lint** (over source strings, extends PRS6 and the PF29 fix) or **browser** (headless over visible text and layout, extends check:flow).

1. **Body text floor.** Default: visible body and control text is at least 16 px at 1080p desktop (the XAG minimum for PC is 18 px of body height; font size and body height differ, so pick a measured value); dial: a text size setting scaling to 200 percent, and a denser value for chrome labels with a reason. Reason: reading comfort on the target screen. Covers PFG1, PF24. Check: browser, compute font size of every visible text node, list those under the floor.
2. **Hold notices until dismissed.** Default: a notice stays until dismissed, moved to Reports, or superseded; dial: an auto-dismiss duration setting, at least ten times a short default (XAG 116), per notice type. Reason: reading speed varies, and an idle game runs in the background. Covers PFG3, PF10. Check: browser, wait 30 seconds after a toast and see it still present; lint for `setTimeout` near notice code.
3. **Live motion can be stilled.** Default: counters and background movement respect `prefers-reduced-motion` and a Settings switch; dial: per-view (stat tickers, view ease-in, background). Reason: XAG 117, and an idle game moves constantly. Covers PFG2, PFG11, PF17. Check: browser with reduced motion emulated; assert no running animations or transitions over 100 ms on the home view.
4. **One reason, one way forward.** Default: a disabled or refused action states its reason once (per UR149) and the next step in plain words when one exists ("Needs 5 coins"); dial: the world can leave the way forward out when finding it is the point. Reason: NN/g 9, PF12 and PF27 only cover repeating. Covers PFG9, PF12, PF27. Check: lint over disabled-reason strings for a missing quantity or verb; browser list of `aria-describedby` reasons per view.
5. **Outcome labels.** Default: buttons say the outcome ("Brew the batch", "Leave it"), not OK, Yes or Confirm; dial: OK can acknowledge a purely informational alert. A destructive confirmation needs a clear cancel route. Reason: players should not need the question to read the answer. Covers PFG7, PF24. Check: lint for `'OK'|'Yes'|'Confirm'|'Submit'` in button label fields; browser, buttons whose text is exactly those words.
6. **One word per thing.** Default: each game object or action has one display noun or verb per world, held in the naming sheet; dial: variants in dialogue voice, one per speaker. Reason: MS and NN/g consistency; the mixing counter already shows drift. Covers PFG8, PF11, PF1. Check: lint comparing a synonym list per world against the Notebook, Reports and panel strings (extends CTR in check:rules).
7. **Overlays stack one deep; warnings do not hover.** Default: at most one popover or sheet at a time, nothing over a popover except a notice, and no warning or cost surprise inside hover-only detail; dial: a pinned side detail for compare views (PF22). Reason: Apple and NN/g; hover is easy to miss or close. Covers PFG6, PF23, UK5. Check: browser, open every popover trigger and assert at most one open layer; lint that `title=` attributes do not hold warnings or costs.
8. **Visible depth of two.** Default: a panel shows its content and at most two levels of folds or detail before it moves to a view; dial: a per-world "show more" setting. Reason: NN/g, plus UK2's five levels need compressing for display. Covers PFG15, PF14, UK2. Check: browser, count nested `details` or disclosure depth per view.
9. **Prose measure.** Default: running prose (talk, notebook, Reports, place text) keeps lines near 60 to 80 characters and paragraphs under about 7 lines; dial: wider measure for tables and ledgers. Reason: XAG 101 and MS; centre views at 1920 px stretch lines. Covers PFG12, PF15. Check: browser, per prose block, characters per rendered line and line count.
10. **Flag dense narrator copy for review.** Default: flag sentences over 25 words or with several numbers in place text, dialogue answers and panel intros. Dial: review structured ledgers and quoted prose in context. Reason: GOV.UK treats length as a review prompt, and PF2 shows that dense numbers can hide the point of a sentence. Covers PF2, PF4, PF5, PF15. Check: report candidates for a person to review alongside the actual screen.
11. **Colour is never alone.** Default: every state shown in colour also has a mark, word or shape (a ? for unknown, a check for done); dial: a high-contrast theme. Reason: GAG basic. Covers PFG4, UK1, UK2. Check: browser, for elements that differ only by computed colour between states, flag; manual spot check after.
12. **A second route in long lists.** Default: any list over about 12 rows (bestiary, herbal, notebook, people) gets a filter or find box; below that, none; dial: threshold per page. Reason: XAG 112. Covers PFG14, PF13, UK3, UK6. Check: browser, count rows per list view and assert a search or filter control exists above the threshold.
13. **Keyboard reach and back.** Default: every control is reachable by Tab in visual order, Esc closes the top overlay, and every centre view has a visible way back; dial: shortcuts per world. Reason: XAG 112; focus lost after redraw is already on the watch list. Covers PFG5, PF19, PF23, PF25. Check: browser, Tab through each view and assert order matches DOM rects; assert focus survives a redraw.
14. **Where am I.** Default: the work line or current goal is visible or one key away from every view, and long absences get a one-line summary of what changed; dial: hidden in a "no hints" world. Reason: GAG intermediate. Covers PFG13, UR11. Check: browser, assert the work line is in the viewport or not covered on each route.
15. **Motion is cancelable and rare.** Default: start with UR152’s current 140 ms centre transition and compare an immediate change on repeated actions. Dial: tune fade and movement independently where they clarify a change. Reason: Apple Motion and Material distinguish useful feedback from movement that interrupts work. Covers PFG11, PF17, PF16. Check: browser at 1920×1080, exercise repeated actions with motion enabled and reduced, and check whether focus, controls and side columns stay stable.

First desktop review priorities: outcome labels (5), action recovery (4), keyboard reach (13), text scale (1) and motion (15). Review the first purchase, a blocked Mix and the first discovery before deciding which checks are useful as lint.

---

## Open items

- Full-book coverage remains open for both titles. See the 2026-11-11 intake and reading notes below.
- GOV.UK error-message pattern and Microsoft error-message pages not reached; PF8, PFG9 rest on NN/g heuristics 5 and 9.
- The later pass opened XAG 102 (contrast) and 103 (multiple channels), linked in the source comparison below.

## Online research and book shortlist, 2026-11-11

Start online for a specific screen or interaction. The [reference screen notes](GAME_UX_REFERENCE_SCREENS_2026-11.md) already cover alchemy, unidentified items, dense simulations, relationships and incremental onboarding. Add a source when it answers a question those examples leave open. Treat the uses below as proposed checks for OOPS.

| Question | Primary online source | OOPS comparison |
| --- | --- | --- |
| How do dense inventories and crafting menus stay searchable? | Wube’s [Character GUI write-up](https://www.factorio.com/blog/post/fff-289) describes moving search out of a permanent subheader and distinguishing crafting controls from item slots. | Try finding a reagent while keeping the selected mixture and its known effects visible at 1920×1080. |
| Can the player keep their place while live state changes? | Xbox guidelines for [focus](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/113) and [moving or auto-updating content](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117). | Use the keyboard to recover from a blocked Mix and return to the same control after an inventory update. |
| When does an idle loop stall or run away? | Anthony Pecorella’s [idle-game math](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i) and [GDC talk](https://www.gdcvault.com/play/1023863/Quest-for-Progress-The-Math). | Model cost, production and time to the next useful choice for one world. Use canon quantities as fixed points where they apply. |
| How can events respond to world state without a huge branching tree? | Emily Short’s [Beyond Branching](https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/). | Compare how one investigation or relationship scene can become available through different people, evidence or standing. |

Consider full books when the method will be reused across several slices.
These were the first four leads. All four are now held. The [intake receipt](LIBRARY_INDEX.md#game-design-and-writing-references-2026-11-11-dl117)
identifies the verified editions and reading scope.

| Priority | Book and first use | Initial candidate |
| --- | --- | --- |
| 1 | Celia Hodent, [*The Gamer’s Brain*](https://thegamersbrain.com/). Learn how attention, memory and onboarding affect a player’s first encounter with a mechanic. Start with [Hodent’s Fortnite UX talk](https://gdcvault.com/play/1028688/Developing-a-UX-Mindset-on). | `zlibrary:118664492:de3119` |
| 2 | Ian Schreiber and Brenda Romero, [*Game Balance*](https://www.routledge.com/Game-Balance/Romero-Schreiber/p/book/9781498799577). Use the methods to compare feedback loops, pacing and resource flows. Balance goals stay world-specific. | `zlibrary:118681490:bdc73e` |
| 3 | Tracy Fullerton, [*Game Design Workshop*, fifth edition](https://www.routledge.com/Game-Design-Workshop/Fullerton/p/book/9781032607016). Use the prototyping and playtesting methods when comparing two playable versions of a loop. | `zlibrary:118664502:6ed462` |
| 4 | Michael J. Metts and Andy Welfle, [*Writing Is Designing*](https://rosenfeldmedia.com/books/writing-is-designing/). Read the errors chapter when revising blocked actions, confirmations and Reports together. The [publisher sample](https://rosenfeldmedia.com/sample-chapter-writing-is-designing/) already covers chapter 1. | `zlibrary:24736421:7f89ae` |

First proposed application is the existing desktop Mix route. Check that the
player can see what is missing, find it and come back with the same setup.
Game-feel references become more useful when a frequent action needs tuned
response or feedback. Steve Swink’s [*Game Feel*](https://www.routledge.com/Game-Feel/Swink/p/book/9780123743282) is a lead for that pass.

## UI, progression and choice research, 2026-11-11

Weibao asked to improve the rules using book and online research, and called out
interesting UI wording and place descriptions that suggest possible play, such
as wondering whether he could build a house there. This pass adds working
defaults under AD56. Trial target is 1920×1080 desktop, with mobile deferred
under the standing UI priority. Examples are authored sketches.

| Ref | Evidence | OOPS use |
| --- | --- | --- |
| F1 | Hodent’s onboarding transcript describes a player who remembered that crafting existed but could not find it again when needed. The EPUB’s memory chapter gives the background. [Hodent’s talk](https://celiahodent.com/gamers-brain-ux-onboarding/) | **UR153.** Teach the verb while it serves a purpose, then give a cue at the next use. A single successful lesson does not prove the player can resume. |
| F2 | Wube shows both the production history and the rate window behind its research ETA. Its trigger research lets a world action, such as mining a new resource, advance knowledge. [Research tooltip](https://www.factorio.com/blog/post/fff-423), [trigger research](https://www.factorio.com/blog/post/fff-376) | **UR155, PAC9.** Derive the progress display from the gate and explain what changes when it opens. An appointment, permission or shortage needs its own explanation. Some gains can arrive through using the relevant thing in the world. |
| F3 | Pecorella compares growth, costs and reset curves. *Game Balance* ch. 3 maps resources and exchanges, and ch. 6 provides an economy vocabulary. Mega Crit’s talk describes using play data to guide balance iteration. [Pecorella](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii), [Mega Crit](https://www.gdcvault.com/play/1025731/-Slay-the-Spire-Metrics) | **PAC9–PAC10.** Compare time to the next useful consequence under ordinary play and plausible interruptions. For OOPS, use reproducible traces and the player's account of what felt slow. Keep economy, attention and game clocks distinguishable. Preserve lore anchors and the value of long pursuits. |
| F4 | XAG 113 asks for visible focus throughout the UI. XAG 102 and 103 address perceptibility and additional channels. Swink’s response-metrics chapter treats feedback as part of the input-to-output loop. [Focus](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/113), [contrast](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/102), [cues](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103) | **UR154.** Preserve focus and context through updates, and make a result readable even when a flourish is missed. Compare repeated actions with motion and sound disabled. |
| F5 | Nicklin’s ch. 5 treats the voice, type and modality of a choice as design decisions. Choice of Games discusses player reasons for choosing. Short describes callbacks that change a later encounter while retaining the same broad goal. [Choice of Games](https://www.choiceofgames.com/2010/03/5-rules-for-writing-interesting-choices-in-multiple-choice-games/), [Emily Short](https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/) | **PRS10–PRS11.** A spoken option can express personality, spend standing or change what a person thinks. Let its label carry that intent and let the world answer in the appropriate voice and time. |
| F6 | Squire and Jenkins discuss games as spaces players explore and act in. Metts and Welfle’s ch. 4 starts with the task the player came to accomplish when something goes wrong. [The Art of Contested Spaces](https://web.mit.edu/~21fms/People/henry3/contestedspaces.html), [Writing Is Designing](https://rosenfeldmedia.com/books/writing-is-designing/) | **PRS12 with PRS9.** Let an observable detail put an idea in the player’s head. Keep the construction terms and any blockage at the control where the player decides to act. The landscape can answer later in the same voice. |

### A place, an action and a return

| Surface | Example | What to check |
| --- | --- | --- |
| First visit | “The flood marks stop a foot below the shelf. Maybe I could build a house up there.” | The marks are observable. The spot is buildable or has a credible route to making it so. |
| Choice or command | **Survey the shelf** · 20 min. In a conversation, an expressive alternative could be **“I think I could make a home here.”** | The survey spends time and produces a finding. The spoken line expresses intent and gives the listener something to react to. |
| Blocked work | “The lower bank is still soft. The shelf above it might hold.” | The explanation reflects the checked site. A route to investigate is available when the character can see one. |
| Return after work | “The river is up to the old marks. Your doorstep is still dry.” | The detail responds to water and completed work. A different result gets different prose when the character can see it. |

### Dispositions

**ACT NOW.** Registered the six English EPUBs and updated the UI, pacing and
prose owners and the rules router. [Intake receipt](LIBRARY_INDEX.md#game-design-and-writing-references-2026-11-11-dl117).
Book evidence was a TOC check and selected passages. Full-book reading is open.

**ACCOUNT FOR NOW.** A place detail can carry mood or history on its own. Where
it also hints at play, ground it in the site’s visible state. Let ordinary
action labels be short and let spoken choices sound like a person. In a
progression review, inspect the value and visibility of the next use together.
Give a returning player a way to recover the thread of what they were doing.

**LATER / DELEGATE.** Each trial stays in its existing owner and uses a real
journey. Fullerton’s ch. 9 provides the playtesting method of observing a
player with an open task before asking for their interpretation.

| Aspect | Fit | Done check |
| --- | --- | --- |
| Feel and sensory feedback | UI engineer, small. Compare the ordinary Mix response with a brief optional flourish using the same settled result. | In a repeated 1920×1080 route, input has a legible response and both success and refusal remain understandable with sound and motion reduced. |
| Mid- and late-life pacing | Systems designer, medium. Choose one livelihood or research loop and trace the next useful choice after a fresh start, a mature routine and a supply interruption. | Record what controls the wait and whether play opens up after the gain. Use a targeted trace and one playable walk. |
| Place, voice and consequences | Narrative designer, small. Use one site or relationship choice with meaningful alternatives and a later callback. | A reader can say what each option does from the text, and a return visit shows the perceptible result using the stored world state. |
| Return after a real break | UI and systems reviewer, small. Leave a long job or an open question, then return through the normal save route. | The player can identify what changed, what still matters and where to resume without replaying the introduction. |
