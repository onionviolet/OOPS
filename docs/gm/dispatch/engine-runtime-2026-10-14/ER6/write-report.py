import json,pathlib
lane=pathlib.Path(__file__).parent
rows=json.loads((lane/'package-data.json').read_text());bund=json.loads((lane/'bundle-data.json').read_text());sizes={r['name']:r for r in bund['results']};selected=json.loads((lane/'selected-data.json').read_text())
meta={
'bitecs':('ER6-L1','LB1, PF6, RT7','ESM export; CJS too','Recent push; no newer stable npm release observed'),
'miniplex':('ER6-L2','LB1, RT7','Bundler ESM via module; CJS main','Old stable release; recent repository push'),
'koota':('ER6-L3','LB1, RT4','ESM/CJS; React subpath optional','Recent release and push; young API'),
'@sqlite.org/sqlite-wasm':('ER6-L4','LB2, DA1, DA2, DA6','Official ESM wrapper plus separate WASM','Recent release and push'),
'immer':('ER6-L5','LB3, PF6, RT2','ESM/CJS','Recent release and push'),
'@preact/signals-core':('ER6-L6','LB4, RT3, RT4, OS6','Framework-free ESM/CJS','Recent release and push'),
'zod':('ER6-L7','LB5, DA4, DA5, OS4','ESM/CJS; zod/mini available','Recent release and push'),
'valibot':('ER6-L8','LB5, DA4, DA5, OS4','Modular ESM/CJS','Recent release and push'),
'@sinclair/typebox':('ER6-L9','LB5, DA4, DA5','ESM/CJS subpaths','Older 0.x line; distinct from new package'),
'typebox':('ER6-L10','LB5, DA4, DA5','ESM subpaths','Active 1.x line; recent release and push'),
'yuka':('ER6-L11','LB6, AI1, AI2','ESM via module; UMD main','Old npm release; recent repository push'),
'rot-js':('ER6-L12','LB7, LB8','ESM via module; UMD main','No push since 2024 observed'),
'ngraph.path':('ER6-L13','LB7, RT6','ESM/CJS','2025 release; recent repository push'),
'pure-rand':('ER6-L14','LB8, RT9, OS7','ESM/CJS subpaths; no root export in v8','Recent release and push'),
'simplex-noise':('ER6-L15','LB8, DA5','ESM/CJS','No push since 2024 observed'),
 'tracery':('ER6-L16','LB8 name correction','CJS only; esbuild interop','Wrong capability; old release and push'),
 'tracery-grammar':('ER6-L17','LB8, EG7, AI3','CJS only; esbuild interop','2024 release/push; slow cadence'),
 'howler':('ER6-L18','LB9, OS6','UMD/CJS; no native ESM entry','Old npm release; 2025 repository push'),
 'pixi.js':('ER6-L19','EG1, LB9 adjacent, PF5','ESM/CJS','Recent release and push'),
 'break_infinity.js':('ER6-L20','PF8, TS9 adjacent','ESM via module; CJS main','Old npm release; 2025 repository push'),
 'decimal.js':('ER6-L21','PF8, TS9 adjacent','ESM/CJS','2025 release; recent repository push'),
 '@playwright/test':('ER6-L22','LB10, TS3, CH4, PF1','Node ESM/CJS; not browser runtime','Recent release and push'),
 'vitest':('ER6-L23','LB10, TS3','Node ESM; not browser runtime','Recent release and push'),
 'mitt':('ER6-L24','ER6-N1, RT3, LB11','ESM via module; CJS/UMD too','Old release/push; very small stable API'),
 'idb':('ER6-L25','ER6-N2, DA1, DA2','ESM/CJS','Recent release and push'),
 'fflate':('ER6-L26','ER6-N3, DA1, DA7','Browser ESM/CJS','Recent release/push')}
