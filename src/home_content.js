// Original Frontier domicile content. Values are local balance dials, not world laws.
export const HOME_WORLD = 'base.frontier';
const furnishing = (name, slot, price, effects, description, forms=['human']) => ({name, slot, price, effects, description, forms});
export const DOMICILE_FURNITURE = Object.freeze({
    'Home plain bed': furnishing('Plain bed','bed',30,{rest:1.08,xp:{Sleeping:1.1}},'An installed mattress supports ordinary rest and sleep practice.'),
    'Home ragwork blanket': furnishing('Ragwork blanket','blanket',12,{xp:{Sleeping:1.5}},'A fitted blanket improves Sleeping XP here.'),
    'Home straw pillow': furnishing('Straw pillow','pillow',8,{xp:{Sleeping:1.3}},'A supported headrest improves Sleeping XP here.'),
    'Home wooden tableware': furnishing('Wooden tableware','tableware',8,{xp:{Cooking:1.05}},'Reusable preparation and serving utensils support Cooking XP here.'),
    'Home clay tableware': furnishing('Clay tableware','tableware',15,{xp:{Cooking:1.08}},'Washable preparation and serving bowls support Cooking XP here.'),
    'Home ceramic tableware': furnishing('Ceramic tableware','tableware',28,{xp:{Cooking:1.1}},'Durable glazed preparation and serving dishes support Cooking XP here.'),
    'Home straw basket': furnishing('Straw basket','basket',6,{storage:8},'Eight additional local storage units.', ['human','fox','bird']),
    'Home storage box': furnishing('Storage box','box',20,{storage:30},'Thirty additional local storage units.'),
    'Home yarn ball': furnishing('Yarn ball','toy',6,{play:true},'A reusable local cat toy; it supports play without carried cloth.'),
    'Home incense holder': furnishing('Incense holder','incense',10,{xp:{Meditation:1.05}},'A quiet practice fixture supports Meditation XP; no hidden heat or smoke bonus.'),
    'Home bookcase': furnishing('Bookcase','shelf',22,{xp:{Literacy:1.05}},'A local reading station. Finished owned books retain their separate native bonus.'),
    'Home fitted hearth': furnishing('Fitted hearth','hearth',25,{},'An installed fireplace uses actual paid logs, ventilation and the local firewood pile.'),
    'Home nest lining': furnishing('Soft nest lining','bed',8,{rest:1.12,xp:{Sleeping:1.15}},'Dry woven grass supports resting in a burrow or nest.', ['fox','bird']),
});
export const HOME_PLACES = Object.freeze({
    shack: {location:'Shack',name:'Village Shack',travelMinutes:10,tenure:'shared',owner:'village',price:0,legacy:true,forms:['human'],capacity:12,description:'Your existing Village shelter. Housing access grants occupancy; purchase a deed here if you want title and structural rights. The old shared chest stays on its native route.'},
    proto: {location:'Proto23 visitor cottage',name:'Visitor cottage',world:'reference.proto23.village',tenure:'owned',owner:'player',price:0,legacy:true,forms:['human'],capacity:12,description:'Your existing settled cottage right. Its original fixtures and household remain on their native routes; added belongings stay at this endpoint.'},
    shelter: {location:'Willow clearing shelter',name:'Willow clearing shelter',tenure:'owned',owner:'player',price:0,forms:['human'],capacity:8,description:'A lashed timber lean-to on a dry clearing above the flood line. Its roof gives basic shelter; carried goods and fitted bedding remain separate.'},
    manor: {location:'Arlmere family manor',name:'Arlmere family manor',tenure:'shared',owner:'arlmere.household',price:0,forms:['human'],capacity:16,description:'Your family’s country estate. Your room and private residence storage are yours to use; the estate, staff contracts, pantry and provided furniture belong to the household.'},
    tent: {location:'Travel shelter',name:'Travel shelter',tenure:'owned',owner:'player',price:0,forms:['human'],capacity:6,description:'A portable woven shelter on a fitted pole frame. Pack personal goods and furnishings before moving the structure.'},
    cottage: {location:'Hearthside cottage',name:'Hearthside cottage',tenure:'owned',owner:'player',price:80,forms:['human'],capacity:20,description:'A modest cottage with a sound living room and a damaged side room. The deed includes its fixed furnishings.'},
    rental: {location:'Riverside rented room',name:'Riverside rented room',tenure:'rented',owner:'riverside.host',price:12,period:1440,forms:['human'],capacity:8,description:'A private rented room. Prepaid lodging grants use of the bed and room, not title to the building. Stored property stays yours after the term.'},
    family: {location:'Family longhouse room',name:'Family longhouse room',tenure:'shared',owner:'frontier.household',price:0,forms:['human'],capacity:8,description:'Your place in a welcoming shared household. Its bed and tableware remain communal; your storage is separate.'},
    burrow: {location:'Willow burrow',name:'Willow burrow',tenure:'owned',owner:'player',price:0,forms:['fox'],capacity:6,description:'A sheltered dry burrow beneath willow roots, with room for a lining and a small cache.'},
    nest: {location:'Canopy nest',name:'Canopy nest',tenure:'owned',owner:'player',price:0,forms:['bird'],capacity:4,description:'A sheltered woven nest reached by flight. A small cache and a dry lining fit between the branches.'},
});
export const HOME_STARTS = Object.freeze({
    wildbird:{label:'Bird seeking a nest site',site:'Wild willow stand',form:'bird',text:'Begin as a flying bird at a sheltered willow stand. Gather fallen twigs and grass with beak and feet, then weave your own nest without coins.'},
    wildfox:{label:'Fox seeking a den',site:'Wild willow stand',form:'fox',text:'Begin as a fox beside dry, diggable willow roots. Dig a burrow with paws, then gather and fit grass lining.'},
    builder:{label:'Shelter builder',site:'Wild willow stand',form:'human',text:'Begin at a dry woodland clearing without a home. Gather fallen poles and grass, then lash a basic shelter. No land or material purchase is needed at this unclaimed site.'},
    ducal:{label:'Duke’s child at the family manor',home:'manor',form:'human',rank:'Duke’s child',estateFunds:60,allowance:10,text:'Begin in the family manor with a private room, a steward, a cook and a caretaker. Household funds and supplies belong to the estate. Your ten-coin allowance is a real transfer, not title to the estate.'},
    royal:{label:'Royal child at the country manor',home:'manor',form:'human',rank:'Royal child',estateFunds:120,allowance:20,text:'Begin as a prince or princess staying at the family country estate. Request willing staff services under the steward’s budget; your twenty-coin allowance and family access do not grant ownership of the realm.'},
    homeowner:{label:'Cottage owner',home:'cottage',form:'human',text:'Begin in your owned cottage, with a bed, blanket and hearth. Restore the side room when ready.'},
    lodger:{label:'Riverside lodger',home:'rental',form:'human',text:'Begin with one prepaid day in a rented room. The host owns the bed; renew explicitly or move on.'},
    shared:{label:'Shared household',home:'family',form:'human',text:'Begin with a place in a shared household, a communal bed and dishes, and your own storage.'},
    fox:{label:'Fox in a willow burrow',home:'burrow',form:'fox',text:'Begin as a fox with a dry lined burrow and an accessible cache. Paws cannot fit human furniture.'},
    bird:{label:'Bird in a canopy nest',home:'nest',form:'bird',text:'Begin as a bird with a lined nest and small cache. Flight reaches your nest; beak and feet handle nest lining.'},
});
export const HOME_IMPROVEMENTS = Object.freeze({
    restore:{name:'Restore side room',coins:20,wood:5,minutes:30,capacity:10,rest:1.02},
    study:{name:'Fit a quiet study',coins:15,wood:3,minutes:20,capacity:0,xp:{Literacy:1.05}},
    guestroom:{name:'Fit a guest room',coins:20,wood:4,minutes:25,capacity:8},
    catroom:{name:'Fit a cat room',coins:10,wood:2,minutes:15,capacity:0,rest:1.02},
});
export const HOME_SUPPLIES = Object.freeze({'Rough wood log':{name:'Rough wood log',price:2},'Linen cloth':{name:'Linen cloth',price:4}});
export const homeKey = id => JSON.stringify({id});
export function registerDomicileItems(templates, Item) {
    templates[PACKED_TENT] ||= new Item({id:PACKED_TENT,name:'Packed travel shelter',value:0,description:'Your folded woven shelter and pole frame. Pitch through Homes at a permitted camp; its retained condition travels with this kit.',tags:{domicile:true},saturates_market:false});
    templates['Home damp grass'] ||= new Item({id:'Home damp grass',name:'Damp shelter grass',value:0,description:'Rain-wet grass. Dry it before weaving bedding or binding a sound roof.',tags:{domicile:true},saturates_market:false});
    for(const [id,m] of Object.entries(HOME_MATERIALS)) templates[id] ||= new Item({id,name:m.name,value:0,description:m.description,tags:{domicile:true},saturates_market:false});
    for(const [id,f] of Object.entries(DOMICILE_FURNITURE)) templates[id] ||= new Item({id,name:f.name,value:f.price,
        description:`${f.description} Install or remove it through Homes.`,tags:{domicile:true},saturates_market:false});
}

