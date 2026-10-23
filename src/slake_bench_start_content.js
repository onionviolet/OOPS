// Original, opt-in start (queue O1, 2026-10-23): one mechanism chain from reagent to effect.
// Quicklime and clean water react in a slaking pit (a mass-conserving craft law, resolved by
// craft_resolver); the released heat is banked in the bench's heat reserve (energy_resources);
// a learned hot-press method spends that reserve to bake dough into flatbread. Without the
// reaction there is no heat, so the poor start gets a non-body route to a useful trade.
// The reaction's heat yield is read from the resolver once, at definition time, so the pack
// stays plain data. Importing this module enrolls nothing.
import {defineCatalogue} from './craft_materials.js';
import {defineCraftLaw, resolveBatch} from './craft_resolver.js';
import {compileStructuredAbilities} from './structured_ability_runtime.js';
import {eq} from './basics.js';
export const SLAKE_BENCH_PACK_ID = 'slakebench';
const P = SLAKE_BENCH_PACK_ID;
const key = name => JSON.stringify({id:`${P}.${name}`});

const catalogue = defineCatalogue({id:`${P}.chem`, revision:1, basis:1000,
    axes:[{id:'lime', kind:'fraction', label:'quicklime'}, {id:'water', kind:'fraction', label:'free water'}, {id:'slaked', kind:'fraction', label:'slaked lime'}, {id:'heat', kind:'fraction', label:'released heat'}],
    tags:[{id:'mineral', kind:'origin', parents:[], revision:1}, {id:'liquid', kind:'phase', parents:[], revision:1}, {id:'solvent', kind:'use', parents:['liquid'], revision:1}],
    families:[], materials:[{id:'Quicklime', revision:1, tags:['mineral'], phase:'powder', properties:{lime:1000}}, {id:'Clean water', revision:1, tags:['solvent'], phase:'liquid', properties:{water:1000}}]});
export const slakeLaw = defineCraftLaw({id:`${P}.slake`, revision:1, catalogue, carrier:'Slaking pit', ops:[],
    reactions:[{id:'slake', limit:1000, reactants:{lime:1, water:1}, products:{slaked:1, heat:1}}],
    outputs:[{id:'warmth', route:'heat', effect:'reserve', axis:'heat', per:2, mode:'total'}], tagLaws:[]});
const material = id => catalogue.materials.get?.(id) ?? catalogue.materials[id];
// One measure of each reagent: what the law releases and consumes.
export const slakeBatch = resolveBatch(slakeLaw, {inputs:[{material:material('Quicklime'), qty:1}, {material:material('Clean water'), qty:1}]}).product;
export const SLAKE_HEAT = slakeBatch.outputs.heat.reserve;

