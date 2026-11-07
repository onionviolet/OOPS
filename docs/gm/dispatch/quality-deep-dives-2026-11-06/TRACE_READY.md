# Trace recorder ready (PAC lane, 2026-11-06)

`scripts/headless/trace.mjs` records a deterministic headless playthrough as JSON lines.
SHOWN: village (90 actions) and the three Harry Potter starts (12 actions) record cleanly.
Other starts are smoke-tested by the PAC lane; see PAC_REPORT for their status.

## CLI

```
node /Users/weiwei/code/yet-another-idle-rpg/scripts/headless/trace.mjs --list-starts
node /Users/weiwei/code/yet-another-idle-rpg/scripts/headless/trace.mjs --start village --minutes 2880 --actions 300 --out /tmp/village.jsonl
```

Dials: `--dt` (game minutes after each press, default 10), `--panel-dt` (opening a panel, 1), `--minutes`,
`--actions`, `--seed` (1). About one second of wall time per action. Write traces outside the repo (they hold
UI text); `scripts/check_pacing.mjs` caches them under the OS temp folder.

```js
import {recordTrace, listStarts, START_IDS} from './scripts/headless/trace.mjs';
const {meta, steps, end, records} = await recordTrace('book.hp.school', {actions: 100});
```

One game per process: run one `recordTrace` per Node process, or one after another with the recorder closing
the game between them (it does). `recordTrace` throws `{skip:true}` when a start is not offered (private packs).

## Start ids

`village` (default opening), `book.hp.school`, `book.hp.trade`, `book.hp.lead`, `book.ss.apprentice`,
`book.ss.trial`, `book.ss.company`, `book.ri.academy`, `book.ri.keeper`, `lotm.probationer`, `lotm.machinery`,
`lotm.storm`, `lotm.civil`, `lotm.beside` (private pack, skipped when absent), `soldier.p01` (A Soldier's Life visit).
`--list-starts` reads them from the live game (structured choice select, Tingen picks, optional worlds).
Not covered: the "Begin with a system" hero option (set before PLAY), the developer Klein route, Mother of Learning.

## Schema (version 1; the header of the script is the owner)

Lines: one `meta`, many `step`, one `end`. Every step carries every field (empty arrays, never missing).

- `meta`: `schemaVersion, start, seed, policy{name,dt,panelDt,minutes,actions}, startMinute, setup[{action,ok}], world, location`
- `step`: `i, minute, t` (t = minutes since first step), `action{kind: click|open-panel|repeat|wait, selector, label}`, `advanced`,
  `text{blocks,new,removed,novel,samples}`, `reports[]` (new Reports lines), `refusals[{kind: action-error|clock-stopped|step-error|disabled, text}]`,
  `money{now,delta}`, `skills[{id,level,levelDelta,xpDelta}]`, `items[{id,delta,total}]`, `unlocks[]`
  (`avail:cat:id`, `quest:id:active|finished`, `flag:id`, `codex:id`, `panel:id`),
  `changed{count,buckets{topKey:n},samples[path]}` (non-noise save paths), `boots`
- `end`: `reason (minutes|actions|blocked|error), actions, minutes, errors[]`

Notes for consumers: `text.novel` counts blocks never seen earlier in the trace (digits masked). Passive buckets
(`levels`, `skillRecords`, `absorb_local_life`) tick on their own; the pacing check ignores them. The policy never calls
window entry points (no teleport, save, load) and refuses reset, import, new-life and layout controls.
Book lives keep stock in their own records, so read `changed.buckets` and `unlocks` for them, not only `money` and `items`.

## Sample record (village, a Village start; no sealed content)

```json
{"type":"step","i":59,"minute":2521,"t":601,"action":{"kind":"click","selector":"[data-recipe_id=\"Shirt\"]","label":"keyboard_double_arrow_down Shirt"},
 "advanced":10,"text":{"blocks":243,"new":3,"removed":0,"novel":3,"samples":["Skills","Skills & practice is now available in navigation.","Skills ›"]},
 "reports":["Skills & practice is now available in navigation."],"refusals":[],"money":{"now":102,"delta":0},
 "skills":[{"id":"Patience","level":1,"levelDelta":1,"xpDelta":1}],"items":[],"unlocks":["panel:skills"],
 "changed":{"count":5,"buckets":{"skill_category_order":2,"levels":2,"skillRecords":1},"samples":["skill_category_order/0"]},"boots":1}
```

## Known limits of the policy

"Unseen first" is a lower bound on a curious player. In the Village it talks to the elder, mixes and browses, but did not
reach the paid-work loop in 90 actions (money never rose). Treat a Village "no money" reading as a policy gap until a
work-aware route replaces it (PAC backlog). Text samples from book starts may show spoiler-adjacent player text; do not
paste them into shared docs without checking sealed status.

## Update (PACING fix lane, 2026-11-07)

- New policy `--policy work` (`recordTrace(id, {policy: 'work'})`). Default stays `unseen-first`; its records only gain the additive
  `progress` field (step) and `progress0` (meta). Schema version unchanged. `enterStart` is now exported.
- One default-policy change: the panel-opening step skips `disabled` options of the "Other known panels" select (FEEDBACK found `fill`
  picked disabled ones). Unseen-first choices can shift slightly; openings and feedback traces re-record on the new recorder hash.
- Work-policy traces are cached under file names ending `.pwork.jsonl`; default-policy names are unchanged. `check_pacing.PARAMS`
  stays policy-free (the feedback check imports it); the pacing check uses `PACING_PARAMS`.
- `progress`: `{settled, simLog, jobs, gains, packs}` absolute counters from a life's own records (see the trace.mjs header).
- Tingen starts: lotm.probationer, machinery, storm, civil and beside all record cleanly in the current tree (6 actions each, SHOWN
  2026-11-07). No game break found; the earlier failure matches the disabled-panel-option fill, fixed above.
