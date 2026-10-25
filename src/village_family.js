// Optional original annual household decisions and nine-month gestation. Native
// calendar days own all deadlines; people and actual pedigrees stay in npc_lives.
import {check,natural} from './basics.js';
import {seeded,foundingGenes,member,breed,phenotype,memberView,validateLineage} from './lineage_traits.js';
const DAY_YEAR=360,MAX_PEOPLE=32,CHILDREN=3;
export const familyDay=t=>{check(t&&['year','month','day'].every(k=>natural(t[k])),'This family needs the actual native calendar.');check(t.month>=1&&t.month<=12&&t.day>=1&&t.day<=30,'Use this native calendar’s month and day.');return t.year*DAY_YEAR+(t.month-1)*30+t.day-1;};
const rootSeed=(s,id)=>`${s.seed}:village-person:${id}`;
function ancestry(s,p,sex,trail=new Set()){
 if(p.heritage)return p.heritage;check(!trail.has(p.id),'Village pedigree contains a cycle.');trail=new Set(trail).add(p.id);
 const rng=seeded(rootSeed(s,p.id));if(p.parents.length===2){const mother=s.people.find(q=>q.id===p.parents[0]),father=s.people.find(q=>q.id===p.parents[1]);check(mother&&father,'This inherited person needs both actual parents.');p.heritage=breed(ancestry(s,father,'m',trail),ancestry(s,mother,'f',trail),{rng,id:p.id,name:p.name,sex,bornAt:p.birthYear*DAY_YEAR,members:s.people.filter(p=>p.heritage).map(p=>p.heritage)}).child;}
 else p.heritage=member(p.id,p.name,sex,foundingGenes(rng),{bornAt:p.birthYear*DAY_YEAR});return p.heritage;
}
export function familyPolicy(lives,t,enabled){const s=structuredClone(lives),at=familyDay(t);s.family ||= {schema:1,enabled:false,lastDay:at,nextId:1,pregnancies:[]};s.family.enabled=enabled===true;s.family.lastDay=at;validateVillageFamily(s);return s;}
export function validateVillageFamily(s){
 const f=s.family;if(f===undefined)return;check(f&&Object.keys(f).filter(k=>k!=='losses').sort().join(',')==='enabled,lastDay,nextId,pregnancies,schema'&&f.schema===1&&typeof f.enabled==='boolean'&&natural(f.lastDay)&&natural(f.nextId)&&f.nextId>0&&Array.isArray(f.pregnancies)&&f.pregnancies.length<=16,'Invalid Village family policy.');
 check(f.losses===undefined||Array.isArray(f.losses)&&f.losses.length<=16&&f.losses.every(l=>l&&Object.keys(l).sort().join(',')==='at,mother'&&natural(l.at)&&l.at<=f.lastDay&&s.people.some(p=>p.id===l.mother)),'Invalid interrupted pregnancy record.');
 const ids=new Set(s.people.map(p=>p.id)),mothers=new Set();for(const p of f.pregnancies){check(p&&Object.keys(p).sort().join(',')==='at,count,due,parents'&&natural(p.at)&&p.at<=f.lastDay&&p.due===p.at+270&&[1,2].includes(p.count)&&Array.isArray(p.parents)&&p.parents.length===2&&p.parents[0]!==p.parents[1]&&p.parents.every(id=>ids.has(id))&&!mothers.has(p.parents[0]),'Invalid pending Village pregnancy.');mothers.add(p.parents[0]);}
 const members=s.people.filter(p=>p.heritage).map(p=>p.heritage);if(members.length)validateLineage({schema:1,seed:String(s.seed),profile:'household',selfId:null,members});
 for(const p of s.people)if(p.heritage){check(p.heritage.id===p.id&&p.heritage.name===p.name,'This inherited profile needs its own actual person.');if(p.birthDay!==undefined)check(natural(p.birthDay)&&Math.floor(p.birthDay/DAY_YEAR)===p.birthYear&&p.parents.length===2&&p.heritage.sire===p.parents[1]&&p.heritage.dam===p.parents[0],'A birth needs its actual two-parent pedigree.');}
}
const alive=(p,day)=>p.joinedYear*DAY_YEAR<=day&&p.deathYear*DAY_YEAR>day;
const names=['Aven','Bryn','Caro','Dara','Elin','Fenn','Galen','Hali','Iri','Jori','Kemi','Lumi','Miri','Nola','Ori','Perrin','Quin','Runi','Soli','Tarin','Una','Veya','Wynn','Yari','Zeni'];
// Receives already resolved actual marriage rows, never names or a guessed pair.
export function settleVillageFamily(lives,t,bonds){
 const s=structuredClone(lives),f=s.family;if(!f)return s;const day=familyDay(t);check(day>=f.lastDay,'Village family time cannot run backward.');
 const by=id=>s.people.find(p=>p.id===id),born=[];
 const deliver=until=>{for(const p of [...f.pregnancies].sort((a,b)=>a.due-b.due))if(p.due<=until||by(p.parents[0]).deathYear*DAY_YEAR<=until){const mother=by(p.parents[0]),father=by(p.parents[1]);
  if(mother.deathYear*DAY_YEAR<=p.due){f.losses ||= [];f.losses.push({at:mother.deathYear*DAY_YEAR,mother:mother.id});f.losses=f.losses.slice(-16);}
  else if(alive(mother,p.due))for(let twin=0;twin<p.count;twin++){
   check(s.people.length<MAX_PEOPLE&&s.events.length<=62,'The reserved family registry place changed.');
   let id;do{id='child_'+f.nextId++;}while(s.people.some(p=>p.id===id));const rng=seeded(`${s.seed}:birth:${mother.id}:${father.id}:${p.at}:${twin}`),sex=rng()<.5?'m':'f';let name=names[Math.floor(rng()*names.length)],suffix=2;while(s.people.some(p=>p.name===name))name=names[Math.floor(rng()*names.length)]+' '+suffix++;
   const m=ancestry(s,mother,'f'),d=ancestry(s,father,'m'),heritage=breed(d,m,{rng,id,name,sex,bornAt:p.due,members:s.people.filter(p=>p.heritage).map(p=>p.heritage)}).child,year=Math.floor(p.due/DAY_YEAR),span=65+Math.floor(rng()*20)+2*phenotype(heritage.genes).wind;
   const child={id,name,birthYear:year,birthDay:p.due,joinedYear:year,deathYear:year+span,parents:[mother.id,father.id],spouseId:null,heritage};s.people.push(child);born.push(id);s.events.push({id:'birth:'+id,year,kind:'birth',text:`${mother.name} and ${father.name} welcomed ${name}${p.count===2?' as one of twins':''}.`},{id:'death:'+id,year:child.deathYear,kind:'death',text:`Word from Village: ${name} died peacefully, aged ${span}.`});
  }
  f.pregnancies=f.pregnancies.filter(q=>q!==p);
 }};
 // Annual decisions are bounded by the actual available register. Long absent
 // intervals do not synthesize unlimited unknown generations or new couples.
 const from=Math.floor(f.lastDay/DAY_YEAR)+1,to=Math.floor(day/DAY_YEAR);let reserved=f.pregnancies.reduce((n,p)=>n+p.count,0);
 for(let y=from;y<=to;y++){
  const at=y*DAY_YEAR;deliver(at);reserved=f.pregnancies.reduce((n,p)=>n+p.count,0);
  if(!f.enabled||s.people.length+reserved>=MAX_PEOPLE||s.events.length+reserved*2>=64)break;
  for(const pair of typeof bonds==='function'?bonds(y):bonds){if(pair.status!=='married'||pair.since!=null&&y<pair.since)continue;const a=by(pair.a),b=by(pair.b);if(!a||!b||!alive(a,at)||!alive(b,at)||y-a.birthYear<18||y-b.birthYear<18)continue;
   // Original authored founders supply reproductive roles. Later inherited
   // people carry their own sex; this is a local biological method, not a
   // prohibition on other worlds' family means.
   const am=ancestry(s,a,a.id==='oren'||a.id==='lio'?'m':'f'),bm=ancestry(s,b,b.id==='oren'||b.id==='lio'?'m':'f');if(am.sex===bm.sex)continue;const mother=am.sex==='f'?a:b,father=mother===a?b:a;
   if(y-mother.birthYear>48||f.pregnancies.some(p=>p.parents[0]===mother.id)||s.people.filter(p=>p.parents.includes(mother.id)&&p.parents.includes(father.id)).length>=CHILDREN)continue;
   const rng=seeded(`${s.seed}:conception:${pair.key}:${y}`);if(rng()>=.35)continue;const count=rng()<.04?2:1;if(s.people.length+reserved+count>MAX_PEOPLE||s.events.length+2*(reserved+count)>64)continue;
   f.pregnancies.push({parents:[mother.id,father.id],at,due:at+270,count});reserved+=count;
  }
  if(y-from>=120)break;
 }
 deliver(day);f.lastDay=day;s.events.sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));
 // A newly born child is known through this birth route even when it happens
 // within the same annual public-life frame.
 s.news=[...new Set([...s.news,...born.map(id=>'birth:'+id)])].sort((a,b)=>{const x=s.events.find(e=>e.id===a),z=s.events.find(e=>e.id===b);return x.year-z.year||a.localeCompare(b);}).slice(-16);validateVillageFamily(s);return s;
}
export function villageFamilyView(s,t){if(!s)return null;const day=familyDay(t),f=s.family;return {enabled:f?.enabled===true,losses:(f?.losses||[]).map(l=>({at:l.at,mother:s.people.find(p=>p.id===l.mother)?.name||'known parent'})),pending:(f?.pregnancies||[]).map(p=>({parents:p.parents.map(id=>s.people.find(p=>p.id===id)?.name||'known parent'),days:Math.max(0,p.due-day)})),children:s.people.filter(p=>p.birthDay!==undefined&&p.birthDay<=day).map(p=>({id:p.id,name:p.name,traits:memberView(p.heritage).map(v=>({label:v.label,level:v.level,known:v.known}))})),capacity:MAX_PEOPLE,perPair:CHILDREN};}
