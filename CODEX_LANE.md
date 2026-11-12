# Codex lane w12-process: process crafts (census, then one shared process law)

You are the worker for the PROCESS CRAFTS family (forging, tempering, brewing, cooking, refining, distilling, firing, curing). A lead reviews your diff afterwards. Work only in this worktree, `/Users/weiwei/code/yair-w12-process`, branch `codex/w12-process`. Never touch `/Users/weiwei/code/yet-another-idle-rpg`. `node_modules` is a symlink; leave it.

## Goal

1. A census of the Making area, as a table in the family doc.
2. One shared process law on the kernel working, with pack data and a fixture that runs six worked rows.

Done means: the census table is in the family doc, `node --test tests/process_law.test.js` passes, `npm run check:arch` and `npm run check:rules` exit 0, `CODEX_RETURN.md` is written, and the work is committed on this branch.

## Core rules (the owner restated these today; they bind every line)

- Everything is possible, reasonably. Things work by how they work. Model mechanisms, not allowed-outcome lists.
- A limit is a default with a dial and an in-world reason, never "never/always/only". The owner's words today: "There are always ways around everything? Dont forget our core rules too". So a wrong step order, a missing tool or too little heat gives a different or worse result with a cause, and there are ways around a requirement (a substitute tool, a slower route, a helper, a different process that reaches the same properties), never a flat refusal.
- Laws read properties, not names or categories (PFP22). World numbers and material rows live in pack data passed in by the caller (PFP3). Shared modules name no world. Everything is a proposal (AD32).
- Engine first: prove it in tests and in the headless engine world. No wiring into `src/main.js` or UI.
- Keep it small: new modules only where a mechanism is new; no checker scripts; two honest attempts at a sticking point, then stop and report.
- No em dashes anywhere. Preserve unrelated code.

## Files

May create or edit:
- `docs/gm/dispatch/foundation-run-2026-11-12/FAMILY_PROCESS_CRAFTS.md` (census section only; the lead writes the rest)
- `src/process_law.js` (new)
- `src/load_law.js` (new, only if step C5 finds no existing property-reading law to use)
- `tests/process_law.test.js` (new), `tests/fixtures/process_craft_packs.js` (new, pack data)
- `CODEX_RETURN.md` (new, worktree root)

Must not edit: `src/brew_law.js`, `src/kernel_working.js`, `src/craft_working.js`, `src/craft_process_thermal.js`, `src/engine_world.js`, any existing `craft_*`, `crafting_*`, `material_*`, `gear_*`, `vessel_*`, `mixture_*` module, `src/main.js`, any UI file, `package.json`, `dist/`. Build beside them. If you believe one of these needs a change, write the request in `CODEX_RETURN.md` and do not make it.

Do not run `npm run build` or the full `npm test`. No merge, push, stash, reset or force. No visible windows.

## Step A: census (bounded reading, do this first)

Scope: files under `src/` matching `craft_*`, `crafting_*`, `material_*`, `gear_*`, `vessel_*`, `mixture_*`, `forge*`, `assembly*`, `lineage*` (71 files at this commit; none match `forge*` or `assembly*`, say so). Read each file's header comment and exports, not the whole file.

Write to the family doc, under a heading `## Census of Making (2026-11-12)`, one table with these columns:

| File | What it does (one line) | Shape | On kernel | Process steps | Game loads |

- Shape is one of: `process` (state moved along steps), `recipe table`, `scene` (one named item, scene or world), `view` (UI or projection), `state owner`, `data`, `helper`.
- On kernel: `kernel` if it imports `kernel_working.js`, `craft_working` if it imports `craft_working.js`, else `no`.
- Process steps: which of heat, quench, cool, work, fold, grind, stir, cure, age, separate, dry the file actually models, or `none`.
- Game loads: `yes` when `node scripts/reachable.mjs --is src/<file>` exits 0, else `no`. Run it for every file in a shell loop.

Below the table, five lines: total files; how many are `process`; how many the game loads; which run on the kernel or on `craft_working`; which process steps exist anywhere and which are absent (quench, fold and temper are likely absent; confirm).

