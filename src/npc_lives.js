import {validateVillageFamily,settleVillageFamily,familyPolicy,villageFamilyView} from './village_family.js';
// Original optional Village household. Yearly public lives, no native NPC powers.
import {natural} from './basics.js';
import {fnv1a} from './hash_rng.js';
const check=(v,m)=>{if(!v)throw new Error(`Invalid village lives: ${m}.`);};
const hash=s=>fnv1a(2166136261,s);
// Per-world hardship dial (G25/G26, 2026-10-23). Default none: every scripted death is old age. A chosen or forewarned
// hardship (AD19) moves the first household's parents' deaths early with a named cause, so children can be orphaned.
export const HARDSHIPS=Object.freeze({fever_winter:{after:8,cause:'illness',reason:'A fever winter takes the household\'s parents while their children are small.',text:(name,age)=>`Word from Village: ${name} died of the fever winter, aged ${age}.`}});
export function createVillageLives(year,seed=1,hardship=null) {
    check(natural(year)&&year>=100 && natural(seed)&&seed<=0xffffffff && (hardship===null||Object.hasOwn(HARDSHIPS,hardship)),'beginning');
    const people=[],events=[];
    const person=(id,name,birthYear,joinedYear,parents=[])=>{
        const p={id,name,birthYear,joinedYear,deathYear:birthYear+65+hash(`${seed}:${id}`)%20,parents,spouseId:null};people.push(p);
        events.push({id:`death:${id}`,year:p.deathYear,kind:'death',text:`Word from Village: ${name} died peacefully, aged ${p.deathYear-birthYear}.`});return p;
    };
    const maia=person('maia','Maia',year-25,year),oren=person('oren','Oren',year-27,year);maia.spouseId=oren.id;oren.spouseId=maia.id;
    if(hardship){const h=HARDSHIPS[hardship];for(const p of [maia,oren]){p.deathYear=year+h.after;p.cause=h.cause;const e=events.find(e=>e.id===`death:${p.id}`);e.year=p.deathYear;e.text=h.text(p.name,p.deathYear-p.birthYear);}}
    const lio=person('lio','Lio',year-4,year,[maia.id,oren.id]);
    const neri=person('neri','Neri',year+3,year+3,[maia.id,oren.id]);
    events.push({id:'birth:neri',year:neri.birthYear,kind:'birth',text:'Word from Village: Maia and Oren welcomed Neri into their family.'});
    // One explicitly bounded family branch; future members are not shown early.
    const rhea=person('rhea','Rhea',lio.birthYear-1,lio.birthYear+24);lio.spouseId=rhea.id;rhea.spouseId=lio.id;
    events.push({id:'marriage:lio',year:rhea.joinedYear,kind:'marriage',text:'Word from Village: Lio and Rhea married beneath the old trees.'});
    const nima=person('nima','Nima',lio.birthYear+28,lio.birthYear+28,[lio.id,rhea.id]);
    events.push({id:'birth:nima',year:nima.birthYear,kind:'birth',text:'Word from Village: Lio and Rhea welcomed Nima into their family.'});
    events.sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));
    return validateVillageLives({schema:1,startYear:year,lastYear:year,seed,people,events,news:[],...(hardship?{hardship}:{})});
}
export function validateVillageLives(s) {
    check(s&&s.schema===1&&natural(s.startYear)&&natural(s.lastYear)&&s.lastYear>=s.startYear&&natural(s.seed)&&s.seed<=0xffffffff,'schema or clock');
    check(Array.isArray(s.people)&&s.people.length<=32&&Array.isArray(s.events)&&s.events.length<=64&&Array.isArray(s.news)&&s.news.length<=16,'bounds');
    const ids=new Set(s.people.map(p=>p.id));check(ids.size===s.people.length,'duplicate people');
    for(const p of s.people)check(typeof p.id==='string'&&/^[a-z][a-z0-9_]*$/.test(p.id)&&typeof p.name==='string'&&p.name.length>0&&p.name.length<=48&&natural(p.birthYear)&&natural(p.joinedYear)&&p.joinedYear>=p.birthYear&&natural(p.deathYear)&&p.deathYear>p.joinedYear&&Array.isArray(p.parents)&&p.parents.length<=2&&p.parents.every(id=>ids.has(id)&&id!==p.id)&&(p.spouseId===null||ids.has(p.spouseId)&&p.spouseId!==p.id)&&(p.cause===undefined||typeof p.cause==='string'&&/^[a-z]{3,12}$/.test(p.cause)),'person');
    validateVillageFamily(s);
    const events=new Set();let previous=-1;
    for(const e of s.events){check(typeof e.id==='string'&&e.id.length<=64&&!events.has(e.id)&&natural(e.year)&&e.year>=s.startYear&&e.year>=previous&&['birth','marriage','death'].includes(e.kind)&&typeof e.text==='string'&&e.text.length>0&&e.text.length<=240,'event');events.add(e.id);previous=e.year;}
    check(new Set(s.news).size===s.news.length&&s.news.every(id=>events.has(id)&&s.events.find(e=>e.id===id).year<=s.lastYear),'news');return s;
}
export function advanceVillageLives(state,year) {
    validateVillageLives(state);check(natural(year)&&year>=state.lastYear,'year went backward');
    const s=structuredClone(state);
    s.news=[...s.news,...s.events.filter(e=>e.year>state.lastYear&&e.year<=year).map(e=>e.id)].slice(-16);s.lastYear=year;
    return validateVillageLives(s);
}
export function villageLivesView(state) {
    if(!state)return {people:[],news:[]};validateVillageLives(state);
    const known=state.people.filter(p=>p.joinedYear<=state.lastYear),ids=new Set(known.map(p=>p.id));
    return {year:state.lastYear,people:known.map(p=>({id:p.id,name:p.name,age:Math.min(state.lastYear,p.deathYear)-p.birthYear,alive:state.lastYear<p.deathYear,parents:p.parents.map(id=>known.find(p=>p.id===id)?.name).filter(Boolean),spouse:ids.has(p.spouseId)?known.find(other=>other.id===p.spouseId).name:null})),news:state.news.map(id=>state.events.find(e=>e.id===id)).reverse()};
}

