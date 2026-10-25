// Read-only projection. The sole host builds quotes and commits through the
// existing durable publisher; this panel owns only focus and transient notices.
import {isFeatureBattleSchema} from './feature_expansion_battle.js';
import {createActionLegibilityList} from './action_legibility_ui.js';
import {rendered,shownOrDeferred} from './panel_reveal.js';
const node = (tag, text = '', className = '') => {
    const n = document.createElement(tag); n.textContent = text; n.className = className; return n;
};
const textOf = v => typeof v === 'string' ? v : v?.known === false ? '' : v?.text || v?.reason || '';
const reasonsOf = values => (values || []).map(textOf).filter(Boolean).join(' ');

export function createFeatureExpansionPanel({read, command, present}) {
    const element = node('details', '', 'expedition_panel'); element.id = 'feature_expansion_panel';
    const summary = node('summary', 'Tools, practice & local lives'); summary.tabIndex = 0;
    const status = node('p', '', 'expedition_notice'); status.setAttribute('role', 'status');
    const sections = node('div'), rows = new Map();
    const battle=node('section'),attackers=node('div'),defenders=node('div');
    attackers.id='feature_battle_attackers';defenders.id='feature_battle_defenders';
    battle.append(attackers,defenders);element.append(summary, status, sections,battle);
    let notice = '';
    const focus = () => {element.open = true; summary.focus();};
    const safeRemove = n => {if(n.contains(document.activeElement)) focus(); n.remove();};
    const run = action => {
        try {command(typeof action === 'function' ? action() : action); notice = 'Progress saved.';}
        catch(error) {notice = error?.message || String(error);}
        render();
    };
    function rowFor(section, action) {
        const row = node('section', '', 'expedition_card'), button = node('button'), description = node('p');
        const terms = node('p', '', 'expedition_preview'), reasons = node('p', '', 'expedition_requirements');
        button.type = 'button';
        const entry = {row, button, description, terms, reasons, action};
        button.addEventListener('click', () => run(() => ({...entry.action.command, sequence: entry.action.command.sequence ?? read().state.sequence})));
        row.append(button, description, terms, reasons); section.actions.append(row); return entry;
    }
    function render() {
        // In an unrendered container nothing shows; compute when it is revealed.
        if(!shownOrDeferred(render, () => rendered(element.parentElement))) return;
        const snapshot = read(), view = present(snapshot), enabled = snapshot.canWrite && !snapshot.error;
        battle.hidden=snapshot.state.simulation?.sessions.player?.nativeBattle?.schema===6||!isFeatureBattleSchema(snapshot.state.simulation?.sessions.player?.nativeBattle?.schema);
        if(!view.visible && !element.hidden && element.contains(document.activeElement)) focus();
        element.hidden = !view.visible;
        status.textContent = snapshot.error || snapshot.notice || notice; status.hidden = !status.textContent;
        const shown = new Set();
        for(const section of view.sections || []) {
            shown.add(section.id);
            let entry = rows.get(section.id);
            if(!entry) {
                const card = node('details', '', 'notebook_preparation'), heading = node('summary'), intro = node('p');
                const work = node('p', '', 'expedition_preview'), actions = node('div'), records = node('ul', '', 'expedition_history');
                card.append(heading, intro, work, actions, records); sections.append(card);
                entry = {card, heading, intro, work, actions, records, actionRows: new Map(), recordRows: new Map()}; rows.set(section.id, entry);
                entry.currentActions = new Map();
                entry.legibility = createActionLegibilityList({parent:actions,idPrefix:`feature-${section.id}`,focusFallback:summary,
                    onAction:row=>{
                        const action=entry.currentActions.get(row.id);if(!action)throw new Error('This offer changed. Review it again.');
                        // Re-render after a failed command too, so a paused save shows its
                        // reload instruction instead of a generic "try again".
                        try {command({...action.command,sequence:action.command.sequence ?? read().state.sequence});} finally {render();}
                    }});
            }
            entry.heading.textContent = section.label;
            entry.intro.textContent = section.description || ''; entry.intro.hidden = !entry.intro.textContent;
            entry.work.textContent = section.work || ''; entry.work.hidden = !entry.work.textContent;
            const actionsShown = new Set();
            entry.currentActions = new Map((section.actions||[]).map(a=>[a.id,{...a,command:{...a.command,sequence:a.command.sequence??snapshot.state.sequence}}]));
            entry.legibility.render({actions:(section.actions||[]).map(a=>a.legibility).filter(Boolean),enabled,notice:snapshot.error||''});
            for(const action of section.actions || []) {
                if(action.legibility) continue;
                actionsShown.add(action.id);
                let row = entry.actionRows.get(action.id);
                if(!row) {row = rowFor(entry, action); entry.actionRows.set(action.id, row);}
                row.action = entry.currentActions.get(action.id); row.button.textContent = action.label;
                row.button.disabled = !enabled || !action.eligible;
                row.description.textContent = action.description || ''; row.description.hidden = !row.description.textContent;
                row.terms.textContent = action.terms || ''; row.terms.hidden = !row.terms.textContent;
                row.reasons.textContent = snapshot.error || reasonsOf(action.reasons) || (!enabled ? 'Saving is currently unavailable.' : '');
                row.reasons.hidden = !row.reasons.textContent;
            }
            for(const [id, row] of entry.actionRows) if(!actionsShown.has(id)) {safeRemove(row.row); entry.actionRows.delete(id);}
            const recordsShown = new Set();
            for(const record of section.records || []) {
                recordsShown.add(record.id);
                let row = entry.recordRows.get(record.id);
                if(!row) {row = node('li'); entry.records.append(row); entry.recordRows.set(record.id, row);}
                row.textContent = record.text; 
            }
            for(const [id, row] of entry.recordRows) if(!recordsShown.has(id)) {safeRemove(row); entry.recordRows.delete(id);}
            entry.records.hidden = !recordsShown.size;
        }
        for(const [id, entry] of rows) if(!shown.has(id)) {entry.legibility.destroy();safeRemove(entry.card); rows.delete(id);}
    }
    document.getElementById('location_actions_div')?.append(element);
    render(); return {element, panel:element, render, focus};
}
