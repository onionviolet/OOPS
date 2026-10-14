# ER17 report: comic worlds engine fit

## CHECKPOINT

2026-10-14. Complete research/source audit; no implementation selected.
Owned writes are the two files below. Existing shared dirty state and active
workers were left with their owners. Branch inspected:
`codex/gameplay-foundations`. No agent delegation, source mutation, build,
test suite, browser, personal save, private pack, secret file, install,
commit, push or root-palette edit in this lane.

## Files written

| Code | File and result |
|---|---|
| ER17-D1 | [COMIC_WORLDS_ENGINE_FIT_2026-10-14.md](../../../../research/COMIC_WORLDS_ENGINE_FIT_2026-10-14.md): 18 CL, 22 CK and 10 CA mappings; foundations and AB dependencies; READ file:line support; INFERRED numbered workloads/failure verdicts; five headline stress cases; six additional contracts; five proposals ranked by value per effort. |
| ER17-D2 | This report: scope, commands, measured probe limits and open questions. |

## Findings returned to the root

| Code | Result | Root codes informed |
|---|---|---|
| ER17-R1 | Scalar fact/knowledge mutation and short receipt history do not implement retcons or historical observer memory. Narrow recipient-qualified channel receipts already exist and should be reused. | CE1/9, DA6, MC35, AB6/8/13; ER17-N1/2/6. |
| ER17-R2 | World-instance records have continuity/era/revision and presence clocks, but schema 1 rejects tier/history/moving absence additions. Repeated template person IDs collide. A synthetic 10,000-hero roster exceeds the current save budget. | CE2, RT7, DA1/2, MC36, AB5/8/10; ER17-N4. |
| ER17-R3 | Local events and narrow carrier adapters do not provide one six-world event owner, durable phase retries or interrupted borrowed-asset return. | CE3/7, MC37, SB9, AB2/3/7/9/11; ER17-N3. |
| ER17-R4 | Extreme numeric combat values can produce zero equal-stat hit chance and non-finite damage. The native 5% damage floor cannot represent an unreachable target. Separate rank, contact and objective scope. | CE4, PF8, MC6/9, AB5/12/15; ER17-N5. |
| ER17-R5 | A 512-boundary return is a safety boundary, not a completed long skip. Comic recap/panel style cannot create missing offline settlement or remote knowledge. | RT8, E4/7/9, CE8, AB1/6/13/14; ER17-N6 and offline OT owners. |

Full row verdicts and evidence belong to D1. These are findings/proposals,
not gameplay completion or new product priority.

## Commands run and evidence

READ commands: `git status --short`, `git branch --show-current`, bounded
`ps -axo pid,command` filtering for active Codex/Claude workers, `rg --files`,
`rg -n`, `cat`, `sed -n` and `nl -ba` over the specified dispatch/authority,
comic, continuity, engine and cited source files. A targeted memory registry
search for `engine-runtime|comic|palette|ER17` returned no matches; no memory
fact was used. Two mistaken candidate source paths were absent
(`simulation_state.js`, `status_window_panel.js`); searches moved to the
actual effect/knowledge/card owners. Neither absent candidate supports an
absence verdict about gameplay.

MEASURED ER17-M1: ran the following source-only synthetic probe through
`node --input-type=module` in the repo. Exit 0. No storage write occurs.

