// Public authoring records only. Links retain each pack's location namespace.
import {livingKindRegistry,guLivingRows} from '../../src/living_kinds.js';
import {guCatalogue} from '../../src/gu_catalogue.js';
import {BUNDLED_WORLD_PACKS,BUNDLED_LEAD_LIFE_PACKS} from '../../src/world_pack_registry.js';
import {MOL_LOCATIONS} from '../../src/book_world_mol_ids.js';
import {HOME_PLACES} from '../../src/home_content.js';

export function entityLibrary(tingen,officers){
    const records=[];
    function add(group,world,id,label,fields){
        const r={group,world,id,label,fields,links:[]};
        records.push(r);
        return r;
    }
    function connect(a,b,relation,reverse){
        a.links.push({relation,id:b.id});
        if(reverse)b.links.push({relation:reverse,id:a.id});
    }
    const kinds=new Map();
    for(const k of Object.values(livingKindRegistry({extra:guLivingRows(guCatalogue)}).kinds)){
        kinds.set(k.id,add('Living kinds',k.class,'kind:'+k.id,k.label,{
            Body:{class:k.class,needs:k.needs,organs:k.organs},Lifecycle:{stages:k.stages,reproduction:k.reproduction,inheritance:k.inheritance},
            Diet:k.diet,Source:k.source
        }));
    }
    for(const k of kinds.values()){
        const prey = kinds.get(k.fields.Diet.prey);
        if(prey)connect(k,prey,'Prey','Predator');
    }
    const moss=add('Individuals','Household','household.moss','Moss',{Observation:{preview:'See Identified target for the household observer view.'}});
    connect(moss,kinds.get('house_cat'),'Kind','Individual');
    for(const [id,p] of Object.entries(HOME_PLACES)){
        add('Locations',p.world||'base.frontier','home:'+id,p.name,{Description:p.description,Housing:{tenure:p.tenure,capacity:p.capacity,forms:p.forms}});
    }
    for(const p of [...BUNDLED_WORLD_PACKS,...BUNDLED_LEAD_LIFE_PACKS]){
        const geo=new Map();
        const locations=p.native.locations || (p.id==='book.mol'?Object.values(MOL_LOCATIONS).map(id=>({id,label:id})):[]);
        for(const l of locations)geo.set(l.id,add('Locations',p.id,p.id+'/place/'+l.id,l.label,{Description:l.description}));
        for(const c of p.native.definitions?.people||p.native.simulation?.people||[]){
            const person=add('Individuals',p.id,c.id,c.label,{Description:c.description,Body:c.body,Vitals:c.vitals});
            if(geo.has(c.location))connect(person,geo.get(c.location),'Starting location','Starts here');
            if(c.body?.form==='human')connect(person,kinds.get('human'),'Body kind','Individual');
        }
    }
    const people=new Map([...officers].map(([id,label])=>[id,add('Individuals','Tingen',id,label,{})]));
    const places=new Map(tingen.map(p=>[p.name,add('Locations','Tingen','tingen/place/'+p.name,p.name,{District:p.district,Jurisdiction:p.team,Commands:p.actions.map(c=>c.label)})]));
    for(const p of tingen){
        const place=places.get(p.name);
        for(const r of p.routes)connect(place,places.get(r.dest),'Walk · '+r.minutes+' min');
        for(const id of new Set(p.actions.map(a=>a.target)))if(people.has(id))connect(place,people.get(id),'Command target','Target of command here');
    }
    return records;
}
