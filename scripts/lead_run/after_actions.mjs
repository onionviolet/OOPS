// CL61: mine targeted lead-scene actions and the target's next shared scene.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseLocator} from './world_profiles.mjs';
import {classifyAction} from './build_crosswalk.mjs';

const read = p => readFileSync(p, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const chapter = s => { for (const e of s.evidence || []) {const p=parseLocator(e.locator);if(p)return p;} return null; };
const inSlice = (s, book) => {const p=chapter(s);return book==='lotm'?p?.lang==='zh'&&p.ch>=1&&p.ch<=24:p?.lang==='en'&&p.book===1&&(p.ch<5||(p.ch===5&&p.p<=9));};
const stepClass = x => x.class && x.class !== 'other' ? x.class : classifyAction(x.verb || '');
const dominantClass = s => {
  const classes=(s.steps||[]).map(stepClass).filter(Boolean);
  if(!classes.length) return null;
  const counts=new Map(); for(const c of classes) counts.set(c,(counts.get(c)||0)+1);
  return [...counts].sort((a,b)=>b[1]-a[1])[0][0];
};
const responseClass = s => (s.steps||[]).map(stepClass).find(Boolean) ||
  (s.outcomes||[]).map(o=>o.class && o.class!=='changed'?o.class:classifyAction(`${o.verb||''} ${o.fact||''}`)).find(Boolean) || null;
export function afterActions(scenes, book) {
  const selected=scenes.filter(s=>s.pov==='lead'&&inSlice(s,book));
  const actorId=book==='lotm'?'lotm.person.klein-moretti':'mol.person.zorian-kazinski';
  const out=[];
  selected.forEach((s,i)=>{
    for(const option of (s.options||[])) {
      const targets=(option.needs||[]).filter(id=>id!==actorId&&/\.person\./.test(id));
      if(!targets.length) continue;
      const trigger=classifyAction(option.action||'')||option.class||null;
      if(!trigger) continue;
      for(const target of targets){
        const next=selected.slice(i+1).find(n=>(n.present||[]).includes(actorId)&&(n.present||[]).includes(target));
      if(!next) continue;
        const np=chapter(next), sp=chapter(s);
        const response=responseClass(next);
        out.push({actor:actorId,target,triggerClass:trigger,responseClass:response,basis:'option',gapScenes:selected.indexOf(next)-i,
          scenes:[s.beat,next.beat],locators:[...(s.evidence||[]).map(x=>x.locator),...(next.evidence||[]).map(x=>x.locator)].filter(Boolean),
          sourceChapters:[sp?.ch,np?.ch]});
      }
    }
    const trigger=dominantClass(s);
    if(trigger) for(const target of (s.present||[]).filter(id=>id!==actorId&&/\.person\./.test(id))) {
      const next=selected.slice(i+1).find(n=>(n.present||[]).includes(actorId)&&(n.present||[]).includes(target));
      if(!next) continue;
      const np=chapter(next), sp=chapter(s);
      out.push({actor:actorId,target,triggerClass:trigger,responseClass:responseClass(next),basis:'copresence',gapScenes:selected.indexOf(next)-i,
        scenes:[s.beat,next.beat],locators:[...(s.evidence||[]).map(x=>x.locator),...(next.evidence||[]).map(x=>x.locator)].filter(Boolean),
        sourceChapters:[sp?.ch,np?.ch]});
    }
  });
  return out.filter((row,i)=>out.findIndex(x=>x.basis===row.basis&&x.actor===row.actor&&x.target===row.target&&x.scenes[0]===row.scenes[0]&&x.scenes[1]===row.scenes[1])===i);
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const [book,dir,out=join(dir,'after_actions.jsonl')]=process.argv.slice(2);
 if(!['lotm','mol'].includes(book)||!dir)throw new Error('usage: after_actions.mjs lotm|mol <mergedDir> [out.jsonl]');
 const rows=afterActions(read(join(dir,'scenes.jsonl')),book);mkdirSync(dirname(out),{recursive:true});
 writeFileSync(out,rows.map(x=>JSON.stringify(x)).join('\n')+(rows.length?'\n':''));
 const counts=Object.fromEntries([...new Set(rows.map(x=>x.triggerClass))].sort().map(k=>[k,rows.filter(x=>x.triggerClass===k).length]));
 const reacts=read(join(dir,'extras.jsonl')).filter(x=>x.extra==='people').flatMap(x=>x.reacts||[]).filter(r=>inSlice({evidence:[{locator:r.locator}]},book));
 const unplaced=reacts.filter(r=>!classifyAction(r.to)).length;
 console.log(`book=${book} pairs=${rows.length} triggers=${JSON.stringify(counts)} reactsUnplaced=${unplaced}/${reacts.length} output=${out}`);
}
