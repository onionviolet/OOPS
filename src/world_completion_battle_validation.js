// Existing sluice descriptor validation, isolated from the runtime executor.
import {check, natural} from './basics.js';
import {validateRemainderCombatFitBattle} from './audit_remainder_combat_fit_hooks.js';
import {validateRemainderCombatObjectivesBattle} from './audit_remainder_combat_objectives_battle.js';
export const FEATURE_BATTLE_SCHEMA=3,FEATURE_REFERENCE_BATTLE_SCHEMA=4,FEATURE_REMAINDER_BATTLE_SCHEMA=5;
export const isFeatureBattleSchema=s=>s===3||s===4||s===5;
const FEATURE_BATTLE_ID='feature_battle.sluice',FEATURE_SHIELD='featureBattleShield',FEATURE_HOOK='featureBattleHook',FEATURE_HELPER='partyPartner';
const foes=[FEATURE_SHIELD,FEATURE_HOOK];
const validVitals=v=>v&&['health','stamina','max_health','max_stamina'].every(k=>Number.isFinite(v[k])&&v[k]>=0)&&v.max_health>1&&v.health<=v.max_health&&v.stamina<=v.max_stamina;
export function validateFeatureBattle(b,session,state) {
    check(isFeatureBattleSchema(b?.schema)&&b.definitionId===FEATURE_BATTLE_ID&&b.revision===1&&session?.definitionId===FEATURE_BATTLE_ID&&session.revision===1&&session.commandId==='feature_battle.start'&&session.targetId===FEATURE_SHIELD&&session.lethal===false,'Unsupported native sluice binding.');
    check(typeof session.id==='string'&&/^simulation:[1-9][0-9]*$/.test(session.id)&&session.turn===0&&Array.isArray(session.turns)&&session.turns.length===1&&Array.isArray(session.settlement)&&session.settlement.length===0,'Invalid native sluice parent session.');
    if(state)check(Number.isSafeInteger(Number(session.id.split(':')[1]))&&Number(session.id.split(':')[1])<=state.sequence,'Invalid native sluice parent sequence.');
    check(natural(b.seed)&&b.seed>0&&b.seed<=0xffffffff&&natural(b.actions)&&typeof b.last==='string'&&b.last.length<=500,'Invalid saved sluice RNG/action receipt.');
    check(b.fighters&&typeof b.fighters==='object'&&!Array.isArray(b.fighters),'Invalid sluice roster.');
    const ids=Object.keys(b.fighters).sort(),expected=['player',...foes,...(Object.hasOwn(b.fighters,FEATURE_HELPER)?[FEATURE_HELPER]:[])].sort();
    check(ids.join(',')===expected.join(','),'Unsupported saved sluice roster.');
    let moves=0;
    for(const [id,f] of Object.entries(b.fighters)) {
        check(f.side===(foes.includes(id)?'defenders':'attackers')&&f.role===(id===FEATURE_HELPER?'guard':id===FEATURE_SHIELD?'shield':id===FEATURE_HOOK?'hook':'strike')&&['active','yielded','released','exhausted','unsupported'].includes(f.status)&&natural(f.moves)&&f.moves<=b.actions,'Invalid saved sluice fighter.');
        check(id===FEATURE_HELPER||['active','yielded'].includes(f.status),'Only the willing helper can leave separately.');moves+=f.moves;
        if(state) {
            const person=state.simulation.people[id];
            check(person?.life==='alive'&&state.actors[id]?.worldId===state.actors.player.worldId&&person.location==='Village','Unavailable saved sluice body.');
            if(id!=='player') {
                check(person.inventory==='simulation'&&validVitals(person.vitals)&&person.body&&['attack','agility','dexterity','intuition','defense','attack_speed'].every(key=>Number.isFinite(person.body[key])&&person.body[key]>=0)&&person.body.attack_speed>0,'Invalid saved native sluice body/vitals.');
                check(f.status!=='active'||person.vitals.health>1,'An active saved fighter has already yielded.');
                check(f.status!=='yielded'||person.vitals.health===1,'A yielded fighter has incompatible saved wounds.');
            }
        }
    }
    check(moves===b.actions,'Sluice action counters do not match.');
    const active=ids.filter(id=>b.fighters[id].status==='active');check(active.join(',')===[...session.participants].sort().join(',')&&active.includes('player'),'Sluice occupations do not match active fighters.');
    check(b.objective?.key==='raise_gate'&&b.objective.required===3&&natural(b.objective.progress)&&b.objective.progress<3&&[2,3].includes(b.escape?.required)&&natural(b.escape.progress)&&b.escape.progress<b.escape.required,'Invalid active sluice objective/escape.');
    check(Array.isArray(b.guards)&&b.guards.length<=4&&new Set(b.guards.map(g=>g.target)).size===b.guards.length,'Invalid simultaneous sluice guards.');
    for(const g of b.guards)check(active.includes(g.by)&&active.includes(g.target)&&b.fighters[g.by].side===b.fighters[g.target].side&&(b.schema===5?['ordinary','interpose','redirect','lash','maintained','prepared_guard']:['ordinary','interpose','redirect','lash']).includes(g.mode),'Invalid saved guard target.');
    check(Array.isArray(b.focused)&&b.focused.length<=2&&new Set(b.focused).size===b.focused.length&&b.focused.every(id=>foes.includes(id)&&active.includes(id)),'Invalid saved tracked targets.');
    check(b.exposed&&typeof b.exposed==='object'&&!Array.isArray(b.exposed)&&Object.entries(b.exposed).every(([id,n])=>foes.includes(id)&&natural(n)&&n<=2),'Invalid exposed native targets.');
    check(typeof b.wedge==='boolean'&&typeof b.signal==='boolean'&&natural(b.guardsTaken)&&b.guardsTaken<=b.actions&&(b.lastTarget===null||ids.includes(b.lastTarget)),'Invalid saved sluice effects.');
    check(Array.isArray(b.receipts)&&b.receipts.length<=16&&b.receipts.every(r=>natural(r.action)&&r.action>0&&r.action<=b.actions&&typeof r.type==='string'&&ids.includes(r.actorId)&&Array.isArray(r.targets)&&r.targets.every(id=>ids.includes(id))&&typeof r.text==='string'&&r.text.length<=500),'Invalid retained sluice receipt.');
    if(b.schema>=FEATURE_REFERENCE_BATTLE_SCHEMA)validateReferenceBattleFields(b,state,session);
    if(b.schema===5){validateRemainderCombatFitBattle(b,state,session);validateRemainderCombatObjectivesBattle(b,session,state);}
}
function validateReferenceBattleFields(b,state,session) {
    check(!state||state.referenceGameplay?.schema===1,'Reference sluice combat requires explicit enrollment.');
    const validWindow=o=>o&&Object.keys(o).sort().join(',')==='attackerId,defenderId,earnedAction,playerMove'&&foes.includes(o.attackerId)&&b.fighters[o.attackerId]?.status==='active'&&['player',FEATURE_HELPER].includes(o.defenderId)&&natural(o.earnedAction)&&o.earnedAction>0&&o.earnedAction<=b.actions&&natural(o.playerMove)&&o.playerMove===b.fighters.player.moves;
    check(b.opportunity===null||validWindow(b.opportunity),'Invalid next-choice defensive window.');
    check(Array.isArray(b.opportunityReceipts)&&b.opportunityReceipts.length<=16&&b.opportunityReceipts.every(r=>natural(r.earnedAction)&&r.earnedAction>0&&r.earnedAction<=r.action&&natural(r.action)&&r.action<=b.actions&&foes.includes(r.attackerId)&&['used_retreat','used_counter','expired_choice','expired_target','expired_finish'].includes(r.outcome)),'Invalid defensive opportunity history.');
    check(new Set(b.opportunityReceipts.map(r=>r.earnedAction)).size===b.opportunityReceipts.length,'A defended event cannot be used or expired twice.');
    const origin=b.opportunity&&b.receipts.find(r=>r.action===b.opportunity.earnedAction);
    if(origin)check(origin.type==='strike'&&origin.actorId===b.opportunity.attackerId&&origin.outcomes?.some(o=>o.targetId===b.opportunity.defenderId&&o.defended),'The defensive window lacks its actual guarded outcome.');
    for(const r of b.receipts) {
        check(r.nonce&&r.nonce.sessionId===session.id&&natural(r.nonce.sequence)&&(!state||r.nonce.sequence<state.sequence)&&r.nonce.action===r.action-1&&natural(r.nonce.seed)&&r.nonce.seed>0&&r.nonce.seed<=0xffffffff,'Invalid committed sluice action nonce.');
        check(Array.isArray(r.outcomes)&&(r.type==='strike'?r.outcomes.length>0&&r.outcomes.length<=2:r.outcomes.length===0)&&r.outcomes.every(o=>Object.keys(b.fighters).includes(o.targetId)&&['hit','blocked','evaded'].includes(o.kind)&&Number.isFinite(o.damage)&&o.damage>=0&&typeof o.defended==='boolean'),'Invalid native strike outcomes.');
    }
}