head='''# Libraries to incorporate, 2026-10-14

## CHECKPOINT

ER6 COMPLETE: LB1-LB11 and the named candidates are covered; 26 package identities checked against npm/GitHub on 2026-10-14. Runtime size probes ran only in a temporary directory; evidence/scripts live in the ER6 lane. This is a proposal report, not a dependency selection or implementation order. Resume for a named missing fact or changed requirement. No repo dependency, source, test, build, save, private pack, commit or push changed.

## Recommendation

Trial small boundary helpers first. Keep the incumbent plain ESM, esbuild, node:test, JSON envelope, common scheduler and DOM panels. ECS, SQL, game AI, audio and canvas tools each need a selected workload or visible feature; none supplies this game's ownership, clock or save semantics.

This extends [the root LB/RT/PF/DA/TS/CH/OS palette](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md), [E1-E10](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md) and [offline F1-F9 and later additions](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md). It retains accepted desktop/laptop priority in `docs/USER_VISION.md:3-23` and PROJECT.md's standing summary. It introduces no mobile work or new offline policy. [ER3](TECH_STACK_OPTIONS_2026-10-14.md) owns broad worker/storage/platform choices, browser-runner setup and PF8 numeric semantics; this lane adds pinned package facts and narrower adapters.

READ = inspected checkout file:line. STATED = registry/API/author docs, checked 2026-10-14. MEASURED = the commands below ran. INFERRED = fit, cost, maintenance judgment and proposed gates. Repo lines are a point-in-time reading of a dirty concurrent checkout, not a frozen runtime build. Existing staged/dirty work was preserved; no file named SECRETS was opened and no personal save was used.

## Top five by value per effort (INFERRED)

| Rank / code | Candidate / disposition | Value, cost and first gate | Palette informed |
| --- | --- | --- | --- |
| 1 / ER6-P1 | Valibot, trial one content boundary | Consistent shape errors with small selected imports. Low schema/error-mapping effort. Validate one public pack header alongside today's validator; valid/invalid fixtures must agree before replacing anything. | LB5, DA4, DA5, OS4 |
| 2 / ER6-P2 | signals-core, trial one published read model | Replace redundant refresh work without a UI rewrite. Moderate invalidation/lifecycle work. One work-ledger projection updates after successful publication and disposes on close; compare renders/focus at 1366×768 and 1600×1100. | LB4, RT3, RT4, PF5, OS6 |
| 3 / ER6-P3 | Playwright, add one acceptance route | Repeat rebuilt browser/save evidence that source tests cannot supply. Moderate frozen-build/selector/browser-binary upkeep. Follow ER3-T4 for one public paid action and literal-file roundtrip. | LB10, TS3, CH4, PF1 |
| 4 / ER6-P4 | mitt, optional simpler alternative to P2 | Tiny post-publication domain event bus when explicit subscriptions are enough. Low event/disposal contract effort. One panel subscribes/unsubscribes and renders once per relevant commit. Native EventTarget or a callback Set is also viable at zero dependency cost. | ER6-N1, RT3, LB11 |
| 5 / ER6-P5 | miniplex, conditional query-index trial | Object-shaped entity queries fit existing people records better than a representation rewrite. Moderate identity/index upkeep. A disposable synthetic people index returns the same stable-ID set/order as current loops; promote only if measured query benefit pays for it. | LB1, PF6, RT7 |

P2 and P4 are alternatives for the first panel, not two dependencies to add together. P5 is fifth among candidates, not a claim that ECS is needed now. No runtime speed, battery savings, leak freedom or native acceptance was measured.

## Current npm/GitHub facts and measured browser sizes

Every row was checked **2026-10-14 UTC**. Version is npm `dist-tags.latest`; release is npm's timestamp for that version, not GitHub's latest tag or a repository push. Links on names point to npm registry evidence; repo/API links establish identity, push date and archive state. The captured [package data](../gm/dispatch/engine-runtime-2026-10-14/ER6/package-data.json) retains exact UTC timestamps, manifest exports, gitHead where available and URLs. All 26 observed repositories were unarchived; that does not prove responsiveness or release quality. Push dates are screening signals, including possible docs/bot changes, not evidence of unreleased fixes in the npm version.

**MEASURED recipe:** esbuild 0.25.10, browser platform, ES2022 target, ESM format, minify, retain the full root export namespace via `globalThis.__ER6`, gzip level 9. Bytes below are `minified / gzip`, including bundled transitive JS selected by that entry. They are neither npm unpacked sizes nor actual incremental game bundle cost. Full namespaces deliberately prevent tree shaking away unused features; selected probes follow the table. WASM, workers, images, audio, fonts, browser binaries and dev tools are not hidden inside a JS-only total.

```sh
python3 docs/gm/dispatch/engine-runtime-2026-10-14/ER6/collect.py
node docs/gm/dispatch/engine-runtime-2026-10-14/ER6/measure.mjs
node docs/gm/dispatch/engine-runtime-2026-10-14/ER6/measure-selected.mjs
```

The measurement script runs pinned `npm install --ignore-scripts --no-audit --no-fund --package-lock=true` in a new OS temp directory, never in the repo. It installed 42 scratch packages. The preserved scratch lock includes resolved tarball integrity. These probes compile imports; they do not execute library gameplay or compare throughput.

| Code / palette | Package and npm latest release date | License (npm) | Minified / gzip bytes (MEASURED) | ESM support (STATED manifest) | GitHub push date (STATED) / maintenance (INFERRED) |
| --- | --- | --- | --- | --- | --- |
'''
parts=[head]
for r in rows:
 n=r['name'];code,palette,esm,maint=meta[n];s=sizes.get(n,{})
 if n=='pure-rand':s=next(x for x in selected if x['name']=='pure-rand-all')
 size=f"{s['minified']:,} / {s['gzip']:,}" if 'minified' in s else 'N/A: Node tooling, no shipped browser entry'
 if n=='pure-rand':size+=' (all exported runtime subpaths)'
 if n=='@sqlite.org/sqlite-wasm':size+=' JS; WASM 868,907 / 403,404 additional'
 g=r.get('github',{});repo=g.get('html_url',r.get('homepage'));push=(g.get('pushed_at') or 'unknown')[:10]
 parts.append(f"| {code} / {palette} | [{n}]({r['registry_url']}) **{r['version']}**, {r['release'][:10]} | {r['license']} | {size} | {esm} | [{push}]({r['github_api']}); [repo]({repo}). {maint}. |\n")
