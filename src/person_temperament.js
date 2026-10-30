// Defaults are proposals for ordinary people. Worlds overlay numbers with a new revision.
export const MEMORY_NUMBER_REASONS = Object.freeze({
    holders:'Bound the number of people whose detailed memories a life keeps.',
    episodes:'Fold older details so a long life stays bounded.', bytes:'Bound the UTF-8 save slice; larger populations need a larger budget.',
    idLength:'Keep opaque pointers compact.', harmDays:'Hurt stays vivid for months.', otherDays:'Ordinary encounters fade over weeks.',
    feelingScale:'Strong feelings lengthen recall.', tellingLoss:'Each retelling loses certainty in percent points.',
    reactionVividness:'Below this fraction an episode no longer drives a visible manner.', tellingRate:'Default daily chance, in percent, when a listener is present.',
    traitObservationDays:'Wait for persistent harm before inferring a grudge.', amendsWeight:'Practical restitution reduces earlier harm without erasing it.', hearsayTrust:'Default listener accepts the teller certainty, in percent.',
    witnessedWeight:'Witnessed events affect a bond less than direct treatment.', toldWeight:'An account has less force than direct experience.',
});
export const MEMORY_LIMITS = Object.freeze({id:'memory.limits', revision:1, holders:300, episodes:40, bytes:500000,
    idLength:96, harmDays:120, otherDays:30, feelingScale:10, tellingLoss:20, reactionVividness:0.25,
    tellingRate:100, traitObservationDays:30, amendsWeight:0.5, hearsayTrust:100, witnessedWeight:0.25, toldWeight:0.5});
export function memoryLimits(worldId, worlds = {}) {
    const overlay = worlds[worldId];
    if(!overlay) return MEMORY_LIMITS;
    if(!overlay.id || !Number.isSafeInteger(overlay.revision) || overlay.revision < 1) throw TypeError('World memory table needs id@rev.');
    const table = {...MEMORY_LIMITS,...overlay};
    for(const key of Object.keys(MEMORY_NUMBER_REASONS)) if(!Number.isFinite(table[key]) || table[key] <= 0) throw TypeError('Invalid memory number: '+key);
    for(const key of ['holders','episodes','bytes','idLength']) if(!Number.isSafeInteger(table[key])) throw TypeError('Invalid memory cap.');
    if(table.tellingLoss>100 || table.tellingRate>100 || table.hearsayTrust>100 || table.reactionVividness>1 || table.amendsWeight>1) throw TypeError('Invalid memory percentage.');
    if(table.id===MEMORY_LIMITS.id && table.revision===MEMORY_LIMITS.revision && Object.keys(MEMORY_NUMBER_REASONS).some(key=>table[key]!==MEMORY_LIMITS[key])) throw TypeError('Changed memory numbers need a new id@rev.');
    return Object.freeze(table);
}
export const TEMPERAMENT_TABLE = Object.freeze({id:'memory.temperament', revision:1});
// Multipliers compose. Every entry states the observed tendency it proposes.
export const TRAIT_TEMPERAMENTS = Object.freeze(Object.fromEntries(Object.entries({
    kind:{amends:1.5, reason:'A repair is taken generously.'},
    curious:{recall:1.25, reason:'Cues draw attention.'},
    patient:{harmFade:0.75, reason:'Small hurts pass sooner.'},
    practical:{amends:1.5, reason:'Material repair matters.'},
    sociable:{telling:1.5, loss:0.75, reason:'More opportunities to pass on a clear account.'},
    reserved:{telling:0.1, reason:'Usually keeps an account to oneself.'},
    grudging:{harmFade:4, harmRecall:1.5, amends:0.1, reason:'Returns to hurts and gives apologies little weight.'},
    forgiving:{harmFade:0.1, harmRecall:0.75, amends:2, reason:'Lets hurts fade and accepts repairs.'},
    loyal:{helpFade:30, reason:'Keeps favours vivid for years.'},
    ungrateful:{helpFade:0.05, reason:'Lets favours fade in days.'},
    reliable:{loss:0.5, reason:'A careful account loses less certainty.'},
    unreliable:{slant:0.5, reason:'Retells the feeling more strongly.'},
    gullible:{trust:1.25, reason:'Gives a received account extra certainty.'},
    sceptical:{trust:0.5, reason:'Discounts a received account.'},
}).map(([key,value])=>[key,Object.freeze(value)])));
export function temperamentFromTraits(words = [], registry = TRAIT_TEMPERAMENTS) {
    const out = {harmFade:1, helpFade:1, recall:1, harmRecall:1, telling:1, loss:1, trust:1, amends:1, slant:0};
    for(const word of new Set(words)) for(const [key,value] of Object.entries(Object.hasOwn(registry,word) ? registry[word] : {}))
        if(key !== 'reason') out[key] = key === 'slant' ? out[key]+value : out[key]*value;
    out.traits=Object.freeze([...new Set(words)].filter(word=>Object.hasOwn(registry,word)));
    return Object.freeze(out);
}
export const DEFAULT_TEMPERAMENT = temperamentFromTraits();
// Authored definitions or generated people supply traits; this port saves no derived values.
export const createTemperamentPort = (personOf, registry = TRAIT_TEMPERAMENTS) => holderId => temperamentFromTraits(personOf(holderId)?.traits, registry);
export const temperamentOf = () => DEFAULT_TEMPERAMENT;
export const tableRevision = table => `${table.id}@${table.revision}`;
