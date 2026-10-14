import {resolveResponsiveLock,validateVillageRuleOwner,villageRuleRoot} from './mixture_rules.js';
import {xorshift32} from './seeded_streams.js';
import {currentProductAppearanceView} from './product_appearance_view.js';
// Original Village law revision 1. Truth is retained, knowledge is independent.
export const MIXTURE_ID = 'Village mixture';
export const INGREDIENTS = [
    {id:'River bellleaf', price:8, route:'Forest road herbalism'},
    {id:'Emberseed', price:10, route:'Forest road herbalism'},
    {id:'Mellow salt', price:4, route:'Village mixing counter'},
    {id:'Spring water', price:2, route:'Village mixing counter'},
];
const clone = value => structuredClone(value);
const fail = message => {throw new Error(message);};
export function localMixtureSeed(seed, scope) {
    let n=seed>>>0;for(const c of scope)n=Math.imul(n^c.charCodeAt(0),16777619)>>>0;
    return xorshift32(n)||1;
}
export function createMixtureState(seed) {
    if(!Number.isSafeInteger(seed)||seed<0)fail('Unresolved mixture seed.');
    const profiles={};
    for(const {id} of INGREDIENTS){
        const draw=localMixtureSeed(seed,'village.mixtures.family@1:'+id),axis=draw%5;
        const restore=id==='River bellleaf'?100+10*axis:0;
        const vigor=id==='Emberseed'?90+15*axis:0;
        const trace=id==='River bellleaf'?10+axis: id==='Emberseed'?6+axis:0;
        profiles[id]={revision:1,axis,draw,unit:'fictional-mass',basis:1000,
            fractions:{restore,vigor,trace,matrix:1000-restore-vigor-trace}};
    }
    const recipeDraw=localMixtureSeed(seed,'village.mixtures.method@1');
    return {schema:1,revision:1,seed,sequence:0,profiles,products:{},knowledge:{},methods:{},job:null,
        hiddenMethod:{revision:1,process:recipeDraw%2?'steep':'boil',inputs:{'River bellleaf':1,'Emberseed':1,'Spring water':1},draw:recipeDraw,
            witness:{station:'Village mixing counter',supplies:INGREDIENTS.map(i=>i.id),consumer:'oral-village@1'}},lastObservation:null};
}
export function validateMixtureState(s) {
    if(s?.schema!==1||s.revision!==1||!Number.isSafeInteger(s.seed)||!Number.isSafeInteger(s.sequence)||s.sequence<0)fail('Unsupported mixture owner revision.');
    for(const {id} of INGREDIENTS){const p=s.profiles?.[id];
        if(p?.revision!==1||p.unit!=='fictional-mass'||p.basis!==1000||!Number.isInteger(p.axis)||p.axis<0||p.axis>4||!Number.isSafeInteger(p.draw)||p.draw<=0)fail('Unresolved ingredient profile.');
        if(Object.keys(p.fractions||{}).sort().join()!=='matrix,restore,trace,vigor'||Object.values(p.fractions).some(v=>!Number.isSafeInteger(v)||v<0)||Object.values(p.fractions).reduce((a,b)=>a+b,0)!==1000)fail('Unaccounted ingredient fractions.');
    }
    for(const [id,p] of Object.entries(s.products||{})){validateProduct(p,id);if(JSON.stringify(p.revision===1?resolveMixture(s,p.inputs,p.process):resolveResponsiveLock(resolveMixture(s,p.inputs,p.process),p.lawLock))!==JSON.stringify(p))fail('Product disagrees with retained ingredient truth.');}
    if(!s.knowledge||!s.methods||!s.products||!s.hiddenMethod)fail('Missing mixture retained data.');
    for(const [id,k] of Object.entries(s.knowledge))if(!s.products[id]||k.observed!==true||!Number.isSafeInteger(k.at)||k.at<0)fail('Invalid mixture observation.');
    for(const [id,m] of Object.entries(s.methods)){if(!s.knowledge[id]||!s.products[id]||m.revision!==s.products[id].revision||JSON.stringify(m.inputs)!==JSON.stringify(s.products[id].inputs)||m.process!==s.products[id].process)fail('Unresolved learned method.');}
    const h=s.hiddenMethod;
    if(h.revision!==1||!Number.isSafeInteger(h.draw)||h.draw<=0||h.witness?.station!=='Village mixing counter'||h.witness?.consumer!=='oral-village@1'||!INGREDIENTS.every(i=>h.witness.supplies.includes(i.id)))fail('Unresolved hidden method witness.');
    resolveMixture(s,h.inputs,h.process);
    if(s.acquisitions!=null){
        if(typeof s.acquisitions!=='object'||Array.isArray(s.acquisitions))fail('Invalid mixture acquisition ledger.');
        for(const [id,r]of Object.entries(s.acquisitions))if(id!==`mixture.acquisition:${r.sequence}`||!Number.isSafeInteger(r.sequence)||r.sequence<1||r.sequence>s.sequence||!s.products[r.product]||r.revision!==s.products[r.product].revision||!Number.isSafeInteger(r.at)||r.at<0)fail('Unresolved mixture acquisition.');
    }
    if(s.job){const j=s.job,p=s.products[j.product];if(!p||!s.methods[j.product]||!Number.isSafeInteger(j.due)||j.due<0||!Number.isSafeInteger(j.remaining)||j.remaining<1||j.remaining>999||JSON.stringify(j.held)!==JSON.stringify(p.inputs))fail('Invalid mixture reservation.');}
    if(s.ruleLaws!=null)validateVillageRuleOwner(s.ruleLaws,s.products,s.sequence);
    else if(Object.values(s.products).some(p=>p.revision===2))fail('Missing responsive rule owner.');
    return s;
}
export function resolveMixture(s, inputs, process) {
    if(!['steep','boil'].includes(process))fail('Choose steep or boil.');
    if(!inputs||Object.keys(inputs).some(id=>!INGREDIENTS.some(i=>i.id===id)))fail('Unresolved ingredient selection.');
    const ordered={};for(const {id} of INGREDIENTS){const n=inputs[id]??0;if(!Number.isSafeInteger(n)||n<0||n>99)fail('Use whole ingredient packs from 0 to 99.');if(n)ordered[id]=n;}
    if(Object.keys(ordered).length<2||!ordered['Spring water']||!((ordered['River bellleaf']||0)+(ordered.Emberseed||0)))fail('Use water and at least one plant ingredient.');
    const fractions={restore:0,vigor:0,trace:0,matrix:0};
    for(const [id,n]of Object.entries(ordered)){const profile=s.profiles?.[id];if(!profile?.fractions)fail('Unresolved ingredient truth.');for(const kind of Object.keys(fractions)){const v=profile.fractions[kind];if(!Number.isSafeInteger(v)||v<0)fail('Unresolved required property.');fractions[kind]+=n*v;}}
    const mass=Object.values(ordered).reduce((a,n)=>a+n*1000,0);
    if(Object.values(fractions).reduce((a,n)=>a+n,0)!==mass)fail('Mixture does not conserve mass.');
    // Process and concentration change oral availability, never delete a constituent or trace.
    // One whole vial is one dose; availability is normalized to a 2000-unit reference vial.
    const availability=process==='boil'?{restore:1,vigor:0.6,trace:1.5}:{restore:0.65,vigor:1,trace:0.5};
    const dose={health:fractions.restore*availability.restore/100*2000/mass,stamina:fractions.vigor*availability.vigor/100*2000/mass,
        sedation:fractions.trace*availability.trace/1000*2000/mass,duration:process==='boil'?40:25};
    const identity=JSON.stringify({revision:1,process,inputs:ordered,fractions,mass});
    return {id:'m1:'+identity,revision:1,unit:'fictional-mass',process,inputs:ordered,fractions,mass,dose,consumer:'oral-village@1'};
}
export function validateProduct(p,id=p?.id){
    if(p?.revision===2){
        const identity=JSON.stringify({revision:1,process:p.process,inputs:p.inputs,fractions:p.fractions,mass:p.mass});
        const a=p.process==='boil'?[1,.6,1.5]:[.65,1,.5];
        const base={id:'m1:'+identity,revision:1,unit:p.unit,process:p.process,inputs:p.inputs,fractions:p.fractions,mass:p.mass,
            dose:{health:p.fractions.restore*a[0]/100*2000/p.mass,stamina:p.fractions.vigor*a[1]/100*2000/p.mass,sedation:p.fractions.trace*a[2]/1000*2000/p.mass,duration:p.process==='boil'?40:25},consumer:'oral-village@1'};
        validateProduct(base);const expected=resolveResponsiveLock(base,p.lawLock);
        if(p.id!==id||JSON.stringify(p)!==JSON.stringify(expected))fail('Invalid retained responsive product.');return p;
    }
    if(p?.revision!==1||p.consumer!=='oral-village@1'||p.unit!=='fictional-mass'||p.id!==id||!['boil','steep'].includes(p.process))fail('Unsupported generated product.');
    const identity='m1:'+JSON.stringify({revision:1,process:p.process,inputs:p.inputs,fractions:p.fractions,mass:p.mass});
    if(id!==identity||!Number.isSafeInteger(p.mass)||p.mass<=0||Object.values(p.fractions).some(n=>!Number.isSafeInteger(n)||n<0)||Object.values(p.fractions).reduce((a,b)=>a+b,0)!==p.mass)fail('Noncanonical generated identity.');
    if(!p.dose||Object.values(p.dose).some(n=>!Number.isFinite(n)||n<0)||p.dose.duration!== (p.process==='boil'?40:25))fail('Unresolved generated dose.');
    const a=p.process==='boil'?[1,.6,1.5]:[.65,1,.5];
    if(p.dose.health!==p.fractions.restore*a[0]/100*2000/p.mass||p.dose.stamina!==p.fractions.vigor*a[1]/100*2000/p.mass||p.dose.sedation!==p.fractions.trace*a[2]/1000*2000/p.mass)fail('Dose does not match retained law.');
    return p;
}
export function mixtureKey(product){validateProduct(product);return JSON.stringify({id:MIXTURE_ID,mixture:product.id});}
export function productFromKey(s,key){const k=JSON.parse(key);if(k.id!==MIXTURE_ID||typeof k.mixture!=='string'||!s?.products?.[k.mixture])fail('Missing generated product reference.');const p=validateProduct(s.products[k.mixture],k.mixture);if(key!==mixtureKey(p))fail('Noncanonical mixture key.');return p;}
export function mixturePresentation(s,p){
    const known=s?.knowledge?.[p.id]?.observed;
    return currentProductAppearanceView(p,s?.knowledge,{name:`${p.process==='steep'?'Steeped':'Boiled'} Village mixture`,description:known?
        `Observed dose: +${p.dose.health} health regeneration, +${p.dose.stamina} stamina regeneration; agility -${p.dose.sedation}. ${p.dose.duration} minutes. Same family replaces the previous dose.`:
        'An untested mixture. Its properties still operate. Drink one dose to observe them. Same family replaces the previous dose.'});
}
// Exact rational aliquots: traces are never rounded. This slice exposes whole vials.
export function splitComposition(p,numerator,denominator){validateProduct(p);if(!Number.isSafeInteger(numerator)||!Number.isSafeInteger(denominator)||numerator<=0||numerator>=denominator||denominator*p.mass>Number.MAX_SAFE_INTEGER)fail('Invalid aliquot.');return [numerator,denominator-numerator].map(n=>({unit:p.unit,fractions:Object.fromEntries(Object.entries(p.fractions).map(([k,v])=>[k,{numerator:v*n,denominator}]))}));}
export function diluteComposition(p,water){validateProduct(p);if(!Number.isSafeInteger(water)||water<=0||water+p.mass>Number.MAX_SAFE_INTEGER)fail('Invalid dilution.');return {...clone(p.fractions),matrix:p.fractions.matrix+water};}
export function validateMixtureEnvelope(envelope){
    const s=envelope.mixtures;if(s!=null)validateMixtureState(s);
    if(s?.ruleLaws&&(!envelope.expansion?.streams||s.ruleLaws.root!==villageRuleRoot(envelope.expansion)))fail('Missing or mismatched saved rule root.');
    function visit(value){if(typeof value==='string'&&value.startsWith('{')){let k;try{k=JSON.parse(value);}catch{return;}if(k.id===MIXTURE_ID||k.mixture!=null)productFromKey(s,value);}else if(value&&typeof value==='object'){for(const [key,v]of Object.entries(value)){visit(key);visit(v);}}}
    // All holders, including vendor/chest inventories and job reservations.
    visit(envelope);
    for(const [id,e]of Object.entries(envelope.active_effects||{}))if(e.mixtureExposure){validateExposure(e,s?.products?.[e.mixtureExposure.product]);if(id!=='Village mixture exposure'||!s?.products[e.mixtureExposure.product]||JSON.stringify(e.mixtureExposure.dose)!==JSON.stringify(s.products[e.mixtureExposure.product].dose))fail('Dangling consumed-product exposure.');}
    return envelope;
}
export function mixtureExposure(p,clock){validateProduct(p);return {name:'Village mixture exposure',id:'Village mixture exposure',description:'Observed Village mixture dose; newest dose replaces this family.',duration:p.dose.duration,
    effects:{bonus_skill_levels:{},stats:{health_regeneration_flat:{flat:p.dose.health},stamina_regeneration_flat:{flat:p.dose.stamina},agility:{flat:-p.dose.sedation}}},
    tags:{buff:true,medicine:true,effect:true},potency:0,group_tags:{village_mixture:1},affected_by_travel:true,base_xp_value:0,
    mixtureExposure:{revision:p.revision,product:p.id,dose:clone(p.dose),appliedAt:clock,expiresAt:clock+p.dose.duration,policy:'replace'}};}
