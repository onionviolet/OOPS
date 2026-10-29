#!/usr/bin/env node
// Private research output; rule names and patterns are world-neutral.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Ordered head-verb and object-type rules. Ambiguous unmatched actions remain unclustered.
export const FAMILY_RULES = [
  {family:'exchange a message',head:/^(send|receive|deliver|hand|write|read|open|reply)\w*\b/i,object:/\b(letter|message|telegram|mail|postcard|envelope|reply)\b/i,objectType:'message',cause:'control is a different mechanism'},
  {family:'paid transport',head:/^(ride|hire|take|board|pay|travel|catch)\w*\b/i,object:/\b(carriage|cab|taxi|fare|coach|bus|train|ticket|ship|boat|passage|tram|trolleybus|subway)\b/i,objectType:'transport or fare',cause:'control is a different mechanism'},
  {family:'read a text',head:/^(read|reread|browse|peruse|flip)\w*\b/i,object:/\b(book|text|note|page|diary|journal|newspaper|paper|document|file|report|letter|message|sentence|writing|contents|records|script|inscription|formula|newspapers|pages|books)\w*\b/i,objectType:'text or item',cause:'control is a different mechanism'},
  {family:'divination or ritual',head:/^(divin|pray|chant|recite|meditat|ritual|consecrat|sacrific)\w*\b/i,objectType:'ritual or effect',cause:'control is a different mechanism'},
  {family:'use an ability',head:/^(activate|use|invoke|trigger|unleash|channel|cast|summon)\w*\b/i,object:/\b(ability|power|skill|spell|charm|magic|ritual|divination|vision|aura|summon|messenger|projection|artifact|amulet|scepter|potion|light|fire|spirit|thread)\w*\b/i,objectType:'ability or effect',cause:'control is a different mechanism'},
  {family:'trade or pay',head:/^(buy|purchase|sell|pay|hire|spend|negotiate|bid|invest|auction|bargain|rent)\w*\b/i,objectType:'goods service or price',cause:'control is a different mechanism'},
  {family:'speak or ask',head:/^(talk|speak|ask|tell|told|answer|discuss|greet|reply|repl|say|said|chat|convers|question|explain|describe|report|warn|advise|argue|request|propose|remark|shout|whisper|promise|insult|joke|introduce|persuade|instruct)\w*\b/i,objectType:'person or topic',cause:'control is a different mechanism'},
  {family:'wait for a time or event',head:/^(wait|pause)\w*\b/i,objectType:'time or event',cause:'no matching control established'},
  {family:'rest or personal care',head:/^take\w*\b/i,object:/\b(nap|rest|break)\b/i,objectType:'rest',cause:'control is a different mechanism'},
  {family:'travel or move',head:/^(walk|stroll|wander|return|travel|enter|leave|arrive|depart|go|head|run|climb|descend|approach|retreat|flee|escape|cross|follow|step|ride|board|teleport|fly|jump|sail)\w*\b/i,objectType:'place or route',cause:'control is a different mechanism'},
  {family:'observe or listen',head:/^(observe|watch|see|look|notice|hear|listen|sense|survey|witness|spot|glance|overhear|feel)\w*\b/i,objectType:'person event or surroundings',cause:'no matching control established'},
  {family:'reason or plan',head:/^(plan|reason|weigh|decide|think|consider|deduce|infer|reflect|recall|remember|estimate|calculate|judge|conclude|guess|realize|realise|suspect|recognize|recognise|compare|reconsider|choose)\w*\b/i,objectType:'information or decision',cause:'no matching control established'},
  {family:'inspect or investigate',head:/^(check|inspect|examine|search|investigate|review|assess|identify|test|confirm|analyze|analyse|study|research|probe|explore|verify|trace|track|measure)\w*\b/i,objectType:'item person or evidence',cause:'control is a different mechanism'},
  {family:'handle or move an item',head:/^(take|put|place|hold|carry|pick|pull|push|throw|toss|drop|collect|retrieve|grab|lift|store|hide|seal|remove|bring|fetch|deliver|hand|give|receive|open|close|unlock|lock|wear|pack|extract)\w*\b/i,objectType:'item or container',cause:'control is a different mechanism'},
  {family:'fight or evade',head:/^(attack|shoot|fire|strike|hit|punch|slash|stab|fight|dodge|block|defend|kill|injure|aim|fire|parry|counter|ambush|pursue|chase|wound|fight)\w*\b/i,objectType:'opponent or attack',cause:'control is a different mechanism'},
  {family:'rest or personal care',head:/^(eat|drink|sleep|rest|wash|clean|dress|wake|awaken|bathe|cook|prepare breakfast|smoke)\w*\b/i,objectType:'food body or rest',cause:'control is a different mechanism'},
  {family:'make or write an item',head:/^(write|draw|craft|make|build|prepare|compose|copy|record|forge|mix|brew|create|paint|carve|assemble|repair|burn|light|pour|add)\w*\b/i,objectType:'item or material',cause:'control is a different mechanism'},
  {family:'agree or refuse a proposal',head:/^(agree|accept|decline|refuse|offer|reject|approve|allow|permit|deny|consent|pledge|swear)\w*\b/i,objectType:'proposal or commitment',cause:'control is a different mechanism'},
  {family:'direct another actor',head:/^(order|assign|command|appoint|arrange|dispatch|lead|guide|organize|organise|summon)\w*\b/i,objectType:'person or task',cause:'no matching control established'},
  {family:'change or maintain state',head:/^(change|set|start|stop|end|continue|release|dismiss|restore|maintain|switch|transform|adjust|replace|upgrade|establish|activate|deactivate)\w*\b/i,objectType:'state or effect',cause:'control is a different mechanism'},
  {family:'obtain or learn information',head:/^(learn|discover|find|reveal|uncover|gather|acquire|obtain|gain|record|memorize|memorise|teach|practice|practise|train)\w*\b/i,objectType:'knowledge or skill',cause:'no matching control established'}
];

