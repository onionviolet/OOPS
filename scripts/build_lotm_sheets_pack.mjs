// Copies the private L8 character sheets into the runtime pack private_packs/lotm-sheets/sheets.json, keyed by cast person id
// (sheet.links.cast). Usage: node scripts/build_lotm_sheets_pack.mjs [sheetsDir]. The pack is gitignored; add
// "lotm-sheets/sheets.json" to private_packs/manifest.json supplements to load it (a pack revision, P1 procedure).
import {readdirSync,readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const dir=process.argv[2]??'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/character-sheets';
const sheets={};let skipped=0;
for(const name of readdirSync(dir).filter(n=>n.endsWith('.json'))){
 const sheet=JSON.parse(readFileSync(join(dir,name),'utf8')),cast=sheet.links?.cast;
 if(typeof cast!=='string'||!cast){skipped++;continue;}
 sheets[cast]=sheet;
}
mkdirSync('private_packs/lotm-sheets',{recursive:true});
writeFileSync('private_packs/lotm-sheets/sheets.json',JSON.stringify({schema:1,sheets}));
console.log(`${Object.keys(sheets).length} sheets keyed by cast id, ${skipped} without a cast link`);
