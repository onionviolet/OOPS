// Clones a native Klein-home checkpoint into the explicitly synthetic seller-tie
// fixture. Never edits the input or a personal save. Use with home-purchase-entry.mjs.
import {readFile,writeFile} from 'node:fs/promises';
const [input,output]=process.argv.slice(2);
if(!input||!output||input===output)throw Error('Pass separate input and output fixture paths.');
const save=JSON.parse(await readFile(input,'utf8'));
if(save.expansion?.actors?.player?.worldId!=='book.lotm.tingen')throw Error('Use the named Klein-home fixture.');
const relations=save.expansion.simulation.relationships;
const r=(relations['lotm.person.cast-618f4df49af02c7da45e']??={}).player??={axes:{},memories:[]};
r.axes['tie.trust']=2;r.memories??=[];
await writeFile(output,JSON.stringify(save));
