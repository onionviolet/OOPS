// Pure start recipes. Axis order belongs to the world; saves keep resolved native fields.
export const START_MERGE_RULES = Object.freeze({money:'sum',items:'append by id+quality',pockets:'append',location:'last',quest:'last',skills:'sum',knowledge:'append',text:'append',lead:'last'});
export function seededStartRng(seed) {
    let h=2166136261;
    for(const c of String(seed)) {h^=c.charCodeAt(0);h=Math.imul(h,16777619);}
    return () => {h=(h+0x6D2B79F5)|0;let t=Math.imul(h^(h>>>15),1|h);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};
}
function compose(layers,base={}) {
    const s={money:0,items:[],pockets:[],location:null,quest:null,skills:{},knowledge:[],text:[],lead:null};
    for(const {axis,id:layerId,patch:p={}} of [{patch:base},...layers]) {
        s.money+=p.money ?? 0;
        for(const item of p.items || []) {
            const old=s.items.find(it=>it.id===item.id && it.quality===item.quality);
            if(old)old.count+=item.count ?? 1;else s.items.push({...item,count:item.count ?? 1});
        }
        if(axis!==undefined)for(const itemId of new Set((p.items || []).map(item=>item.id))) {
            if(Object.hasOwn(p.pockets || {},itemId))s.pockets.push({axis,layerId,itemId,line:p.pockets[itemId]});
        }
        for(const field of ['location','quest','lead'])if(Object.hasOwn(p,field))s[field]=p[field];
        for(const [id,n] of Object.entries(p.skills || {}))s.skills[id]=(s.skills[id] || 0)+n;
        for(const field of ['knowledge','text'])s[field].push(...(p[field] || []));
    }
    return s;
}
// Error axes identify the contributors to reconsider, preserving unrelated picks.
export function validateStart(result) {
    const {snapshot:s,layers=[]}=result,errors=[];
    const writers=field=>{const l=layers.filter(l=>Object.hasOwn(l.patch || {},field)).at(-1);return l ? [l.axis] : [];};
    const contributors=fields=>{const axes=[...new Set(fields.flatMap(writers))];return axes.length ? axes : layers.map(l=>l.axis);};
    if(typeof s?.location!=='string' || !s.location.trim())errors.push({reason:'missing location',axes:contributors(['location'])});
    if(!((typeof s?.quest==='string' && s.quest.trim()) || (typeof s?.lead==='string' && s.lead.trim())))
        errors.push({reason:'missing first lead',axes:contributors(['quest','lead'])});
    for(let i=0;i<layers.length;i++) {
        const a=layers[i],before=layers.slice(0,i),tags=new Set(before.flatMap(l=>l.tags || []));
        if((a.needs || []).some(tag=>!tags.has(tag)))errors.push({reason:'unmet need',axes:[a.axis,...before.map(l=>l.axis)]});
        for(const b of before)if((a.excludes || []).some(tag=>(b.tags || []).includes(tag)) || (b.excludes || []).some(tag=>(a.tags || []).includes(tag)))
            errors.push({reason:'layer conflict',axes:[a.axis,b.axis]});
    }
    return {valid:errors.length===0,errors};
}
function candidates(layers,rng) {
    const pool=layers.filter(l=>(l.weight ?? 1)>0),out=[];
    // Weighted order without replacement gives a bounded, seeded reroll sequence.
    while(pool.length) {
        const total=pool.reduce((n,l)=>n+(l.weight ?? 1),0);let draw=rng()*total,index=0;
        while(index<pool.length-1 && (draw-=pool[index].weight ?? 1)>=0)index++;
        out.push(pool.splice(index,1)[0]);
    }
    return out;
}
export function resolveStart(world,choices={},seed='') {
    seed=String(seed);
    const pools=world.axes.map(axis=>{
        const choice=choices[axis] || {mode:'roll'},layers=world.layers[axis];
        if(!['lock','roll','unknown'].includes(choice.mode))throw new Error(`Invalid start mode: ${axis}.`);
        if(choice.mode==='lock') {
            const l=layers.find(l=>l.id===choice.layerId);
            if(!l)throw new Error(`Unknown start layer: ${axis}/${choice.layerId}.`);
            return [l];
        }
        return candidates(layers,seededStartRng(`${world.id}:${world.revision}:${seed}:${axis}`));
    });
    const make=layers=>({snapshot:compose(layers,world.base),provenance:{worldId:world.id,revision:world.revision,seed,
        layers:layers.map(({axis,id,revision})=>({axis,id,revision}))},hidden:world.axes.filter(axis=>choices[axis]?.mode==='unknown'),layers});
    function pick(index,layers) {
        if(index===world.axes.length) {const result=make(layers),check=validateStart(result);return check.valid ? {result} : check;}
        const axis=world.axes[index];let failed={errors:[{reason:'no eligible layer',axes:[axis]}]};
        for(const layer of pools[index]) {
            failed=pick(index+1,[...layers,{...structuredClone(layer),axis}]);
            if(failed.result)return failed;
            // A bad location/lead or conflict rerolls only its contributing axes.
            if(!failed.errors.some(e=>e.axes.includes(axis)))return failed;
        }
        return failed;
    }
    const resolved=pick(0,[]);
    if(!resolved.result)throw new Error(`Invalid start: ${resolved.errors.map(e=>e.reason).join(', ')}.`);
    return resolved.result;
}
