import {check,natural} from './basics.js';
import {COHORT_SCHEMA,COHORT_ID,COHORT_COACHES,COHORT_MEMBERS,COHORT_ROOM} from './cohort_battle_facts.js';
export function validateCohortBattle(b,session,state){
 check(b&&b.schema===COHORT_SCHEMA&&b.definitionId===COHORT_ID&&b.revision===1&&session?.definitionId===COHORT_ID&&session.revision===1&&session.commandId==='cohort.start'&&session.lethal===false,'Invalid native cohort binding.');
 check(typeof session.id==='string'&&/^simulation:[1-9][0-9]*$/.test(session.id)&&session.turn===0&&session.turns?.length===1&&session.settlement?.length===0,'Invalid cohort parent encounter.');
 check(natural(b.seed)&&b.seed>0&&b.seed<=0xffffffff&&natural(b.actions)&&typeof b.last==='string'&&b.last.length<=500,'Invalid cohort action cursor.');
 const a=b.admission;check(a&&natural(a.at)&&natural(a.sequence)&&a.sequence>0&&a.fees===2&&Array.isArray(a.members)&&a.members.length>=1&&a.members.length<=COHORT_MEMBERS.length&&new Set(a.members).size===a.members.length&&a.members.every(id=>COHORT_MEMBERS.includes(id)),'Invalid admitted cohort.');
 check(a.frontline===undefined||a.members.includes(a.frontline),'Invalid willing front participant.');
 check(a.training&&a.bindings&&Object.keys(a.training).sort().join(',')===[...a.members].sort().join(',')&&Object.keys(a.bindings).sort().join(',')===['player',...a.members,...COHORT_COACHES].sort().join(',')&&Object.values(a.training).every(n=>n===1)&&Object.values(a.bindings).every(s=>typeof s==='string'&&s.length<=400),'Invalid frozen cohort training/body snapshot.');
 check(b.fighters&&Object.keys(b.fighters).sort().join(',')===['player',...a.members,...COHORT_COACHES].sort().join(','),'Invalid native cohort roster.');
 let moves=0;
 for(const [id,f]of Object.entries(b.fighters)){
  check(f&&Object.keys(f).sort().join(',')==='moves,side,status'&&f.side===(COHORT_COACHES.includes(id)?'defenders':'attackers')&&['active','yielded','released','unsupported'].includes(f.status)&&natural(f.moves)&&f.moves<=b.actions,'Invalid cohort participant status.');moves+=f.moves;
  if(state){const p=state.simulation?.people[id];check(p&&state.actors[id]?.worldId==='base.frontier','Missing actual cohort person.');if(f.status==='active')check(p.location===COHORT_ROOM,'An active cohort member left the actual room.');}
 }
 check(moves===b.actions,'Every actual cohort action belongs to its acting person.');
 check([...session.participants].sort().join(',')===Object.keys(b.fighters).filter(id=>b.fighters[id].status==='active').sort().join(','),'Cohort occupation differs from active fighters.');
 check(Array.isArray(b.receipts)&&b.receipts.length<=24&&b.receipts.every(r=>r&&natural(r.action)&&r.action>0&&r.action<=b.actions&&Object.hasOwn(b.fighters,r.actor)&&['strike','release','withdraw'].includes(r.kind)&&typeof r.text==='string'&&r.text.length<=500&&(r.target===undefined||r.kind==='strike'&&Object.hasOwn(b.fighters,r.target))),'Invalid cohort observed receipts.');
 if(state)check(a.at<=state.clock&&a.sequence<=state.sequence&&Number(session.id.split(':')[1])<=state.sequence,'Cohort snapshot is ahead of its owner.');
}