// Enroll the one adult recruit in the existing bounded public-life owner.
export function addVillageRecruit(state,year,seed=1) {
    const s=structuredClone(state ?? createVillageLives(year,seed));validateVillageLives(s);
    if(s.people.some(p=>p.id==='iona'))return s;
    s.people.push({id:'iona',name:'Iona',birthYear:year-19,joinedYear:year,deathYear:year+60,parents:[],spouseId:null});
    s.events.push({id:'death:iona',year:year+60,kind:'death',text:'Word from Village: Iona, once your patrol recruit, died peacefully.'});
    s.events.sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));return validateVillageLives(s);
}

// Relationship status machine (G03). `spouseId` stays the authority for "married"; widowed is derived from a death.
// `bonds` holds only overlays {"a|b": {status:'courting'|'estranged'|'married', since}} written by player actions
// and the yearly scan. Estranged restores to married by mending or by time; courting ends freely (AD19).
export const BOND_STATUSES=Object.freeze(['courting','married','estranged','widowed']);
export const pairKey=(a,b)=>a<b?`${a}|${b}`:`${b}|${a}`;
export function bondStatuses(state,bonds={},year=state.lastYear) {
    validateVillageLives(state);const by=new Map(state.people.filter(p=>p.joinedYear<=year).map(p=>[p.id,p])),alive=p=>year<p.deathYear,seen=new Set(),rows=[];
    const add=(a,b,status,extra={})=>{const key=pairKey(a,b);if(seen.has(key))return;seen.add(key);rows.push({key,a,b,status,...extra});};
    const settle=(a,b,overlay,base)=>{const pa=by.get(a),pb=by.get(b);if(!pa||!pb)return;
        if(!alive(pa)&&!alive(pb))return;
        if(!alive(pa)||!alive(pb)){if(base==='married')add(alive(pa)?a:b,alive(pa)?b:a,'widowed',{since:Math.min(pa.deathYear,pb.deathYear)});return;}
        add(a,b,overlay?.status??base,overlay?.since!=null?{since:overlay.since}:{});};
    for(const p of state.people)if(p.spouseId&&by.has(p.id)&&by.has(p.spouseId))settle(p.id,p.spouseId,bonds[pairKey(p.id,p.spouseId)]?.status==='estranged'?bonds[pairKey(p.id,p.spouseId)]:null,'married');
    for(const [key,o] of Object.entries(bonds)){const [a,b]=key.split('|');settle(a,b,o,o.status);}
    return rows.sort((x,y)=>x.key.localeCompare(y.key));
}


// Only the detached native save writer calls this producer. Projection and
// ordinary annual reads do not conceive or deliver a child.
export function stageVillageFamilySave(save){
 if(!save.npc_lives?.family)return save.npc_lives;
 const year=save['current time'].year,state=advanceVillageLives(save.npc_lives,year),bonds=at=>bondStatuses(state,Object.fromEntries(Object.entries(save.life_events?.bonds||{}).filter(([,b])=>b.since<=at)),at);
 return validateVillageLives(settleVillageFamily(state,save['current time'],bonds));
}
export {familyPolicy,villageFamilyView};
