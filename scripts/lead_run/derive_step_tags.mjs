#!/usr/bin/env node
// LSD190-LSD194, LSD202, LSD205: derive step tags by script (no model call) into a sidecar keyed by step id.
// A tag carries a basis; `weak` marks a default that nothing in the text supports. A reader's own 1.5 field wins (LSD151 union rule).
// Public and name-free: canon ids come in through --scenes, --registry and --lead and stay in private output.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {familyOf} from './gap_census.mjs';

export const KIND_RULES = [
  {kind:'think', head:/^(think|ponder|wonder|consider|realize|realise|recall|remember|deduce|infer|decide|plan|suspect|doubt|hesitate|worry|fear|reflect|reason|weigh|guess|conclude|dream|imagine|resolve|recognize|recognise|budget|calculate|estimate)\w*\b/i},
  {kind:'perceive', head:/^(notice|see|hear|watch|observe|sense|feel|glimpse|spot|overhear|smell|witness|look|listen|glance|perceive|detect)\w*\b/i},
  {kind:'speak', head:/^(say|tell|told|ask|answer|reply|greet|talk|speak|shout|whisper|explain|introduce|call out|question|discuss|chat|warn|promise|thank|apologi[sz]e|dictate|request)\w*\b/i},
  {kind:'report', head:/^(report|announce|relay|inform|narrate|recount|describe)\w*\b/i},
];
/** Kinds that write knowledge or journal lines rather than a button (LSD172); `speak` is an action. */
export const NOT_PLAYED_KINDS = Object.freeze(['think', 'perceive', 'report', 'narration']);
const ROUTINE = /\b(every|each (day|morning|evening|night|week)|daily|nightly|weekly|usually|habitual\w*|routine|as usual|regularly|always)\b/i;
const REPEATED = /\b(again|repeatedly|several times|over and over|keep|continue\w*|once more|multiple)\b/i;

