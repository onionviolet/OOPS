// R20 synthetic combat fixtures: 1, 3, 5, 8 and 9 opponents, cloned from the parity-r9
// populated-three save (as check-r7-edge did for eight). Health varies per opponent so each one
// stays distinguishable; the 5 and 9 cases include a defeated opponent (health 0).
// Synthetic only: no personal save is read. Usage: node r20-fixtures.cjs
const fs=require('fs'),path=require('path');
const src=JSON.parse(fs.readFileSync(path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),'utf8'));
const out=path.join(__dirname,'evidence/r20/fixtures');fs.mkdirSync(out,{recursive:true});
for(const n of [1,3,5,8,9]){
    const s=structuredClone(src),base=src.native_encounter.enemies;
    s.native_encounter.enemies=Array.from({length:n},(_,i)=>{const e=structuredClone(base[i%base.length]);e.key=`r20-${n}:${i}`;e.full.health=Math.max(0,20-((i*3)%17));if((n===5&&i===1)||(n===9&&i===4))e.full.health=0;e.alive=e.full.health>0;return e;});
    s.native_encounter.turns.defenders=Array(n).fill(0);if(n!==3)s.native_encounter.loops={};
    fs.writeFileSync(path.join(out,`opponents-${n}.save.txt`),JSON.stringify(s));
}
// Mixed: eight opponents of three kinds (stats as in the source; only names differ).
{const s=structuredClone(src),base=src.native_encounter.enemies,kinds=['Starving wolf rat','Wolf rat','Elite wolf rat'];
    s.native_encounter.enemies=Array.from({length:8},(_,i)=>{const e=structuredClone(base[i%base.length]);e.template=kinds[i%3];e.key=`r20-8m:${i}`;e.full.health=20-i*2;e.alive=true;return e;});
    s.native_encounter.turns.defenders=Array(8).fill(0);s.native_encounter.loops={};fs.writeFileSync(path.join(out,'opponents-8-mixed.save.txt'),JSON.stringify(s));}
console.log('wrote',fs.readdirSync(out).join(' '));
