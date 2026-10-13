Below is a tighter replacement that makes discovery authority, VFX consumption, persistence, ownership, and rebuilt-browser proof explicit while keeping stronger effects as a future extension rather than a prerequisite.

Implement one bounded playable YAIRPG slice that connects Proto23-inspired progressive disclosure to the existing text-native VFX system. Complete and prove one genuine discovery transition before considering any second consumer. Preserve the larger UI and VFX horizon in the existing design documentation, but do not turn this round into a framework rewrite, broad UI conversion, or demonstration of powers the game does not yet possess.

Do not stop at an audit, prompt, mockup, or preview when the live repository permits a native implementation.

Authority and boundaries

The human explicitly authorized this browser review and a later local implementation round. This prompt is reviewer advice until the local executor reconciles it with live owners and repository state.

Work in the existing YAIRPG checkout and follow the live repository instructions. Before editing, read and reconcile at minimum:

AGENTS.md

PROJECT.md

docs/USER_VISION.md

docs/PRESENTATION_AND_FOURTH_WALL.md

docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md

docs/research/proto23/UI_SOURCE_ABSORPTION_2026-10-13.md

docs/research/proto23/SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md

Treat all source-path and behavior descriptions below as supplied observations that require execution-time verification.

Inspect dirty state, current ownership/reservations, and relevant tests before writing. Preserve unrelated work. Use one writer per file area. If a required shared path has another active owner, do not overwrite it. Use an authorized ownership transfer if available, or leave a narrowly described candidate/change requirement for that owner.

This round does not authorize reset, discard, commit, push, publication, modification of personal saves, new agents or chats, new reference-source acquisition, paid services, or revival of paused authoring/world lanes. Do not expose tokens, private data, save contents, or other secrets in reports or evidence.

Desktop/laptop remains primary. Mobile optimization is deferred. Keep the first milestone inside the accepted one-realm, one-prestige-layer scope.

Reference evidence and what to adopt

The audited public Proto23 reference is 23html/23html.github.io/index.html, revision e93a8cd617932fb698ff889b968a32f9a20d48f3, SHA256 a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5.

Prior source review and browser play found useful progressive disclosure:

difficulty selection reveals the enemy/combat presentation;

the first recipe reveals Assemble;

the first learned action reveals Actions;

books reveal Journal/Bestiary;

using a wallet reveals currency controls.

Later items above remain source evidence unless independently reproduced in YAIRPG. Do not present them as YAIRPG behavior.

Proto23 also demonstrated defects or design choices that must not be copied:

skill discovery occurs on first level-up, not first XP;

accumulation hooks could overcount an XP award;

a missing second tool could still permit a craft attempt and increment its counter;

round-based RNG could systematically favor middle options;

hover could grant Literacy XP;

fixed coordinates and timers could couple presentation to game behavior.

Do not transplant any of those behaviors.

Preserve semantic color distinctions. Inventory/category color, rarity/equipment glow, and combat damage/result color carry different meanings. Do not flatten them into one generic rarity or accent system.

Useful reference lessons are structural: compact rows, adjacent list/detail views, dedicated comparison space, tall readable logs, progressive disclosure, and dense information that remains legible. Adapt those ideas through YAIRPG's flexible layout rather than copying Proto23 coordinates.

Do not reuse source code or assets unless license provenance is already resolved by an authoritative project owner. Independent implementation of learned behavior is the intended route, with attribution retained where appropriate.

Discovery model

Keep these facts separate:

whether the player has discovered that a system or concept exists;

whether knowledge about it has been learned;

whether it is permanently unlocked;

whether it is currently eligible or actionable;

whether the user has hidden or collapsed its presentation.

Do not infer one fact from another merely because the current UI combines them.

Unknown information must not leak through module names, disabled picker entries, search results, counts, badges, themes, accessibility text, logs, reports, screenshots, or effect metadata. A known but currently unavailable method may remain visible with its truthful reason.

Preserve critical character, save/recovery, navigation, and other baseline controls. Do not gate basic app operation behind a tutorial.

Existing implementation surfaces to verify

Recheck the live implementation before choosing an edit path.

Reported entry points include:

src/skill_discovery.js, which projects known/hinted/available/blocked rows, filters before search/counts, preserves accepted-work records, and returns null for unknown content.

src/skill_discovery_native.js, which reads existing XP and visibility/unlock facts without initializing progress.

src/models/skill.js, which owns native thresholds.

src/main.js:add_xp_to_skill, which reportedly has a hidden-to-visible transition, restore/load exceptions, and a nativeCraftMessage path.

src/display.js, which owns skill-bar creation/update and logging.

src/workspace_layout.js, whose modules have eligible() but whose registrations may default to eligible and whose picker may expose named disabled entries.