const norm = s => String(s || '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
export function nameIndex(registry, leadId) {
  const index = new Map();
  for (const r of registry || []) {
    if (r.kind && r.kind !== 'person') continue;
    for (const name of [r.label, ...(r.aliases || [])]) { const n = norm(name); if (n.length > 2 && !index.has(n)) index.set(n, r.id); }
  }
  return {resolve: name => index.get(norm(name)) || null, leadId};
}

export function kindOf(step) {
  const verb = String(step.verb || '').trim();
  const rule = KIND_RULES.find(r => r.head.test(verb));
  return rule ? {kind: rule.kind, basis: 'verb-lexicon'} : {kind: 'act', basis: 'verb-default', weak: true};
}
export function habitOf(step) {
  const text = `${step.verb || ''} ${step.object || ''}`;
  if (ROUTINE.test(text)) return {habit: 'routine', basis: 'frequency-lexicon'};
  if (REPEATED.test(text)) return {habit: 'repeated', basis: 'frequency-lexicon'};
  return null;
}
export function actorOf(step, scene, names) {
  if (step.actor) return {actor: typeof step.actor === 'string' ? step.actor : step.actor.id, basis: 'reader', source: 'reader'};
  const lead = names.leadId;
  const pov = scene.pov;
  if (pov && pov !== 'lead' && pov !== lead) return {actor: pov, basis: 'scene-pov'};
  const prefix = /^((?:[A-Z][\p{L}'-]+\s+){1,3})(?=[a-z])/u.exec(String(step.verb || ''));
  const named = prefix && names.resolve(prefix[1]);
  if (named && named !== lead) return {actor: named, basis: 'subject-name'};
  if (named === lead && lead) return {actor: 'lead', basis: 'subject-name'};
  return pov === 'lead' || (lead && pov === lead) ? {actor: 'lead', basis: 'pov-default', weak: true} : null;
}

export function deriveStepTags(scenes, {registry = [], leadId = null} = {}) {
  const names = nameIndex(registry, leadId);
  const tags = [];
  for (const scene of scenes) for (const [i, step] of (scene.steps || []).entries()) {
    const tag = {schema: 'step-tags/1', id: `${scene.beat}#${i + 1}`, scene: scene.beat, source: 'script'};
    const a = actorOf(step, scene, names); if (a) { tag.actor = a.actor; tag.actorBasis = a.basis; if (a.weak) tag.actorWeak = true; if (a.source) tag.source = a.source; }
    const k = kindOf(step); tag.kind = k.kind; tag.kindBasis = k.basis; if (k.weak) tag.kindWeak = true;
    const h = habitOf(step); if (h) { tag.habit = h.habit; tag.habitBasis = h.basis; }
    const f = familyOf({verb: step.verb, object: step.object, class: step.class}); tag.family = f.family;
    tags.push(tag);
  }
  return tags;
}

const share = (n, d) => d ? Math.round(1000 * n / d) / 1000 : null;
/** LSD205: how far the script tags agree with reviewed verdicts. `actor not the lead` and `not an action` are the reviewers' own labels. */
export function agreementWithReviewed(tags, reviewed) {
  const byId = new Map(tags.map(t => [t.id, t]));
  const seen = new Set(), rows = [];
  for (const r of reviewed) if (r?.stepId && !seen.has(r.stepId)) { seen.add(r.stepId); rows.push(r); }
  const out = {reviewedSteps: rows.length, tagged: 0, actor: {notLead: 0, notLeadTaggedNonLead: 0, notLeadTaggedLead: 0, notLeadUnknown: 0, rowSteps: 0, rowStepsTaggedNonLead: 0},
    kind: {notAction: 0, notActionTaggedNonAct: 0, rowSteps: 0, rowStepsTaggedNonAct: 0}};
  for (const r of rows) {
    const t = byId.get(r.stepId); if (!t) continue; out.tagged++;
    const strongNonLead = t.actor && t.actor !== 'lead' && !t.actorWeak, strongLead = t.actor === 'lead' && !t.actorWeak;
    const nonAct = NOT_PLAYED_KINDS.includes(t.kind) && !t.kindWeak;
    if (r.gapReason === 'actor not the lead') { out.actor.notLead++; if (strongNonLead) out.actor.notLeadTaggedNonLead++; else if (strongLead) out.actor.notLeadTaggedLead++; else out.actor.notLeadUnknown++; }
    if (r.verdict === 'row') { out.actor.rowSteps++; if (strongNonLead) out.actor.rowStepsTaggedNonLead++; out.kind.rowSteps++; if (nonAct) out.kind.rowStepsTaggedNonAct++; }
    if (r.gapReason === 'not an action') { out.kind.notAction++; if (nonAct) out.kind.notActionTaggedNonAct++; }
  }
  out.actor.recall = share(out.actor.notLeadTaggedNonLead, out.actor.notLead);
  out.actor.falsePositiveRate = share(out.actor.rowStepsTaggedNonLead, out.actor.rowSteps);
  out.kind.recall = share(out.kind.notActionTaggedNonAct, out.kind.notAction);
  out.kind.falsePositiveRate = share(out.kind.rowStepsTaggedNonAct, out.kind.rowSteps);
  return out;
}

export function summarize(tags) {
  const count = (key) => tags.reduce((m, t) => (t[key] !== undefined && (m[t[key]] = (m[t[key]] || 0) + 1), m), {});
  return {steps: tags.length, actorBasis: count('actorBasis'), actorStrong: tags.filter(t => t.actor && !t.actorWeak).length, actorNone: tags.filter(t => !t.actor).length,
    kind: count('kind'), kindStrong: tags.filter(t => !t.kindWeak).length, habit: count('habit'), families: count('family')};
}

const readJsonl = file => fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
function main(args) {
  const get = (k, req = true) => { const i = args.indexOf(k); if (i < 0 || !args[i + 1]) { if (req) throw Error(`Missing ${k}`); return null; } return args[i + 1]; };
  const scenes = readJsonl(get('--scenes')), registry = readJsonl(get('--registry'));
  const tags = deriveStepTags(scenes, {registry, leadId: get('--lead', false)});
  const out = get('--out'); fs.mkdirSync(path.dirname(out), {recursive: true});
  fs.writeFileSync(out, tags.map(t => JSON.stringify(t)).join('\n') + '\n');
  const reviewedFiles = args.flatMap((a, i) => a === '--reviewed' ? [args[i + 1]] : []);
  const report = {summary: summarize(tags), agreement: reviewedFiles.length ? agreementWithReviewed(tags, reviewedFiles.flatMap(readJsonl)) : null};
  const rep = get('--report', false); if (rep) fs.writeFileSync(rep, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, (k, v) => k === 'families' ? undefined : v));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
