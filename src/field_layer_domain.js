import {registerDomain} from './domain_registry.js';
import {createFieldDomain} from './field_layer_factory.js';
import {createFieldPanel} from './field_layer_panel.js';
import {MIXTURE_ID, INGREDIENTS, getMixtureOwner, createMixtureState, productFromKey} from './mixture_state.js';
import {STREAMS, streamSeed} from './seeded_streams.js';
import {current_location} from './runtime_state.js';
import {is_raining} from './weather.js';
export {createFieldDomain, validateFields, WATER} from './field_layer_factory.js';
// Native composition. Material properties come from the existing mixture owner (products and
// ingredient profiles); nothing here duplicates them. The panel mounts through the domain.
const nativeFields = createFieldDomain();
let panel = null;
export const fieldsState = nativeFields.getState;
export const setFieldsState = nativeFields.setState;
export const refreshFieldsPanel = () => panel?.render();
export function configureFields(operations) {
    const {actor, itemOwners, assertSpend, persist, writable, location, refresh, logMessage, root, lampShining} = operations;
    const owner = () => getMixtureOwner() ?? createMixtureState(streamSeed(root(), STREAMS.craft, 'village.mixtures@1'));
    nativeFields.configure({itemOwners, assertSpend, persist, writable, location, refresh, logMessage, refreshPanel: refreshFieldsPanel,
        heldItems: () => Object.entries(actor().getItems()).filter(([, row]) => row.count > 0).map(([key, row]) => ({key, count: row.count, name: row.item?.getName?.() ?? ''})),
        removeKey: (key, count) => actor().removeFromInventory([{item_key: key, item_count: count}]),
        ignitionSource: () => lampShining(),
        // Doorways: places joined to this one by a short walk (10 minutes or less) share fire; recorded where stock is spilled.
        doorways: () => (current_location?.connected_locations ?? []).filter(c => c.travel_time <= 10).map(c => c.location?.id ?? c.location?.name).filter(Boolean),
        raining: () => is_raining(),
        bindLightSource: reader => actor().bindNativeLightSource(reader),
        // Bounded harm (HARM dials): scorched and winded, never below 1 health or 0 stamina (AD19). This is the
        // layer's one write into a person, injected by the host and flagged for review against AR3.
        harm: ({health, stamina}) => {
            const stats = actor().getLevelableComponent().stats.full;
            stats.health = Math.max(Math.min(1, stats.health), stats.health - health);
            stats.stamina = Math.max(0, stats.stamina - stamina);
            actor().updateStatsAndDisplay?.();
        },
        composition(key) {
            try {
                const id = JSON.parse(key).id;
                if (id === MIXTURE_ID) { const p = productFromKey(owner(), key); return {fractions: {...p.fractions}, mass: p.mass}; }
                if (INGREDIENTS.some(i => i.id === id)) { const f = owner().profiles[id].fractions; return {fractions: {...f}, mass: 1000}; }
            } catch { /* not a field material */ }
            return null;
        }});
}
registerDomain({...nativeFields, load: value => { nativeFields.setState(value); panel?.reset(); }, refresh: () => panel?.render(),
    panels: [() => { panel = createFieldPanel({read: nativeFields.projection, quote: nativeFields.commands.quote, execute: nativeFields.commands.execute,
        discovered: () => { const v = nativeFields.projection(); return !!v.here || v.materials.length > 0 || v.places.length > 0; }}); }]});
