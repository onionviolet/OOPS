import {check, natural} from './basics.js';
import {validateFeatureBattle,isFeatureBattleSchema} from './world_completion_battle_validation.js';
export const PARTY_HELPER = 'partyPartner', PARTY_METHOD = 'party.guard_control';
export function validateNativeBattle(battle,session,state) {
    if(isFeatureBattleSchema(battle?.schema))return validateFeatureBattle(battle,session,state);
    check(battle && session?.definitionId==='rival.native_duel' && session.targetId==='roadRival' && session.participants?.includes('roadRival'),'Invalid native battle binding.');
    check(natural(battle.seed)&&battle.seed>0&&battle.seed<=0xffffffff&&natural(battle.actions)&&typeof battle.last==='string'&&battle.last.length<=500,'Invalid saved native battle.');
    if(battle.schema===1)return;
    check(battle.schema===2&&battle.definitionId==='party.braced_contest','Unsupported native battle schema.');
    check(battle.fighters && Object.keys(battle.fighters).sort().join(',')==='partyPartner,player,roadRival','Invalid party roster.');
    for(const [id,f] of Object.entries(battle.fighters)) {
        check(f.role===(id===PARTY_HELPER?'guard':'strike')&&f.side===(id==='roadRival'?'defenders':'attackers')&&natural(f.moves)&&f.moves<=battle.actions&&['active','yielded','exhausted','unsupported','released'].includes(f.status),'Invalid saved party role.');
        if(id!==PARTY_HELPER)check(f.status==='active','Invalid contest leader.');
        if(state)check(state.simulation.people[id]?.life==='alive'&&state.actors[id]?.worldId===state.actors.player.worldId,'Unavailable saved party fighter.');
    }
    const active=Object.keys(battle.fighters).filter(id=>battle.fighters[id].status==='active').sort();
    check(active.join(',')===[...session.participants].sort().join(','),'Party occupation does not match active fighters.');
    check((battle.guard===null||battle.guard===PARTY_HELPER&&battle.fighters[PARTY_HELPER].status==='active')&&natural(battle.guardsPrepared)&&natural(battle.guardsTaken)&&battle.guardsTaken<=battle.guardsPrepared&&battle.guardsPrepared<=battle.actions,'Invalid saved party guard.');
    check(battle.lastTarget===null||Object.hasOwn(battle.fighters,battle.lastTarget),'Invalid party target.');
}