// One authored unclaimed site. Suitability is local terrain, not universal land rights.
export const HOME_SITE='Wild willow stand';
export const HOME_MATERIALS=Object.freeze({
    'Home fallen twigs':{name:'Fallen nesting twigs',description:'Small dry deadfall carried one bundle at a time. Useful for weaving a nest.',forms:['bird','human'],minutes:3},
    'Home dry grass':{name:'Dry shelter grass',description:'Grass from beneath the willow canopy, gathered one small bundle at a time for lining or thatch.',forms:['bird','fox','human'],minutes:3},
    'Home fallen poles':{name:'Fallen shelter poles',description:'Sound deadwood poles, gathered as a human-sized armful for a lashed shelter.',forms:['human'],minutes:6},
});
export const HOME_BUILDINGS=Object.freeze({
    tent:{name:'Weave a portable shelter',form:'human',minutes:30,costs:{'Home fallen poles':2,'Home dry grass':6},reason:'A light pole frame and tightly woven grass screens can be packed and carried between permitted camps.'},
    nest:{name:'Weave a canopy nest',form:'bird',minutes:20,costs:{'Home fallen twigs':4,'Home dry grass':2},reason:'A forked branch under the dense canopy supports a woven nest above the wet ground.'},
    burrow:{name:'Dig a willow burrow',form:'fox',minutes:35,costs:{},reason:'Dry earth above the flood line is soft enough for paws; the root mat supports the roof.'},
    shelter:{name:'Lash a woodland lean-to',form:'human',minutes:40,costs:{'Home fallen poles':4,'Home dry grass':4},reason:'The unclaimed clearing has level ground and forked supports. Flexible grass lashes bind the frame and thatch.'},
});

export const HOME_CAMPS=Object.freeze(['Wild willow stand','Village']);
export const PACKED_TENT='Home packed travel shelter';
