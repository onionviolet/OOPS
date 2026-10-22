import {HOUSEHOLD, validateHousehold, planHousehold, householdRest, householdFirewood, householdPlayCloth} from './model.js';
import {furnitureProjection, furnitureComfort, furnitureBonusText} from '../../absorb_b/furniture.js';
import {projectHouseholdScene} from '../../household_scene.js';

/** P00 adapter, deliberately not registered by this lane.
 * read() -> {household?: save block, context: model's native snapshot,
 * furnitureInput: furnitureProjection input}. Capture one root revision.
 * preflight(plan, snapshot) -> true only if ALL item/custody/condition intents
 * can be published with the block and notices in ONE root transaction.
 * publish(plan,snapshot) -> synchronous atomic compare-and-publish result;
 * reject changed snapshot.context.sequence, never partially debit resources.
 * Neither callback may modify snapshot/plan. No direct inventory fallback.
 */
export function commitHousehold(host, command) {
    const snapshot = host.read();
    const c = snapshot.context;
    if(command.sequence !== c.sequence) throw Error('Household: review changed terms.');
    const plan = planHousehold(snapshot.household,
        {type: command.type, clock: c.clock, sequence: c.sequence + 1,
            ...(command.type === 'tick' ? {elapsed: command.elapsed} : {})}, c);
    if(plan.state === undefined) return {unchanged: true};
    if(host.preflight(plan, snapshot) !== true) throw Error('Household: native preflight refused.');
    return host.publish(plan, snapshot);
}

/** Call in native full-envelope import preflight, before ANY owner mutation. */
export function preflightHouseholdImport(block, nativeClock, nativeSequence) {
    validateHousehold(block, {clock: nativeClock, sequence: nativeSequence});
    if(block && block.lastClock !== nativeClock) throw Error('Household: save clock must match native played clock; no catch-up.');
    return block;
}

/** Known-only standard Here section. Host controls DOM and Effects master switch.
 * No effects animation, hidden actors, future gifts or undiscovered items here.
 */
export function householdPresentation(snapshot) {
    const {household: s, context: c} = snapshot;
    validateHousehold(s, c);
    const supported = c.alive === true && c.controlled === true && c.homeOwned === true && c.atHome === true;
    if(!supported || (s && s.homeId !== c.homeId) || (!s && c.animalKnown !== true && c.hearthOwned !== true))
        return {visible: false, sections: []};
    const fixtures=furnitureProjection(snapshot.furnitureInput),comfort = furnitureComfort(fixtures);
    const h = s?.hearth, animal = s?.animal;
    const actions = [], records = [];
    const add = (type, label, enabled = true, reason = '') => actions.push({id: `household.${type}`, label,
        enabled, reason, command: {type: 'household', id: type, sequence: c.sequence}});
    if(c.animalKnown === true) {
        if(!animal) add('meet', 'Let Moss sniff your hand');
        else {
            records.push({id: 'household.animal', at: c.clock, basis: null,
                text: `Moss · ${animal.ageMinutes >= HOUSEHOLD.growMinutes ? 'grown' : 'young'} brindled cat · ${animal.mood} · bond ${animal.bond}/100 · ${animal.adopted ? 'at home with you' : 'getting to know you'} · ${animal.gifts} gifts received.`});
            add('pet', 'Sit with Moss', c.clock >= animal.lastInteraction + 5 && h.smoke === 0,
                h.smoke > 0 ? 'Moss is sheltering outside. Ventilate first.' : 'Allow five played minutes between visits.');
            add('play', c.playToy?'Play with Moss · use the installed yarn ball':'Play with Moss · reuse 1 carried Linen cloth', c.clock >= animal.lastInteraction + 5 && h.smoke === 0 && householdPlayCloth(c),
                h.smoke > 0 ? 'Moss is sheltering outside. Ventilate first.' : c.clock < animal.lastInteraction + 5 ?
                    'Allow five played minutes between visits.' : 'Carry your own usable Linen cloth. Play returns it and shares the sitting cooldown.');
        }
    }
    if(c.hearthOwned === true) {
        records.push({id: 'household.hearth', at: c.clock, basis: null,
            text: `Hearth · ${h?.fuelMinutes || 0} prepaid minutes · vent ${h?.ventilated === false ? 'closed' : 'open'} · smoke ${h?.smoke || 0}/10 · smoke trial ${h?.smokeOptIn ? 'on' : 'off'}. One owned log burns twenty played minutes, dries Wet after three warm minutes, and uses the firewood pile only when auto-feed is selected.`});
        const supply = householdFirewood(s, c);
        records.push({id:'household.firewood',at:c.clock,basis:null,
            text:`Firewood pile · ${supply.logs.length}/${supply.capacity} stocked logs · auto-feed ${supply.enabled ? 'on' : 'off'}. Stocked logs feed an already burning hearth while you are home. Extinguish keeps the reserve; lighting remains manual.`});
        for(const row of supply.available) {
            const quality = JSON.parse(row.key).quality;
            add(row.action, `Stock 1 Rough wood log${quality == null ? '' : ` · ${quality}% quality`}`,
                supply.logs.length < supply.capacity, 'The five-log local pile needs space.');
        }
        if(h) {
            add(supply.enabled ? 'supply_off' : 'supply_on', supply.enabled ? 'Disable firewood auto-feed' : 'Enable firewood auto-feed');
            add('withdraw_firewood', 'Take 1 stocked log back', supply.logs.length > 0, 'The pile is empty.');
        }
        add('light', 'Light hearth · 1 Rough wood log', !h?.fuelMinutes && c.ownedInventory?.[HOUSEHOLD.fuelKey] >= 1,
            'Carry an owned log and let the previous fuel finish.');
        if(h) {
            add('ventilate', 'Ventilate and clear smoke');
            add('close_vent', 'Close hearth vent');
            add(h.smokeOptIn ? 'smoke_off' : 'smoke_on', h.smokeOptIn ? 'Disable smoke trial' : 'Opt into smoke trial · closed vent causes smoke');
            add('extinguish', 'Extinguish · discard remaining fuel');
        }
        // Uses the existing native exit, not a new destination or travel model.
        records.push({id: 'household.exit', at: c.clock, basis: null,
            text: 'Use the ordinary location exit to step outside. Exposure clears immediately; prepaid fuel keeps burning on played time.'});
    }
    records.push({id: 'household.comfort', at: c.clock, basis: null,
        text: `${comfort.label} · ${comfort.score} owned furnishing comfort. Sleeping recovery +${Math.round((householdRest(s, c, comfort) - 1) * 100)}% from this household, alongside existing bedding.`});
    return {visible: true, scene:{...projectHouseholdScene(s,c,HOUSEHOLD.name),fixtures:fixtures.rows.map(row=>({id:row.id,name:row.name,active:row.active,scope:row.scope,description:furnitureBonusText(row)}))}, sections: [{id: 'household', label: 'A lived hearth',
        description: 'Original household proposal · played time only · no compulsory upkeep', actions, records}]};
}
