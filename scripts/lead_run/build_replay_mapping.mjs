#!/usr/bin/env node
// CLR3: public deterministic mapper. Inputs and emitted canon IDs stay in private packs.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {GAP_KINDS} from '../headless/lead_runs/lotm_ui_replay.mjs';
import {buildPackJoin} from './build_crosswalk.mjs';

const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const readJsonl = p => fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const chapter = locator => Number(/第(\d+)章/.exec(locator || '')?.[1] || Infinity);
const rangeOf = rows => rows.flatMap(s => (s.evidence || []).map(e => chapter(e.locator))).filter(Number.isFinite);

export function buildReplayMapping({scenes, crosswalk, fromChapter, toChapter, controlIndex = {}, registry = [], pack = null}) {
  const packJoin = pack ? buildPackJoin({crosswalk, registry, pack}) : null;
  const selected = scenes.filter(s => s.pov === 'lead' && s.evidence?.length && rangeOf([s]).some(n => n >= fromChapter && n <= toChapter))
    .sort((a,b) => a.order-b.order);
  const rows = []; let lastPlace = null, lastTimeKey = null;
  for (const scene of selected) for (const [i, step] of scene.steps.entries()) {
    const row = {id:`${scene.beat}#${i+1}`, scene:scene.beat, verb:step.verb, object:step.verb, class:step.class,
      classBasis:'M4 step class', place:scene.place, time:{value:scene.timeOfDay?.value || null, date:scene.date || null},
      peoplePresent:(scene.present || []).map(p => typeof p === 'string' ? p : p?.kind === 'person' ? p.id : null).filter(Boolean),
      canonicalControl:null, lockedOptions:(scene.choices || []).flatMap(c => (c.options || []).filter(o => !o.taken).map(o => o.id)).filter(Boolean),
      status:'gap', gapKind:'missing UI path', reason:'No matching be-seat control is established by the supplied control index.',
      route:[], setup:[], anchors:{}, loses:[], codes:['CL269','ON3','ON5']};
    const joinedPlace = packJoin?.resolvePlace(scene.place);
    const placeId = joinedPlace?.id || crosswalk.places?.[scene.place];
    if (joinedPlace) { row.placeResolution = joinedPlace.rule; row.packPlaceId = joinedPlace.id; }
    row.peopleResolved = row.peoplePresent.map(id => ({readerId:id, packId:packJoin?.resolvePerson(id) || null}));
    const moveId = placeId && placeId !== lastPlace && /walk|travel|move|go to|arrive/i.test(step.verb) && controlIndex.walks?.[placeId];
    const presentId = row.peoplePresent.map(id => controlIndex.talks?.[id] || controlIndex.talks?.[packJoin?.resolvePerson(id)]).find(Boolean);
    const timeKey=scene.timeOfDay?.value && !/unknown|unstated|unspecified|^u$/i.test(scene.timeOfDay.value) ? scene.timeOfDay.value : null;
    const isTimeGap=i===0&&timeKey&&timeKey!==lastTimeKey;
    if (moveId) {
      row.status='clean_fold'; row.gapKind=null; row.reason=null; row.canonicalControl=moveId;
      row.controlBuilder='src/book_world_lotm_cast_host.js:castMoves; src/book_world_lotm_host.js:lotmMoveLabels';
      row.route=[{actionId:moveId, place:placeId, controlBuilder:row.controlBuilder}]; row.anchors.place=placeId;
      lastPlace=placeId;
    } else if (presentId && /talk|speak|ask|tell|answer|discuss/i.test(step.verb)) {
      row.status='clean_fold'; row.gapKind=null; row.reason=null; row.canonicalControl=presentId;
      row.controlBuilder='src/book_world_lotm_cast_host.js:castTalkCommands';
      row.route=[{actionId:presentId, place:placeId || null, controlBuilder:row.controlBuilder}]; if (placeId) row.anchors.place=placeId;
    } else if (isTimeGap && controlIndex.waitPrefix) {
      row.status='gap'; row.gapKind='missing UI path';
      row.reason='A wait intention is identified, but M4 has no numeric replay window for the be driver.';
      row.canonicalControl=`${controlIndex.waitPrefix}{at}`; row.waitIntent=timeKey;
      row.controlBuilder='src/wait_until.js:waitUntilOptions';
      row.routeMode='wait'; row.method='wait'; row.route=[]; if(placeId)row.anchors.place=placeId;
    } else {
      row.gapKind=GAP_KINDS.includes('missing verb') ? 'missing verb' : 'missing UI path';
      row.reason=`No mapped be-seat control for verb class ${step.class || 'unknown'}.`;
    }
    rows.push(row);
    if(i===scene.steps.length-1)lastTimeKey=timeKey;
  }
  return {schema:'lead-ui-replay/2', scope:{fromChapter,toChapter,sceneCount:selected.length,stepCount:rows.length},
    inputHashes:{scenes:hash(JSON.stringify(scenes)),crosswalk:hash(JSON.stringify(crosswalk))}, rows};
}

