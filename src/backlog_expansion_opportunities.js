// Two finite original proofs over actual simulation owners and the played clock.
// Importing, viewing and loading this module never introduces a person or stock.
import {deepFreeze as freeze, natural, object as record} from './basics.js';
import {backlogAssert as assert, backlogRecord, backlogActor, backlogInventory,
    backlogItem, backlogTransfer, backlogLog, assertBacklogBoundary} from './backlog_expansion_core.js';
import {simulationOccupiesActor} from './simulation.js';

const keys = (value, expected, label) => assert(record(value) && Object.keys(value).length === expected.length &&
    expected.every(key => Object.hasOwn(value, key)), `Invalid ${label} record.`);

export const OPPORTUNITY_IDS = freeze({
    keeper:'backlog.reed_keeper', bed:'backlog.reed_bed', bench:'backlog.packing_bench',
    entitlement:'backlog.fate.packing_slot', loan:'backlog.fate.rope', rights:'backlog.ecology.harvest_rights',
    rootResource:'backlog.ecology.root_divisions', cropResource:'backlog.ecology.standing_shoots',
    purseResource:'backlog.ecology.supply_coins'
});
export const OPPORTUNITY_ITEMS = freeze({
    log:JSON.stringify({id:'Rough wood log'}), rope:JSON.stringify({id:'Survey rope'}),
    kit:JSON.stringify({id:'Prepared survey kit'}), herbs:JSON.stringify({id:'Cooking herbs'})
});
const I = OPPORTUNITY_IDS, K = OPPORTUNITY_ITEMS;
const WORLD = 'base.frontier', LOCATION = 'Village';
const CYCLES = 3, YIELD = 2, GROWTH = 10, PAY = 2;
const FATE_WILLING = 'backlog.fate.willing', ECOLOGY_WILLING = 'backlog.ecology.willing';

export const opportunityDefinitions = freeze({
    people:[{id:I.keeper, revision:1, label:'Rill, reed-bed keeper', worldId:WORLD,
        location:LOCATION, inventory:'simulation', provision:false,
        resources:{[I.rootResource]:CYCLES, [I.cropResource]:0, [I.purseResource]:CYCLES * PAY}}],
    sites:[{id:I.bed, revision:1, label:'Rill’s reed-bed herb edge', capacity:1},
        {id:I.bench, revision:1, label:'Rill’s one-slot packing bench', capacity:1}]
});

export const opportunityCommands = freeze([
    {id:'backlog.fate_offer', family:'fate', label:'Hear Rill’s one-slot offer',
        description:'Meet a new willing keeper. One existing packing entitlement belongs to Rill; this meeting transfers no access or reward.'},
    {id:'backlog.fate_transfer', family:'fate', label:'Accept the transferred packing chance',
        description:'Rill consents to transfer one scarce entitlement and lend one actual Survey rope. Only its recipient may redeem it; Rill loses that slot.'},
    {id:'backlog.fate_settle', family:'fate', label:'Redeem the slot · 1 log',
        description:'Use the exclusive bench opportunity. Spend one actual log, return the borrowed rope and receive Rill’s one funded survey kit. The entitlement settles once.'},
    {id:'backlog.fate_return', family:'fate', label:'Return the unused slot and rope',
        description:'Return the exact loan and relinquish this chance without a kit. The finite slot closes and cannot be offered again.'},
    {id:'backlog.ecology_join', family:'ecology', label:'Agree to the reed-bed work rights',
        description:'Rill retains ownership and consents to three finite renewal rounds. You receive harvesting rights; planting, outputs and supply payments require later actions.'},
    {id:'backlog.ecology_plant', family:'ecology', label:'Renew the herb edge · 1 log · 10 played min',
        description:'Spend one actual log as mulch and one of Rill’s three root divisions. Two growing shoots occupy the bed; no actor stays reserved and no wall-clock catch-up occurs.'},
    {id:'backlog.ecology_harvest', family:'ecology', label:'Harvest the mature herb edge',
        description:'After ten played minutes, cut the two actual standing shoots into two native Cooking herbs. An immature or already cut crop gives no output.'},
    {id:'backlog.ecology_supply', family:'ecology', label:'Supply 2 herbs · earn 2 coins',
        description:'Transfer two owned native Cooking herbs to Rill. Each completed harvest opens one finite order, funded by two coins from Rill’s actual six-coin purse.'},
    {id:'backlog.ecology_close', family:'ecology', label:'Close the completed reed-bed agreement',
        description:'After all three harvests and supply orders, settle the harvesting rights. The owner, paid stock and remembered work remain.'}
]);