src/workspace_state.js, which owns browser-local layouts separately from game saves.

src/settled_text_effects.js, which presents post-settlement text/ink receipts with bounded animation, deduplication, hidden-tab cancellation, reduced-motion support and opt-in audio.

src/customization_profiles.js and src/customization_ui.js, which own effects mode, audio, placement and current per-module support.

Verify each consequential claim before depending on it. If live code differs, follow current owners and record the difference.

Implement one connected native slice

Prefer a real skill-discovery transition if live evidence confirms it provides a clean authoritative boundary.

The target behavior is:

Before legitimate discovery, the selected skill/system is absent from every surface that should respect discovery, including relevant rows, categories, picker entries, search results and counts.

Legitimate gameplay input crosses the existing native threshold. Do not alter XP thresholds, rewards, prerequisites or save state merely to make the demonstration easy.

The existing authoritative transition makes the skill/system known.

The newly useful native view or row becomes visible.

One restrained text-native cue marks that first settled discovery.

The cue consumes the settled result. It does not determine whether discovery happened, grant XP, unlock content, alter RNG, initialize progress, or settle gameplay.

Subsequent XP, redraws, hover, layout changes and unrelated events do not replay the first-discovery flourish.

If skill discovery is not a safe consumer after live inspection, choose another already reachable, authoritative learning/discovery transition. It must still satisfy the discovery and VFX outcomes above. State why the substitute is more authoritative or less invasive. Do not fabricate a new gameplay event just to demonstrate VFX.

Limit native integration to the chosen transition and any narrowly required shared support. Do not convert every Proto23 reveal in this round.

VFX contract

Use the existing effect/settings owners rather than creating a parallel effects system.

Separate event semantics from visual motifs. The gameplay owner should expose or pass enough structured truth to identify a supported settled event. Presentation may choose an effect from that truth. Do not use prose regexes, color, text wording, or DOM state as authoritative gameplay inference.

The ordinary discovery cue should remain small. A styled phrase, line treatment, ink/seal accent, or comparable text-native effect is appropriate. Do not spend fracture, panel-shatter, whole-screen, time-stop, rewind, erasure, or fourth-wall signatures on ordinary skill XP.

Preserve the larger VFX horizon as an open design vocabulary, not a required tier taxonomy. Future consumers may include transformations, spatial/temporal/conceptual powers, adaptation, erasure, revelation, fracture, material signatures, absence/silence, panel damage and rare fourth-wall events. Those effects require actual world, character, knowledge, means and settled-event authority before native use.

Do not invent a god/domain/time ability, fake gameplay consequence, fake save deletion, host-file access, or other false authority to justify an effect.

Observation and truth remain distinct. A bluff, rumor, ambiguous witness account or incomplete observation must not become authoritative proof through VFX.

Sealed secrets must remain sealed through all visual and textual channels.

Effects-off must leave every fact and control usable. Reduced motion must provide a readable static equivalent. Sound remains opt-in after user gesture. Effects must not capture required input, hide required terms, steal focus, reset layout, or create an unbounded overlay.

Persistence, replay and batching

Derive discovery from the current authoritative gameplay state. Do not add a gameplay-save field solely to remember that a decorative animation played if existing state can establish the baseline.

On load, reload, import or restoration, seed presentation so already-known discoveries appear correctly without replaying their first-discovery flourish. A restore path must not manufacture a fresh discovery event.

Define the minimum session-local deduplication/coalescing needed by the chosen effect. Verify that redraws, settings changes, hover, hidden-tab transitions, repeated ordinary XP and unrelated actions cannot retrigger it.

If rapid craft/XP batches can reach the consumer, define bounded behavior such as coalescing, sequencing or dropping redundant decorative cues. Presentation backpressure must never delay or alter gameplay settlement.

Hidden-tab and cancellation cleanup must leave no stale overlay, timers, focus traps or pending gameplay mutation.

Layout and information disclosure

Audit the selected consumer's complete exposure surface before declaring the discovery gate complete. A panel-only gate is insufficient if picker names, counts or search still disclose the unknown system.

Preserve saved layouts and user hidden/collapsed choices when a system becomes eligible. Discovery may make a module available, but it must not forcibly rearrange the workspace or take focus unless an existing explicit product contract requires that behavior.

Use Proto23's density lessons only where they improve the selected native view. This round may make narrow spacing/list-detail adjustments needed to keep the new disclosure useful at supported desktop sizes. Do not begin a general layout redesign.

Respect the existing palette precedence and Vivid/customization contracts unless the chosen consumer exposes a reproduced defect.

Documentation deliverables

Update the existing owners by reference rather than duplicating specifications.

Leave:

one reconciled executable implementation prompt and short reconciliation notes if the project process requires them;

the bounded ownership/checkpoint record required by the live GM/process documentation;

a concise implementation report containing changed behavior, files/owners touched, reproduced issue if any, and explicit non-goals;

a remaining acceptance/backlog entry for Proto23 reveal mappings and stronger VFX consumers that were not implemented.

Document which reference reveal patterns map conceptually to YAIRPG discovery families and which larger VFX families remain future work. Do not describe future mappings as implemented behavior.

Required evidence and acceptance

Before claiming implementation complete, rebuild using the repository's authoritative build path. Browser acceptance must use the rebuilt output from a disposable fresh origin, not a stale dev tab or old bundle. Record enough served source/bundle fingerprints to show what was actually exercised.

Use legitimate native gameplay state and input. Do not patch runtime objects, edit the save to synthesize the transition, call presentation functions directly as proof, or lower thresholds solely for acceptance.

For the selected discovery event, capture evidence of all applicable stages:

before discovery, the unknown system/name is absent from its native content view and every relevant picker/search/count surface;

the legitimate input and precondition that cause the authoritative transition are visible or otherwise recorded;

immediately after settlement, the correct native row/view becomes available;

costs, result and any blocked/available reason remain truthful;

exactly one restrained discovery cue is visible in full-effects mode;

focus, scroll position and workspace geometry remain usable;

repeating the ordinary action does not replay the first cue or alter discovery semantics.

Exercise at least 1366x768, 1440x900, and 1920x1080, plus larger text or 150% browser zoom as the project's accepted proxy if that remains the live accessibility procedure. Use a populated state rather than empty panels when judging density.

Exercise:

effects off;

reduced effects;

full effects;

OS/browser reduced-motion behavior where the app observes it;

optional sound unavailable or disabled.

Gameplay and controls must remain usable in every mode.

Exercise redraw, resize, layout switching, hide/collapse where relevant, repeated XP/action, hidden-tab interruption and effect cancellation. None may grant rewards, mutate authoritative progress, expose unknown content, reset layout or replay a settled first-discovery cue incorrectly.

Then save/export the disposable learned state, reload it, and perform the project's literal-file import path. Verify that authoritative XP/unlocks and any affected items/currency remain correct, workspace layout remains correct according to its separate persistence owner, the learned content remains visible, and the first-discovery cue does not replay merely because the state was restored/imported.

If the implementation touches save interpretation or compatibility paths, exercise one supported older-save fixture/baseline. Do not add this requirement if no save compatibility code changed and the existing owner explicitly makes it irrelevant.

Run focused automated tests that prove the contracts rather than mirror implementation details. Cover, where applicable:

unknown versus known exposure across rows/search/counts/picker;

authoritative event gating;

no reward/state mutation from presentation;

first-event deduplication and restored-state baseline behavior;

effects off/reduced/full contracts;

cancellation/hidden-tab cleanup;

any changed customization or layout contract.

Run the repository-required affected checks and build. Do not substitute a broad green suite for missing native browser evidence.

Save screenshots or equivalent evidence for the decisive before/after discovery states and the effects modes where visual behavior matters. Record exact build/served fingerprints and the native play route used.

Report completion in separate categories:

source/tests verified;

rebuilt native browser behavior verified;

persistence/import behavior verified;

human taste or visual judgment still requiring human acceptance.

Do not convert an OPEN visual/taste or unavailable native proof into completion. Finish with the exact legitimate play route and name at most one remaining authoritative acceptance gate if one truly remains.

Material changes:

Made the dependency chain explicit. Gameplay discovery is authoritative, disclosure projects it, and VFX only consumes the settled result. This prevents an animation or UI state from becoming gameplay authority.
Narrowed the first slice further. One real discovery transition is required before any second consumer or wider Proto23 conversion. A substitute event is allowed only if live inspection shows skill discovery is unsafe or poorly owned.
Strengthened leak testing. Acceptance now covers rows, categories, picker names, search and counts, rather than treating a hidden panel as sufficient.
Separated persistence domains. Gameplay discovery must come from authoritative progress, while browser-local workspace state keeps its own owner. Decorative replay state should not become a new save schema without necessity.
Made VFX restraint operational. Ordinary discovery gets a small cue. High-impact fracture, time, erasure and fourth-wall effects remain documented future consumers that require real gameplay authority.
Tightened evidence quality. Native threshold crossing, rebuilt fresh-origin execution, literal-file import, pre/post screenshots, served fingerprints, replay checks and separate technical versus human-taste status prevent source tests or previews from standing in for gameplay proof.
Removed unconditional compatibility work. Older-save testing is required only when the change actually touches save interpretation or compatibility, avoiding a costly gate with no dependency on the slice.