parts.append('''
**ER6-F1: Import/name corrections.** `tracery@1.0.3` resolves to an object predicate builder, not story grammars ([its README](https://github.com/junosuarez/tracery)). Use the distinct `tracery-grammar` identity for that experiment. `@sinclair/typebox` 0.34 and `typebox` 1.x are different package/API lines; do not silently substitute them. Koota's React peers are optional and its plain core entry bundled without React; using `koota/react` adds another route. pure-rand 8 has no root export. The first root probe failed; the corrected subpath probe succeeded and the failure remains in bundle-data.json. For ngraph.path, the JS size excludes the separate graph implementation, usually ngraph.graph, or our own compatible graph adapter. ESM via a `module` field means esbuild can select it; it does not guarantee Node bare-import ESM behavior.

**ER6-F2: Selected-import sizes.** Same esbuild/gzip recipe; the exact fixtures are in measure-selected.mjs. This two-field schema is a size probe, not equivalent production save validation or a general ranking of every feature. Full Zod's root exposes a much broader graph than Zod Mini. TypeBox's root schema-builder size alone excludes actual runtime checking; the Value.Check probes below include it. No code generation/compiler subpath is used here.

| Probe | Minified / gzip bytes, MEASURED |
| --- | --- |
''')
for r in selected:parts.append(f"| {r['name']} | {r.get('minified',0):,} / {r.get('gzip',0):,} |\n")
parts.append('''
**ER6-F3: Size boundaries.** SQLite wrapper plus one WASM file totals 1,084,407 uncompressed/minified bytes and 469,661 separately gzipped bytes in this probe. Additional VFS/worker deployment assets may still be required. The WASM number is gzip of binary bytes, not “minified WASM.” Playwright/Vitest are Node development tools: minified browser-runtime size is not applicable, not zero installed size. Playwright browsers and Vitest's tool graph need a separate disk/CI budget; neither was installed or run here. For every runtime candidate, the root import compiled successfully except the retained initial pure-rand root mistake; successful bundling is not browser execution.

## License fit with this repository

READ `LICENSE:1-9`: MIT, upstream copyright Miktaew retained. STATED license identities appear per package above; compatibility conclusions below are INFERRED from the linked terms, checked 2026-10-14.

| Code | License fit and distribution boundary |
| --- | --- |
| ER6-C1 | MIT and ISC packages can be combined with this MIT application while keeping their copyright/license notices. BSD-3-Clause rot.js also needs its notices/disclaimer and no implied endorsement. Do not label the complete dependency bundle as exclusively our MIT code. |
| ER6-C2 | bitECS 0.4.0 is **MPL-2.0**, not MIT. It can be used alongside MIT files. Distributed minified JS must point recipients to the corresponding MPL source; modifications to covered source files retain MPL. Keep an external library/adapter boundary and exact source version/notice route. [Mozilla FAQ Q8, Q11, Q16](https://www.mozilla.org/en-US/MPL/2.0/FAQ/), [MPL text](https://www.mozilla.org/en-US/MPL/2.0/). This is extra notice/source work, not a blanket incompatibility. |
| ER6-C3 | Official `@sqlite.org/sqlite-wasm` npm wrapper and Playwright are **Apache-2.0**. They can be incorporated while the application remains MIT, retaining their license, applicable NOTICE and attribution; mark modifications where required. [Apache terms section 4](https://www.apache.org/licenses/LICENSE-2.0). SQLite **core** is [public domain](https://www.sqlite.org/copyright.html), which does not erase the wrapper license. |
| ER6-C4 | READ `build.js:9-16` emits explicit Ink notices; no generic dependency notice pipeline was seen there. Adoption must collect the pinned distribution's license and transitive notices rather than assume minification keeps them. No complete transitive legal audit was performed. Audio/artwork/content asset licenses are separate from Howler/Pixi/grammar code licenses. |

## Per-candidate adapter and save decision (INFERRED unless marked READ)

Costs appear once per row. “No format change” assumes the stated derived/transient boundary is honored. All first steps and gates here are specified, not run; installed packages in scratch prove no adapter, save compatibility or gameplay.

| Code / candidate | Existing file/system (READ file:line) and adapter boundary | Save impact / cost | Smallest first step; reason not to adopt |
| --- | --- | --- | --- |
| ER6-L1 bitECS | `src/simulation_contracts.js:217-249` owns people/actor/custody records. Build a disposable stable-ID to numeric-EID index for numeric queries, not a replacement store. | None for derived index; high if authoritative SoA/EIDs replace records. Moderate conversion and MPL notice work. | Compare one alive/co-located query against native IDs. Skip unless a numeric hot loop is measured; expressive records/ownership are already present. |
| ER6-L2 miniplex | Same people records `src/simulation_contracts.js:237-249`. `PeopleIndex.rebuild(snapshot)` maps immutable records to object entities and returns stable IDs. | No format change for derived index; never serialize World, buckets or object references. Moderate index invalidation work. | Synthetic query equality including deletion/world transfer and deterministic sort. Skip if repeated scans are cheap or object-index upkeep exceeds benefit. |
| ER6-L3 Koota | Same actor seam plus `src/panel_kit.js:7-12`. Plain traits/query core behind PeopleIndex; no React requirement or second UI/game store. [Author docs](https://github.com/pmndrs/koota). | No format change for projections; high if trait layout becomes persisted authority. Moderate trait/identity conversion. | Query the same synthetic people set as L2 without koota/react. Skip if plain records suffice; young API adds churn and its React features do not help current DOM panels. |
| ER6-L4 official sqlite-wasm | `src/expansion_persistence.js:7-50`, `src/save_files.js:185-215`. Async SaveRepository.commit(envelope, expectedRevision), awaited before publication; retain JSON import/export. | High backend/migration/recovery work. Existing localStorage primary remains readable until a proven migration; never imitate synchronous setItem with a Promise. | Scratch synthetic envelope transaction, failed write, reopen and portable JSON equality. Skip without a storage/query bottleneck; OPFS/VFS/worker/deployment costs are substantial. [Official persistence options](https://www.sqlite.org/wasm/doc/trunk/persistence.md) distinguish OPFS VFS from SAH pool; isolation requirements depend on chosen route. |
| ER6-L5 Immer | `src/expansion_engine.js:65,536-585,588-592` clones plans before mutation. Wrap one pure plan builder in produce; persistence owner stays outside. | JSON shape unchanged if output stays plain data; freezing/reference identity may affect mutating callers. Moderate draft/alias audit. | One synthetic action yields equal complete state and leaves input untouched. Skip unless allocation profile warrants it; wrapping structuredClone in produce alone gains nothing. [Immer](https://github.com/immerjs/immer). |
| ER6-L6 signals-core | `src/main.js:8347,8457` polls panels; `src/expansion_persistence.js:5,49-50` defines publication order. Published revision/projection signal feeds computed views and disposed effects. | No format change; never serialize signals or publish speculative drafts. Moderate lifecycle/invalidation work. | One work-ledger panel with render counters and failed-write no-notify. Skip if explicit events are simpler; nested in-place mutation is not automatic signal notification. [Core API](https://github.com/preactjs/signals). |
| ER6-L7 Zod, including Mini | `src/content_packs.js:55-66`, `src/save_files.js:158-191`. validateHeader returns existing plain object/errors; keep domain migrations and reference checks. | No intended shape change, but defaults/coercion/unknown-key stripping can change saves; choose strictness per existing policy. Moderate schema/error mapping. | Compare current header validator with zod/mini on synthetic public fixtures. Skip full root for size-sensitive runtime paths; Mini is a better option if Zod ecosystem is wanted. [Zod](https://github.com/colinhacks/zod). |
| ER6-L8 Valibot | Same public pack header seam `src/content_packs.js:55-66`; named modular safeParse functions, no automatic rewriting. | No format change if validation is observational; keep missing/unsupported schema behavior and dormant fields. Low leaf-schema work. | One header shape plus existing semantic validator; report disagreement instead of replacing policy. Skip if hand checks remain clearer; no library proves cross-record conservation. [Valibot](https://valibot.dev/guides/introduction/). |
| ER6-L9 scoped TypeBox | Same content/save seam, especially authoring `src/content_packs.js:55-66`. JSON Schema builder plus Value.Check behind validateHeader. | No change for validation only; do not use casting/defaulting as migration. Moderate builder/runtime split work. | Header plus missing/wrong-type/unknown-key fixtures. Skip if no JSON Schema tooling benefit; root builder alone is not runtime validation. |
| ER6-L10 new TypeBox | Same seam; select the pinned typebox 1.x API explicitly, not as an upgrade alias for scoped 0.x. [Repository](https://github.com/sinclairzx81/typebox). | Validation-only boundary preserves JSON; compiler/code-generation choices have separate CSP constraints. Moderate API/runtime/tooling work. | Same header fixture through Value.Check, retaining handwritten semantic checks. Skip if static typing/JSON Schema tooling is not needed; current plain JS gets less of its type benefit. |
| ER6-L11 Yuka | `src/simulation.js:522-541` already orders controllers by priority, previews eligibility and starts authoritative commands. AI scorer returns candidate IDs into that gate. | None for stateless scores; new goal/memory state needs versioned plain records and retained decisions. Moderate controller/state bridge. | One deterministic priority/utility comparison with stable tie breaks. Skip unless deeper agent behavior is selected; steering/navmesh/entity managers add little to current text routines. [Yuka mechanisms](https://github.com/Mugen87/yuka). |
| ER6-L12 rot.js | `src/world_instances.js:271-281` owns revisioned sites/facts; `src/pathfinding.js:44-54` owns graph connections. New grid generator/FOV returns plain cells, site IDs and known visibility only. | New domain if grid becomes consequential; save generator revision, seed and resolved map, never regenerate old truth silently. Moderate selected-world map work. | Disposable synthetic grid/FOV, no native world replacement. Skip without a chosen grid/FOV game feature; existing site records are not a roguelike map. [rot.js](https://github.com/ondras/rot.js). |
| ER6-L13 ngraph.path | `src/pathfinding.js:12-20,92-118,128-159` sorts queue, filters accessible directed links and returns all-target rounded costs. TravelRoutes adapter owns graph construction, oriented edges and zero/admissible heuristic. | None for computed routes; preserve saved jobs and route quotes. Moderate graph/invalidation/equivalence work. | Compare every reachable cost, asymmetric links, locked sites and unreachable cases. Skip if current small graph is fast; a point-to-point A* route is not a drop-in all-destinations Dijkstra result. [Graph options](https://github.com/anvaka/ngraph.path). |
| ER6-L14 pure-rand | `src/expansion_engine.js:517-521` and `src/simulation.js:38-39` already persist xorshift streams; native `src/main.js:7503-7509` still draws via Math.random. RandomStream adapter uses explicit generator/distribution subpaths. | High if replacing old algorithm: same seed then yields different futures. Retain legacy algorithm ID/state reader; new streams get tagged full state, not seed alone. Moderate codec/call-site work. | New synthetic stream encode/decode and split/jump equality, no replacement of legacy draws. Skip library if simply centralizing existing xorshift solves the gap. [pure-rand](https://github.com/dubzzz/pure-rand). |
| ER6-L15 simplex-noise | `src/world_instances.js:275-281` owns authored site/fact identity; noise could supply a new terrain/environment read model, not replace current clocks or weather. Generator adapter accepts injected deterministic RNG and revision. | None for decoration; generated consequential terrain needs retained outputs/revision. Low algorithm use, moderate world/save design. | Seeded synthetic terrain projection with fixed sample order. Skip if no spatial field is wanted; noise adds no causal world rules and default RNG must not decide truths during rendering. [Noise docs](https://github.com/jwagner/simplex-noise.js). |
| ER6-L16 tracery npm | `src/ink_narrative.js:61-68` is the existing narrative seam, but this package does not serve it. No adapter recommended. | None; zero adoption work. | Verify identity, already done from npm/repo. Reject for story generation: it is a predicate builder with the same name. |
| ER6-L17 tracery-grammar | `src/ink_narrative.js:61-68` keeps rewards/randomness in host; `src/display.js:863-875` displays logs. Grammar renderer only expands approved observed facts, returns text, never effects. | Decorative text can remain transient; consequential utterances need saved text/grammar revision. Moderate RNG/text-safety/content work. | One public synthetic description with injected RNG, escaped/textContent sink and depth/output cap. Skip where Ink or templates suffice; grammar is not knowledge/state logic. Its RNG setter is global, so isolate/scoped use needs care. [Grammar package](https://github.com/v21/tracery). |
| ER6-L18 Howler | `src/settled_text_effects.js:39-57` already starts/resumes Web Audio on gesture and emits tones; `:59-69` honors visibility/effects. AudioService consumes settled receipts and settings, owns preload/unload. | No gameplay save change; any new user setting needs defaults independent of progress. Moderate asset/lifecycle/license work. | One optional sample cue with effects-off, mute, hidden-tab and restore suppression. Skip for existing synthesized cue; browser Web Audio already handles it. [Howler](https://github.com/goldfire/howler.js). |
| ER6-L19 PixiJS | `src/panel_kit.js:7-12` and `src/settled_text_effects.js:6-17` are panel/presentation seams. Lazy canvas renderer receives knowledge-filtered projection and returns input intent, no game timer. | No format change for view; persistent camera/layout preferences are separate. High renderer/asset/accessibility/resource work. | One disposable visible map/canvas panel at 1366×768 with DOM fallback and destroy/reopen. Skip unless canvas earns a selected visual feature; DOM/SVG already deliver readable panels/cues. [PixiJS](https://github.com/pixijs/pixijs). |
| ER6-L20 break_infinity | `src/simulation_contracts.js:15-16` enforces safe/finite ordinary numbers; `src/expansion_persistence.js:12-16` requires finite money. Domain magnitude arithmetic/compare/format/codec only. | High if changing existing numeric saves; tagged versioned magnitude, no object arithmetic or silent cast. Moderate rounding/threshold/content work. | New extreme-growth synthetic domain with declared tolerance and roundtrip. Skip ordinary currency/custody: approximate huge magnitudes are a different contract. Link [ER3-N3c](TECH_STACK_OPTIONS_2026-10-14.md#large-numbers-and-bounded-rules) for semantics. |
| ER6-L21 decimal.js | Same safe-number/finite-money seams; narrow economics adapter with specified precision and rounding, never whole-state conversion. | Existing money stays integer Number; new decimals use tagged strings and explicit old-reader decision. Moderate codec/method-call work. | One isolated cost/interest example, threshold/rounding/roundtrip. Skip when bounded integers already conserve value. [ER3-N3b](TECH_STACK_OPTIONS_2026-10-14.md#large-numbers-and-bounded-rules) owns the larger decision. |
| ER6-L22 Playwright | `package.json:5-9` uses node:test; `build.js:23-32,48-58` defines actual shipped bytes; `src/save_files.js:176-191` defines export/import. Test-only fixture/server/browser adapter, no production import. | No format change; synthetic test origins/fixtures only. Moderate browser/harness upkeep. | ER3-T4 frozen rebuilt public native route, save/reload/Export/file-input Import and failed-write check. Skip if a reliable existing harness supplies the needed gate; adding package alone proves nothing. [Runner docs](https://playwright.dev/docs/test-intro). |
| ER6-L23 Vitest | `package.json:8` already runs node:test. Test adapter only if a specific DOM/mock/browser-runner feature is needed. | No format change. Moderate runner/config/fixture conversion. | Reproduce one named missing capability beside the incumbent before moving suites. Skip bulk migration: no test-runner gap was established here. [Vitest](https://vitest.dev/guide/). |
| ER6-L24 mitt | `src/expansion_persistence.js:5,49-50`, `src/main.js:8347`. PublishedDomainEvents emits changed-domain/sequence only after commit, unsubscribes on panel destroy. | No save change; never retain raw states/secret text in event payloads. Low event contract work. | One panel with duplicate/open-close/failure event counts. Skip if EventTarget or callback Set suffices; mitt supplies no transactions, typing enforcement or history store. [mitt](https://github.com/developit/mitt). |
| ER6-L25 idb | `src/expansion_persistence.js:7-50`, `src/save_files.js:185-215`. Async SaveRepository behind awaited commit; use tx.done and one envelope revision, not request success alone. | High backend/old-primary/recovery work despite tiny helper. Preserve JSON exports, last good save and writer ownership; never mix authorities. | Synthetic IDB transaction abort/reopen and envelope equality. Prefer this over SQL if key-value slots/history suffice; skip absent quota/slot need. [idb](https://github.com/jakearchibald/idb), ER3-T10. |
| ER6-L26 fflate | `src/save_files.js:158-182` owns marked UTF-8/legacy codecs. Optional versioned compressed-export adapter; current writer/envelope unchanged initially. | New marker/reader needed; retain YAIR-UTF8-1 and legacy reads. Moderate bounded decompression/codec work. | Synthetic Unicode roundtrip and malformed/oversized expansion rejection. Skip if CompressionStream availability or current size is adequate; compressed transfer bytes do not alone fix clone/validation cost. [fflate](https://github.com/101arrowz/fflate), ER3-N1. |

## LB coverage beyond package rows

| Code / root row | Extension and incumbent choice |
| --- | --- |
| ER6-B1 / LB10 | Keep node:test. Playwright is the first useful conditional addition; Vitest needs a named runner gap. A dev panel gallery can exercise the existing `src/panel_kit.js:7-12` contract without Storybook/framework installation. Public synthetic definitions through `src/content_packs.js:55-66` give an editor validation seam; an editor product is not part of this research. |
| ER6-B2 / LB11 | Start an opt-in bounded in-memory telemetry ring, using command ID, published sequence, elapsed duration and generic panel ID. READ `src/simulation.js:37` already bounds a presentation log to 100; it is not telemetry or a durable gameplay ledger. No external analytics SDK is needed. Add disposable JSON download behind an explicit user action; avoid raw states, saves, names and sealed observations. Save compatibility remains unchanged; durable telemetry becomes a separate quota/retention decision. Lowest cost is own buffer plus published-domain events. |
| ER6-N1 / RT3 | mitt is a smaller scoped option than introducing a general UI/store framework. Compare to zero-dependency EventTarget/callback Set first; signals provide dependency tracking that mitt lacks. |
| ER6-N2 / DA1, DA2 | idb is a smaller storage helper than SQLite when queries are only key/value run slots or bounded recovery history. Both still require the async transaction redesign described by ER3 and E3. |
| ER6-N3 / DA1, DA7 | fflate is a fallback when compressed export/worker codecs need broader support than native CompressionStream. It is not a replacement database or an offline-clock tool. |

Do not couple grammar/noise/FOV generation to live render previews or switch old RNG algorithms merely to standardize imports. For authoritative generated outcomes, retain content/generator revision and resolved output; adapters must pass only actor-qualified data to UI/telemetry. SQL/ECS do not by themselves satisfy E1-E10 or offline settlement ownership.

ER6-X1: Link [ER1's runtime audit](RUNTIME_HOTSPOT_AUDIT_2026-10-14.md) for clone/validation/render attribution and [ER2's bundle audit](CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md) for actual incremental bundle context. ER1 measured a contended headless workload, not library alternatives; it supports investigating validation/allocation but does not prove Immer, ECS or SQL wins. [ER5](GAME_ENGINE_OPTIONS_2026-10-14.md) owns renderer-versus-port fit. No results from those lanes are relabeled as ER6 measurements.

## Evidence handback and open gates

MEASURED only: npm scratch install and browser-target package-size compilation/gzip, including the corrected pure-rand subpath probe. READ only: mapped runtime source, current owners, existing license/build/dependency recipe. STATED only: live package registry, GitHub API/archive/push data and author mechanisms. The ranking/adapters/save decisions are INFERRED proposals.

Open adoption gates: selected real workload, adapter behavior/semantic parity, full current dependency-notice audit, rebuilt browser proof and old/current/failure save roundtrips where touched. Current gameplay/native gates stay with their existing owners. No gameplay tests, native browser journey, real save migration, engine throughput benchmark or shipping bundle rebuild was run in ER6. The [lane report](../gm/dispatch/engine-runtime-2026-10-14/ER6/REPORT.md) lists commands, files and exact limits. ER7 may provide separate ECS/worker/SQL spike evidence; this package-size probe does not preempt its result.
''')
p=pathlib.Path('docs/research/LIBRARIES_TO_INCORPORATE_2026-10-14.md');p.write_text(''.join(parts))
print('WROTE',p,len(p.read_text()),'characters')
