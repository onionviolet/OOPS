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
