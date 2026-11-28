import {domainRegistry,registerDomain} from './domain_registry.js';
import {VILLAGE_ABILITY_LOADOUT as rule} from './data/ability_loadout.js';
import {abilitySlots,emptyAbilityLoadout,loadoutRecovery,quoteAbilitySwap,readAbilityLoadout,settleAbilityLoadout} from './ability_loadout.js';
import {formatDuration} from './number_format.js';

let state=emptyAbilityLoadout(rule),ports;
export function configureAbilityLoadout(config){ports=config;}
function active(){
    return ports?.context().world===rule.world && ports.level(rule.unlock.track)>=rule.unlock.level;
}

export function villageSlottedRecovery(stat,missing) {
    if(!active())return [];
    return loadoutRecovery(rule,state,'active',ports.context().clock,stat,missing);
}

function section(){
    if(!active())return;
    const {clock}=ports.context();
    const [current]=abilitySlots(rule,state,'active',clock);
    const name=id=>rule.abilities.find(option=>option.id===id)?.name??'Empty';
    const time=rule.groups.active.cost.minutes;
    const pending=state.pending&&clock<state.pending.ready ? state.pending : null;
    const quote=(id,at)=>quoteAbilitySwap(rule,state,{group:'active',id,replace:current,clock:at});
    return {id:'ability-loadout',name:'Sleep ability loadout',waiting:state.readyAt===0,
        summary:`Active slot: ${name(current)}.${pending?` ${name(pending.slots[0])} ready in ${formatDuration(pending.ready-clock)}. Rest keeps using ${name(current)} until then.`:''}`,
        actions:rule.abilities.filter(option=>option.id!==current).map(option=>({
            label:`Slot ${option.name}`,
            fact:`${option.description} Replaces ${name(current)} after ${time} game minutes. Sleep continues with ${name(current)} during the change.`,
            reason:quote(option.id,clock).reason || (!ports.writable()?'Saving is unavailable.':undefined),
            run:()=>{
                if(!ports.writable())throw Error('Restore saving before swapping abilities.');
                const result=quote(option.id,ports.context().clock);
                if(result.reason)throw Error(result.reason);
                ports.persist(result.next);
                state=result.next;
                ports.report(`Changing the sleep slot to ${option.name} takes ${time} game minutes.`);
                domainRegistry.refresh();
            },
        }))};
}

registerDomain({id:'ability_loadout',initialState:()=>emptyAbilityLoadout(rule),
    validate:saved=>readAbilityLoadout(rule,saved),load:saved=>{state=readAbilityLoadout(rule,saved);},
    save:()=>state.readyAt?structuredClone(settleAbilityLoadout(rule,state,ports.context().clock)):undefined,
    projection:name=>name==='growth'?section():undefined});
