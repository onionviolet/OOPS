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
const locatorKey = locator => {
  const match = /(?:\bb(\d+)\s+)?第(\d+)章/.exec(locator || '');
  return match ? {volume:Number(match[1] || 1), chapter:Number(match[2])} : null;
};
const inLocatorRange = (locator, from, to) => {
  const key = locatorKey(locator);
  if (!key || !from || !to) return false;
  const compare = (a,b) => a.volume-b.volume || a.chapter-b.chapter;
  return compare(key, from) >= 0 && compare(key, to) <= 0;
};
const householdOperation = step => {
  const text = `${step.verb || ''} ${step.object || ''}`.toLowerCase();
  if (/\blook over\b/.test(text)) return 'inspect';
  if (/\bpay\b/.test(text)) return 'pay';
  if (/\blight\b/.test(text)) return 'use';
  if (/\bwash\b/.test(text)) return 'wash';
  if (/\bclean\b/.test(text)) return 'clean';
  if (/\bcheck\b/.test(text)) return 'inspect';
  if (/\beat\b/.test(text)) return 'consume';
  if (/\bput away\b/.test(text)) return 'store';
  if (/\btake\b/.test(text)) return 'take';
  return null;
};
const tokens = value => new Set(String(value || '').toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 2));
const genericActWords = new Set(['the','and','for','with','from','into','pay','light','wash','clean','check','eat','take','use','put','away','look','over','inspect']);
const TALK_VERB = /\b(talk\w*|speak\w*|ask\w*|tell\w*|answer\w*|discuss\w*|greet\w*|repl\w*|say\w*|said|chat\w*|convers\w*|meet\w*)\b/i;
const TRAVEL_VERB = /\b(walk\w*|stroll\w*|wander\w*|travel\w*|move\w*|go to|arrive\w*)\b/i;
const GREETING_VERB = /^(?:greet\w*\b|(?:talk|speak|chat|convers)\w*(?:\s+(?:to|with)\b|$)|say\s+hello\s+to\b)/i;
const inferredClass = (step, current) => {
  if (!['other','unknown',undefined,null,''].includes(current)) return current;
  if (TALK_VERB.test(step.verb || '')) return 'socialize';
  if (TRAVEL_VERB.test(step.verb || '')) return 'travel';
  return current || 'unknown';
};
function bestHouseholdAct(step, acts) {
  const operation = householdOperation(step);
  const candidates = (acts || []).filter(act => act?.id && act.operation === operation);
  if (!operation || !candidates.length) return null;
  const sourceTokens = new Set([...tokens(`${step.object || ''} ${step.verb || ''}`)].filter(t => !genericActWords.has(t)));
  const ranked = candidates.map(act => ({act, score:[...tokens(`${act.label} ${act.description}`)].filter(t => sourceTokens.has(t)).length}))
    .sort((a,b)=>b.score-a.score);
  if (ranked[0].score === 0 || (ranked[1] && ranked[0].score === ranked[1].score)) return null;
  return ranked[0].act;
}

function stepActorRole(step, packJoin, leadActorId, knownActors) {
  const actor = typeof step.actor === 'string' ? step.actor : step.actor?.id;
  if (!actor || /^(unknown|unstated|unspecified)$/i.test(actor)) return 'unknown';
  if (actor === 'lead') return 'lead';
  if (actor === 'non-lead') return 'non-lead';
  if (!leadActorId) return 'unknown';
  const resolved = actor === leadActorId || knownActors.has(actor) ? actor : packJoin?.resolvePerson(actor);
  return !resolved ? 'unknown' : resolved === leadActorId ? 'lead' : 'non-lead';
}

