import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyHomes,planHome,validateHomes,homeBenefits,homeCapacity,homeUsable,settleHomes} from '../src/home_model.js';
import {homeKey as k,HOME_PLACES as P} from '../src/home_content.js';
const context=()=>({world:'base.frontier',location:'Village',clock:0,sequence:0,alive:true,ready:true,fresh:true,money:500,body:{form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true},inventory:{[k('Rough wood log')]:20,[k('Linen cloth')]:1},unspendable:[],animalElsewhere:false});
function rig(){let s=null;const c={...context(),resources:{}};return {c,get state(){return s;},set state(v){s=v;},run(request){const r=planHome(s,request,c);s=r.state;c.money=r.money;c.sequence++;for(const row of r.items){c.inventory[row.key]=(c.inventory[row.key]||0)+row.amount;if(!c.inventory[row.key])delete c.inventory[row.key];}if(r.body)c.body=r.body;if(r.location)c.location=r.location;return r;},finish(id){const p=s.projects[id];c.resources[`home.work.${id}.${p.kind}`]=p.required;s=settleHomes(s,c,null,rows=>{for(const e of rows)if(e.type==='resource')c.resources[e.key]=(c.resources[e.key]||0)+e.amount;});},advance(n){c.clock+=n;c.sequence++;s=settleHomes(s,c);c.sequence=Math.max(c.sequence,...Object.values(s.properties).map(h=>h.household?.lastSequence||0));}};}

test('distinct actual starts settle residence rights, fixture ownership and body once',()=>{
    for(const [profile,id,form]of [['homeowner','cottage','human'],['lodger','rental','human'],['shared','family','human'],['fox','burrow','fox'],['bird','nest','bird']]){
        const r=rig(),res=r.run({type:'start',profile}),h=r.state.properties[id];assert.equal(h.id,id);assert.equal(r.c.body.form,form);assert.equal(res.location,P[id].location);assert.equal(homeUsable(h,r.c),true);
        assert.throws(()=>r.run({type:'start',profile}),/one beginning/);validateHomes(JSON.parse(JSON.stringify(r.state)),r.c);
        assert.equal(homeUsable(h,{...r.c,body:{...r.c.body,form:form==='human'?'fox':'human'}}),false);
    }
    const r=rig();r.c.fresh=false;assert.throws(()=>r.run({type:'start',profile:'homeowner'}),/one beginning/);assert.equal(r.state,null);
});

test('rented and shared use is distinct from title; expiry preserves goods and explicit renew costs once',()=>{
    for(const profile of ['lodger','shared']){const r=rig();r.run({type:'start',profile});const home=profile==='lodger'?'rental':'family';assert.throws(()=>r.run({type:'remove',home,slot:'bed'}),/remain with their owner/);assert.throws(()=>r.run({type:'improve',home,improvement:'restore'}),/your own home/);}
    const r=rig();r.run({type:'start',profile:'lodger'});r.run({type:'deposit',home:'rental',key:k('Linen cloth')});r.advance(1440);
    assert.equal(homeUsable(r.state.properties.rental,r.c),false);const old=structuredClone(r.state);
    assert.throws(()=>r.run({type:'deposit',home:'rental',key:k('Rough wood log')}),/renew/);assert.deepEqual(r.state,old);
    r.run({type:'withdraw',home:'rental',key:k('Linen cloth')});assert.equal(r.c.inventory[k('Linen cloth')],2);
    const money=r.c.money;r.run({type:'renew',home:'rental'});assert.equal(r.c.money,money-12);assert.equal(r.state.properties.rental.paidUntil,2880);
});

test('furnishings use exact native custody, one slot and actual recovery/XP readers',()=>{
    const r=rig();r.run({type:'start',profile:'homeowner'});const before=homeBenefits(r.state,r.c);assert.equal(before.xp.Sleeping,1.1*1.5);
    r.run({type:'remove',home:'cottage',slot:'blanket'});assert.equal(r.c.inventory[k('Home ragwork blanket')],1);assert.equal(homeBenefits(r.state,r.c).xp.Sleeping,1.1);
    const key=k('Home ragwork blanket');r.c.unspendable=[key];assert.throws(()=>r.run({type:'install',home:'cottage',key}),/borrowed/);r.c.unspendable=[];
    r.run({type:'install',home:'cottage',key});assert.equal(r.c.inventory[key],undefined);assert.equal(homeBenefits(r.state,r.c).xp.Sleeping,before.xp.Sleeping);
    assert.throws(()=>r.run({type:'install',home:'cottage',key}),/current fixture/);
    assert.equal(homeBenefits(r.state,{...r.c,location:'Village'}).rest,1);
});