Also grep outside the pattern for two things and report in one line each: other callers of `defineWorkingLaw` (the kernel's users), and other process leaves (`craft_process_*`, `craft_agitation`, `dose_process`, `making_procedure`, `absorb_e2/durability.js`).

## Step B: the mechanism (decided by the lead; build this)

`src/process_law.js`: a kernel working law (`defineWorkingLaw` from `src/kernel_working.js`), law id `f.process`. Read `src/brew_law.js` first and follow its shape: facts hold the state, operations return `{ok, facts, effects, observed, cause}`, a stamped clock, a `processMethod` builder like `brewMethod`.

Why it is beside `brew_law.js` and not inside it: the brew law keeps a conserved matter ledger of many lots in buckets (extensive amounts). A workpiece is one body whose internal structure and scalar properties move (intensive state). Both sit on the same kernel shape and the same receipts. Say this in the file header in two lines and list in `CODEX_RETURN.md` which brew operations (`heat`, `cool`, `stir`'s moves, `prepare`'s changes) and which parts of `craft_process_thermal.js` (its two residence windows are two band rows) could later be expressed as rows of this law.

### State

`facts.piece = {temperature, shares: {name: number}, scalars: {name: number}, clock, path: [...]}`.
- `shares` are the structure of the piece and sum to the starting total (conserved; check it and expose `processBalance(facts)`).
- `scalars` are free quantities (grain, moisture, impurity, whatever the pack names).
- `path` is the list of settled steps with what each moved and why. The path is part of the result.
- The law names none of these quantities. It reads whatever names the pack rows and the bound things carry.

### Operations (two, both exposures)

- `hold`: roles `{piece: 'piece', medium: 'medium'}`. The piece sits in a medium for the step's minutes.
- `work`: roles `{piece: 'piece', medium: 'medium', tool: 'tool'}`. The same, while a tool delivers work.

Forge, quench, temper, bake, simmer, roast, smelt and cure are not operations. They are pack methods made of `hold` and `work` steps with different media and tools. That is the point.

Bound things are read through the kernel's `ports.read` as usual: a medium is `{kind: 'medium', id, properties: {temperature, exchange, ...}}`, a tool is `{kind: 'tool', id, properties: {...}}`, a piece is `{kind: 'piece', id, properties: {thermalMass, ...}, shares, scalars, temperature}`. On the first step the law takes the starting state from the bound piece; after that the facts hold it.

### One step, computed in closed form

1. Temperature follows `T(t) = Tm + (T0 - Tm) * exp(-r t)` with `r = medium.properties.exchange / piece.properties.thermalMass` (per minute). No ticks.
2. Pack rows arrive as step options `options.rows` (the method builder copies them from the pack so the method is data). Each row:
   `{id, band: {min, max}, from, to}` for a share transfer, or `{id, band, scalar, toward}` for a scalar drift, plus `tauMinutes`, optional `driveBy` (a tool property name; the rate is multiplied by `tool.properties[driveBy] / 1000`, and the row does nothing in a `hold` step or when the property is 0), optional `needs` (`{medium: {prop: atLeast}, shares: {name: atLeast}, scalars: {name: atLeast}}`; an unmet need means the row moves nothing this segment and the receipt says which need), and `cause` (a short in-world sentence).
3. Split the step at every time the temperature curve crosses a band edge of any row (the curve is monotone, so each edge is crossed at most once). In each segment, the active rows are those whose band holds the segment's temperature and whose needs are met at the segment's start. First-order kinetics: rows that share a `from` compete, `moved = from * (1 - exp(-K t))` with `K` the sum of their rates, split in proportion to each rate. Scalar drifts move `(toward - value) * (1 - exp(-k t))`.
4. The step's receipt (`observed` for what a maker can see, `truth` through the returned facts' `path` entry) lists per row: minutes in band, amount moved, and the cause. A row that had its band but moved nothing says why (nothing of `from` present, need unmet, no drive). A step never returns `ok: false` for a wrong order, a weak tool, a cool fire or a slow medium. It returns `ok: true` with the different state and the causes. `ok: false` is left for malformed data (a row with no band, a negative tau), which is a `check` failure.
5. On the final step of a method (`options.finish: true`, set by the method builder) the step also returns one effect `{op: 'property', ...}` per projected property so a host can land the result on the piece's holder. Read `applyWorldOps` in `src/world_substrate.js` (`case 'property'`) for the exact op shape and use it.

### Projection (PC70)

`projectProcess(facts, projection)`: pack data `projection = {property: {shares: {name: weight}, scalars: {name: weight}, base}}` gives each outward property as a weighted sum. The fixture's steel pack projects `hardness` and `toughness`; the kitchen pack projects whatever its reader needs. The law knows no property name.

