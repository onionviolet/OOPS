# Architecture rules

Standing rules for every agent that adds or changes runtime code. Weibao,
2026-10-16, after the [modularity assessment](reviews/MODULARITY_AND_REWRITE_ASSESSMENT_2026-10-16.md):
"make a codex run to fix accordingly and create rules accordingly". The accepted
direction is the assessment's O2: no whole-game rewrite; restructure around
replaceable domain boundaries one connected slice at a time. Each rule names the
mistake it prevents. A feature can propose an exception, but it has to say why.

Snapshot behind these rules (2026-10-16): `src/main.js` is 10,337 lines with
332 import lines and appeared in about 70 of this month's `src` commits; the
next file had 27. `display.js` imports helpers from `main.js`, so the two import
each other. `save_files.js` imports a validator from about 48 feature modules.

These rules sit beside [UI rules](UI_RULES.md) and [making rules](MAKING_RULES.md);
neither is replaced.

## The target shape

One application, a thin composition root and domain modules that own their
state. No microservices, plugin runtime, ECS conversion, TypeScript migration,
UI framework migration or universal rule language. Any of those needs its own
demonstrated gap and cost comparison.

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| AR1 | **`main.js` is a composition root, not an owner.** A new feature adds at most one registration line to each of `main.js`, `save_files.js` and `display.js`. Its state, ticks, commands, save slice and panels live in its own module | `main.js` grew to 10k lines because every feature hand-wired its state, save, tick and UI into it |
| AR2 | **Register through the domain registry.** A domain declares only the parts it has: `id`, dependencies, initial state, save slice, validate, migrate, load, tick, commands, projection and panels. A static content table needs none of this | Each feature inventing its own join, so the second feature cannot reuse the first one's wiring |
| AR3 | **One authority per fact.** No second timer, save writer, transaction owner or mutation event bus. Ticks run from the existing game clock; costs and once-only outcomes go through the existing transaction paths. Events may observe; they never mutate | Modules that look decoupled because they quietly run their own clock or write their own save |
| AR4 | **Inject the few operations a module needs.** Pass `{spendItem, logMessage}`, not an omnibus `GameContext` with access to everything | A context object that recreates `main.js` coupling under a new name |
| AR5 | **No import cycles, and nothing imports `main.js` except the entry.** Shared helpers live in leaf modules. The architecture check fails on any new cycle or new import of `main.js`; existing ones sit on a shrinking baseline | `display` ↔ `main` cycle, which makes bundling order and extraction fragile |

## Saves and behavior

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| AR6 | **Namespaced save slices inside the existing envelope.** Each domain owns one key. A missing key means an older save: load it untouched with defaults. Changes need a migration or an explicit compatibility decision (AGENTS.md Safety). Keep the existing validation order and cross-owner checks when moving validators | Extraction silently breaking old saves or reordering validation that another owner depended on |
| AR7 | **Commands quote, then revalidate before mutating.** A command exposes eligibility and cost for the UI, then rechecks at execution | UI showing a cost the action no longer charges, or double-spends after a stale click |
| AR8 | **Projections are observer-safe read models.** UI, AI and inspection read the projection, which never grants authority or reveals sealed truth | A second truth store, or UI leaking a sealed secret |
| AR9 | **Keep structural moves separate from behavior changes.** A refactor round changes no gameplay. Prove it with the same scenario before and after on a rebuilt bundle, including save, reload, Export and literal Import | A "cleanup" that quietly changed timing, costs or disclosure |

## Proving a boundary

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| AR10 | **A module is integrated only when a player journey crosses it.** State, command, UI and save/reload must all be exercised in a rebuilt browser. A pure module plus unit tests is "engine ready", not integrated | The crafting engine and other isolated modules reported as progress with no consumer |
| AR11 | **A second, different case proves the seam.** Keep or extend a boundary if the second case needs less core work; revise or delete it if it only hid coupling | Abstractions designed around one feature that every later feature works around |
| AR12 | **World variety stays in the domain.** The shared layer covers identity, custody, transactions, knowledge and save. Product and world rules stay local (MR envelope versus product logic) | A universal system that flattens potions, runes and cultivation into one rule shape |
| AR13 | **Judge by change surface, not by counts.** The measure is how many core-owner files a feature touched, duplicated eligibility or state, and task-specific adapters. File, test and document counts do not count | Agents producing many tidy modules and a growing tangle of bespoke joins |

## For coordinators and lane briefs

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| AR14 | **Every runtime lane brief names the seam it lands through** and links this file. A lane that needs a seam that does not exist extends the registry; it does not add an ad hoc join | Parallel lanes each wiring their own feature into `main.js` |
| AR15 | **Extraction rounds reserve their files.** A round that moves code out of `main.js`, `save_files.js` or `display.js` records a writer reservation in its checkpoint. Other lanes in those files wait or work on a branch and merge after | Refactor and feature lanes overwriting each other in the hottest files |
| AR16 | **Run the architecture check before calling runtime work done.** Once `scripts/check_architecture.mjs` exists, it is part of the gate with build, `npm test` and the browser check | Rules that decay because nothing enforces them |

## Status

Rules AR1–AR16 are standing direction from 2026-10-16. The registry, the
architecture check and the first migrated domains are being built in the
[modular seams dispatch](gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md);
until that lands, AR2, AR5 and AR16 are targets and existing code is
grandfathered on a baseline. New work should not add to the baseline.
