#!/usr/bin/env node
// Seam adoption register (AR11 made checkable; AR17 and this tool are proposals, AD32).
// Scans src/**/*.js static imports and reports, per curated seam, importer counts and
// world families. Import counts never prove a seam: the proof column comes from the
// curated PROOF map below, each entry citing a receipt.
// Usage: node scripts/seam_register.mjs [--write | --check]
import {readdirSync,readFileSync,writeFileSync,existsSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Curated seams, from lane H's register (docs/audits/cross-world-foundations-2026-11-06/LANE_H_HOSTS_REGISTER.md).
// files: module paths under src/ (no .js). Importers inside the group do not count.
export const SEAMS=[
 {id:'ready_stock',files:['ready_stock'],purpose:'Counted stock a holder carries and spends (rounds, doses)'},
 {id:'notch_contest',files:['notch_contest'],purpose:'Notch-banded contest resolution'},
 {id:'check_contract',files:['check_contract'],purpose:'Declared check contract (inputs, outcomes) for skill checks'},
 {id:'own_holdings',files:['own_holdings'],purpose:'Purse and holdings owned by the player'},
 {id:'recurring_duties',files:['recurring_duties'],purpose:'Duties that come due on a schedule'},
 {id:'lesson',files:['lesson'],purpose:'Taught lessons and what they leave behind'},
 {id:'teacher_window',files:['teacher_window'],purpose:'When a teacher is available'},
 {id:'travel_legs',files:['travel_legs'],purpose:'Journeys as legs with cost and time'},
 {id:'world_light',files:['world_light'],purpose:'Light and dark by place and hour'},
 {id:'people_knowledge',files:['people_knowledge'],purpose:'What the player knows about each person'},
 {id:'people_sources',files:['people_sources'],purpose:'Where people entries come from'},
 {id:'constraint_store',files:['constraint_store'],purpose:'Standing constraints on the actor'},
 {id:'conflict_frame',files:['conflict_frame'],purpose:'Shared frame for an encounter and its grains'},
 {id:'tempo_fight',files:['tempo_fight','tempo_fight_contract','tempo_fight_domain'],purpose:'Tempo fight engine, contract and domain'},
 {id:'harm_state',files:['harm_state'],purpose:'Harm ladder and wounds'},
 {id:'world_rhythm',files:['world_rhythm'],purpose:'World clock rhythm and seasons'},
 {id:'cast_schedule',files:['cast_schedule'],purpose:'Where the cast is by hour'},
 {id:'world_events',files:['world_events','world_events_knowledge','world_events_pack'],purpose:'Dated world events and who knows them'},
 {id:'storylet_deck',files:['storylet_deck'],purpose:'Storylet draw and gating'},
 {id:'seeded_streams',files:['seeded_streams'],purpose:'Named seeded random streams'},
 {id:'institution_store',files:['institution_store'],purpose:'Institutions with standing and credit'},
 {id:'institution_access',files:['institution_access'],purpose:'What an institution lets a member reach'},
 {id:'faction_rank',files:['faction_rank'],purpose:'Rank inside a faction'},
 {id:'law_case',files:['law_case','jurisdiction_rules'],purpose:'Cases and jurisdiction rules'},
 {id:'owed_ledger_sources',files:['owed_ledger_sources'],purpose:'Sources of what is owed to or by the player'},
 {id:'structured_ability_runtime',files:['structured_ability_runtime'],purpose:'Structured ability execution'},
 {id:'life_events',files:['life_events','life_events_domain','life_events_ui'],purpose:'Life events and their domain'},
 {id:'home_building_model',files:['home_building_model'],purpose:'Home as a building model'},
 {id:'research_*',files:['research_content','research_view','research_home'],purpose:'Research content, view and home'},
 {id:'ability_ladders',files:['ability_ladders'],purpose:'Ability ladders'},
 {id:'effect_dsl',files:['effect_dsl'],purpose:'Effect description language (inert by ABR4)'},
 {id:'world_calendar',files:['world_calendar','world_calendar_content'],purpose:'Per-world calendar'},
 {id:'cast_* adapters',files:['cast_ability_adapter','cast_body_adapter','cast_divination_adapter','cast_exchange_adapter','cast_inference_adapter','cast_making_adapter','cast_topic_talk','cast_journeys'],purpose:'Adapters that give cast members shared mechanisms'},
 {id:'ability_records',files:['ability_records'],purpose:'Ability records'},
 {id:'material_lineage',files:['material_lineage','material_lineage_domain'],purpose:'Where a material came from'},
 {id:'lore_history_state',files:['lore_history_state'],purpose:'Lore and history knowledge state'},
 {id:'combat_math',files:['combat_math'],purpose:'Shared combat arithmetic'}
];

// Proof state is curated, not computed. States: none (no world file imports it, set by the scan),
// one-world route, two-world route, unknown (default). A route means a native play route (AR10), not a unit test.
export const PROOF={
 ready_stock:{state:'one-world route',receipt:'docs/gm/dispatch/at15-fight-2026-11-06/CHECKPOINT.md (fixture route kj3z ckpt-range: native hire and load shown; fight use blocked by T1, T2); docs/gm/dispatch/refinement-audits-2026-10-31/B8_IMPLEMENTATION_RECEIPT.md (B8 focused tests)'},
 tempo_fight:{state:'one-world route',receipt:'docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P4_TEMPO_CHECKPOINT.md (Frontier road-rival contest, fixture-seeded browser route); not reached natively for LOTM: docs/gm/dispatch/at15-fight-2026-11-06/CHECKPOINT.md T1, T2'}
};

// World families by path under src/ (first match wins). Anything else is "shared".
export const FAMILIES=[
 ['lotm',/lotm/],
 ['hp',/(^|\/)(book_world_hp|hp_|book_hp)/],
 ['mol',/(^|\/)(book_world_mol|mol_|book_mol)/],
 ['paradise',/paradise/],
 ['primordial',/primordial/],
 ['gu',/(^|\/)(book_world_gu|book_gu|gu_)/],
 ['shadow',/shadow/],
 ['mistglass',/mistglass|root_retuning|vessel_thread/],
 ['proto23',/proto23|(^|[\/_])p23/],
 ['dnd',/dnd/],
 ['field',/(^|\/)field_/],
 // Lane H's village/frontier family also holds these Frontier-only kits. tempo_fight* is world-neutral (neutral write port, serves LOTM) and stays shared.
 ['village',/(^|\/)(village|frontier|original_frontier|expedition_|cohort_|life_events|storylet|tools_domain|gear_workshop|pocket|tempo_location)/]
];
export const SHARED='shared';
export function familyOf(rel,families=FAMILIES) {
 for(const [name,re] of families) if(re.test(rel)) return name;
 return SHARED;
}

function stripComments(src) {
 return src.replace(/\/\*[\s\S]*?\*\//g,'').replace(/^[ \t]*\/\/.*$/gm,'');
}
// Static specifiers: `import x from`, `import 'x'`, `export ... from`. Dynamic import() is not scanned.
export function importSpecs(source) {
 const src=stripComments(source),out=[];
 for(const m of src.matchAll(/(?:^|[\n;}])\s*(?:import|export)\b[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]/g)) out.push(m[1]);
 for(const m of src.matchAll(/(?:^|[\n;}])\s*import\s*['"]([^'"]+)['"]/g)) out.push(m[1]);
 return out;
}
function resolveSpec(fromRel,spec) {
 if(!spec.startsWith('.')) return null;
 let t=path.posix.normalize(path.posix.join(path.posix.dirname(fromRel),spec));
 if(!/\.(m?js)$/.test(t)) t+='.js';
 return t;
}
// files: Map or object of repo-relative path (posix) -> source text. Seam files are src-relative without .js.
// Returns one row per seam; a seam with no importers is a row with zeros.
export function scan(files,seams=SEAMS,{families=FAMILIES,srcPrefix='src/',proof=PROOF}={}) {
 const entries=files instanceof Map?[...files]:Object.entries(files);
 const edges=entries.map(([rel,text])=>[rel,importSpecs(text).map(s=>resolveSpec(rel,s)).filter(Boolean)]);
 const missing=[];
 const known=new Set(entries.map(([r])=>r));
 return {rows:seams.map(seam=>{
  const targets=new Set(seam.files.map(f=>`${srcPrefix}${f}.js`));
  for(const t of targets) if(!known.has(t)) missing.push(t);
  const src=new Set(),other=new Set(),fam=new Map();
  for(const [rel,deps] of edges) {
   if(targets.has(rel)||!deps.some(d=>targets.has(d))) continue;
   if(rel.startsWith(srcPrefix)) {
    src.add(rel);
    const f=familyOf(rel.slice(srcPrefix.length),families);
    fam.set(f,(fam.get(f)||0)+1);
   } else other.add(rel);
  }
  const worlds=[...fam].filter(([f])=>f!==SHARED).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  const p=proof[seam.id];
  return {id:seam.id,purpose:seam.purpose,src:src.size,tests:[...other].filter(r=>r.startsWith('tests/')).length,scripts:[...other].filter(r=>r.startsWith('scripts/')).length,
   shared:fam.get(SHARED)||0,worlds,families:worlds.length,state:p?p.state:'unknown',receipt:p?p.receipt:''};
 }),missing};
}

