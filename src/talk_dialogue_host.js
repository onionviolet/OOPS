// Host seam for the conversation view: turns a native base-game dialogue (data/dialogues.js textlines) into the talk
// model and mounts src/ui/talk_view.js over the native line list. The native divs stay in the DOM (hidden to sight
// and to assistive tech) so every route to a line is still the one native start_textline (PIR8).
// What is "new" is read from the divs update_displayed_dialogue already built, so eligibility cannot drift from
// the native checks. "Heard" is derived from the line's own lock (it closes itself in locks_lines), so no new save
// state is written; a line that a sibling closed reads "settled another way".
import {topicsFromLines, talkModel, rapportFigure} from './read_models/talk_bridge.js';
import {renderTalkView} from './ui/talk_view.js';
import {storyRecap} from './lore_history_view.js';
import {readPort} from './ui_ports.js';

export function nativeTalkLines({dialogue, shownKeys, labelOf, answerOf}) {
    const lines = [];
    for (const [key, line] of Object.entries(dialogue.textlines)) {
        if (line.is_branch_only) continue;
        const a = line.getAvailabilityComponent();
        const closed = a.is_unlocked && (a.is_locked || a.is_finished);
        if (shownKeys.includes(key)) lines.push({id: key, label: labelOf(key), state: 'new', rewards: line.rewards, closesOthers: Object.values(line.rewards?.locks?.textlines || {}).flat().some(k => k !== key)});
        else if (closed) lines.push({id: key, label: labelOf(key), state: (line.locks_lines || []).includes(key) ? 'heard' : 'closed', text: answerOf(line)});
    }
    const hidden = Object.values(dialogue.textlines).some(l => !l.is_branch_only && !l.getAvailabilityComponent().is_unlocked && !l.getAvailabilityComponent().is_locked);
    return {lines, hiddenMore: hidden};
}

// parts: {actionDiv, npcId, name, role, place, dialogue, translate, choose}. Deeds come from the same storyRecap the person card uses (one authority).
export function mountTalkView({actionDiv, npcId, name, role, place, dialogue, translate, choose}) {
    const natives = [...actionDiv.querySelectorAll(':scope > .dialogue_textline[data-textline]')];
    if (!natives.length && !Object.values(dialogue.textlines).some(l => l.getAvailabilityComponent().is_locked || l.getAvailabilityComponent().is_finished)) return null;
    const shownKeys = natives.map(n => n.dataset.textline);
    // A line authored as plain text has no translation key; the translator reports "text not found, id: 'X'". Show X.
    const plain = text => text.replace(/^"|"$/g, '').replace(/^text not found, id: '(.*)'$/, '$1');
    const labelOf = key => { const n = natives.find(x => x.dataset.textline === key); return plain(n ? n.textContent : translate(dialogue.textlines[key].name)); };
    const {lines, hiddenMore} = nativeTalkLines({dialogue, shownKeys, labelOf: key => labelOf(key), answerOf: line => translate(line.text)});
    const recap = storyRecap(readPort('expansion'), npcId)?.line;
    const deeds = recap ? [recap.replace(/^Story so far: /, '')] : [], manner = '';
    const person = {id: npcId, name, role};
    const model = talkModel({person, place, topics: topicsFromLines(lines), hiddenMore, deeds, manner});
    model.rapportFigure = rapportFigure(person, model.rapport);
    const answerNode = actionDiv.querySelector('#dialogue_answer_div');
    for (const n of natives) { n.classList.add('talk-native-list'); n.setAttribute('aria-hidden', 'true'); }
    actionDiv.querySelector('#dialogue_name_div')?.classList.add('talk-native-list');
    const anchor = natives[0] || actionDiv.querySelector('.end_dialogue_button');
    const host = actionDiv.ownerDocument.createElement('div'); host.className = 'talk-view-host'; host.id = 'talk_view_host';
    if (anchor) anchor.before(host); else actionDiv.append(host);
    return renderTalkView(host, model, {onChoose: topic => choose(topic.id)}, {answerNode});
}
