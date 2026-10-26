// ORIGINAL process laws. Pure constituent custody plans, no stock/save/clock owner.
// Integration must commit outputs + apparatus + costs atomically, once per stage.
const PHASES = ['dissolved', 'suspended', 'settled', 'surface', 'vapor'];
const OPS = ['strain', 'decant', 'skim', 'distill', 'divide'];
const fail = message => { throw new Error(message); };
const integer = (n, label) => Number.isSafeInteger(n) && n >= 0 ? n : fail(`${label} must be a nonnegative safe integer.`);
const positive = (n, label) => integer(n, label) > 0 ? n : fail(`${label} must be positive.`);
const text = (s, label) => typeof s === 'string' && s.length && !['__proto__','constructor','prototype'].includes(s) ? s : fail(`Invalid ${label}.`);
const permille = (n, label) => integer(n, label) <= 1000 ? n : fail(`${label} exceeds 1000.`);
const safeAdd = (a, b) => integer(a + b, 'Sum');
// BigInt intermediates avoid multiplication overflow without accepting unsafe input.
const fraction = (n, a, b) => Number(BigInt(n) * BigInt(a) / BigInt(b));
const copy = value => structuredClone(value);
const ordered = rows => [...rows].sort((a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : PHASES.indexOf(a.phase)-PHASES.indexOf(b.phase));

export function normalizeConstituents(rows) {
    if(!Array.isArray(rows)) fail('Constituents must be rows.');
    const merged = new Map();
    for(const r of rows) {
        text(r.id, 'constituent ID');
        if(!PHASES.includes(r.phase)) fail('Unknown constituent phase.');
        integer(r.amount, 'Constituent amount');
        const key = `${r.id}\0${r.phase}`;
        const old = merged.get(key);
        merged.set(key, {id:r.id, phase:r.phase, amount:safeAdd(old?.amount ?? 0, r.amount)});
    }
    return ordered([...merged.values()].filter(r => r.amount));
}

export function validateProcessBatch(batch) {
    integer(batch.volume, 'Batch volume');
    const constituents = normalizeConstituents(batch.constituents);
    mass(constituents);
    return {volume:batch.volume, constituents};
}

export function validateProcessVessel(vessel) {
    text(vessel.id, 'apparatus ID'); text(vessel.material, 'vessel material');
    positive(vessel.capacity, 'Vessel capacity');
    if(!['open','sealed','reflux'].includes(vessel.closure)) fail('Unknown vessel closure.');
    for(const k of ['meshSize','thermalMass','heatTransfer']) integer(vessel[k], k);
    permille(vessel.condenserPermille, 'Condenser efficiency');
    const remainders = copy(vessel.remainders ?? {});
    for(const n of Object.values(remainders)) if(integer(n,'Exposure remainder') >= 1000) fail('Invalid exposure remainder.');
    const films = normalizeConstituents(vessel.films);
    mass(films);
    return {...copy(vessel), films, remainders};
}

export function defineSeparationLaw(spec) {
    text(spec.id,'law ID'); positive(spec.revision,'Law revision');
    const law = copy(spec);
    if(!law.constituents || typeof law.constituents !== 'object') fail('Law needs constituents.');
    for(const [id,r] of Object.entries(law.constituents)) {
        text(id,'constituent ID');
        integer(r.particleSize ?? 0,'Particle size');
        integer(r.volatilePerVolume ?? 0,'Volatile amount per volume');
        for(const [material,effect] of Object.entries(r.materialEffects ?? {})) {
            text(material,'material');
            if(effect !== 'refuse') {
                if(!Object.hasOwn(law.constituents,effect.to)) fail('Unknown material conversion destination.');
                permille(effect.permille,'Material conversion');
            }
        }
    }
    for(const op of OPS) {
        const c = law.costs?.[op] ?? fail(`Missing ${op} cost.`);
        positive(c.secondsPerVolume, 'Operation time'); positive(c.workPerVolume, 'Operation work');
        integer(c.fuelPerVolume ?? 0,'Operation fuel');
    }
    for(const k of ['filmRetainPermille','filmReleasePerVolume','cleanWaterPerAmount','cleanWorkPerAmount'])
        (k.endsWith('Permille') ? permille : integer)(law[k], k);
    positive(law.cleanWaterPerAmount,'Cleaning water'); positive(law.cleanWorkPerAmount,'Cleaning work');
    for(const reaction of law.contactReactions ?? []) {
        const sum = side => Object.entries(side).reduce((n,[id,amount]) => {
            if(!Object.hasOwn(law.constituents,id)) fail('Unknown reaction constituent.');
            return safeAdd(n,positive(amount,'Reaction coefficient'));
        },0);
        if(!sum(reaction.reactants) || sum(reaction.reactants) !== sum(reaction.products)) fail('Contact reaction must conserve mass.');
        positive(reaction.maxExtent,'Reaction extent');
    }
    if(law.airReaction) {
        for(const id of [law.airReaction.from,law.airReaction.to]) if(!Object.hasOwn(law.constituents,id)) fail('Unknown air reaction constituent.');
        if(law.airReaction.from === law.airReaction.to) fail('Air reaction needs distinct constituents.');
        positive(law.airReaction.amountPerAirUnit,'Air reaction amount');
    }
    return law;
}

function admitted(law,batch,vessel) {
    batch = validateProcessBatch(batch); vessel = validateProcessVessel(vessel);
    if(batch.volume > vessel.capacity) fail('Batch exceeds vessel capacity.');
    for(const r of [...batch.constituents,...vessel.films]) {
        if(!Object.hasOwn(law.constituents,r.id)) fail(`Unknown constituent ${r.id}.`);
        if(law.constituents[r.id].materialEffects?.[vessel.material] === 'refuse') fail('Vessel material is incompatible with this batch.');
    }
    return {batch,vessel};
}
const empty = () => ({volume:0,constituents:[]});
const mass = rows => rows.reduce((n,r) => safeAdd(n,r.amount),0);
export const processConstituentMass = batch => mass(normalizeConstituents(batch.constituents));
export const processHeadspace = (batch,vessel) => {
    batch = validateProcessBatch(batch); vessel = validateProcessVessel(vessel);
    if(batch.volume > vessel.capacity) fail('Batch exceeds vessel capacity.');
    return vessel.capacity - batch.volume;
};

// Withdrawn aliquots preserve integer remainders in source. Homogeneous dissolved
// matter follows volume; settled/surface matter follows its physical layer.
function take(batch,volume,mode,law,vessel) {
    const product = {volume,constituents:[]}, residue = {volume:batch.volume-volume,constituents:[]};
    for(const row of batch.constituents) {
        let amount = fraction(row.amount,volume,batch.volume || 1);
        if(mode === 'strain' && ['suspended','settled'].includes(row.phase) && (law.constituents[row.id].particleSize ?? 0) >= vessel.meshSize) amount = 0;
        if(mode === 'decant' && row.phase === 'settled') amount = 0;
        if(mode === 'skim') amount = row.phase === 'surface' ? row.amount : 0;
        // Ordinary unremixed pouring leaves the bottom sediment to the last pour.
        if(mode === 'divide' && row.phase === 'settled') amount = residue.volume === 0 ? row.amount : 0;
        if(row.phase === 'vapor') amount = 0;
        if(amount) product.constituents.push({...row,amount});
        if(row.amount-amount) residue.constituents.push({...row,amount:row.amount-amount});
    }
    return {product,residue};
}

export function quoteSeparation(law,batch,action,vessel) {
    ({batch,vessel} = admitted(law,batch,vessel));
    if(!OPS.includes(action.op)) fail('Unknown separation operation.');
    positive(batch.volume,'Separating volume');
    const volume = positive(action.volume ?? batch.volume,'Transfer volume');
    if(volume > batch.volume) fail('Transfer exceeds available volume.');
    if(action.op === 'distill' && vessel.closure !== 'reflux') fail('Distillation needs a vapor capture apparatus.');
    if(action.op === 'divide') {
        positive(action.doses,'Dose count');
        if(action.doses > volume) fail('Dose count exceeds whole volume units.');
    }
    const c = law.costs[action.op];
    const costs = {seconds:integer(c.secondsPerVolume * volume,'Time cost'), work:integer(c.workPerVolume * volume,'Work cost'), fuel:integer((c.fuelPerVolume ?? 0)*volume,'Fuel cost')};
    return {op:action.op,volume,costs};
}

export function separateProcessBatch(law,batch,action,vessel) {
    const quote = quoteSeparation(law,batch,action,vessel);
    ({batch,vessel} = admitted(law,batch,vessel));
    const result = {product:empty(),residue:empty(),vaporCapture:empty(),exit:empty(),waste:empty(),doses:[],vessel,costs:quote.costs};
    if(action.op === 'distill') {
        const exposure = exposeProcessVessel(law,batch,vessel,{evaporateVolume:quote.volume,airUnits:0});
        Object.assign(result,{residue:exposure.batch,vaporCapture:exposure.vaporCapture,exit:exposure.exit});
        // Captured condensate is the usable distillation output, not two copies.
        result.product = result.vaporCapture; result.vaporCapture = empty();
        return result;
    }
    Object.assign(result,take(batch,quote.volume,action.op,law,vessel));
    // Material retained on shared apparatus leaves product custody exactly once.
    const film = [];
    result.product.constituents = result.product.constituents.map(row => {
        const amount = fraction(row.amount,law.filmRetainPermille,1000);
        if(amount) film.push({...row,amount});
        return {...row,amount:row.amount-amount};
    }).filter(row => row.amount);
    vessel.films = normalizeConstituents([...vessel.films,...film]);
    if(action.op === 'divide') {
        let remaining = result.product;
        const base = Math.floor(quote.volume/action.doses), extra = quote.volume%action.doses;
        for(let i=0;i<action.doses;i++) {
            const part = take(remaining,base+(i<extra?1:0),'divide',law,vessel);
            result.doses.push(part.product); remaining = part.residue;
        }
        // Doses own the matter; product is empty, never a duplicate pooled copy.
        result.product = empty();
    }
    return result;
}

// Contact is an explicit committed stage, not an automatic effect of preview.
// Films can contribute a trace seed or harm, with actual conserved amounts.
export function contactProcessVessel(law,batch,vessel) {
    ({batch,vessel} = admitted(law,batch,vessel));
    const release = integer(batch.volume*law.filmReleasePerVolume,'Film release');
    const released = [];
    vessel.films = vessel.films.map(row => {
        const amount = Math.min(row.amount,release);
        if(amount) released.push({...row,phase:'dissolved',amount});
        return {...row,amount:row.amount-amount};
    }).filter(row => row.amount);
    let rows = normalizeConstituents([...batch.constituents,...released]);
    const changed = [];
    for(const row of rows) {
        const effect = law.constituents[row.id].materialEffects?.[vessel.material];
        const amount = effect && effect !== 'refuse' ? fraction(row.amount,effect.permille,1000) : 0;
        changed.push({...row,amount:row.amount-amount});
        if(amount) changed.push({id:effect.to,phase:row.phase,amount});
    }
    rows = normalizeConstituents(changed);
    for(const reaction of law.contactReactions ?? []) {
        const available = id => rows.filter(r => r.id === id && r.phase === 'dissolved').reduce((n,r) => n+r.amount,0);
        const extent = Math.min(reaction.maxExtent,...Object.entries(reaction.reactants).map(([id,n]) => Math.floor(available(id)/n)));
        if(!extent) continue;
        for(const [id,n] of Object.entries(reaction.reactants)) {
            const row = rows.find(r => r.id === id && r.phase === 'dissolved'); row.amount -= n*extent;
        }
        rows = normalizeConstituents([...rows,...Object.entries(reaction.products).map(([id,n]) => ({id,phase:'dissolved',amount:n*extent}))]);
    }
    const work = Math.max(batch.volume,mass(batch.constituents) ? 1 : 0);
    return {batch:validateProcessBatch({volume:batch.volume,constituents:rows}),vessel,released:normalizeConstituents(released),costs:{seconds:work,work}};
}

// G6/thermal provide settled exposure budgets, once per owning interval. No local
// clock or weather generator. Per-volume volatility makes interval splitting
// equivalent; there are no percentage-of-remainder ticks or random dose draws.
export function exposeProcessVessel(law,batch,vessel,{evaporateVolume=0,airUnits=0}) {
    ({batch,vessel} = admitted(law,batch,vessel));
    integer(evaporateVolume,'Evaporation exposure'); integer(airUnits,'Air exposure');
    // Changing fill level changes the next air-contact condition. G6 must supply
    // ordered exposure boundaries rather than let arbitrary tick size pick order.
    if(evaporateVolume && airUnits && vessel.closure !== 'sealed') fail('Settle evaporation and air at separate exposure boundaries.');
    const loss = vessel.closure === 'sealed' ? 0 : Math.min(batch.volume,evaporateVolume);
    const capture = (n,key) => {
        const numerator = BigInt(n)*BigInt(vessel.condenserPermille)+BigInt(vessel.remainders[key] ?? 0);
        vessel.remainders[key] = Number(numerator%1000n);
        return Number(numerator/1000n);
    };
    const capturedVolume = vessel.closure === 'reflux' ? capture(loss,'volume') : 0;
    const vaporCapture = {volume:capturedVolume,constituents:[]}, exit = {volume:loss-capturedVolume,constituents:[]};
    const rows = [];
    for(const row of batch.constituents) {
        const amount = row.phase === 'dissolved' || row.phase === 'vapor' ? Math.min(row.amount,integer(loss*(law.constituents[row.id].volatilePerVolume ?? 0),'Volatile loss')) : 0;
        // Quantization debt persists so one long exposure equals smaller chunks.
        const captured = vessel.closure === 'reflux' ? capture(amount,`${row.id}:${row.phase}`) : 0;
        if(captured) vaporCapture.constituents.push({...row,phase:'dissolved',amount:captured});
        if(amount-captured) exit.constituents.push({...row,phase:'vapor',amount:amount-captured});
        rows.push({...row,amount:row.amount-amount});
    }
    if(law.airReaction && vessel.closure !== 'sealed') {
        const r = law.airReaction;
        // airUnits is G6's received/exchanged air budget, not elapsed time.
        // A filled vessel has no exposed headspace in this bounded law.
        let budget = integer((vessel.capacity > batch.volume ? airUnits : 0)*r.amountPerAirUnit,'Air conversion');
        for(const row of [...rows]) if(row.id === r.from) {
            const amount = Math.min(row.amount,budget); row.amount -= amount; budget -= amount;
            rows.push({id:r.to,phase:row.phase,amount});
        }
    }
    return {batch:{volume:batch.volume-loss,constituents:normalizeConstituents(rows)},vessel,
        vaporCapture:{...vaporCapture,constituents:normalizeConstituents(vaporCapture.constituents)},exit:{...exit,constituents:normalizeConstituents(exit.constituents)}};
}

// Partial source withdrawal and destination contact share one conservative plan.
// G5/native owners retain actual lot IDs; this function never mints inventory.
export function transferProcessBatch(law,source,destination,volume,sourceVessel,destinationVessel) {
    ({batch:source,vessel:sourceVessel} = admitted(law,source,sourceVessel));
    ({batch:destination,vessel:destinationVessel} = admitted(law,destination,destinationVessel));
    if(sourceVessel.id === destinationVessel.id) fail('Transfer needs distinct apparatus.');
    const moved = separateProcessBatch(law,source,{op:'decant',volume},sourceVessel);
    const combined = {volume:safeAdd(destination.volume,moved.product.volume),constituents:normalizeConstituents([...destination.constituents,...moved.product.constituents])};
    const contacted = contactProcessVessel(law,combined,destinationVessel);
    return {source:moved.residue,destination:contacted.batch,sourceVessel:moved.vessel,destinationVessel:contacted.vessel,
        costs:{seconds:safeAdd(moved.costs.seconds,contacted.costs.seconds),work:safeAdd(moved.costs.work,contacted.costs.work),fuel:moved.costs.fuel}};
}

export function cleanProcessVessel(law,vessel,budget) {
    vessel = validateProcessVessel(vessel);
    const amount = mass(vessel.films);
    const costs = {water:integer(amount*law.cleanWaterPerAmount,'Cleaning water'),work:integer(amount*law.cleanWorkPerAmount,'Cleaning work')};
    for(const key of ['water','work']) if(integer(budget[key],key) < costs[key]) fail(`Insufficient cleaning ${key}.`);
    const waste = {volume:costs.water,constituents:vessel.films};
    return {vessel:{...vessel,films:[]},waste,costs};
}
