import {registerDomain} from './domain_registry.js';
import {readPort} from './ui_ports.js';
import {accessView, loopView, hasPermit, inCyoria} from './book_world_mol_access.js';
import {createMolAccessPanel} from './book_world_mol_access_ui.js';
// Slice `mol_access` ({schema:1, issuedAt}) is written only once the guest permit has been seen, so saves that never met Ilsa stay as they were.
// Everything else on the panel is derived from the expansion state (AR5: one authority per fact).
let slice = null, panel = null;
const expansion = () => readPort('expansion');
function observe() {
    const e = expansion();
    if(!slice && hasPermit(e) && Number.isSafeInteger(e.clock)) slice = {schema: 1, issuedAt: e.clock};
}
const view = () => { observe(); const e = expansion(); return {access: accessView(e, slice), loop: loopView(e)}; };
registerDomain({id: 'mol_access', initialState: () => null,
    save: () => { observe(); return slice ?? undefined; },
    validate: s => { if(s != null && (s.schema !== 1 || !Number.isSafeInteger(s.issuedAt) || s.issuedAt < 0 || (s.termMinutes != null && !(Number.isSafeInteger(s.termMinutes) && s.termMinutes > 0)))) throw new Error('Invalid Cyoria access record.'); },
    load: s => { slice = s ? {schema: 1, issuedAt: s.issuedAt, ...(s.termMinutes ? {termMinutes: s.termMinutes} : {})} : null; },
    refresh: () => panel?.render(false), projection: view,
    panels: [() => { panel = createMolAccessPanel({read: view, eligible: () => inCyoria(expansion())}); }]});