test('finite local storage, meaningful capacity and own fixture removal conserve objects',()=>{
    const r=rig();r.run({type:'start',profile:'fox'});const id='burrow',h=r.state.properties[id];
    for(let i=0;i<homeCapacity(h);i++)r.run({type:'deposit',home:id,key:k('Rough wood log')});assert.throws(()=>r.run({type:'deposit',home:id,key:k('Rough wood log')}),/full/);
    r.c.inventory[k('Home straw basket')]=1;r.run({type:'install',home:id,key:k('Home straw basket')});r.run({type:'deposit',home:id,key:k('Rough wood log')});
    assert.throws(()=>r.run({type:'remove',home:id,slot:'basket'}),/empty enough/);r.run({type:'withdraw',home:id,key:k('Rough wood log')});r.run({type:'remove',home:id,slot:'basket'});assert.equal(r.c.inventory[k('Home straw basket')],1);
    assert.throws(()=>r.run({type:'improve',home:id,improvement:'restore'}),/usable hand/);
});

test('homeowner improvements cost real materials and elapsed time without double completion',()=>{
    const r=rig();r.run({type:'start',profile:'homeowner'});assert.throws(()=>r.run({type:'improve',home:'cottage',improvement:'study'}),/restore the side room/);
    const money=r.c.money,wood=r.c.inventory[k('Rough wood log')],res=r.run({type:'improve',home:'cottage',improvement:'restore'});
    assert.equal(res.minutes,30);assert.equal(r.c.money,money-20);assert.equal(r.c.inventory[k('Rough wood log')],wood-5);assert.equal(homeCapacity(r.state.properties.cottage),30);
    assert.throws(()=>r.run({type:'improve',home:'cottage',improvement:'restore'}),/unfinished/);
    r.run({type:'improve',home:'cottage',improvement:'study'});assert.equal(homeBenefits(r.state,r.c).xp.Literacy,1.05);
});

test('multiple homes retain separate stock, fire and companion ownership across travel and restoration',()=>{
    const r=rig();r.run({type:'start',profile:'homeowner'});r.run({type:'household',home:'cottage',action:'meet'});r.run({type:'household',home:'cottage',action:'light'});r.run({type:'deposit',home:'cottage',key:k('Linen cloth')});
    r.c.location='Village';r.run({type:'acquire',home:'rental'});r.c.location=P.rental.location;r.advance(5);
    assert.equal(r.state.properties.cottage.household.hearth.fuelMinutes,15);assert.equal(r.state.properties.rental.household,undefined);assert.equal(r.state.properties.cottage.stock[k('Linen cloth')],1);
    r.c.animalElsewhere=true;assert.throws(()=>r.run({type:'household',home:'rental',action:'meet'}),/already has a home/);
    r.run({type:'move_cat',home:'rental',from:'cottage'});assert.equal(r.state.properties.cottage.household.animal,null);assert.equal(r.state.properties.rental.household.animal.id,'household.moss');
    const cloned=JSON.parse(JSON.stringify(r.state));validateHomes(cloned,r.c);assert.deepEqual(cloned,r.state);
    const corrupt=structuredClone(cloned);corrupt.properties.cottage.owner='stranger';assert.throws(()=>validateHomes(corrupt,r.c),/title/);
});

test('missing home state grants no title, family, stock or beginning',()=>{validateHomes(null);assert.deepEqual(emptyHomes().properties,{});assert.equal(homeBenefits(null,context()).rest,1);});

test('existing Shack registration derives access, buys title and preserves native household ownership',()=>{
    const r=rig();r.c.location='Shack';r.c.nativeRights={shack:false};assert.throws(()=>r.run({type:'register',home:'shack'}),/actual existing/);
    r.c.nativeRights.shack=true;r.run({type:'register',home:'shack'});assert.equal(r.state.properties.shack.owner,'village');assert.equal(r.state.properties.shack.household,undefined);
    assert.throws(()=>r.run({type:'rename',home:'shack',name:'Mine'}),/your own home/);
    const money=r.c.money;r.run({type:'deed',home:'shack'});assert.equal(r.c.money,money-60);r.run({type:'rename',home:'shack',name:'Willow home'});assert.equal(r.state.properties.shack.name,'Willow home');
    assert.throws(()=>r.run({type:'household',home:'shack',action:'meet'}),/existing household/);validateHomes(r.state,r.c);
});