const cause = state => `backlog:${state.sequence + 1}`;
const atSequence = state => state.sequence + 1;
const claim = (state, id, owner) => {
    const value = state.simulation.claims[id];
    assert(value?.status === 'held' && value.owner === owner, 'The actual scarce entitlement or work right is no longer held here.');
    return value;
};
const local = (state, context) => {
    assertBacklogBoundary(state, context);
    assert(context.worldId === WORLD && state.actors.player.worldId === WORLD && context.facts?.location === LOCATION,
        'Meet Rill in the actual Village before choosing this action.');
};
function keeper(plan) {
    const {actor, person} = backlogActor(plan, I.keeper);
    assert(person.definitionId === I.keeper && person.life === 'alive' && person.inventory === 'simulation' &&
        person.location === LOCATION && actor.worldId === WORLD && !simulationOccupiesActor(plan.state, I.keeper),
        'Rill must be alive, present and free to consent to this action.');
    return {actor, person};
}
function meetKeeper(plan) {
    const state = plan.state, s = state.simulation;
    if(s.people[I.keeper] || state.actors[I.keeper]) { keeper(plan); return; }
    assert(!s.owners[I.keeper], 'The keeper’s actual stock has an incompatible owner.');
    state.actors[I.keeper] = {facts:{[FATE_WILLING]:true, [ECOLOGY_WILLING]:true},
        resources:{[I.rootResource]:CYCLES, [I.cropResource]:0, [I.purseResource]:CYCLES * PAY},
        completed:{}, sources:{}, techniques:{}, worldId:WORLD};
    s.people[I.keeper] = {life:'alive', inventory:'simulation', location:LOCATION,
        bornAt:state.clock, definitionId:I.keeper, definitionRevision:1};
    // Explicit first meeting provisions this new original owner exactly once.
    // These are Rill's possessions, not player rewards or a load initializer.
    s.owners[I.keeper] = {[K.rope]:1, [K.kit]:1};
}
function openOwnedSite(plan, id) {
    const sites = plan.state.simulation.sites;
    if(sites[id]) {
        assert(sites[id].capacity === 1 && !Object.keys(sites[id].reservations).length &&
            (sites[id].owner == null || sites[id].owner === I.keeper), 'This site has an incompatible owner or reservation.');
        sites[id].owner = I.keeper;
    } else sites[id] = {capacity:1, reservations:{}, owner:I.keeper};
}
function ownedSite(state, id) {
    const site = state.simulation.sites[id];
    assert(site?.owner === I.keeper && site.capacity === 1 && !Object.keys(site.reservations).length,
        'Rill’s actual work site is unavailable or reserved.');
}
function remember(plan, key, text) {
    const state = plan.state, knowledge = state.simulation.knowledge.player ||= {};
    knowledge[key] = {stage:'seen', value:text, at:state.clock, cause:cause(state)};
    backlogLog(plan, text);
}
function exactLoan(plan) {
    const loan = plan.state.simulation.custody[I.loan];
    assert(loan?.owner === I.keeper && loan.holder === 'player' && loan.key === K.rope && loan.count === 1,
        'Return the exact Rill rope loan before settling this opportunity.');
    assert((backlogInventory(plan, 'player')[K.rope] || 0) >= 1, 'The actual borrowed rope is missing from your native bag.');
    return loan;
}
function returnRope(plan) {
    exactLoan(plan);
    delete plan.state.simulation.custody[I.loan];
    backlogItem(plan, 'player', K.rope, -1);
    backlogItem(plan, I.keeper, K.rope, 1, {acquisition:false});
}
function fateHeld(plan) {
    const fate = plan.state.backlog?.fate;
    assert(fate?.phase === 'transferred' && fate.recipientConsent === true, 'Accept the actual transferred chance first.');
    keeper(plan); ownedSite(plan.state, I.bench); claim(plan.state, I.entitlement, 'player'); exactLoan(plan);
    return fate;
}
function ecologyHeld(plan) {
    const ecology = plan.state.backlog?.ecology;
    assert(ecology?.phase === 'working' && ecology.recipientConsent === true, 'Agree to the actual reed-bed work rights first.');
    const {actor} = keeper(plan);
    assert(actor.facts[ECOLOGY_WILLING] === true, 'Rill is not consenting to this work now.');
    ownedSite(plan.state, I.bed); claim(plan.state, I.rights, 'player');
    return {ecology, actor};
}