```js
import {createWorldInstance, validateWorldInstance} from './src/world_instances.js';
import {get_hit_chance, mitigateCombatDamage} from './src/combat_math.js';
const d = {id:'comic.synthetic', worldId:'comic', revision:1,
  label:'Synthetic', unidentifiedLabel:'Unknown',
  regions:[{id:'city',layerIds:['surface']}], sites:[],
  initialFacts:{saved:true}, uniqueClaimIds:[]};
const i = createWorldInstance(d,
  {id:'earth.1',continuityId:'test',eraId:'test',playedAt:0});
for (const [label,mutate] of [
  ['history',x=>x.facts.saved={value:false,validFrom:1}],
  ['LOD',x=>x.tier='dormant'],
  ['moving',x=>x.clock.absence='moving']]) {
  const x=structuredClone(i); mutate(x);
  try {validateWorldInstance(x,d); console.log(label,'accepted');}
  catch(e) {console.log(label,'rejected:',e.message);}
}
const actors=Array.from({length:50*200},(_,n)=>({
  id:`earth.${Math.floor(n/200)}.hero.${n%200}`,state:'x'.repeat(512)}));
const s=JSON.stringify({actors});
console.log('syntheticRoster',JSON.stringify({actors:actors.length,
  utf8Bytes:Buffer.byteLength(s),storageBytes:2*s.length,budget:4*1024*1024}));
console.log('combat',JSON.stringify({
  cosmicOverflows:Number.isNaN(get_hit_chance(1e308,1e308)),
  normalEqual:get_hit_chance(100,100),
  minimumVsHugeArmor:mitigateCombatDamage([100],1e12)}));
```

Observed: all three mutations rejected; 10,000 roster records,
5,492,512 UTF-8 bytes, 10,985,024 UTF-16 storage bytes versus READ guard
4,194,304 bytes; ordinary equal hit chance 0.53; armor case damage 5.
The first probe's `Number.isNaN` was false. That alone could conceal the
wrong finite hit chance, so ER17-M2 printed the actual value and damage
finiteness. This is the basis of the final arithmetic finding.

MEASURED ER17-M2: second `node --input-type=module` command, exit 0:

```js
import {get_hit_chance,rollBaseCombatDamage} from './src/combat_math.js';
console.log(JSON.stringify({
  hugeEqualHitChance:get_hit_chance(1e308,1e308),
  hugeDamage:rollBaseCombatDamage(1e308,1,1,()=>0.5)[0],
  isFiniteDamage:Number.isFinite(rollBaseCombatDamage(1e308,1,1,()=>0.5)[0])
}));
```

Observed: `{hugeEqualHitChance:0, hugeDamage:null, isFiniteDamage:false}`
in JSON. Null is JSON's encoding of the non-finite arithmetic result.
Neither synthetic fixture is a valid full saved campaign or measured browser
workload. Stress-scale timings and proposed distributions remain INFERRED.

Document checks: Python verified exactly ordered CL1-18, CK1-22 and CA1-10,
all cited source paths exist, no forbidden dash syntax, valid local Markdown
file targets and table column counts. Scoped `git diff --check` ran for the
owned files. Both are new/untracked, so direct file checks supply the actual
content validation. No runtime test/build/browser gate was run or claimed.

## Other lane reconciliation

K1/K4/K5 outputs were still checkpoints at final read; K2's expected output
was absent. K3 completed during ER17 and was read: content kind versus beat
treatment, ordinary record/recap usability, fictional focus rather than CSS
panel membership, and separate simulation versus reader time are reflected
in D1. W18 also completed during ER17; its observation/explanation,
trusted-execution versus observer-read, overlay and persona mappings were
read and linked. These outputs remain proposals and source evidence, not
proof that the AB interfaces or comic gameplay landed. Do not restart K6's
stopped duplicate lane.

## Open questions and acceptance boundary

| Code | Unresolved selection or proof |
|---|---|
| ER17-Q1 | Which one original or source-pinned comic slice should qualify these contracts? The audit does not change canon-first order or select a franchise pack. |
| ER17-Q2 | For a selected retcon law, which commitments survive, refund, invalidate or recompute, and which observers retain old belief? Additive fields alone do not answer this schema/meaning change. |
| ER17-Q3 | For a selected crossover, what are unavailable-module, dormant-world and borrowed-person return policies? Resolve at the event owner before promising six-world play. |
| ER17-Q4 | What representative actor/fact footprint and device should the performance gate use? Current numbers are synthetic capacity/arithmetic probes, not input p95, frame rate or import latency. |

The next authoritative gameplay gate, after root selection of one bounded
slice, is its rebuilt desktop journey plus exact save/reload/import and
old-save compatibility when persistence changes. Fault/retry/clock/knowledge
fixtures support that gate; they do not substitute for native play. Human
fiction/balance acceptance remains separate. The authorized two-file audit
is complete; implementation remains open.