test('guest occupancy pays from one finite purse and does not mint wages on repeated invitations',()=>{
    const r=rig();r.run({type:'start',profile:'homeowner'});r.run({type:'improve',home:'cottage',improvement:'restore'});r.run({type:'improve',home:'cottage',improvement:'guestroom'});
    const money=r.c.money;r.run({type:'invite',home:'cottage'});assert.equal(r.c.money,money+6);assert.equal(r.state.lodger.coins,18);
    assert.throws(()=>r.run({type:'invite',home:'cottage'}),/already occupies/);assert.throws(()=>r.run({type:'guest_renew',home:'cottage'}),/must finish/);
    r.run({type:'guest_leave',home:'cottage'});r.run({type:'invite',home:'cottage'});assert.equal(r.state.lodger.coins,12);
    r.advance(1440);r.run({type:'guest_renew',home:'cottage'});assert.equal(r.state.lodger.coins,6);r.advance(1440);r.run({type:'guest_renew',home:'cottage'});assert.equal(r.state.lodger.coins,0);r.advance(1440);assert.throws(()=>r.run({type:'guest_renew',home:'cottage'}),/no funds/);validateHomes(r.state,r.c);
});

test('a nest needs actual flight and home storage accepts assembled native gear keys',()=>{
    const r=rig();r.run({type:'start',profile:'bird'});assert.equal(r.c.body.flying,true);assert.equal(homeUsable(r.state.properties.nest,r.c),true);assert.equal(homeUsable(r.state.properties.nest,{...r.c,body:{...r.c.body,flying:false}}),false);
    const gear=JSON.stringify({components:{head:'Iron axe head',handle:'Simple long wooden shaft'},quality:100});r.c.inventory[gear]=1;r.run({type:'deposit',home:'nest',key:gear});validateHomes(r.state,r.c);r.run({type:'withdraw',home:'nest',key:gear});assert.equal(r.c.inventory[gear],1);
});

test('the adopted local companion has one actual rest effect and follows smoke and location',()=>{
    const r=rig();r.run({type:'start',profile:'homeowner'});const before=homeBenefits(r.state,r.c).rest;r.run({type:'household',home:'cottage',action:'meet'});r.advance(5);r.run({type:'household',home:'cottage',action:'pet'});r.advance(5);r.run({type:'household',home:'cottage',action:'pet'});assert.ok(homeBenefits(r.state,r.c).rest>before);assert.equal(homeBenefits(r.state,r.c).rows.find(row=>row.id==='domicile.comfort').bonuses.rest,1.08);
    assert.equal(homeBenefits(r.state,{...r.c,location:'Village'}).rest,1);const smoke=structuredClone(r.state);smoke.properties.cottage.household.hearth.smokeOptIn=true;smoke.properties.cottage.household.hearth.smoke=1;assert.equal(homeBenefits(smoke,r.c).rows.find(row=>row.id==='domicile.comfort').bonuses.rest,1);
});

test('a played new game can keep a beginning invitation without a one-minute UI deadline',()=>{
    const r=rig();r.state={...emptyHomes(),beginning:true};r.c.clock=30;r.run({type:'start',profile:'homeowner'});assert.equal(r.state.start.at,30);assert.equal(r.state.beginning,false);
    const ordinary=rig();ordinary.state={...emptyHomes(),beginning:true};ordinary.run({type:'ordinary'});assert.throws(()=>ordinary.run({type:'start',profile:'homeowner'}),/one beginning/);
});

test('local companion retrieval has a real round trip and preserves the original household owner',()=>{
    const r=rig();r.run({type:'start',profile:'homeowner'});r.run({type:'household',home:'cottage',action:'meet'});const old=structuredClone(r.state.properties.cottage.household);old.homeId='base.frontier:Shack';r.state.properties.cottage.household=undefined;r.c.legacyHousehold=old;r.c.legacyAnimal=true;r.c.nativeRights={shack:true};
    const moved=r.run({type:'move_native_cat',home:'cottage'});assert.equal(moved.minutes,30);assert.equal(moved.removeLegacyAnimal,true);assert.equal(old.animal.id,'household.moss');assert.equal(moved.state.properties.cottage.household.animal.id,'household.moss');
});

