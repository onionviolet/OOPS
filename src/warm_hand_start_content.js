// Original, opt-in start (queue A3, 2026-10-23): an innate, small, limited gift.
// Warm hands are a body faculty: they warm a cold loaf by paying the holder's own
// body heat. Mastery lowers its stamina price and, from two steps, unlocks a three-loaf batch; a short rest between warmings is the power's cooldown (AD5 dials,
// reason: the heat is the holder's own). Importing this module enrolls nothing.
import {compileStructuredAbilities} from './structured_ability_runtime.js';
import {eq} from './basics.js';
export const WARM_HAND_PACK_ID = 'warmhand';
const P = WARM_HAND_PACK_ID;
const key = name => JSON.stringify({id:`${P}.${name}`});
const flag = (name, value = true) => ({type:'fact', scope:'actor', key:`${P}.${name}`, value});
const note = (name, value) => ({type:'knowledge', key:`${P}.${name}`, stage:'understood', value});
const alive = {all:[eq('actor.life', 'alive'), eq('native.ready')]};

export function createWarmHandStartContent() {
    const world = `${P}.kitchen`, room = `${P}.room`;
    const command = (name, label, extra = {}) => ({id:`${P}.${name}`, revision:1, label, group:'structured_local', worldId:world, actorId:'player', location:room, audience:['$actor'], costs:[], effects:[], ...extra});
    const sources = [{id:`${P}.gift`, revision:1, kind:'trait', label:'Warm hands', grants:[], look:{slot:'hands',rank:1,text:'Your palms run warm; cold bread steams faintly in them.'},
        bioDetail:'Your palms run warmer than anyone’s. A loaf held a while in them comes back from the cold.'}];
    const stamina = scale => ({type:'vital', key:'stamina', amount:{fact:'power.costScale', scale}});
    const steady = {all:[alive, {fact:`power.${P}.warming.mastery`, op:'gte', value:2, reason:'Your hands are not yet steady enough to warm a whole batch. Practice first.'}]};
    const abilities = [['palms', 'warm'], ['palms_batch', 'warm_batch']].map(([id, commandId]) => ({id:`${P}.${id}`, commandId:`${P}.${commandId}`, sourceId:`${P}.gift`, powerId:`${P}.warming`, function:'craft', acquisition:'innate', executionKind:'body-faculty',
        control:eq('actor.life', 'alive'), target:null, counters:[], carriers:[]}));
    const commands = [
        command('warm', 'Warm a cold loaf in your palms · stamina', {
            powerId:`${P}.warming`, requires:alive,
            description:'Hold a cold loaf until it is warm. The heat is your own, so it costs stamina, and your hands need a short rest between warmings. Practice lowers the stamina price and, once your hands are steady, lets you warm a whole batch.',
            costs:[{type:'item', key:key('cold_loaf'), amount:-1}, stamina(-4)],
            effects:[{type:'item', key:key('warm_loaf'), amount:1}, note('warmed', 'My palms warmed bread that had gone cold. It tires me, and my hands need a little rest before the next warming.')],
        }),
        command('warm_batch', 'Warm three loaves at once · needs steady hands · stamina', {
            powerId:`${P}.warming`, requires:steady,
            description:'With steady hands, warm three cold loaves in one go for the heat of about two single warmings. The same rest applies afterward.',
            costs:[{type:'item', key:key('cold_loaf'), amount:-3}, stamina(-8)],
            effects:[{type:'item', key:key('warm_loaf'), amount:3}, note('warmed', 'My steadier palms warmed a whole batch. It tires me, and my hands need a little rest before the next warming.')],
        }),
        // Growth route. Practice is an ordinary timed command, so it can be queued as a routine and
        // runs on played time while the player is elsewhere; closing the browser pauses it (current owners).
        command('practice', 'Steady your hands against the cold stone · 3 min · stamina', {
            duration:3, cancellation:'refund', reservationReturns:1, requires:alive, completionRequires:alive, completionCoLocated:true, completionFailure:'refund',
            description:'Hold your palms to a cold stone until they stop shaking. Each round adds one step of mastery; at three steps a warming costs half the stamina.',
            costs:[{type:'vital', key:'stamina', amount:-2}],
            effects:[{type:'power', powerId:`${P}.warming`, operation:'refine', amount:1}, note('practice', 'Holding steady against cold stone made my warming hands surer.')],
        }),
    ];
    const initial = [
        {type:'source', sourceId:`${P}.gift`, operation:'grant', awakened:true, active:true, origin:'inherited'},
        {type:'power', powerId:`${P}.warming`, operation:'learn'},
        {type:'item', key:key('cold_loaf'), amount:6},
        flag('begun'),
        note('opening', 'A cold kitchen with six day-old loaves. Your hands have always run warm; you have never made anything of it.'),
    ];
    const definition = {id:P, world:{id:world}, sources, abilities,
        simulation:{powers:[{id:`${P}.warming`, revision:1, label:'Warming', model:'practice', capacity:1, capacityPerMastery:1, cooldown:20,
            masteryBands:[{at:3, costScale:0.5}]}], commands}};
    const compiled = compileStructuredAbilities(definition);
    return {
        schema:2, id:P, revision:1, title:'Warm hands',
        description:'Optional original start: an ordinary adult with one small innate gift. Your hands warm cold bread at the cost of your own stamina and need a short rest between warmings. Steady practice widens it. No combat or Frontier campaign is required. Closing the browser pauses its played clock.',
        compatibility:{legacy:'preserve-dormant', origin:'mandatory'}, admission:{forms:['human'], lifeStages:['adult']}, capabilities:['native-stock', 'jobs'],
        world:{id:world, label:'Original cold kitchen'},
        locations:[{id:room, label:'Cold kitchen', description:'A shuttered kitchen with a cold stone slab and six day-old loaves.', underRoof:true}],
        items:[{id:`${P}.cold_loaf`, label:'Cold loaf', description:'A day-old loaf, hard and cold.', value:1},
            {id:`${P}.warm_loaf`, label:'Warm loaf', description:'A loaf your hands brought back to warmth. People pay more for it.', value:2}],
        starts:[{id:`${P}.start`, locationId:room, description:'You begin an adult life with one small gift: your hands run warm enough to revive cold bread, at the price of your own stamina.',
            body:{id:`${P}.player.body`, ownerId:'player', controllerId:'player', form:'human', lifeStage:'adult', hands:2, mobile:true}, effects:[...initial, ...compiled.seeds]}],
        sources, abilities,
        simulation:{people:[], powers:definition.simulation.powers, commands},
        presentation:{people:{}, status:['opening', 'warmed', 'practice'].map(name => ({id:`${P}.${name}_status`, label:({opening:'Your opening', warmed:'Your gift', practice:'Practice'})[name], knowledgeKey:`${P}.${name}`}))},
    };
}
