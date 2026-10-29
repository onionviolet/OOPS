#!/usr/bin/env node
// CLR1/CLR2: compile cited whole-book dialogue steps into private pack rows.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildPackJoin} from './build_crosswalk.mjs';
import {shardIndex} from './cite_paragraphs.mjs';
import {parseLocator} from './world_profiles.mjs';

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

const escapeRe = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function namedSpeaker(paragraphs, people, namesById, nameIds) {
  const found = new Map(); let ambiguous = false;
  for (const paragraph of paragraphs) for (const id of people) for (const name of namesById.get(id) || []) {
    if (name.length < 2) continue;
    const n = escapeRe(name);
    const cue = new RegExp(`(?:${n})[^。！？!?;；\\n]{0,18}(?:说(?:道)?|问(?:道)?|回答|答道|表示|said|asked|replied|answered|told)`, 'i');
    if (!cue.test(paragraph.text)) continue;
    if ((nameIds.get(norm(name))?.size || 0) > 1) { ambiguous = true; continue; }
    found.set(id, paragraph.locator);
  }
  return !ambiguous && found.size === 1 ? {id:[...found.keys()][0],locator:[...found.values()][0]} : null;
}
export function buildTopicTalks({scenes, crosswalk, registry, pack, paragraphIndex = null}) {
  const join = buildPackJoin({crosswalk, registry, pack});
  const names = new Map(), namesById = new Map();
  const addName = (value, id) => {
    if (!human(value)) return;
    const normalized = norm(value), ids = names.get(normalized) || new Set(); ids.add(id); names.set(normalized, ids);
    const values = namesById.get(id) || new Set(); values.add(String(value).normalize('NFKC')); namesById.set(id, values);
  };
  for (const p of pack.people || []) for (const v of [p.id,p.indexId,p.name,p.label,...(p.aliases||[])]) addName(v,p.id);
  for (const r of registry.filter(x => x.kind === 'person')) for (const v of [r.id,r.label,r.zh,...(r.aliases||[])]) if (human(v)) {
    const resolved = join.resolvePerson(r.id); if (resolved) addName(v,resolved);
  }
  const rows = [], rejectedRows = [], rejected = {notFamily:0, unresolvedPerson:0, unresolvedPlace:0, ambiguousPerson:0, unclearSpeaker:0};
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
      const mentioned = people.filter(id => [...names].some(([n,ids])=>ids.size===1 && ids.has(id) && n.length>2 && (` ${text} `).includes(` ${n} `)));
      const ambiguousMention = [...names].some(([n,ids])=>ids.size>1 && n.length>2 && (` ${text} `).includes(` ${n} `));
      if (!people.length) {
        rejected.unresolvedPerson++;
        const unresolved=(scene.present||[]).filter(human).filter(id=>!join.resolvePerson(id) && id!==pack.leadLife?.actorId);
        rejectedRows.push({stepId,reason:'unresolvedPerson',missing:[{kind:'person',value:unresolved.length===1?unresolved[0]:null},...(!place?[{kind:'place',value:scene.place||null}]:[])],otherBlockers:['speaker attribution not checked']});
        continue;
      }
      let speaker = mentioned.length === 1 && people.length === 1 ? {id:mentioned[0],locator:null} : null;
      if (!speaker && paragraphIndex) {
        const paragraphs = (scene.evidence || []).flatMap(ev => {
          const parsed = parseLocator(ev.locator || '');
          if (!parsed) return [];
          const paragraph = paragraphIndex.get(`${parsed.book}:${parsed.ch}:${parsed.p}`);
          return paragraph ? [{text:paragraph,locator:ev.locator}] : [];
        });
        speaker = namedSpeaker(paragraphs, people, namesById, names);
      }
      if (!speaker) { const reason=ambiguousMention || mentioned.length > 1 || people.length > 1 ? 'ambiguousPerson' : 'unclearSpeaker';rejected[reason]++;rejectedRows.push({stepId,reason,missing:!place?[{kind:'place',value:scene.place||null}]:[],otherBlockers:['speaker attribution']});continue; }
      if (!place) { rejected.unresolvedPlace++; rejectedRows.push({stepId,reason:'unresolvedPlace',missing:[{kind:'place',value:scene.place||null}]}); continue; }
      const personId = speaker.id, d = duration(original), label = topicLabel(original);
      const row = {id:`topic.${key(stepId)}`, sourceStepId:stepId, personId, topicId:`topic.${key(stepId)}`, label,
        description:`Discuss ${label.charAt(0).toLowerCase()+label.slice(1)} with ${labelOf(personId,registry,pack)}.`, minutes:d.minutes, minutesBasis:d.basis,
        place, choices:[{id:'canon',label:'Follow the recorded exchange',report:`You ${String(original.verb||'discuss the matter').toLowerCase()} with ${labelOf(personId,registry,pack)}.`,
          effects:effectsFor({...original,id:stepId},personId,locator,registry), source:{label:original.label||'U',locator}}], source:{label:original.label||'U',locator}};
      if (speaker.locator) row.speakerEvidence={basis:'paragraph-explicit-speaker-cue',label:scene.evidence.find(e=>e.locator===speaker.locator)?.label||'S',locator:speaker.locator};
      if (Number.isInteger(scene.timeOfDay?.hour) && scene.timeOfDay.hour>=0 && scene.timeOfDay.hour<24) row.hour=scene.timeOfDay.hour;
      rows.push(row); perVolume[volume]=(perVolume[volume]||0)+1;
    }
  }
  return {rows, rejected, rejectedRows, perVolume, familyStepsByVolume};
}

function main(args) {
  const get = k => { const i=args.indexOf(k); if(i<0||!args[i+1]) throw Error(`Missing ${k}`); return args[i+1]; };
  const scenes=readJsonl(get('--scenes')), registry=readJsonl(get('--registry'));
  const crosswalk=JSON.parse(fs.readFileSync(get('--crosswalk'),'utf8'));
  const input=JSON.parse(fs.readFileSync(get('--pack'),'utf8'));
  const sourceDir=args.includes('--source-dir') ? args[args.indexOf('--source-dir')+1] : null;
  const result=buildTopicTalks({scenes,crosswalk,registry,pack:input,paragraphIndex:sourceDir?shardIndex(sourceDir):null});
  const pack=structuredClone(input); pack.topicTalks={talks:result.rows};
  const out=get('--out'), report=get('--report'); fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify(pack,null,2)+'\n');
  fs.writeFileSync(report,JSON.stringify({schema:'topic-talk-build-report/2',rows:result.rows.length,perVolume:result.perVolume,familyStepsByVolume:result.familyStepsByVolume,rejected:result.rejected,rejectedRows:result.rejectedRows},null,2)+'\n');
  console.log(JSON.stringify({rows:result.rows.length,perVolume:result.perVolume,familyStepsByVolume:result.familyStepsByVolume,rejected:result.rejected}));
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) main(process.argv.slice(2));