test('expired rented lodging permits retrieving an owned companion, just like stored belongings',()=>{
    const r=rig();r.run({type:'start',profile:'lodger'});r.run({type:'household',home:'rental',action:'meet'});r.c.location='Village';r.run({type:'acquire',home:'cottage'});r.c.location='Hearthside cottage';r.advance(1440);
    assert.equal(homeUsable(r.state.properties.rental,r.c),false);const result=r.run({type:'move_cat',home:'cottage',from:'rental'});assert.equal(result.minutes,20);assert.equal(r.state.properties.rental.household.animal,null);assert.equal(r.state.properties.cottage.household.animal.id,'household.moss');
});

test('wild beginnings build body-appropriate shelter without coins or granted furniture',()=>{
    for(const [profile,id,form]of [['wildbird','nest','bird'],['wildfox','burrow','fox'],['builder','shelter','human']]){
        const r=rig();r.c.inventory={};r.c.money=0;r.run({type:'start',profile});assert.equal(r.c.location,'Wild willow stand');assert.equal(r.c.body.form,form);assert.deepEqual(r.state.properties,{});assert.deepEqual(r.c.inventory,{});
        const materials=id==='nest'?{'Home fallen twigs':4,'Home dry grass':2}:id==='shelter'?{'Home fallen poles':4,'Home dry grass':4}:{};
        if(id!=='burrow')assert.throws(()=>r.run({type:'build',home:id}),/materials/);
        for(const [item,n]of Object.entries(materials))for(let i=0;i<n;i++){const q=r.run({type:'gather',item});assert.ok(q.minutes>0);r.advance(q.minutes);}
        const q=r.run({type:'build',home:id});assert.equal(q.minutes,0);assert.equal(r.state.properties[id],undefined);r.finish(id);assert.equal(r.c.money,0);assert.deepEqual(r.c.inventory,{});assert.deepEqual(r.state.properties[id].fixtures,{});assert.equal(r.state.properties[id].construction.site,'Wild willow stand');
        assert.throws(()=>r.run({type:'build',home:id}),/already held/);r.c.location=P[id].location;assert.equal(homeUsable(r.state.properties[id],r.c),true);validateHomes(JSON.parse(JSON.stringify(r.state)),r.c);
    }
});
test('natural lining, physical moving and salvage conserve custody without reissuing a beginning',()=>{
    const r=rig();r.c.inventory={};r.c.money=0;r.run({type:'start',profile:'wildbird'});
    for(const [item,n]of Object.entries({'Home fallen twigs':4,'Home dry grass':5}))for(let i=0;i<n;i++)r.run({type:'gather',item});
    r.run({type:'build',home:'nest'});r.finish('nest');r.run({type:'weave_lining'});r.c.location=P.nest.location;r.run({type:'install',home:'nest',key:k('Home nest lining')});assert.ok(homeBenefits(r.state,r.c).rest>1);
    assert.throws(()=>r.run({type:'dismantle',home:'nest'}),/collect stored goods/i);r.run({type:'remove',home:'nest',slot:'bed'});const q=r.run({type:'dismantle',home:'nest'});assert.equal(q.location,'Wild willow stand');assert.equal(r.state.primary,null);assert.deepEqual(r.state.properties,{});assert.equal(r.c.inventory[k('Home fallen twigs')],2);assert.equal(r.c.inventory[k('Home dry grass')],1);assert.equal(r.c.inventory[k('Home nest lining')],1);assert.throws(()=>r.run({type:'start',profile:'bird'}),/one beginning/);
});
test('wild work checks site, means and owned usable material rather than charging for nature',()=>{
    const r=rig();r.c.inventory={};r.run({type:'start',profile:'wildbird'});r.c.body.beak=false;assert.throws(()=>r.run({type:'gather',item:'Home fallen twigs'}),/beak/);r.c.body.beak=true;r.c.body.flying=false;assert.throws(()=>r.run({type:'build',home:'nest'}),/flight/);r.c.body.flying=true;r.c.location='Village';assert.throws(()=>r.run({type:'gather',item:'Home dry grass'}),/willow/);assert.throws(()=>r.run({type:'acquire',home:'nest'}),/wild site/);
    r.c.location='Wild willow stand';r.c.inventory[k('Home dry grass')]=3;r.c.unspendable=[k('Home dry grass')];assert.throws(()=>r.run({type:'weave_lining'}),/borrowed/);assert.equal(r.c.inventory[k('Home dry grass')],3);
});
