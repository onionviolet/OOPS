import {registerDomain} from './domain_registry.js';
import {readGearComponentLineage} from './gear_component_lineage.js';
import {readMaterialLineage} from './material_lineage.js';
import {parseHeirloomKey} from './heirloom_items.js';
import {nativeLineageFamily} from './processed_materials.js';
import {validateSpecimen} from './harvest.js';
import {calendarMinutes} from './world_rhythm.js';
const own = key => {try{const parsed=JSON.parse(key);return parsed.lineage!=null || parsed.componentLineage!=null;}catch{return false;}};
// No save slice: the key is the product record, native count is the stock owner.
// Existing native chest transfers split/coalesce exact keys without rewriting
// the immutable batch. Different batches remain separately selectable.
export function validateMaterialLineageEnvelope(envelope) {
    const now=envelope['current time']?calendarMinutes(envelope['current time']):Number.MAX_SAFE_INTEGER;
    function validate(key,depth=0) {
        let parsed;
        try {parsed=JSON.parse(key);} catch {return;}
        if(!parsed || (parsed.lineage==null && parsed.componentLineage==null))return;
        if(depth>12)throw Error('Unsupported material lineage depth.');
        if(parseHeirloomKey(key))return; // G3: a unique named object, its identity is the key; story_requests owns its request
        const parts=readGearComponentLineage(parsed);
        if(parts) for(const part of Object.values(parts)) validate(part,depth+1);
        const lineage=readMaterialLineage(key);
        if(!lineage)return;
        if(nativeLineageFamily(parsed.id)!==lineage.family)throw Error('Unsupported native material lineage carrier.');
        for(const e of lineage.history) {
            if(e.at>now)throw Error('Material process is ahead of its owning clock.');
            for(const input of e.inputs) {
                const facts=input.facts;
                if(facts?.born>e.at)throw Error('Material process predates its source.');
                const specimen=facts?.evidence?.specimen;
                if(specimen){validateSpecimen(specimen,e.at);if(facts.born!==specimen.born)throw Error('Material source age differs from its specimen.');}
                validate(input.item_key,depth+1);
            }
        }
    }
    function walk(value) {
        if(typeof value==='string'){if(value.startsWith('{'))validate(value);return;}
        if(!value||typeof value!=='object')return;
        for(const [key,row]of Object.entries(value)){if(key.startsWith('{'))validate(key);walk(row);}
    }
    walk(envelope.inventories);walk(envelope.character);walk(envelope.harvest);
}
registerDomain({id:'material_lineage',initialState:()=>null,ownsItemKey:own,
    validate:(_,envelope)=>validateMaterialLineageEnvelope(envelope)});
