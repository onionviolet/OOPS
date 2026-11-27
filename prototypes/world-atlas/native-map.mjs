// A disposable fresh game supplies registered geography, including destinations added at boot.
import {existsSync} from 'node:fs';
import {boot} from '../../scripts/headless/runner.mjs';
import {nativeTravelReport} from './registered-travel.mjs';
const marksFile = new URL('../../src/ui/map_marks.js', import.meta.url);
const decorations = existsSync(marksFile) ? await import(marksFile.href) : null;
const measuredAt=new Date().toISOString(),game=await boot(null,{seed:1});
let rows, others,registeredTravel;
const GROUPS=[[/^book\.hp\./,'Harry Potter'],[/^book\.ri\./,'Reverend Insanity'],[/^book\.ss\./,'Shadow Slave'],
    [/^(p0\d|p06_air)/,'Private test packs'],[/^(Proto23|p23\.)/,'Proto23 reference']];
function locationGroup(id,tags){
    if(tags.book_world_lotm)return 'Lord of the Mysteries';
    if(tags.book_world_mol)return 'Mother of Learning';
    if(tags.book_world_campaign||tags.nested_campaign)return 'Reincarnation Paradise';
    for(const [re,name] of GROUPS)if(re.test(id))return name;
    return 'Frontier, not reached from the Village';
}
try {
    const {locations, activities, NPCRegistry, enemy_templates}=game.internals;
    const ids=new Map(Object.entries(locations).map(([key,value])=>[value,key]));
    const start=ids.get(game.internals.current_location);
    const queue=['Village'], seen=new Set(queue);
    rows=[];
    for(const id of queue){
        const p=locations[id];
        const routes=(p.connected_locations||[]).map(r=>({id:ids.get(r.location),minutes:r.travel_time}));
        if(p.parent_location)routes.push({id:ids.get(p.parent_location)});
        const valid=routes.filter(r=>r.id);
        rows.push({id,label:p.name||id,current:id===start,routes:valid,people:p.npcs||[],craft:Object.keys(p.crafting?.tiers||{}),activities:Object.keys(p.activities||{}),housing:!!p.housing,combat:!!p.parent_location,
            marks:decorations?.locationMapMarks(p,{activities,trader:id=>NPCRegistry?.get(id)?.tags?.trader}) ?? [],
            danger:decorations?.locationMapDanger(p,enemy_templates ?? {}) ?? null});
        for(const r of valid)if(!seen.has(r.id)){seen.add(r.id);queue.push(r.id)}
    }
    // Every other registered location: book worlds walk by their own hosts, so group by owner.
    others=Object.entries(locations).filter(([id])=>!seen.has(id)).map(([id,p])=>({id,label:p.name||id,group:locationGroup(id,p.tags||{}),
        routes:(p.connected_locations||[]).map(r=>ids.get(r.location)).filter(Boolean),people:p.npcs||[],
        activities:Object.keys(p.activities||{}),stations:(p.stations||[]).map(s=>s.name||s.id),combat:!!p.tags?.combat_zone}));
    registeredTravel=nativeTravelReport([...rows.map(p=>({...p,group:'Village'})),...others],locations,
        [...game.internals.expeditionRegistry.simulation.commands.values()],measuredAt);
} finally {game.close()}
process.stdout.write(JSON.stringify({frontier:rows,others,registeredTravel}));