export function validateExposure(e,product){const x=e?.mixtureExposure;if(![1,2].includes(x?.revision)||x.policy!=='replace'||!Number.isSafeInteger(x.appliedAt)||x.appliedAt<0||!Number.isSafeInteger(x.expiresAt)||x.expiresAt!==x.appliedAt+x.dose?.duration||!Number.isFinite(e.duration)||e.duration<=0||e.duration>x.dose.duration)fail('Invalid retained mixture exposure timing.');
    const retained=x.revision===1?{id:x.product,...JSON.parse(x.product.slice(3)),unit:'fictional-mass',consumer:'oral-village@1',dose:x.dose}:product;
    if(retained?.revision!==x.revision||retained.id!==x.product||JSON.stringify(retained.dose)!==JSON.stringify(x.dose))fail('Missing complete retained exposure product.');
    const expected=mixtureExposure(retained,x.appliedAt);
    if(JSON.stringify(e.effects?.stats)!==JSON.stringify(expected.effects.stats)||e.name!==expected.name)fail('Invalid retained mixture exposure payload.');
    if(x.revision===2){
        if(Object.keys(x).sort().join()!==Object.keys(expected.mixtureExposure).sort().join())fail('Unsupported retained exposure fields.');
        for(const key of ['id','effects','tags','group_tags','potency','base_xp_value','affected_by_travel'])if(JSON.stringify(e[key])!==JSON.stringify(expected[key]))fail('Invalid complete responsive exposure payload.');
    }
    return e;}
let owner=null;
export const getMixtureOwner=()=>owner;
export function setMixtureOwner(s){owner=s==null?null:validateMixtureState(s);}
