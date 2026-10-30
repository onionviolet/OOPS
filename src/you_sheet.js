// The You panel's expanded view is the character sheet (CHARACTER_SHEET.md step 16, CS6i). This builds
// the self subject from what the status window already reads and draws it through the same projection
// as anyone else's sheet. The status window is a read the sheet gains once the system awakens.
import {characterSheetView} from './character_sheet.js';
import {renderCharacterSheet} from './ui/character_sheet_view.js';
import {observerView} from './observer_view.js';
import {readPort} from './ui_ports.js';

const NATIVE = ['strength', 'agility', 'dexterity', 'intuition', 'magic'];
const cap = word => word[0].toUpperCase() + word.slice(1);
export const STATUS_READ = Object.freeze({means: 'status-window', label: 'Your status window', level: 5, precision: 3, scope: ['standing']});

// snapshot = {level, stats, titles[], quest?}; system = the awakened status entry's state, or null.
export function youSheetSubject(snapshot, observer, system = null) {
    const standing = system ? [
        {id: 'system-points', label: 'System points', value: String(system.points ?? 0)},
        {id: 'system-quest', label: 'System quest', value: snapshot.quest?.text || 'None yet.'},
    ] : [];
    return {
        id: observer.actorId, name: 'You', kind: '', level: snapshot.level,
        stats: NATIVE.filter(key => Number.isFinite(snapshot.stats?.[key])).map(key => ({id: key, label: cap(key), value: snapshot.stats[key]})),
        traits: (snapshot.titles || []).map((name, i) => ({id: `title-${i}`, label: name, value: 'Title'})),
        standing,
    };
}

export function youSheetView(snapshot, observer, system) {
    const view = characterSheetView(youSheetSubject(snapshot, observer, system), observer, system ? [STATUS_READ] : []);
    // Nothing about yourself is "not read yet": a section with no rows of its own is left out until an owner fills it.
    return {...view, sections: view.sections.filter(section => !(section.rows.length === 1 && section.rows[0].id === 'unread'))};
}

// Mounts the sheet in the node it is given (the Character & preparation view) and redraws on change.
export function createYouSheet({host, read}) {
    const panel = document.createElement('section');
    panel.id = 'you_sheet_panel'; panel.className = 'you_sheet';
    host.prepend(panel);
    let signature = '';
    function render(system) {
        const view = youSheetView(read(), observerView(readPort('expansion') ?? {}), system);
        const next = JSON.stringify(view);
        if(next === signature) return;
        signature = next;
        renderCharacterSheet(panel, view, {layout: 'wide'});
    }
    return {render, destroy() {panel.remove();}};
}
