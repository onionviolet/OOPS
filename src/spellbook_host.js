import {hogwartsSpellRules,cyoriaSpellRules} from './spell_world_rules.js';
import {readSpellbookWorkings,commitSpellbookWorking,spellbookMethods,settleSpellbookReceipt,quoteSpellbookStep} from './spellbook_workings.js';
import {createSpellbookPanel} from './spellbook_ui.js';
import {isZorianStart} from './book_world_mol_starts.js';
import {commitMolCommand,previewMolCommand} from './book_world_mol_host.js';
import {HP_SPELL_PRACTICE} from './hp_lead_spells.js';
import {admittedExtensionCommands} from './structured_pack_extensions.js';
import {requireStructuredContent} from './structured_pack_state.js';
import {commitSimulationCommand,previewSimulationCommand} from './simulation.js';
import {structuredActionCosts} from './structured_pack_runtime.js';

function activeRules({state,place,record}) {
    const world=state.actors.player.worldId;
    if(world===hogwartsSpellRules.worldId&&place===hogwartsSpellRules.location&&
        record?.extensions?.some(pin=>pin.id===HP_SPELL_PRACTICE)) return hogwartsSpellRules;
    if(world===cyoriaSpellRules.worldId&&place===cyoriaSpellRules.location&&isZorianStart(state)) return cyoriaSpellRules;
    return null;
}

export function settleNativeSpellbook(state) {
    for(const rules of [hogwartsSpellRules,cyoriaSpellRules]) settleSpellbookReceipt(state,rules);
}

export function mountNativeSpellbook({read,structuredContext,featureWaveContext,assertWriter,lifeEnded,nativeAlive,registry,structuredPacks,persist}) {
    const methods=new Map([hogwartsSpellRules,cyoriaSpellRules].map(rules=>[rules,spellbookMethods(rules)]));
    createSpellbookPanel({
        read:open=>{
            const current=read(),rules=activeRules(current);
            if(!rules)return null;
            const {state,record}=current,book=readSpellbookWorkings(state,rules);
            const quote=open?quoteSpellbookStep(book,rules,({id})=>{
                const definition=registry.simulation.commands.get(id);
                if(!definition)throw Error('This spell is unavailable here.');
                const local=rules===hogwartsSpellRules;
                const q=local?previewSimulationCommand(state,registry,id,{...structuredContext(),targetId:definition.targetId}):
                    previewMolCommand(state,registry,id,{...featureWaveContext(),nativeAlive:nativeAlive()});
                const costs=structuredActionCosts({costs:q.costs?.length?q.costs:definition.costs},local?structuredPacks.get(record.packId):definition,state);
                return {eligible:q.visible&&q.eligible,reasons:q.reasons,costs,duration:q.duration};
            }):null;
            return {...book,quote,world:rules.world,
                methods:methods.get(rules).filter(method=>rules.knows(current.state,method.id)),canWrite:current.canWrite};
        },
        command:request=>{
            assertWriter();
            if(lifeEnded())throw Error('This life has ended.');
            const current=read(),rules=activeRules(current);
            if(!rules||request.world!==rules.world)throw Error('Return to your practice place.');
            const {state,record}=current;
            if(request.action==='append'&&!rules.knows(state,request.step?.method))throw Error('Study this method before adding it.');
            const context=rules===hogwartsSpellRules?structuredContext():featureWaveContext();
            const plan=commitSpellbookWorking(state,rules,request,{
                edit:()=>{
                    const next=structuredClone(state);
                    next.sequence++;
                    return {state:next,external:context.external,gameplay:context.gameplay,vitals:context.vitals,acquisitions:[],unlocks:[]};
                },
                cast:command=>{
                    if(rules===cyoriaSpellRules)return commitMolCommand(state,registry,command,{...context,nativeAlive:nativeAlive()});
                    const pack=structuredPacks.get(record.packId);
                    requireStructuredContent(record,structuredPacks,state);
                    const action=admittedExtensionCommands(pack,record).find(row=>row.id===command.id);
                    if(!action)throw Error('This spell is unavailable here.');
                    return commitSimulationCommand(state,registry,{id:action.id},{...context,targetId:action.targetId});
                },
            });
            persist(plan);
        },
    });
}