function main(args) {
  const get = key => { const i=args.indexOf(key); if(i<0||!args[i+1]) throw Error(`Missing ${key}`); return args[i+1]; };
  const inputScenes=get('--scenes'), inputCrosswalk=get('--crosswalk'), output=get('--out');
  const fromChapter=Number(get('--from')),toChapter=Number(get('--to'));
  const scenes=readJsonl(inputScenes),crosswalk=JSON.parse(fs.readFileSync(inputCrosswalk,'utf8'));
  const controlIndex=JSON.parse(fs.readFileSync(get('--controls'),'utf8'));
  const registry=readJsonl(get('--registry'));
  const pack=JSON.parse(fs.readFileSync(get('--pack'),'utf8'));
  const mapping=buildReplayMapping({scenes,crosswalk,fromChapter,toChapter,controlIndex,registry,pack});
  fs.mkdirSync(path.dirname(output),{recursive:true}); fs.writeFileSync(output,JSON.stringify(mapping,null,2)+'\n');
  const counts={walk:0,wait:0,talk:0,gapByVerbClass:{}};
  for(const r of mapping.rows){if(r.canonicalControl?.startsWith('lotm.move.'))counts.walk++;else if(r.waitIntent)counts.wait++;else if(r.peoplePresent.some(p=>controlIndex.talks?.[p]===r.canonicalControl))counts.talk++;else counts.gapByVerbClass[r.class||'unknown']=(counts.gapByVerbClass[r.class||'unknown']||0)+1;}
  const totals={placeStepRefs:0,placeResolvedStepRefs:0,personStepRefs:0,personResolvedStepRefs:0}, unresolvedPlaces=new Map(), unresolvedPeople=new Map();
  for(const r of mapping.rows){if(r.place){totals.placeStepRefs++;if(r.packPlaceId)totals.placeResolvedStepRefs++;else unresolvedPlaces.set(r.place,(unresolvedPlaces.get(r.place)||0)+1)}for(const p of r.peopleResolved||[]){totals.personStepRefs++;if(p.packId)totals.personResolvedStepRefs++;else unresolvedPeople.set(p.readerId,(unresolvedPeople.get(p.readerId)||0)+1)}}
  const talkCandidateSteps=mapping.rows.filter(r=>/talk|speak|ask|tell|answer|discuss/i.test(r.verb)&&r.peopleResolved?.some(p=>p.packId)).length;
  console.log(JSON.stringify({sceneCount:mapping.scope.sceneCount,stepCount:mapping.scope.stepCount,...counts,talkCandidateSteps,resolution:{...totals,placeRate:totals.placeResolvedStepRefs/totals.placeStepRefs,personRate:totals.personResolvedStepRefs/totals.personStepRefs,topUnresolvedPlaceIds:[...unresolvedPlaces].sort((a,b)=>b[1]-a[1]).slice(0,20),topUnresolvedPersonIds:[...unresolvedPeople].sort((a,b)=>b[1]-a[1]).slice(0,20)}},null,2));
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) main(process.argv.slice(2));