export function buildReplayMapping({scenes, crosswalk, fromChapter, toChapter, fromLocator, toLocator, controlIndex = {}, registry = [], pack = null}) {
  const packJoin = pack ? buildPackJoin({crosswalk, registry, pack}) : null;
  const knownActors = new Set((pack?.people || []).map(person=>person.id));
  const householdActs = pack?.householdActs?.acts || [];
  const topicTalks = Object.fromEntries((pack?.topicTalks?.talks || []).map(t => [t.sourceStepId, t]));
  // Every travelling pack place is a walk target in the be seat (cast host castMoves: `lotm.move.<placeId>`).
  // Principals the lead knows can be talked to (cast host castTalkCommands: `cast_talk_<last indexId segment>`).
  const talks = {...Object.fromEntries((pack?.people || []).filter(p => p?.id && p.tier === 'principal' && p.indexId).map(p => [p.id, `cast_talk_${p.indexId.split('.').at(-1)}`])), ...(controlIndex.talks || {})};
  const walks = {...Object.fromEntries((pack?.places || []).filter(p => p?.id && p.travel && !p.anchorOnly).map(p => [p.id, `lotm.move.${p.id}`])), ...(controlIndex.walks || {})};
  const selected = scenes.filter(s => s.pov === 'lead' && s.evidence?.length && s.evidence.some(e => fromLocator && toLocator
      ? inLocatorRange(e.locator, locatorKey(fromLocator), locatorKey(toLocator))
      : Number.isFinite(chapter(e.locator)) && chapter(e.locator) >= fromChapter && chapter(e.locator) <= toChapter))
    .sort((a,b) => a.order-b.order);
  const rows = []; let lastPlace = null, lastTimeKey = null;
  for (const scene of selected) for (const [i, step] of scene.steps.entries()) {
    const row = {id:`${scene.beat}#${i+1}`, scene:scene.beat, sourceVolume:locatorKey(scene.evidence?.[0]?.locator)?.volume || null, verb:step.verb, object:step.object || step.verb, class:inferredClass(step,step.class),
      actorRole:stepActorRole(step,packJoin,pack?.leadLife?.actorId,knownActors), actorBasis:step.actor ? 'step actor' : 'actor not supplied', scenePov:scene.pov,
      classBasis:'M4 step class', place:scene.place, time:{value:scene.timeOfDay?.value || null, date:scene.date || null},
      peoplePresent:(scene.present || []).map(p => typeof p === 'string' ? p : p?.kind === 'person' ? p.id : null).filter(Boolean),
      canonicalControl:null, lockedOptions:(scene.choices || []).flatMap(c => (c.options || []).filter(o => !o.taken).map(o => o.id)).filter(Boolean),
      status:'gap', gapKind:'missing UI path', reason:'No matching be-seat control is established by the supplied control index.',
      route:[], setup:[], anchors:{}, loses:[], codes:['CL269','ON3','ON5']};
    const joinedPlace = packJoin?.resolvePlace(scene.place);
    const placeId = joinedPlace?.id || crosswalk.places?.[scene.place];
    if (joinedPlace) { row.placeResolution = joinedPlace.rule; row.packPlaceId = joinedPlace.id; }
    else if (placeId) row.packPlaceId = placeId;
    row.peopleResolved = row.peoplePresent.map(id => ({readerId:id, packId:packJoin?.resolvePerson(id) || null}));
    // A scene location is not by itself the destination of an unrelated action.
    const destination = /^(?:return(?:s|ed)?|walk(?:s|ed)?|stroll(?:s|ed)?|wander(?:s|ed)?)(?:\s+back|\s+over)?\s+to\s+(.+?)[.!]?$/i.exec(step.verb || '')?.[1]
      || (/^walk(?:s|ed)?$/i.test(step.verb || '') && typeof step.object==='string' ? step.object : null);
    const destinationId = destination && (packJoin?.resolvePlace(destination)?.id || crosswalk.places?.[destination]);
    const moveId = placeId && destinationId === placeId && placeId !== lastPlace && walks[placeId];
    const possiblePeople = row.peoplePresent.filter(id => (packJoin?.resolvePerson(id) || id) !== pack?.leadLife?.actorId);
    const presentIds = [...new Set(possiblePeople.map(id => {
      const resolved=packJoin?.resolvePerson(id) || id;
      return talks[id] || talks[resolved];
    }).filter(Boolean))];
    const presentId = presentIds.length === 1 && possiblePeople.length === 1 ? presentIds[0] : null;
    const timeKey=scene.timeOfDay?.value && !/unknown|unstated|unspecified|^u$/i.test(scene.timeOfDay.value) ? scene.timeOfDay.value : null;
    const isTimeGap=i===0&&timeKey&&timeKey!==lastTimeKey;
    const actsHere = householdActs.filter(act => act.place === placeId);
    row.availableControls = {walk:walks[placeId] || null, walkInventory:Object.keys(walks).length>0, destinationResolved:!!destinationId && destinationId===placeId,
      talk:presentId || null, talkInventory:Object.keys(talks).length>0, talkCandidates:presentIds.length,
      resolvedNonLeadPeople:row.peopleResolved.filter(person=>person.packId && person.packId!==pack?.leadLife?.actorId).length,
      wait:controlIndex.waitPrefix || null, pay:actsHere.filter(act=>act.operation==='pay').map(act=>act.id)};
    const householdVerb = actsHere.length ? householdOperation(step) : null;
    const householdAct = householdVerb ? bestHouseholdAct(step, actsHere) : null;
    if (householdAct) {
      row.status='clean_fold'; row.gapKind=null; row.reason=null; row.canonicalControl=householdAct.id;
      row.controlBuilder='private pack householdActs; H1 be-seat inventory';
      row.route=[{actionId:householdAct.id, place:placeId, object:step.object || null}];
      row.anchors={...row.anchors,place:placeId};
      row.householdActId=householdAct.id;
    } else if (householdVerb) {
      const matchingActs=actsHere.filter(act=>act.operation===householdVerb);
      row.reason=matchingActs.length
        ? 'Household verb and place match, but the step object does not distinguish a pack act.'
        : 'No pack act supports this household verb at the step place.';
      row.householdGap=matchingActs.length ? 'object does not disambiguate act' : 'no act for verb at place';
      if(placeId) row.anchors.place=placeId;
    } else if (moveId) {
      row.status='clean_fold'; row.gapKind=null; row.reason=null; row.canonicalControl=moveId;
      row.controlBuilder='src/book_world_lotm_cast_host.js:castMoves; src/book_world_lotm_host.js:lotmMoveLabels';
      row.route=[{actionId:moveId, place:placeId, controlBuilder:row.controlBuilder}]; row.anchors.place=placeId;
      lastPlace=placeId;
    } else if (topicTalks[row.id]) {
      const talk = topicTalks[row.id];
      const choice = talk.choices?.[0];
      if (talk.personId && choice?.id) {
        row.status='clean_fold'; row.gapKind=null; row.reason=null; row.canonicalControl=`${talk.id}.${choice.id}`;
        row.controlBuilder='private pack topicTalks; src/cast_topic_talk.js';
        row.route=[{actionId:row.canonicalControl, place:talk.place || placeId || null, personId:talk.personId, controlBuilder:row.controlBuilder}];
        row.anchors={...row.anchors, ...(talk.place?{place:talk.place}:{}), person:talk.personId}; row.topicTalkId=talk.id;
      }
    } else if (presentId && GREETING_VERB.test(step.verb || '') && !/\b(about|regarding|concerning|explain|ask|tell|warn|persuad\w*|promis\w*|and then)\b/i.test(step.verb || '')) {
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
  return {schema:'lead-ui-replay/2', scope:{fromChapter,toChapter,fromLocator:fromLocator || null,toLocator:toLocator || null,sceneCount:selected.length,stepCount:rows.length},
    inputHashes:{scenes:hash(JSON.stringify(scenes)),crosswalk:hash(JSON.stringify(crosswalk))}, rows};
}

function main(args) {
  const get = key => { const i=args.indexOf(key); if(i<0||!args[i+1]) throw Error(`Missing ${key}`); return args[i+1]; };
  const inputScenes=get('--scenes'), inputCrosswalk=get('--crosswalk'), output=get('--out');
  const fromLocator=args.includes('--from-locator') ? get('--from-locator') : null;
  const toLocator=args.includes('--to-locator') ? get('--to-locator') : null;
  if (Boolean(fromLocator) !== Boolean(toLocator)) throw Error('--from-locator and --to-locator must be provided together');
  const fromChapter=Number(args.includes('--from') ? get('--from') : NaN),toChapter=Number(args.includes('--to') ? get('--to') : NaN);
  const scenes=readJsonl(inputScenes),crosswalk=JSON.parse(fs.readFileSync(inputCrosswalk,'utf8'));
  const controlIndex=JSON.parse(fs.readFileSync(get('--controls'),'utf8'));
  const registry=readJsonl(get('--registry'));
  const pack=JSON.parse(fs.readFileSync(get('--pack'),'utf8'));
  if (!fromLocator && (!Number.isFinite(fromChapter) || !Number.isFinite(toChapter))) throw Error('Provide --from/--to or --from-locator/--to-locator');
  const mapping=buildReplayMapping({scenes,crosswalk,fromChapter,toChapter,fromLocator,toLocator,controlIndex,registry,pack});
  fs.mkdirSync(path.dirname(output),{recursive:true}); fs.writeFileSync(output,JSON.stringify(mapping,null,2)+'\n');
  const counts={walk:0,wait:0,talk:0,householdActs:{},householdGapsByReason:{},gapByVerbClass:{}};
  for(const r of mapping.rows){if(r.householdActId)counts.householdActs[r.householdActId]=(counts.householdActs[r.householdActId]||0)+1;else if(r.householdGap)counts.householdGapsByReason[r.householdGap]=(counts.householdGapsByReason[r.householdGap]||0)+1;else if(r.canonicalControl?.startsWith('lotm.move.'))counts.walk++;else if(r.waitIntent)counts.wait++;else if(r.canonicalControl?.startsWith('cast_talk_'))counts.talk++;else counts.gapByVerbClass[r.class||'unknown']=(counts.gapByVerbClass[r.class||'unknown']||0)+1;}
  const totals={placeStepRefs:0,placeResolvedStepRefs:0,personStepRefs:0,personResolvedStepRefs:0}, unresolvedPlaces=new Map(), unresolvedPeople=new Map();
  for(const r of mapping.rows){if(r.place){totals.placeStepRefs++;if(r.packPlaceId)totals.placeResolvedStepRefs++;else unresolvedPlaces.set(r.place,(unresolvedPlaces.get(r.place)||0)+1)}for(const p of r.peopleResolved||[]){totals.personStepRefs++;if(p.packId)totals.personResolvedStepRefs++;else unresolvedPeople.set(p.readerId,(unresolvedPeople.get(p.readerId)||0)+1)}}
  const talkCandidateSteps=mapping.rows.filter(r=>/talk|speak|ask|tell|answer|discuss/i.test(r.verb)&&r.peopleResolved?.some(p=>p.packId)).length;
  console.log(JSON.stringify({sceneCount:mapping.scope.sceneCount,stepCount:mapping.scope.stepCount,...counts,talkCandidateSteps,resolution:{...totals,placeRate:totals.placeResolvedStepRefs/totals.placeStepRefs,personRate:totals.personResolvedStepRefs/totals.personStepRefs,topUnresolvedPlaceIds:[...unresolvedPlaces].sort((a,b)=>b[1]-a[1]).slice(0,20),topUnresolvedPersonIds:[...unresolvedPeople].sort((a,b)=>b[1]-a[1]).slice(0,20)}},null,2));
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) main(process.argv.slice(2));
