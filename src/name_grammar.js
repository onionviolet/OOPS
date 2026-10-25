// Original Village culture; saved names win over future grammar edits.
import {deriveSimulationSeed} from './simulation_resolution.js';
export const villageAuthoredNames = ['Maia','Oren','Lio','Neri','Rhea','Nima','Iona','Tessa','village elder','village guard','old craftsman'];
export const nameGrammars = Object.freeze({
    'base.frontier': {revision:1, cultures:[
        {id:'hill',given:['Bram','Hale','Dessa','Pell','Wynn','Tove','Ansel','Mirek','Sela','Koris'],family:['Stoneleigh','Harrow','Tuck','Cairn','Fellwick']},
        {id:'river',given:['Rue','Fenn','Calla','Joss','Ibb','Teal','Marren'],family:['Reedman','Shallow','Weir','Eddy','Sedge']},
        {id:'road',given:['Varo','Kesh','Lindt','Sabe','Doran','Ysolt','Tamar'],family:['Cartwright','Lowe','Tolliver','of the Forest Road']}
    ]}
});
export function generatePersonName({seed,key,worldId='base.frontier',used=[],authored=villageAuthoredNames,grammars=nameGrammars}) {
    const grammar=grammars[worldId];
    if(!grammar || !Number.isInteger(seed) || seed<0 || seed>0xffffffff || typeof key!=='string')throw Error('Unknown name grammar or invalid seed/key.');
    const blocked=new Set([...used,...authored,...authored.map(n=>n.split(/[ ,]/)[0])].map(n=>n.trim().toLowerCase()));
    const choices=grammar.cultures.flatMap(c=>c.given.flatMap(g=>c.family.map(f=>({name:`${g} ${f}`,culture:c.id,given:g}))));
    const offset=deriveSimulationSeed(seed,`names:${worldId}:${key}`)%choices.length;
    for(let i=0;i<choices.length;i++) {
        const n=choices[(offset+i)%choices.length];
        if(!blocked.has(n.name.toLowerCase())&&!blocked.has(n.given.toLowerCase()))return {name:n.name,culture:n.culture,grammarRevision:grammar.revision};
    }
    throw Error('This world name grammar has no unused names.');
}

// Items, relics and places (G6). Same contract as people: saved names win over grammar edits, the
// choice is a pure function of (seed, key), and the grammar revision is returned so a name can say
// which grammar made it. A world supplies its own table; kinds a world lacks fall back to none.
export const thingGrammars = Object.freeze({
    'base.frontier': {revision:1,
        item:{mark:['Ash','Reed','Tallow','Brindle','Moss','Cinder','Wren','Hollow'],form:['keeper','warden','bearer','guard','shell','lining']},
        relic:{mark:['Dawn','Ember','Last','Quiet','Hundred-Winter','Long','Unbroken'],form:['Vow','Mantle','Remembrance','Bulwark','Oath','Watch'],of:['the Forest Road','the Weir','Stoneleigh','the First Frost','the Cairn']},
        place:{mark:['Willow','Cairn','Weir','Harrow','Sedge','Tolliver'],form:['Rest','Crossing','Hollow','Rise','Ford','Stand']},
        faction:{mark:['Reed','Lantern','Weir','Furrow','Road'],form:['Wardens','Compact','Guild','Brotherhood','Circle'],of:['the Ford','the Long Fields','the Forest Road']}
    }
});
export function generateThingName({seed,key,kind,worldId='base.frontier',used=[],grammars=thingGrammars}) {
    const g=grammars[worldId]?.[kind];
    if(!g || !Number.isInteger(seed) || seed<0 || seed>0xffffffff || typeof key!=='string')throw Error('Unknown thing grammar or invalid seed/key.');
    const blocked=new Set(used.map(n=>n.trim().toLowerCase()));
    const choices=g.mark.flatMap(m=>g.form.flatMap(f=>g.of?g.of.map(o=>`${m} ${f} of ${o}`):[`${m}${kind==='item'?'-':' '}${f}`]));
    const offset=deriveSimulationSeed(seed,`names:${worldId}:${kind}:${key}`)%choices.length;
    for(let i=0;i<choices.length;i++) {
        const name=choices[(offset+i)%choices.length];
        if(!blocked.has(name.toLowerCase()))return {name,kind,grammarRevision:grammars[worldId].revision};
    }
    throw Error('This world name grammar has no unused names.');
}