// Called only on a cloned unpublished host plan. The root advances sequence
// exactly once after this dispatch, validates all owners and publishes once.
export function stageOpportunityCommand(plan, command, context) {
    const id = typeof command === 'string' ? command : command?.id;
    assert(opportunityCommands.some(row => row.id === id), 'Unknown backlog opportunity command.');
    local(plan.state, context);
    const state = plan.state, s = state.simulation;
    if(id === 'backlog.fate_offer') {
        const backlog = backlogRecord(plan);
        assert(!backlog.fate && !s.claims[I.entitlement] && !s.custody[I.loan], 'This finite packing chance has already been offered.');
        meetKeeper(plan);
        const {actor} = keeper(plan);
        assert(actor.facts[FATE_WILLING] === true && (backlogInventory(plan, I.keeper)[K.rope] || 0) >= 1 &&
            (backlogInventory(plan, I.keeper)[K.kit] || 0) >= 1, 'Rill must willingly fund the actual offered chance and rope.');
        openOwnedSite(plan, I.bench);
        s.claims[I.entitlement] = {owner:I.keeper, status:'held', at:state.clock, cause:cause(state)};
        backlog.fate = {revision:1, donorId:I.keeper, recipientId:'player', claimId:I.entitlement, loanId:I.loan,
            phase:'offered', donorConsent:true, recipientConsent:false, offeredAt:state.clock, offerSequence:atSequence(state),
            transferredAt:null, transferSequence:null, settledAt:null, settleSequence:null, settlement:null};
        remember(plan, 'backlog.fate.offer', 'Rill willingly offers one owned packing slot and one rope loan. Rill still holds the slot; no access or kit has transferred.');
    } else if(id === 'backlog.fate_transfer') {
        const fate = state.backlog?.fate;
        assert(fate?.phase === 'offered' && fate.donorConsent === true && !s.custody[I.loan], 'This chance is not awaiting its first transfer.');
        const {actor} = keeper(plan);
        assert(actor.facts[FATE_WILLING] === true, 'Rill is not consenting to transfer the chance now.');
        ownedSite(state, I.bench);
        const entitlement = claim(state, I.entitlement, I.keeper);
        assert((backlogInventory(plan, I.keeper)[K.kit] || 0) >= 1, 'Rill’s actual kit no longer funds the opportunity.');
        backlogTransfer(plan, I.keeper, 'player', K.rope, 1);
        s.custody[I.loan] = {owner:I.keeper, holder:'player', key:K.rope, count:1, at:state.clock, cause:cause(state)};
        entitlement.owner = 'player'; entitlement.cause = cause(state);
        Object.assign(fate, {phase:'transferred', recipientConsent:true, transferredAt:state.clock, transferSequence:atSequence(state)});
        remember(plan, 'backlog.fate.transferred', 'With both parties consenting, Rill’s single packing chance now belongs to you. Rill cannot use the slot; the actual rope in your bag remains Rill’s loan.');
    } else if(id === 'backlog.fate_settle' || id === 'backlog.fate_return') {
        const fate = fateHeld(plan), entitlement = claim(state, I.entitlement, 'player');
        if(id === 'backlog.fate_settle') {
            assert(keeper(plan).actor.facts[FATE_WILLING] === true, 'Rill is not consenting to bench work now.');
            backlogItem(plan, 'player', K.log, -1);
            returnRope(plan);
            backlogTransfer(plan, I.keeper, 'player', K.kit, 1);
            fate.settlement = 'redeemed';
        } else { returnRope(plan); entitlement.owner = I.keeper; fate.settlement = 'returned_unused'; }
        entitlement.status = 'settled'; entitlement.cause = cause(state);
        Object.assign(fate, {phase:'settled', settledAt:state.clock, settleSequence:atSequence(state)});
        remember(plan, 'backlog.fate.settled', fate.settlement === 'redeemed'
            ? 'You spent one log at the exclusive bench, returned Rill’s rope and received Rill’s actual one-kit stock. The slot is settled and pays no second kit.'
            : 'You returned Rill’s actual rope and unused slot. The finite opportunity closed without a kit or a repeated offer.');
    } else if(id === 'backlog.ecology_join') {
        const backlog = backlogRecord(plan);
        assert(!backlog.ecology && !s.claims[I.rights], 'This finite reed-bed agreement has already been made.');
        meetKeeper(plan);
        const {actor} = keeper(plan);
        assert(actor.facts[ECOLOGY_WILLING] === true && actor.resources[I.rootResource] === CYCLES &&
            actor.resources[I.cropResource] === 0 && actor.resources[I.purseResource] === CYCLES * PAY,
            'Rill must willingly fund the actual root divisions and supply purse.');
        openOwnedSite(plan, I.bed);
        s.claims[I.rights] = {owner:'player', status:'held', at:state.clock, cause:cause(state)};
        backlog.ecology = {revision:1, ownerId:I.keeper, workerId:'player', siteId:I.bed, rightsId:I.rights,
            phase:'working', donorConsent:true, recipientConsent:true, joinedAt:state.clock, joinSequence:atSequence(state),
            planted:0, harvested:0, supplied:0, crop:null, history:[], closedAt:null, closeSequence:null};
        remember(plan, 'backlog.ecology.agreement', 'Rill retains the reed bed and grants you finite herb-edge work rights. Three actual root divisions and six supply coins fund this agreement; planting costs your owned mulch logs.');
    } else {
        const {ecology, actor} = ecologyHeld(plan), resources = actor.resources;
        if(id === 'backlog.ecology_plant') {
            assert(!ecology.crop && ecology.planted < CYCLES && resources[I.rootResource] > 0 && resources[I.cropResource] === 0,
                'Harvest the current crop first; this agreement has only three actual root divisions.');
            assert(Number.isSafeInteger(state.clock + GROWTH), 'The supported played clock cannot represent another growth round.');
            backlogItem(plan, 'player', K.log, -1);
            resources[I.rootResource]--; resources[I.cropResource] += YIELD;
            ecology.planted++;
            ecology.crop = {round:ecology.planted, plantedAt:state.clock, readyAt:state.clock + GROWTH, count:YIELD, sequence:atSequence(state)};
            ecology.history.push({round:ecology.planted, plantedAt:state.clock, plantSequence:atSequence(state), harvestedAt:null, harvestSequence:null,
                suppliedAt:null, supplySequence:null});
            remember(plan, 'backlog.ecology.planted', `You mulched round ${ecology.planted} with one actual log and one of Rill’s root divisions. Two living shoots mature at played minute ${ecology.crop.readyAt}; leaving or closing the game destroys no crop.`);
        } else if(id === 'backlog.ecology_harvest') {
            const crop = ecology.crop;
            assert(crop && state.clock >= crop.readyAt, crop ? `This crop needs ${crop.readyAt - state.clock} more played minutes.` : 'Plant an actual crop before harvesting.');
            assert(resources[I.cropResource] === crop.count && crop.count === YIELD, 'The actual standing crop is missing or incompatible.');
            resources[I.cropResource] -= crop.count;
            backlogItem(plan, 'player', K.herbs, crop.count);
            const round = ecology.history[crop.round - 1];
            Object.assign(round, {harvestedAt:state.clock, harvestSequence:atSequence(state)});
            ecology.harvested++; ecology.crop = null;
            remember(plan, 'backlog.ecology.harvested', 'You cut two mature herb-edge shoots into two native Cooking herbs. The standing crop is gone; the paid output is in your actual bag and opens one funded supply order.');
        } else if(id === 'backlog.ecology_supply') {
            assert(ecology.supplied < ecology.harvested && ecology.supplied < CYCLES && resources[I.purseResource] >= PAY,
                'Harvest another finite round before taking its funded supply order.');
            assert(natural(plan.external.money) && Number.isSafeInteger(plan.external.money + PAY), 'Bind the actual native coin owner before settling supplies.');
            backlogTransfer(plan, 'player', I.keeper, K.herbs, YIELD);
            resources[I.purseResource] -= PAY; plan.external.money += PAY;
            const round = ecology.history[ecology.supplied];
            Object.assign(round, {suppliedAt:state.clock, supplySequence:atSequence(state)});
            ecology.supplied++;
            remember(plan, 'backlog.ecology.supplied', 'Rill received two actual Cooking herbs and paid two native coins from the finite supply purse. This harvest’s order is settled; the transferred herbs remain Rill’s stock.');
        } else if(id === 'backlog.ecology_close') {
            assert(ecology.planted === CYCLES && ecology.harvested === CYCLES && ecology.supplied === CYCLES &&
                !ecology.crop && resources[I.rootResource] === 0 && resources[I.cropResource] === 0 && resources[I.purseResource] === 0,
                'Complete the three finite harvests and funded supply orders before closing this agreement.');
            const rights = claim(state, I.rights, 'player'); rights.status = 'settled'; rights.cause = cause(state);
            Object.assign(ecology, {phase:'closed', closedAt:state.clock, closeSequence:atSequence(state)});
            remember(plan, 'backlog.ecology.closed', 'The three-round agreement is complete. Rill still owns the reed bed and its six supplied herbs; your paid coins and retained knowledge remain. No new roots or orders were created.');
        }
    }
    return plan;
}