const inc=(record,key,n=1)=>{record[key]=(record[key]||0)+n;};
const normalized=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')||'(missing verb)';
function familyOf(row) {
  const verb=String(row.verb||'').trim();
  // An explicit proper-name subject can prefix the action; it never establishes actor identity.
  const stripped=FAMILY_RULES.some(rule=>rule.head.test(verb)) ? verb : verb.replace(/^(?:[A-Z][a-z'-]+\s+){1,3}(?=[a-z])/,'');
  const text=`${stripped} ${row.object||''}`;
  return FAMILY_RULES.find(rule=>rule.head.test(stripped)&&(!rule.object||rule.object.test(text))) || null;
}
function causeOf(row,rule) {
  if (rule?.family==='wait for a time or event' && row.availableControls?.wait) return 'control exists but time unresolved';
  if (row.householdGap === 'object does not disambiguate act') return 'control exists but place/person/item unresolved';
  if (rule?.family==='speak or ask' && !row.availableControls?.talk) {
    if (!row.availableControls?.talkInventory) return 'no matching control established';
    if ((row.availableControls?.talkCandidates || 0)>0 || !row.availableControls?.resolvedNonLeadPeople) return 'control exists but place/person/item unresolved';
    return 'no matching control established';
  }
  if (rule?.family==='travel or move' && /^(walk|stroll|wander)\w*\b/i.test(row.verb||'')) {
    if (!row.availableControls?.walkInventory) return 'no matching control established';
    if (!row.packPlaceId || (row.availableControls?.walk && !row.availableControls?.destinationResolved)) return 'control exists but place/person/item unresolved';
    if (!row.availableControls?.walk) return 'no matching control established';
  }
  return rule?.cause || 'no matching control established';
}
function cheapCandidate(row) {
  const verb=String(row.verb||''); const controls=row.availableControls||{};
  if (/^wait\b/i.test(verb)&&controls.wait) return 'wait';
  if (/^walk\w*\b/i.test(verb)&&controls.walk) return 'walk';
  if (/^return\w*\s+to\b/i.test(verb)&&controls.walk&&controls.destinationResolved) return 'return';
  if (/^pay\w*\b/i.test(verb)&&controls.pay?.length) return 'pay';
  if (/^(talk|speak)\w*\b/i.test(verb)&&controls.talk) return 'talk';
  return null;
}
const freshSegment=()=>({steps:0,gaps:0,classes:{},families:{},familyReasons:{},familyRows:{},volumes:{},reasons:{},phrases:{},cheapMisses:[]});

export function buildGapCensus(mappings,failures=[]) {
  const segments={lead:freshSegment(),'non-lead':freshSegment(),unknown:freshSegment()};
  const seen=new Set();let totalSteps=0,totalGaps=0,duplicateRowsOmitted=0;
  for(const mapping of mappings) for(const row of mapping.rows||[]) {
    const identity=row.id||`${row.scene||''}#${row.verb||''}#${row.sourceVolume||''}`;
    if(seen.has(identity)){duplicateRowsOmitted++;continue;}seen.add(identity);totalSteps++;
    const actor=['lead','non-lead'].includes(row.actorRole)?row.actorRole:'unknown';const s=segments[actor];s.steps++;
    if(row.status!=='gap'&&row.status!=='lossy_fold')continue;
    totalGaps++;s.gaps++;const rule=familyOf(row), family=rule?.family||'unclustered',cause=causeOf(row,rule),volume=String(row.sourceVolume??'unknown');
    inc(s.classes,row.class||'unknown');inc(s.families,family);inc(s.reasons,cause);
    inc(s.familyReasons[family]||={},cause);
    (s.familyRows[family]||=[]).push({id:row.id,scene:row.scene,verb:row.verb,object:row.object,volume:row.sourceVolume,cause});
    const v=s.volumes[volume]||={gaps:0,families:{}};v.gaps++;inc(v.families,family);
    const phrase=normalized(row.verb);const bucket=s.phrases[row.class||'unknown']||={};inc(bucket,phrase);
    const cheap=cheapCandidate(row);if(cheap)s.cheapMisses.push({id:row.id,scene:row.scene,verb:row.verb,object:row.object,volume:row.sourceVolume,kind:cheap,cause,reason:row.reason,controls:row.availableControls});
  }
  for(const s of Object.values(segments)) {
    s.clustered=s.gaps-(s.families.unclustered||0);s.clusteredShare=s.gaps?s.clustered/s.gaps:0;
    s.families=Object.entries(s.families).map(([family,steps])=>({family,steps,share:s.gaps?steps/s.gaps:0})).sort((a,b)=>b.steps-a.steps||a.family.localeCompare(b.family));
    s.topVerbPhrases=Object.fromEntries(Object.entries(s.phrases).map(([key,phrases])=>[key,Object.entries(phrases).map(([phrase,count])=>({phrase,count})).sort((a,b)=>b.count-a.count||a.phrase.localeCompare(b.phrase)).slice(0,40)]));delete s.phrases;
  }
  return {schema:'lead-gap-census/2',totalSteps,totalGaps,duplicateRowsOmitted,segments,rangeFailures:failures,
    rules:FAMILY_RULES.map(({family,head,object,objectType,cause})=>({family,head:head.source,object:object?.source||null,objectType,cause}))};
}

function main(args) {
  const arg=name=>{const i=args.indexOf(name);return i<0?null:args[i+1]};
  const dir=arg('--mappings'),output=arg('--out');if(!dir||!output)throw Error('Usage: gap_census.mjs --mappings <private-dir> --out <private-census.json> [--failures <json>]');
  const files=fs.readdirSync(dir).filter(file=>/^v\d+-ch\d+-\d+\.json$/.test(file)).sort().map(file=>path.join(dir,file));if(!files.length)throw Error(`No mapping JSON files found in ${dir}`);
  const failures=arg('--failures')?JSON.parse(fs.readFileSync(arg('--failures'),'utf8')):[];
  const census=buildGapCensus(files.map(file=>JSON.parse(fs.readFileSync(file,'utf8'))),failures);
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(census,null,2)+'\n');
  console.log(JSON.stringify({totalSteps:census.totalSteps,totalGaps:census.totalGaps,duplicateRowsOmitted:census.duplicateRowsOmitted,rangeFailures:failures.length,
    segments:Object.fromEntries(Object.entries(census.segments).map(([key,s])=>[key,{steps:s.steps,gaps:s.gaps,clustered:s.clustered,clusteredShare:s.clusteredShare,families:s.families,reasons:s.reasons,cheapMisses:s.cheapMisses.length,volumes:s.volumes}]))},null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main(process.argv.slice(2));