export function createSlakeBenchStartContent() {
    const world = `${P}.yard`, room = `${P}.room`, heat = `${P}.heat`;
    const alive = {all:[eq('actor.life', 'alive'), eq('native.ready')]};
    const command = (name, label, extra = {}) => ({id:`${P}.${name}`, revision:1, label, group:'structured_local', worldId:world, actorId:'player', location:room, audience:['$actor'], costs:[], effects:[], requires:alive, ...extra});
    const sources = [{id:`${P}.method`, revision:1, kind:'technique', label:'Hot-press baking', grants:[], bioDetail:'You know how to bake flatbread on a plate heated from the slaking pit.'}];
    const abilities = [{id:`${P}.press`, commandId:`${P}.bake`, sourceId:`${P}.method`, powerId:`${P}.hot_press`, function:'craft', acquisition:'learned', executionKind:'device-construct',
        control:eq('actor.life', 'alive'), target:null, counters:[], carriers:[]}];
    const commands = [
        command('slake', 'Slake one measure of quicklime with water · heat', {
            description:`Quench one measure of quicklime in one measure of clean water. The reaction conserves mass: it leaves slaked lime and releases heat, which the bench banks as ${SLAKE_HEAT} units of reserve (the reserve holds six; extra heat is lost to the air). It also strains the pit.`,
            costs:[{type:'item', key:key('quicklime'), amount:-1}, {type:'item', key:key('water'), amount:-1}],
            effects:[{type:'item', key:key('slaked_lime'), amount:1}, {type:'energy', energyId:heat, operation:'recover', amount:SLAKE_HEAT},
                {type:'knowledge', key:`${P}.slaked`, stage:'understood', value:'Quicklime and water give slaked lime and a great deal of heat. The pit holds the heat for a while; I can bake on it.'}]}),
        command('bake', 'Bake dough on the heated plate · uses heat', {
            powerId:`${P}.hot_press`,
            description:'Press a dough round on the plate. Baking spends two units of the pit’s heat reserve and strains the plate; with no heat banked the plate stays cold.',
            costs:[{type:'item', key:key('dough'), amount:-1}, {type:'energy', energyId:heat, operation:'use', output:2, control:1}],
            effects:[{type:'item', key:key('flatbread'), amount:1}]}),
        command('rest', 'Let the plate cool', {
            duration:3, cancellation:'refund', reservationReturns:1, completionRequires:alive, completionCoLocated:true, completionFailure:'refund',
            description:'Leave the plate to cool and settle. It clears the strain from baking; it adds no heat.',
            effects:[{type:'energy', energyId:heat, operation:'recover', amount:0, cooling:3}]}),
    ];
    const definition = {id:P, world:{id:world}, sources, abilities,
        simulation:{powers:[{id:`${P}.hot_press`, revision:1, label:'Hot press', model:'practice', capacity:2, cooldown:0}], commands}};
    const compiled = compileStructuredAbilities(definition);
    return {
        schema:2, id:P, revision:1, title:'Slake bench',
        description:'Optional original start: an ordinary adult with no gift at all, only a yard bench, a pit, quicklime and water. Slaking lime releases heat that you bank and spend to bake flatbread. No combat or Frontier campaign is required. Closing the browser pauses its played clock.',
        compatibility:{legacy:'preserve-dormant', origin:'mandatory'}, admission:{forms:['human'], lifeStages:['adult']}, capabilities:['native-stock', 'jobs'],
        world:{id:world, label:'Original lime yard'},
        locations:[{id:room, label:'Lime yard', description:'A walled yard with a stone slaking pit and an iron baking plate set over it.', underRoof:true}],
        items:[['quicklime', 'Quicklime', 'A lump of burnt lime. It reacts hard with water.'], ['water', 'Clean water', 'A jar of clean water.'], ['slaked_lime', 'Slaked lime', 'Lime that has taken up water. It leaves the heat behind.'],
            ['dough', 'Dough round', 'A round of flatbread dough.'], ['flatbread', 'Flatbread', 'A flat loaf baked on the heated plate.']].map(([id, label, description], i) => ({id:`${P}.${id}`, label, description, value:id === 'flatbread' ? 3 : 1})),
        starts:[{id:`${P}.start`, locationId:room, description:'You begin an adult life with no gift, a pit, three lumps of quicklime, three jars of water and six dough rounds.',
            body:{id:`${P}.player.body`, ownerId:'player', controllerId:'player', form:'human', lifeStage:'adult', hands:2, mobile:true},
            effects:[{type:'source', sourceId:`${P}.method`, operation:'grant', awakened:true, active:true, origin:'trained'}, {type:'power', powerId:`${P}.hot_press`, operation:'learn'}, {type:'energy', energyId:heat, operation:'learn'},
                {type:'item', key:key('quicklime'), amount:3}, {type:'item', key:key('water'), amount:3}, {type:'item', key:key('dough'), amount:6},
                {type:'knowledge', key:`${P}.opening`, stage:'understood', value:'A lime yard with a pit and a plate. Slaking lime makes heat; the plate bakes on it. Nothing here is a gift, only the reaction.'}, ...compiled.seeds]}],
        sources, abilities, simulation:{people:[], energies:[{id:heat, revision:1, label:'Plate heat', capacity:6, output:2, control:1, efficiencyNumerator:1, efficiencyDenominator:1, strainLimit:2, strainPerUse:1}], powers:definition.simulation.powers, commands},
        presentation:{people:{}, status:[{id:`${P}.opening_status`, label:'Your opening', knowledgeKey:`${P}.opening`}, {id:`${P}.slaked_status`, label:'The reaction', knowledgeKey:`${P}.slaked`}]},
    };
}