export function opportunityView(state, _context) {
    const fate = state.backlog?.fate, ecology = state.backlog?.ecology, records = [];
    if(fate) records.push(fate.phase === 'offered'
        ? 'Rill willingly holds one offered packing chance. Accepting transfers exclusive access and one real rope loan.'
        : fate.phase === 'transferred' ? 'You hold the one packing chance and Rill’s rope loan. Redeem with one log, or return it unused.'
            : fate.settlement === 'redeemed' ? 'The chance paid one actual kit and settled. Rill’s rope returned; the reward cannot repeat.'
                : 'The unused chance closed and Rill’s rope returned. No kit was paid.');
    if(ecology) {
        const crop = ecology.crop, resources = state.actors[I.keeper]?.resources;
        records.push(`Rill owns the reed bed. ${ecology.phase === 'closed' ? 'Work rights settled' : 'You hold the agreed work rights'}.`);
        records.push(`${ecology.planted}/${CYCLES} rounds planted; ${ecology.harvested}/${CYCLES} harvested; ${ecology.supplied}/${CYCLES} supply orders settled.`);
        records.push(crop ? crop.readyAt <= state.clock ? 'Two actual standing shoots are mature and ready to harvest.'
            : `Two shoots need ${crop.readyAt - state.clock} more played minutes. Unclaimed wall-clock time causes no growth or loss.`
            : `${resources?.[I.rootResource] ?? 0} owned root divisions remain; no standing crop is waiting.`);
        records.push(`${resources?.[I.purseResource] ?? 0} coins remain in Rill’s actual supply purse. Each settled order transfers two native herbs for two native coins.`);
    }
    return {title:'Transferred chances and a living reed bed',
        description:'Two separate opt-in original proposals. Existing people, saves and stock change only through deliberate commands; the same played clock governs maturation.', records};
}

