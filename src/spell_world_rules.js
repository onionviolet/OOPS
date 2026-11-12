import {HP_SPELL_PRACTICE, HP_LIFT_BOARD_COMMAND} from './hp_lead_spells.js';
import {MOL_LIGHT_PREFIX} from './mol_light_research.js';
import {MOL_IDS,MOL_LOCATIONS} from './book_world_mol_ids.js';

function targetResolver(types) {
    return id => Object.hasOwn(types,id) ? {id,type:types[id]} : null;
}

const action = id => ({type:'action',id});
const liftBoard = ({bindings}) => bindings.target==='board' && action(HP_LIFT_BOARD_COMMAND);
const lightMethods = {'mol.torch':'torch','mol.direct_light':'shaped','mol.oblique':'oblique'};
const summonWeight = HP_SPELL_PRACTICE+'.accio.summon_weight';
const boardAloft = state => state.worlds[hogwartsSpellRules.worldId].facts[HP_SPELL_PRACTICE+'.board_aloft']===true;
const observed = (state,key,cause) => state.simulation?.knowledge?.player?.[key]?.cause===cause;
const known = (state,key) => state.simulation?.knowledge?.player?.[key]?.stage==='understood';

export const hogwartsSpellRules = {
    world:'hogwarts',
    worldId:'book.hp.lead.world',
    location:'book.hp.lead.school_hall',
    target:targetResolver({board:'object',weight:'object',rail:'place'}),
    targets:{board:'Practice board',weight:'Brass weight',rail:'Hand at the rail'},
    knows:(state,method) => method!=='hp.summoning'||known(state,HP_SPELL_PRACTICE+'.accio'),
    operations:{
        lift:liftBoard,
        support:liftBoard,
        move:({bindings}) => bindings.target==='weight' && bindings.destination==='rail' &&
            action(summonWeight),
        release:({bindings}) => bindings.target==='board' && action(HP_SPELL_PRACTICE+'.release_board'),
    },
    worked:(state,id,cause) => id===summonWeight
        ? observed(state,HP_SPELL_PRACTICE+'.trial.accio.weight.worked',cause)
        : boardAloft(state)===(id===HP_LIFT_BOARD_COMMAND),
};

export const cyoriaSpellRules = {
    world:'cyoria',
    worldId:MOL_IDS.world,
    location:MOL_LOCATIONS.court,
    target:targetResolver({slate:'place'}),
    targets:{slate:'Practice slate'},
    knows:(state,method) => known(state,MOL_LIGHT_PREFIX+'.'+{
        'mol.torch':'torch_formula','mol.direct_light':'shaping_control','mol.oblique':'oblique_formula',
    }[method]),
    operations:{
        illuminate:({bindings,method}) => bindings.area==='slate' && Object.hasOwn(lightMethods,method) &&
            {type:'book_mol',id:MOL_LIGHT_PREFIX+'.'+lightMethods[method]},
    },
    worked:(state,id,cause) => observed(state,MOL_LIGHT_PREFIX+'.trial.'+id.split('.').at(-1)+'.worked',cause),
};
