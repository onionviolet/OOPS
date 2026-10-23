// Original, opt-in start (queue A5, 2026-10-23): a borrowed power with a different shape from
// warm hands. A lamp-keeper lends night sight in two measures; each use burns a measure of the
// keeper's oil (a lasting price) and an empty loan refills only while you hold oil to refit it.
// Only data rows on the structured ability descriptor; no core file changes. Enrolls nothing on import.
import {compileStructuredAbilities} from './structured_ability_runtime.js';
import {eq} from './basics.js';
export const LANTERN_LOAN_PACK_ID = 'lanternloan';
const P = LANTERN_LOAN_PACK_ID;
const key = name => JSON.stringify({id:`${P}.${name}`});
const alive = {all:[eq('actor.life', 'alive'), eq('native.ready')]};

export function createLanternLoanStartContent() {
    const world = `${P}.cellar`, room = `${P}.room`;
    const sources = [{id:`${P}.loan`, revision:1, kind:'trait', label:'Lent night sight', grants:[],
        bioDetail:'The lamp-keeper lent you her night sight. It is hers to take back.'}];
    const abilities = [{id:`${P}.sight`, commandId:`${P}.see`, sourceId:`${P}.loan`, function:'perception', acquisition:'borrowed', executionKind:'temporary-construct',
        control:eq('actor.life', 'alive'), target:null, counters:[], carriers:[],
        conditions:[{id:`${P}.measures`, charges:{max:2, recharge:{when:'empty', label:'Refit the loan with the keeper’s oil', requires:{fact:`item.${key('oil')}`, op:'gte', value:1, reason:'The keeper’s loan needs a measure of her oil to refit.'}}},
            price:[{type:'item', key:key('oil'), amount:-1}]}]}];
    const commands = [{id:`${P}.see`, revision:1, label:'Look into the dark with the lent sight · 1 oil', group:'structured_local', worldId:world, actorId:'player', location:room, audience:['$actor'], requires:alive,
        description:'Borrowed night sight shows what the cellar hides. Each look burns a measure of the keeper’s oil, and the loan holds two measures before it must be refit.',
        costs:[], effects:[{type:'knowledge', key:`${P}.cellar_seen`, stage:'seen', value:'With the lent sight I saw the cellar plainly: a low door behind the barrels and a ledger on the shelf.'}]}];
    const compiled = compileStructuredAbilities({id:P, world:{id:world}, sources, abilities, simulation:{commands, powers:[]}});
    return {
        schema:2, id:P, revision:1, title:'Lantern loan',
        description:'Optional original start: an ordinary adult holding a borrowed gift. A lamp-keeper lends you night sight in two measures; each look burns her oil, and refitting an empty loan needs more of it. No combat or Frontier campaign is required. Closing the browser pauses its played clock.',
        compatibility:{legacy:'preserve-dormant', origin:'mandatory'}, admission:{forms:['human'], lifeStages:['adult']}, capabilities:['native-stock', 'jobs'],
        world:{id:world, label:'Original lamp cellar'},
        locations:[{id:room, label:'Lamp cellar', description:'A dark cellar of barrels and shelves, lit by one cold lamp.', underRoof:true}],
        items:[{id:`${P}.oil`, label:'Keeper’s lamp oil', description:'A measure of the lamp-keeper’s oil. The loan burns it.', value:1}],
        starts:[{id:`${P}.start`, locationId:room, description:'You begin an adult life with the lamp-keeper’s lent night sight and three measures of her oil.',
            body:{id:`${P}.player.body`, ownerId:'player', controllerId:'player', form:'human', lifeStage:'adult', hands:2, mobile:true},
            effects:[{type:'source', sourceId:`${P}.loan`, operation:'grant', awakened:true, active:true, origin:'acquired'}, {type:'item', key:key('oil'), amount:3},
                {type:'knowledge', key:`${P}.opening`, stage:'understood', value:'A dark cellar and a lent gift: the keeper’s night sight, two looks at a time, paid for in her oil.'}, ...compiled.seeds]}],
        sources, abilities, simulation:{people:[], powers:[], commands},
        presentation:{people:{}, status:[{id:`${P}.opening_status`, label:'Your opening', knowledgeKey:`${P}.opening`}, {id:`${P}.cellar_seen_status`, label:'What you saw', knowledgeKey:`${P}.cellar_seen`}]},
    };
}