function stamp(at, sequence, state, label) {
    assert(natural(at) && at <= state.clock && natural(sequence) && sequence > 0 && sequence <= state.sequence, `Invalid ${label} receipt.`);
}
function validateKeeper(state) {
    const actor = state.actors[I.keeper], person = state.simulation?.people[I.keeper], inventory = state.simulation?.owners[I.keeper];
    assert(actor?.worldId === WORLD && person?.definitionId === I.keeper && person.definitionRevision === 1 &&
        person.inventory === 'simulation' && person.location === LOCATION && record(inventory), 'Missing actual reed-keeper owner.');
    for(const key of [I.rootResource, I.cropResource, I.purseResource]) assert(natural(actor.resources[key]), 'Invalid keeper stock or purse.');
    assert(actor.resources[I.rootResource] <= CYCLES && actor.resources[I.cropResource] <= YIELD && actor.resources[I.purseResource] <= CYCLES * PAY,
        'Keeper finite resource capacity was exceeded.');
    assert(typeof actor.facts[FATE_WILLING] === 'boolean' && typeof actor.facts[ECOLOGY_WILLING] === 'boolean', 'Missing actual keeper consent.');
    return actor;
}

// Absence is deliberately accepted without provisioning or reward backfill.
export function validateOpportunityRecord(backlog, state) {
    if(!backlog?.fate && !backlog?.ecology) return;
    const actor = validateKeeper(state), s = state.simulation;
    const siteOwner = id => assert(s.sites[id]?.owner === I.keeper && s.sites[id].capacity === 1,
        'The opportunity site lost its actual owner.');
    const fate = backlog.fate;
    if(fate) {
        keys(fate, ['revision','donorId','recipientId','claimId','loanId','phase','donorConsent','recipientConsent','offeredAt','offerSequence',
            'transferredAt','transferSequence','settledAt','settleSequence','settlement'], 'finite fate');
        assert(fate.revision === 1 && fate.donorId === I.keeper && fate.recipientId === 'player' && fate.claimId === I.entitlement &&
            fate.loanId === I.loan && fate.donorConsent === true && ['offered','transferred','settled'].includes(fate.phase), 'Unsupported finite fate identity or consent.');
        siteOwner(I.bench); stamp(fate.offeredAt, fate.offerSequence, state, 'fate offer');
        const entitlement = s.claims[I.entitlement], loan = s.custody[I.loan];
        const claimSequence = fate.phase === 'offered' ? fate.offerSequence : fate.phase === 'transferred' ? fate.transferSequence : fate.settleSequence;
        assert(entitlement && entitlement.at === fate.offeredAt && entitlement.cause === `backlog:${claimSequence}`, 'Missing original scarce entitlement or transition receipt.');
        if(fate.phase === 'offered') {
            assert(fate.recipientConsent === false && fate.transferredAt === null && fate.transferSequence === null && fate.settledAt === null &&
                fate.settleSequence === null && fate.settlement === null && entitlement.owner === I.keeper && entitlement.status === 'held' &&
                !loan && (s.owners[I.keeper][K.rope] || 0) === 1 && (s.owners[I.keeper][K.kit] || 0) === 1,
                'Invalid untransferred opportunity or funding.');
        } else {
            stamp(fate.transferredAt, fate.transferSequence, state, 'fate transfer');
            assert(fate.recipientConsent === true && fate.transferredAt >= fate.offeredAt && fate.transferSequence > fate.offerSequence,
                'Invalid recipient consent or transfer ordering.');
            if(fate.phase === 'transferred') assert(entitlement.owner === 'player' && entitlement.status === 'held' &&
                loan?.owner === I.keeper && loan.holder === 'player' && loan.key === K.rope && loan.count === 1 && loan.at === fate.transferredAt &&
                loan.cause === `backlog:${fate.transferSequence}` && (s.owners[I.keeper][K.rope] || 0) === 0 && (s.owners[I.keeper][K.kit] || 0) === 1 &&
                fate.settledAt === null && fate.settleSequence === null && fate.settlement === null,
                'Transferred chance lost its unique claim or actual custody.');
            else {
                stamp(fate.settledAt, fate.settleSequence, state, 'fate settlement');
                assert(fate.settledAt >= fate.transferredAt && fate.settleSequence > fate.transferSequence && !loan && entitlement.status === 'settled' &&
                    ['redeemed','returned_unused'].includes(fate.settlement) && entitlement.owner === (fate.settlement === 'redeemed' ? 'player' : I.keeper) &&
                    (s.owners[I.keeper][K.rope] || 0) === 1 && (s.owners[I.keeper][K.kit] || 0) === (fate.settlement === 'redeemed' ? 0 : 1),
                    'Invalid one-time opportunity settlement or loan return.');
            }
        }
    }
    const ecology = backlog.ecology;
    if(ecology) {
        keys(ecology, ['revision','ownerId','workerId','siteId','rightsId','phase','donorConsent','recipientConsent','joinedAt','joinSequence',
            'planted','harvested','supplied','crop','history','closedAt','closeSequence'], 'reed-bed');
        assert(ecology.revision === 1 && ecology.ownerId === I.keeper && ecology.workerId === 'player' && ecology.siteId === I.bed && ecology.rightsId === I.rights &&
            ['working','closed'].includes(ecology.phase) && ecology.donorConsent === true && ecology.recipientConsent === true, 'Unsupported reed-bed identity or rights.');
        siteOwner(I.bed); stamp(ecology.joinedAt, ecology.joinSequence, state, 'reed-bed agreement');
        assert([ecology.planted, ecology.harvested, ecology.supplied].every(natural) && ecology.planted <= CYCLES && ecology.harvested <= ecology.planted &&
            ecology.supplied <= ecology.harvested && Array.isArray(ecology.history) && ecology.history.length === ecology.planted,
            'Invalid finite reed-bed conservation or history.');
        const rights = s.claims[I.rights];
        assert(rights?.owner === 'player' && rights.at === ecology.joinedAt && rights.status === (ecology.phase === 'closed' ? 'settled' : 'held') &&
            rights.cause === `backlog:${ecology.phase === 'closed' ? ecology.closeSequence : ecology.joinSequence}`,
            'Missing actual harvesting entitlement.');
        assert(actor.resources[I.rootResource] === CYCLES - ecology.planted && actor.resources[I.cropResource] === (ecology.crop ? YIELD : 0) &&
            actor.resources[I.purseResource] === (CYCLES - ecology.supplied) * PAY && (s.owners[I.keeper][K.herbs] || 0) >= ecology.supplied * YIELD,
            'The actual roots, crop, supply stock or funded purse disagree with settled work.');
        let previousSequence = ecology.joinSequence, previousAt = ecology.joinedAt;
        let previousSupplySequence = ecology.joinSequence, previousSupplyAt = ecology.joinedAt;
        for(const [index, round] of ecology.history.entries()) {
            keys(round, ['round','plantedAt','plantSequence','harvestedAt','harvestSequence','suppliedAt','supplySequence'], 'reed-bed round');
            stamp(round.plantedAt, round.plantSequence, state, 'planting');
            assert(round.round === index + 1 && round.plantSequence > previousSequence && round.plantedAt >= previousAt, 'Out-of-order finite planting.');
            if(index < ecology.harvested) {
                stamp(round.harvestedAt, round.harvestSequence, state, 'harvest');
                assert(round.harvestedAt >= round.plantedAt + GROWTH && round.harvestSequence > round.plantSequence, 'A crop was harvested before actual played maturation.');
                previousSequence = round.harvestSequence; previousAt = round.harvestedAt;
            } else {
                assert(round.harvestedAt === null && round.harvestSequence === null, 'Unharvested round has a harvest receipt.');
                previousSequence = round.plantSequence; previousAt = round.plantedAt;
            }
            if(index < ecology.supplied) {
                stamp(round.suppliedAt, round.supplySequence, state, 'supply');
                assert(round.suppliedAt >= round.harvestedAt && round.supplySequence > round.harvestSequence &&
                    round.supplySequence > previousSupplySequence && round.suppliedAt >= previousSupplyAt, 'An order settled before its funded harvest or settled twice.');
                previousSupplySequence = round.supplySequence; previousSupplyAt = round.suppliedAt;
            } else assert(round.suppliedAt === null && round.supplySequence === null, 'Unsettled order has a supply receipt.');
        }
        if(ecology.crop) {
            keys(ecology.crop, ['round','plantedAt','readyAt','count','sequence'], 'standing crop');
            const round = ecology.history[ecology.planted - 1];
            assert(ecology.planted === ecology.harvested + 1 && ecology.crop.round === ecology.planted && ecology.crop.count === YIELD &&
                ecology.crop.plantedAt === round.plantedAt && ecology.crop.sequence === round.plantSequence && natural(ecology.crop.readyAt) &&
                ecology.crop.readyAt === ecology.crop.plantedAt + GROWTH, 'Invalid bounded crop or played-clock boundary.');
        } else assert(ecology.planted === ecology.harvested, 'Standing planted stock was lost without harvest.');
        if(ecology.phase === 'closed') {
            stamp(ecology.closedAt, ecology.closeSequence, state, 'reed-bed closure');
            assert(ecology.planted === CYCLES && ecology.harvested === CYCLES && ecology.supplied === CYCLES && !ecology.crop &&
                ecology.closedAt >= ecology.history[CYCLES - 1].suppliedAt && ecology.closeSequence > ecology.history[CYCLES - 1].supplySequence,
                'Reed-bed rights settled before the finite agreement completed.');
        } else assert(ecology.closedAt === null && ecology.closeSequence === null, 'Working agreement has a closure receipt.');
    } else assert(actor.resources[I.rootResource] === CYCLES && actor.resources[I.cropResource] === 0 && actor.resources[I.purseResource] === CYCLES * PAY,
        'Unjoined ecology changed actual stock.');
}
