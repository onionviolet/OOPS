# V1: Proto23 shell over YAIR systems

2026-10-15. Explicitly authorized by Weibao:

> Proto23 still looks better. Can we build a variant using its UI shell with YAIR’s systems underneath, keeping saves and gameplay intact? Include the fuller panels and send that direction to the UI worker accordingly? Especially inventory and the focus menu and maybe stats, but we can extend and absorb best of both worlds?

## Outcome

Build a separately selectable **Proto23 Shell** presentation variant using the
fuller original interface as the concrete visual reference. This supersedes the
idea that C1's grouping and square skin alone satisfy his visual preference.
Preserve C1 as a working comparison and preserve existing saved layouts. This
is an authorized playable variant, not another research-only report.

The source game is allowed as a local experimental base/reference. If using a
source-derived shell locally is useful, keep any unresolved-provenance code in
the ignored private prototype; do not silently place it under YAIR's MIT license
or publish it. An independently written shell using the source's geometry and
visual language is also valid. The observable requirement is visual fidelity
and native YAIR behavior, not a particular volume of copied code. Never load
Proto23's game state, timers or save system into YAIR to get the look.

## Inputs and authority

Read PROJECT standing priorities, USER_VISION's latest shell instruction,
UI_RULES, the foundation design owner's V1 section, C1_REPORT.md and the completed
NAV_REPORT.md before writing. Retain NAV correctness fixes and shared APIs.
Review the actual source lab's fuller views, not just the opening screenshot:

- `http://127.0.0.1:19118/?preset=crafting`, Skills, Actions, General Store,
  Journal/statistics and source item details; lab presets are DEV SEEDED.
- Pinned source and manifest in
  `docs/research/panel-design-2026-10-15/private/proto23-lab/` and sibling
  `proto23.html`; unchanged original on `http://127.0.0.1:19117/proto23.html`.
- `docs/research/PANEL_DESIGN_ABSORPTION_2026-10-15.md`, deeper native exploration:
  source item clicks may start reading; recipe clicks may craft. Preserve YAIR's
  own explicit commands and stop/cancel semantics while adapting the layout.

## Ownership and sequencing

Current NAV CLI PID33400 / chat `01a13e05-6d87-7d40-83e1-5f160fa0c428`
is the sole runtime writer until its final report and process release. Root
stopped only the queue coordinator, so TRIAGE/APOTHECARY cannot start alongside
this variant. The existing foundation UI chat
`01a13dba-1433-7232-bd63-674e459f141a` receives this packet first for read-only
acknowledgment. **No runtime writes, build or browser mutation by that receiver
until root transfers ownership after actual NAV release.** Acknowledge with
`SHELL_VARIANT_ACK.md` and flag any concrete blocker. Do not launch another chat,
successor or source writer. Pending source transfer is not completion.

## Presentation scope

| Code | Surface | Visible target and behavior |
| --- | --- | --- |
| SV1 | Shell | Source-like cohesive rectangular regions, restrained frame controls, aligned thin rows, centered/compact headings and matching gradient/border/type hierarchy. Match actual source relationships and proportions; avoid another stack of independent cards. Adapt fluidly to the laptop screen at comfortable text size |
| SV2 | Inventory and player | Fuller inventory below an integrated player area, source-like category tabs and aligned name/quantity/status/value columns. Nearby selected-item details with actual native equip/use/read/compare controls and disabled reasons. Retain quantities, instances, equipped state, filters/sort, selection, hotkeys and any supported ownership/custody constraints |
| SV3 | Focus menu | Upper contextual region supports known person, enemy or selected item/service. Give it a coherent detail/action menu using existing native commands, actual known stats and current context. Preserve the opponent view during combat and useful focus while browsing. Never reveal unmet traits, secret names or unsupported stats through tabs/counts/tooltips |
| SV4 | Stats and equipment | Compact real character/derived stats and equipment information next to the player summary, with an obvious larger native detail route. Reuse current stat pipelines/tooltips, equipment slots and commands. No invented body-part slots, numerical effects or parallel stat model just to match Proto23 |
| SV5 | Best of both | Carry the same shell into existing crafting/list-detail, skills/known records and log surfaces. Keep YAIR's clearer destination Back/Esc, current work, shared navigation/history, readable targets, filters and stable lists. Support settings/accessibility and large text. No new gameplay systems or whole-feature parity requirement |

Use existing registry/components/center-mode owners and actual command/state
owners. Borrow native nodes where practical; any view adapter reads authoritative
state and invokes the existing command path. No second simulation loop, inventory
ledger, progression state, save format or duplicate mutation dispatcher.

## Compatibility and gates

Target populated **1366×768**, with 1440×900 and 1920×1080 as affected desktop
checks. Explicitly switching the variant is reversible. Existing player layouts,
pins, collapse states, Appearance preferences and game saves remain exact unless
a separate written compatibility decision is justified. A new presentation
preference must not migrate or reinterpret gameplay state. No personal saves.
Mobile and new world/service content remain deferred. No commits or pushes.

Deliver one working slice: open variant → inspect an item → perform a supported
native item action → inspect known person/enemy → inspect real stats/equipment →
enter crafting/mixing → return to the previous item/tab/scroll → switch back to
the existing layout. Verify no incidental work cancellation or remote service
access. Check live native combat and its log, expanded/compact parity, mouse and
keyboard, reduced motion and actual 125%/150% text. Exercise Save/reload and
Export/literal-file Import on a synthetic populated fixture, plus an old-layout
fixture; no game-schema change is expected.

Rebuild before browser claims. Run focused tests and required affected checks;
retain valid C1/NAV evidence rather than rerunning equivalent suites without a
change or failure. Record actual source/served byte provenance. Save rebuilt
opening, populated inventory + item detail, person/enemy focus, stats/equipment,
crafting and combat captures. Show original Proto23 and the variant at the same
viewport, including fuller source panels. Preserve C1's frozen build/comparison.

Write `SHELL_VARIANT_REPORT.md` with changed paths, compatibility, exact checks,
screenshots, remaining limits and explicit ownership release. Source edit,
rebuilt/browser proof and Weibao's visual acceptance remain distinct. A usable
variant may be delivered without claiming its look accepted or changing the
existing default without direction.