export function renderTable(rows) {
 const out=['| Seam | Purpose | src importers | tests / scripts | Shared importers | World families (importer files) | Families | Proof state | Receipt |','|---|---|---|---|---|---|---|---|---|'];
 for(const r of rows) {
  out.push(`| ${r.id} | ${r.purpose} | ${r.src} | ${r.tests} / ${r.scripts} | ${r.shared} | ${r.worlds.map(([f,n])=>`${f} ${n}`).join(', ')||'none'} | ${r.families} | ${r.state} | ${r.receipt?`\`${r.receipt.split(' ')[0]}\``:'none cited'} |`);
 }
 return out.join('\n');
}
export function renderTally(rows) {
 const g=[rows.filter(r=>r.families===0),rows.filter(r=>r.families===1),rows.filter(r=>r.families>=2)];
 return ['| World families importing (direct) | Seams | Which |','|---|---|---|',
  ...[['0',g[0]],['1',g[1]],['2+',g[2]]].map(([k,l])=>`| ${k} | ${l.length} | ${l.map(r=>r.id).join(', ')||'none'} |`)].join('\n');
}
export const BEGIN='<!-- BEGIN GENERATED: seam_register -->';
export const END='<!-- END GENERATED: seam_register -->';
export function renderBlock(rows) {
 const note='One hop through shared adapters: not computed (lane H marked those rows inferred but defined no rule). Receipt column shows the first cited path only; full locators are in `PROOF` in `scripts/seam_register.mjs`.';
 return `${BEGIN}\n\n${renderTally(rows)}\n\n${renderTable(rows)}\n\n${note}\n\n${END}`;
}
export function replaceBlock(doc,block) {
 const a=doc.indexOf(BEGIN),b=doc.indexOf(END);
 if(a<0||b<a) throw new Error('docs/SEAM_REGISTER.md is missing the BEGIN/END markers');
 return doc.slice(0,a)+block+doc.slice(b+END.length);
}
export function isStale(doc,rows) {
 return replaceBlock(doc,renderBlock(rows))!==doc;
}

function walk(dir,exts,out=[]) {
 for(const e of readdirSync(dir,{withFileTypes:true})) {
  const p=path.join(dir,e.name);
  if(e.isDirectory()) walk(p,exts,out);
  else if(exts.some(x=>e.name.endsWith(x))) out.push(p);
 }
 return out;
}
export function loadRepo(root) {
 const files=new Map();
 for(const [d,exts] of [['src',['.js']],['tests',['.js','.mjs']],['scripts',['.js','.mjs']]]) {
  const full=path.join(root,d);
  if(!existsSync(full)||!statSync(full).isDirectory()) continue;
  for(const f of walk(full,exts)) files.set(path.relative(root,f).split(path.sep).join('/'),readFileSync(f,'utf8'));
 }
 return files;
}

function main() {
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
 const {rows,missing}=scan(loadRepo(root));
 const docPath=path.join(root,'docs/SEAM_REGISTER.md');
 const args=process.argv.slice(2);
 if(missing.length) console.error(`seam_register: curated files not found: ${[...new Set(missing)].join(', ')}`);
 if(args.includes('--write')) {
  writeFileSync(docPath,replaceBlock(readFileSync(docPath,'utf8'),renderBlock(rows)));
  console.log(`wrote ${path.relative(root,docPath)} (${rows.length} seams)`);
 } else if(args.includes('--check')) {
  if(missing.length||isStale(readFileSync(docPath,'utf8'),rows)) {
   console.error('docs/SEAM_REGISTER.md is stale or names missing modules. Run: node scripts/seam_register.mjs --write');
   process.exit(1);
  }
  console.log('seam register is current');
 } else console.log(renderBlock(rows));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) main();
