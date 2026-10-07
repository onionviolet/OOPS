import {cultivationBookProfiles,evaluateCultivationBookRule} from './feature_expansion_book_cultivation.js';
import {BOOK_RECOGNITION_PROFILES,recognizeBookWorld} from './feature_expansion_book_recognition.js';
import {SITUATED_BOOK_PROFILES,evaluateSituatedBookRule} from './feature_expansion_book_situated.js';
import {bookRosterProfiles,evaluateBookRosterRule} from './feature_expansion_book_roster.js';

const situatedAliases={'book.omniscient_reader':'omniscient-reader','book.worm':'worm',
    'book.legendary_mechanic':'legendary-mechanic','book.labyrinth_mad_god':'labyrinth-mad-god'};
const check=(ok,message)=>{if(!ok)throw Error(message);};

// Authoring declarations are registered without creating native worlds, people,
// knowledge or stock. Only a separately admitted native package binds a rule.
export function registerBookSubtletyCatalogue(registry) {
    check(registry?.worlds instanceof Map,'Bind the current native content registry.');
    if(registry.bookSubtleties)return registry.bookSubtleties;
    const profiles=new Map(),bindings=new Map();
    const add=(id,profile,evaluate)=>{check(id&&profile&&!profiles.has(id),'Duplicate source-world subtlety profile.');profiles.set(id,Object.freeze({id,profile,evaluate}));};
    for(const [id,profile] of Object.entries(cultivationBookProfiles))add(id,profile,(ruleId,input)=>evaluateCultivationBookRule(id,ruleId,input));
    for(const profile of BOOK_RECOGNITION_PROFILES)add(profile.id,profile,(ruleId,input)=>recognizeBookWorld(profile.id,{...input,ruleId}));
    for(const profile of SITUATED_BOOK_PROFILES){const id=situatedAliases[profile.id];add(id,profile,(ruleId,input)=>evaluateSituatedBookRule(profile.id,ruleId,input));}
    for(const profile of bookRosterProfiles)add(profile.id,profile,(ruleId,input)=>evaluateBookRosterRule(profile.id,ruleId,input));
    check(profiles.size===19,'Keep every current roster source disposition.');
    registry.bookSubtleties={schema:1,profiles,bindings};return registry.bookSubtleties;
}

export function bindBookSubtletyWorld(registry,profileId,binding) {
    const catalogue=registerBookSubtletyCatalogue(registry);
    check(catalogue.profiles.has(profileId)&&binding&&registry.worlds.has(binding.worldId)&&
        typeof binding.instanceId==='string'&&typeof binding.eraId==='string'&&typeof binding.branchId==='string'&&
        Array.isArray(binding.commandIds)&&binding.commandIds.length&&binding.commandIds.every(id=>registry.simulation.commands.has(id)),
    'A book-source rule needs its actual declared native era, branch and consumers.');
    check(!catalogue.bindings.has(binding.worldId),'A native source-world rule binding already exists.');
    catalogue.bindings.set(binding.worldId,Object.freeze({profileId,...binding,commandIds:Object.freeze([...binding.commandIds])}));
}

export function evaluateBoundBookSubtlety(registry,worldId,ruleId,input) {
    const catalogue=registerBookSubtletyCatalogue(registry),binding=catalogue.bindings.get(worldId);
    if(!binding)return {status:'unknown',explanation:'This source-world rule has no admitted native era or carrier binding.',commitmentAllowed:false};
    if(input?.eraId!==binding.eraId||input?.branchId!==binding.branchId)return {status:'unknown',explanation:'The supplied history differs from the admitted local rule.',commitmentAllowed:false};
    return catalogue.profiles.get(binding.profileId).evaluate(ruleId,input);
}
