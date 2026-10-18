// UIL2 owner probes. Place, time and combat have no publisher of their own yet; their owners are
// live bindings (runtime_state, game_time) and the observer-safe opponent projection (AR8). This
// display-only domain compares them at each native publication the registry already makes (ticks,
// commands, restore end) and publishes the topics whose value moved. No timer, no state, no save
// slice (AR2, AR3). An owner that later publishes for itself drops its probe here.
import {registerDomain, domainRegistry} from './domain_registry.js';
import {current_location} from './runtime_state.js';
import {current_game_time} from './game_time.js';
import {changeSignal} from './ui_change_signal.js';

export function createChangeProbes(probes, signal = changeSignal) {
    const last = new Map();
    return function compare() {
        for (const [topic, read] of Object.entries(probes)) {
            let value; try { value = read(); } catch { continue; }
            if (last.has(topic) && last.get(topic) === value) continue;
            const first = !last.has(topic); last.set(topic, value);
            if (!first) signal.publish(topic, `probe:${topic}`);
        }
    };
}

let registered = false;
export function registerChangeProbes() {
    if (registered) return; registered = true;
    const refresh = createChangeProbes({
        place: () => current_location?.id ?? current_location?.name ?? '',
        time: () => current_game_time?.toString?.() ?? '',
        combat: () => { const view = domainRegistry.project('combat-opponents'); return view ? `${view.active}:${view.count}:${view.alive}` : ''; },
    });
    registerDomain({id: 'ui-change-probes', refresh});
}
