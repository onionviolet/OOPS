import {previewSimulationCommand,simulationFacts} from './simulation.js';
import {evaluateRule} from './rules.js';
import {WORKS} from './field_works_content.js';

export function fieldWorksMessage(text) {
    text=text.replace('Insufficient, stale or unavailable item quantity. Refresh the trade.','The required held inputs or receiving tray are unavailable.');
    const names={storage:'depot receiving places',freightOrders:'prepaid road parcel',rackProgress:'consecutive drying work',courierOrders:'funded handcart trips',gardenCare:'prepared garden care',drive:'drive load',mana:'garden energy',space:'reservoir receiving space',spiritOrders:'remaining wisp orders',artisanOrders:'remaining fitter orders',wages:'funded wages'};
    for(const [key,name]of Object.entries(names))text=text.replaceAll(WORKS.prefix+key,name);
    return text;
}
export function previewFieldWorksCommand(state,registry,id,context) {
    const q=previewSimulationCommand(state,registry,id,context),d=registry.simulation.commands.get(id);
    if(!q.eligible&&d.requires&&q.reasons.includes('The required knowledge, means or circumstances are missing.')) {
        const result=evaluateRule(d.requires,simulationFacts(state,context,registry));
        const reasons=result.reasons.map(r=>r.startsWith('Requires ')?'Restore the required workshop, learned method or worker assignment.':r);
        q.reasons=[...new Set([...reasons,...q.reasons.filter(r=>r!=='The required knowledge, means or circumstances are missing.')])];
    }
    return {...q,reasons:q.reasons.map(fieldWorksMessage)};
}
