#!/usr/bin/env node
// CLR1/CLR2: compile cited whole-book dialogue steps into private pack rows.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildPackJoin} from './build_crosswalk.mjs';

const readJsonl = p => fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const family = /\b(speak\w*|ask\w*|agree\w*|agreed|refus\w*|direct\w*|inform\w*|tell\w*|said|say\w*|answer\w*|discuss\w*)\b/i;
const human = x => typeof x === 'string' && x.trim() && !/^(?:unknown|unstated|unspecified|none|null|u|\?)$/i.test(x.trim());
const norm = s => String(s || '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const key = s => String(s).replace(/[^a-zA-Z0-9_.-]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
const labelOf = (id, registry, pack) => {
  const r = registry.find(x => x.id === id); const p = pack.people.find(x => x.id === id || x.indexId === id);
  return r?.label || r?.zh || p?.name || p?.label || id;
};
function duration(step) {
  for (const n of [step.minutes, step.durationMinutes, step.duration?.minutes]) if (Number.isInteger(n) && n > 0) return {minutes:n, basis:'step duration'};
  return {minutes:1, basis:'fill'};
}
function topicLabel(step) {
  const value = String(step.object || step.verb || '').replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '');
  return value ? value[0].toUpperCase() + value.slice(1) : 'Discuss the matter';
}
function effectsFor(step, personId, locator, registry) {
  const outputs = Array.isArray(step.outputs) ? step.outputs.filter(human) : [];
  const gains = Array.isArray(step.gains) ? step.gains.filter(human) : [];
  const effects = [];
  const knowledgeValue = [...outputs, ...gains].join('; ');
  if (knowledgeValue) effects.push({type:'knowledge', actor:personId, key:`topic.talk.${key(step.id)}.result`, value:knowledgeValue,
    stage:'seen', basis:{kind:'observation', at:locator || 'U', attributedTo:personId}});
  const stance = String(step.verb || '').match(/\b(agree|refus\w*|declin\w*|accept\w*|consent\w*)\b/i)?.[0];
  if (stance) effects.push({type:'relationship', actor:personId, target:'player', axis:'trust', amount:/agree|accept|consent/i.test(stance)?1:-1,
    text:`Fill: stance during ${topicLabel(step).toLowerCase()}.`});
  return effects;
}

export function buildTopicTalks({scenes, crosswalk, registry, pack}) {
  const join = buildPackJoin({crosswalk, registry, pack});
  const names = new Map();
  for (const p of pack.people || []) for (const v of [p.id,p.indexId,p.name,p.label]) if (human(v)) names.set(norm(v), p.id);
  for (const r of registry.filter(x => x.kind === 'person')) for (const v of [r.id,r.label,r.zh,...(r.aliases||[])]) if (human(v)) {
    const resolved = join.resolvePerson(r.id); if (resolved) names.set(norm(v), resolved);
  }
  const rows = [], rejected = {notFamily:0, unresolvedPerson:0, unresolvedPlace:0, ambiguousPerson:0, unclearSpeaker:0};
  const perVolume = {}, familyStepsByVolume = {};
  for (const scene of scenes.filter(s => s.pov === 'lead').sort((a,b)=>(a.order||0)-(b.order||0))) {
    const locator = scene.evidence?.[0]?.locator || null;
    const place = join.resolvePlace(scene.place).id;
    for (const [i, original] of (scene.steps || []).entries()) {
      const stepId = `${scene.beat}#${i+1}`;
      if (!family.test(`${original.verb||''} ${original.object||''}`)) { rejected.notFamily++; continue; }
      const volume=Number(/\bb(\d+)\b/.exec(locator||'')?.[1]||1);
      familyStepsByVolume[volume]=(familyStepsByVolume[volume]||0)+1;
      const text = norm(`${original.verb||''} ${original.object||''}`);
      const people = [...new Set((scene.present||[]).filter(human).map(id=>join.resolvePerson(id)).filter(id=>id && id!==pack.leadLife?.actorId))];
      const mentioned = people.filter(id => {
        const candidate = [...names].filter(([,pid])=>pid===id).map(([n])=>n).sort((a,b)=>b.length-a.length).find(n=>n.length>2 && (` ${text} `).includes(` ${n} `));
        return !!candidate;
      });
      if (!people.length) { rejected.unresolvedPerson++; continue; }
      if (mentioned.length !== 1 || people.length !== 1) { rejected[mentioned.length > 1 || people.length > 1 ? 'ambiguousPerson' : 'unclearSpeaker']++; continue; }
      if (!place) { rejected.unresolvedPlace++; continue; }
      const personId = mentioned[0], d = duration(original), label = topicLabel(original);
      const row = {id:`topic.${key(stepId)}`, sourceStepId:stepId, personId, topicId:`topic.${key(stepId)}`, label,
        description:`Discuss ${label.charAt(0).toLowerCase()+label.slice(1)} with ${labelOf(personId,registry,pack)}.`, minutes:d.minutes, minutesBasis:d.basis,
        place, choices:[{id:'canon',label:'Follow the recorded exchange',report:`You ${String(original.verb||'discuss the matter').toLowerCase()} with ${labelOf(personId,registry,pack)}.`,
          effects:effectsFor({...original,id:stepId},personId,locator,registry), source:{label:original.label||'U',locator}}], source:{label:original.label||'U',locator}};
      if (Number.isInteger(scene.timeOfDay?.hour) && scene.timeOfDay.hour>=0 && scene.timeOfDay.hour<24) row.hour=scene.timeOfDay.hour;
      rows.push(row); perVolume[volume]=(perVolume[volume]||0)+1;
    }
  }
  return {rows, rejected, perVolume, familyStepsByVolume};
}

function main(args) {
  const get = k => { const i=args.indexOf(k); if(i<0||!args[i+1]) throw Error(`Missing ${k}`); return args[i+1]; };
  const scenes=readJsonl(get('--scenes')), registry=readJsonl(get('--registry'));
  const crosswalk=JSON.parse(fs.readFileSync(get('--crosswalk'),'utf8'));
  const input=JSON.parse(fs.readFileSync(get('--pack'),'utf8'));
  const result=buildTopicTalks({scenes,crosswalk,registry,pack:input});
  const pack=structuredClone(input); pack.topicTalks={talks:result.rows};
  const out=get('--out'), report=get('--report'); fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify(pack,null,2)+'\n');
  fs.writeFileSync(report,JSON.stringify({schema:'topic-talk-build-report/1',rows:result.rows.length,perVolume:result.perVolume,familyStepsByVolume:result.familyStepsByVolume,rejected:result.rejected},null,2)+'\n');
  console.log(JSON.stringify({rows:result.rows.length,perVolume:result.perVolume,familyStepsByVolume:result.familyStepsByVolume,rejected:result.rejected}));
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) main(process.argv.slice(2));