Export also `processMethod({id, revision, steps, rows, projection})`, `unfinishedPiece(record)` (after an interruption the piece keeps its state, like `unfinishedBatch`), and `PROCESS_LAW`.

## Step C: worked rows the fixture must run as data

Pack data in `tests/fixtures/process_craft_packs.js`: an original steel pack (shares such as `soft`, `hot`, `hard`, `tempered`; rows: above a high band everything becomes `hot`; in a middle band `hot` turns `soft` with a tau of minutes; below a low band `hot` turns `hard` almost at once; in a tempering band `hard` turns `tempered` over tens of minutes; a grain scalar that coarsens when held very hot and refines under hammer work in the forging band, driven by the tool's `impact`), media (forge, water, oil, still air, a low oven) and tools (hammer, a river stone as a weak substitute), and a kitchen or refinery pack on the same law (for example `raw` to `cooked` to `charred` shares with a `moisture` scalar, or `impurity` leaving to `slag` when the medium carries flux). Every number is a dial with a one-line reason in a comment. The packs are original (name no book world).

`tests/process_law.test.js` proves, each as its own test:

1. **Forge, quench, temper.** A blade worked hot, quenched in water and tempered. A second blade with the temper step left out is harder and less tough. Under one stated load the untempered blade fails and the tempered one survives (see 5).
2. **Order matters, with the cause.** The same steps in another order (temper before quench) give another result, and the path names why (the tempering band found nothing hard to temper; the quench then left it all hard).
3. **A way around.** No water: the smith quenches in oil, or in still air. The method still completes. The properties shift (less hard, because the piece spent longer in the band where hot structure turns soft) and the receipt shows the minutes in that band as the reason. Also show the weak tool: the river stone refines grain more slowly, and a longer `work` step with it reaches the hammer's grain.
4. **Not forging only.** One cooking or refining method runs on the same law with a different pack, and the too-hot or too-long variant gives a worse result with a cause.
5. **Another law reads the result, no code for the pair.** First look for an existing law that reads `hardness` or `toughness` style properties on a thing (`src/world_quantities.js` names them; check `src/absorb_e2/durability.js`, `src/contest_bodies.js`, `src/notch_contest.js`). If one fits without edits, use it. If none does, add `src/load_law.js`: a small function that takes any thing's properties, a load `{force, shock}` and pack thresholds as data, and returns `{held, bent, broke, cause}` by comparing property quantities. It imports nothing from the process law, and the process law imports nothing from it. The test passes the projected properties of blades from tests 1 and 3, and of one thing that was never forged (plain properties), through the same call.
6. **One settlement or several, save and restore.** `settleWorking` once to the end and minute by minute give deep-equal records. `serializeWorking` then `restoreWorking` mid-method, then settling on, gives the same final record. And in the engine world (`createEngineWorld` with a small pack list, see `tests/engine_world.test.js` for how holders and `shared.properties` are declared): the finished piece's property effects are applied with `applyEngineOps`, the world is serialized and restored, and the properties read back equal.

Also one small test: an interrupted method (`interruptWorking` after the quench) leaves a piece whose state is kept, and a new method started from that piece can temper it (the rescue route).

## Review points the lead will grep for

- `ok: false` in `src/process_law.js` outside malformed-data checks.
- World words in `src/process_law.js` or `src/load_law.js` (steel, blade, water, oil, martensite, any book name). Quantity names come from data.
- "never", "always", "only" as rules in comments or docs. Write a default, its dial and its reason.
- Em dashes. Use none.
- Imports from the game shell or UI.

## Checks

```
node --test tests/process_law.test.js
node --test tests/brew_law.test.js tests/kernel_working.test.js   # unchanged neighbours still pass, if those files exist
npm run check:arch
npm run check:rules
```

If `check:arch` or `check:rules` fails on something that predates your change, record the exact line in `CODEX_RETURN.md` and move on.

## Return

Write `CODEX_RETURN.md` in the worktree root: files changed; each check's command with pass and fail counts; the census five lines; for each of the six points, the test name and what it shows with the key numbers; what existing modules this law could absorb later; anything below the bar or not done, stated plainly; any change request for a file you may not edit.

Commit in this worktree when the checks pass: `git add` your own paths only, plain English message, no `Co-Authored-By` trailer. Do not commit `CODEX_LANE.md` changes other than leaving the file as it is (it may be committed as written).
