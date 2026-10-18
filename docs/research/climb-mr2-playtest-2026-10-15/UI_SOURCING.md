# UI sourcing and connected considerations, 2026-10-15

**Requested comparison now built:** [playable recipe experiment and base UI
integration notes](../../../prototypes/recipe-ui-2026-10-15/INTEGRATION.md).
It compares the existing detail renderer with compact/full disclosure using
real recipe definitions and labelled synthetic state. Native adoption and human
visual choice remain separate gates; the main UI source is unchanged by this lane.

Requested follow-up to [the adaptation shortlist](ADAPTATION_SHORTLIST.md).
Recommendations and source availability, not accepted UI changes or a dispatch.

## Outcome and authority

Keep Proto23's accepted composition and shared tokens/components. Source useful
interaction details from other games within that composition. Relevant authority:
PROJECT.md standing priorities, docs/UI_RULES.md UR1–UR48, the UI foundation
round and the R3 report. R3 records technical delivery with visual acceptance
open; this research does not rerun or extend that proof. Current source already
contains inventory hover/focus previews and expanded item routes in
`src/proto23_shell.js`. Their presence is not proof of every interaction state.

For any later UI trial: populated synthetic save, 1366×768 laptop first, plus
actual 125/150% text. Visible outcome: inspect a known item or recipe, understand
requirements and consequence, follow a related reference, and return to the same
selection with work/log readable. Mobile and a new visual baseline are deferred.

## Sourcing inventory

| ID | Source | What can be sourced | Evidence and route | Recommendation / cost |
| --- | --- | --- | --- | --- |
| U1 | Proto23 | Region proportions, row rhythm, contextual target/player relationship, adjacent recipe detail and knowledge-driven reveals | Existing pinned original HTML, screenshots and source traces in `../proto23/`; prior panel study and R3 have composition measurements | Keep as incumbent. Adapt detail placement through existing shell; avoid another layout system |
| U2 | The Climb | Stable player/target/inventory/action/log regions; local context during gathering; equipment categories | Saved `private/climb-equipped.jpg` inspected this pass; prior ordinary play and pinned bundle in REPORT.md/acquisition.json | Adapt contextual continuity. Icon-only items and abbreviated stats have a discoverability cost. No evidence here of a working side-by-side comparison UI |
| U3 | MR2 | Live cost/current/capacity distinction; visible researcher allocations and availability; expanded action details and optional secondary commands | Saved study screenshot plus recovered `ActionContainer.tsx`, `CostViewer.tsx` and `Home.tsx` read this pass. Bodies indexed/hashed in `private/source-index.json` | Adapt legibility within YAIR tokens. Low/medium for one consumer. Exact missing/capacity reasons require native data; color alone is insufficient |
| U4 | Factorio | Ingredients and reverse uses, merged related entries, reference history | [FFF397](https://factorio.com/blog/post/fff-397), developer design article read this pass | Strongest adjacent reference. Medium/high binding and knowledge-filtering work. Follow known ingredient → known use → appropriate service without granting remote access |
| U5 | Factorio | Consistent search, personal reminders and subject-specific alerts | [FFF400](https://factorio.com/blog/post/fff-400), developer design article read this pass | Adapt one reminder tied to a chosen pursuit. Distinguish reminder/bookmark, fixed inspector and layout pin. Reuse existing navigation/history rather than duplicate it |
| U6 | Kittens / ITRTG | Dense production tables and stable subsystem context | Existing [panel comparison](../PANEL_DESIGN_ABSORPTION_2026-10-15.md): Kittens source-read, ITRTG official screenshots only. Not newly exercised | Later reference for an actual multi-job management gap. Table sorting must not move rows under the pointer during ticks |
| U7 | A Dark Room / Your Chronicle | Story-driven interface reveal and task-to-capability connections | A Dark Room source was read in existing panel study. Your Chronicle remains a candidate here; no new UI inspection | Later, when a selected discovery route needs presentation. Reveal a useful control with an explanation; keep essentials reachable |
| U8 | RimWorld / Qud / grand strategy | Derived-number explanations, relationship and obligation views | Candidates from prior panel study, not verified UI mechanisms in this pass | Park until a named person/status/relationship view needs deeper comparison |

## Available material and how to use it

The Climb has captured deployed HTML/JS and ordinary-play screenshots; its
[published repository](https://github.com/tomlipo/the-climb) is build-oriented,
not evidence of a conventional editable source tree. MR2's public demo source
map supplied readable TSX component bodies; that does not establish retail parity
or permission to redistribute its code/assets. Existing manifests retain URLs,
hashes and source paths. Keep source bodies/private assets in the ignored research
cache and write original YAIR adapters. Review actual licenses if code/assets
are selected for reuse. Public browser access alone supplies no reuse license.

Factorio supplies first-party interaction rationale and illustrations, sufficient
to source a pattern without acquiring its executable. Proto23 already has a
pinned local study. Prefer these routes before new extraction or installations.
No new game acquisition was needed for the present questions.

For a selected interaction, capture its real path and varied states: inventory
selection, unavailable action, shop, active work, combat and reference return as
applicable. Label source-rendered fixtures separately from ordinary progression.
Saved opening screenshots are not enough to claim complete parity.

## More to consider

| ID | Consequence | Disposition |
| --- | --- | --- |
| M1 | Inspection, pinned inspection, reference navigation and execution have different consequences. A purchase/craft must not occur from merely selecting or hovering. Hover must have focus/click equivalents. | ACCOUNT FOR NOW; UR41–UR43. Hover-to-pin default remains unselected |
| M2 | A quantity shortage and a capacity shortage imply different next steps. “Need 20 mana” is misleading if maximum is 10. Upgrade previews should expose changed consumption as well as output. | ACCOUNT FOR NOW; extend authoritative cost/eligibility projections |
| M3 | References can reveal unknown recipes, identities, hidden effects or future rewards through names, counts and search. Old log events can accidentally show current knowledge. | ACCOUNT FOR NOW; observer-qualified links and explicit historical/current distinction, UR47–UR48 |
| M4 | A simulation tick can destroy reading through resorting, moving buttons, rebuilding previews or scrolling the log. A remembered intent can become stale after world/means changes. | ACCOUNT FOR NOW; stable identity/selection, explicit unread behavior and revalidated reminders |
| M5 | Expanding detail can crowd the log or conceal current work; tiny icon grids save space but make quantity/name scanning harder. | ACCOUNT FOR NOW; compare compact and expanded routes at actual larger text, use named rows unless an icon demonstrably helps |
| M6 | Narrative rewards, new actions and changed equipment effects need coherent feedback without another permanent dashboard. | LATER; one quiet discovery entry linked to the real consumer, using existing notification/log owners |
| M7 | Reference-based polish can proliferate systems: another tooltip model, catalog, search index, controller or saved layout. | ACCOUNT FOR NOW; extend panel kit, shared controller and existing public projections only where a concrete consumer needs them |

## Smallest useful next comparison

Recommendation, not dispatched: one existing recipe/item route comparing compact
preview and explicit full detail. Show result, actual cost, one real blocker and
one known related use. Follow the reference and return without losing selection,
scroll, current work or the log. Reuse existing commands. This combines U1/U3/U4
and directly exposes M1–M5 without selecting a full redesign or new game system.

Research checks: current owners, selected source and two saved reference images
inspected; Factorio developer articles and The Climb listing refreshed. No fresh
gameplay, rebuilt UI acceptance, save manipulation, runtime edit, commit or push.
