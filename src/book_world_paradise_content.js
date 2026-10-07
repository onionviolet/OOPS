import {PARADISE_IDS as I,PARADISE_LOCATIONS as L,PARADISE_KEYS as K,PARADISE_FOOTPRINTS,PARADISE_NATIVE_DOMAIN,PARADISE_SOURCE_SNAPSHOT,PARADISE_SOURCE_HASH,PARADISE_BASELINE} from './book_world_paradise_ids.js';
import {paradiseCommands,paradiseControllers,paradisePowers,paradiseSources,paradiseActions,paradiseSituations} from './book_world_paradise_actions.js';
export {PARADISE_IDS,PARADISE_LOCATIONS,PARADISE_KEYS,PARADISE_FOOTPRINTS,PARADISE_NATIVE_DOMAIN,PARADISE_SOURCE_SNAPSHOT,PARADISE_SOURCE_HASH,PARADISE_BASELINE} from './book_world_paradise_ids.js';
export {paradiseSources,paradiseActions};
export const paradiseWorlds=[{id:I.hub,label:'Paradise independent contractor entry',publicName:'Paradise contractor district',continuityLabel:'Supplied-MTL qualified alternate branch',provenance:'PD-MTL-67f15d112389-r1 sid26-28 service institutions. Independent retained-body entry and availability beside first-Goa era are authored; no Hunter entitlement.'},{id:I.goa,label:'Goa: Gray Terminal',publicName:'Goa · Gray Terminal',continuityLabel:'First-Goa alternate branch',provenance:'Novel-presented Goa/Van Pease at sid20 before the fire; source cast and causal baseline qualified against supplied MTL, not authenticated franchise canon. Player interventions change actual consequences.'}];
export const PARADISE_INITIAL_FACTS={
 [I.hub]:{'book.paradise.hub.met':false,'book.paradise.hub.workDone':false},
 [I.goa]:{'book.goa.met':false,'book.goa.lifeDone':false,'book.goa.cache':false,'book.goa.warning':false,'book.goa.fuelDiverted':false,'book.goa.fire':'planned','book.goa.gate':'shut','book.goa.hank':'on_duty','book.goa.king':'alive','book.goa.kingWarned':false,'book.goa.suXiao':'preparing','book.goa.arcClosed':false,'book.goa.aftermath':'unresolved'}
};
// Actual native numbers are authored finite budgets, not source rank/stat
// conversion. Explicit enrollment only initializes them; definitions stay empty.
const rows=[
 [I.employee,'Service worker (original branch desk)',I.hub,L.hub,{'book.paradise.coin':18,'book.paradise.attention':8}],
 [I.porter,'Rin, pier porter (original branch resident)',I.goa,L.pier,{'book.paradise.belli':12,'book.paradise.attention':8}],
 [I.mia,'Mia',I.goa,L.gray,{'book.paradise.belli':0,'book.paradise.attention':8}],
 [I.hank,'Hank',I.goa,L.guard,{'book.paradise.belli':8,'book.paradise.agenda':4,'book.paradise.attention':5}],
 [I.su,'Su Xiao',I.goa,L.guard,{'book.paradise.belli':4,'book.paradise.agenda':4,'book.paradise.attention':4}],
 [I.krieg,'Krieg (supplied-MTL alias)',I.goa,L.pier,{'book.paradise.belli':4,'book.paradise.agenda':3,'book.paradise.attention':3}],
 [I.king,'Philip Herbert',I.goa,L.palace,{'book.paradise.belli':8,'book.paradise.agenda':3,'book.paradise.attention':3}]
];
export const PARADISE_NATIVE_PEOPLE={
 [I.employee]:{inventory:{[K.log]:4,[K.rope]:3,[K.kit]:2},skills:{},reputation:{}},
 [I.porter]:{inventory:{[K.log]:3,[K.rope]:2,[K.ration]:3},skills:{},reputation:{}},
 [I.mia]:{inventory:{},skills:{},reputation:{}},
 [I.hank]:{inventory:{[K.proof]:1,[K.rope]:1,[K.ration]:1},skills:{},reputation:{}},
 [I.su]:{inventory:{[K.sword]:1,[K.necklace]:2,[K.claw]:1,[K.crystal]:1},skills:{},reputation:{}},
 [I.krieg]:{inventory:{[K.cask]:2,[K.ration]:1},skills:{},reputation:{}},
 [I.king]:{inventory:{[K.ration]:1},skills:{},reputation:{}}
};
export const PARADISE_NATIVE_STOCK={[I.hubStock]:{[K.log]:2,[K.rope]:2},[I.hubShop]:{[K.kit]:3,[K.rope]:4,[K.ration]:2},[I.goaStock]:{},[I.goaShop]:{[K.ration]:4,[K.rope]:3,[K.log]:4}};
const people=rows.map(([id,label,worldId,location,resources])=>({id,label,revision:1,worldId,location,inventory:'native',provision:false,resources,body:{form:'human',hands:2,mobile:true},vitals:{health:24,max_health:24,stamina:16,max_stamina:16}}));
export const paradiseDefinitions={people,sites:[{id:I.hubSite,revision:1,label:'Paid bracing booth',capacity:1},{id:I.goaSite,revision:1,label:'Gray Terminal material cache',capacity:1}],powers:paradisePowers,situations:paradiseSituations,commands:paradiseCommands,controllers:paradiseControllers};
export const PARADISE_ITEM_SPECIFICATIONS=[
 ['Goa ration parcel','An original counted food parcel in the supplied-MTL Goa branch. Used by real meals or civilian preparation.'],
 ['Goa ignition cask','A source-scene explosive/fuel cask represented for the first-Goa branch. Actual custody and diversion affect the limited fire operation; this item grants no universal bomb crafting.'],
 ['Goa duty copy','An original physical copy of local operation terms, obtained from an actual participant. It conveys evidence, not office or author foreknowledge.'],
 ['Goa Ryouma-origin sword','Su Xiao’s source-held damaged Ryouma-origin guardhouse sword at sid20;35/40 source durability, Fear/Shock. This scoped NPC knife-route consumer does not implement all weapon combat or grant player mastery.'],
 ['Goa early strength necklace','Two separately sourced early +1Strength drops held by Su Xiao at the selected cutoff. Possession in this branch is NPC-only; no automatic player stat conversion.'],
 ['Goa Tiger Claw','Su Xiao’s retained source drop; foreign graft/learning is unselected.'],
 ['Goa small soul crystal','Su Xiao’s source-held small Soul Crystal. No free learning/fuel conversion is granted.']
].map(([id,description])=>({id,name:id,description,value:1,tags:{expedition:true,book_world_paradise:true}}));
export function registerParadiseItems({itemTemplates,OtherItem}){for(const spec of PARADISE_ITEM_SPECIFICATIONS){if(itemTemplates[spec.id])throw Error(`Duplicate Paradise item ${spec.id}.`);itemTemplates[spec.id]=new OtherItem(spec);}}
