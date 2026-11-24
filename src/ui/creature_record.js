import {kitElement} from './kit.js';
import {semanticInk} from './semantic_ink.js';

// A disclosure tree over the same household observation used beside the hearth.
export function createCreatureRecord(doc, {expanded = false} = {}) {
    const el = (tag, cls, text) => kitElement(tag, cls, text, doc);
    const root = el('details', 'creature-record');
    root.open = expanded;
    const title = el('summary');
    const name = semanticInk(el('strong'), 'person');
    const face = el('span', 'creature-expression');
    face.setAttribute('aria-hidden', 'true');
    title.append(name, face);
    root.append(title);
    function branch(label, open = false) {
        const group = el('details', 'creature-branch');
        group.open = open;
        const body = el('div', 'creature-branch-body');
        group.append(el('summary', '', label), body);
        root.append(group);
        return body;
    }
    const kind = branch('Kind');
    kind.append(el('p', '', 'House cat'));
    const traits = branch('Traits');
    const coat = el('p');
    const mood = semanticInk(el('span'), 'state');
    const bond = el('span');
    const moodLine = el('p', '', 'Mood '), bondLine = el('p', '', 'Bond ');
    moodLine.append(mood);
    bondLine.append(bond);
    traits.append(coat, moodLine, bondLine);
    const observations = branch('Observations', true);
    const posture = semanticInk(el('p'), 'prose');
    const preference = semanticInk(el('p'), 'item');
    const history = el('p', 'creature-history');
    observations.append(posture, preference, history);

    const set = (node, text) => { if (node.textContent !== text) node.textContent = text; };
    return {
        node: root,
        update(view) {
            root.hidden = !view;
            if (!view) return;
            set(name, view.name);
            face.dataset.expression = view.mood;
            set(coat, 'Coat ' + view.coat);
            set(mood, view.mood);
            set(bond, view.bond + '/100');
            set(posture, view.posture);
            set(preference, view.preference || 'No play preference observed yet.');
            set(history, `Met at journey minute ${view.metAt} · known for ${view.knownMinutes} min · ${view.playVisits} play visit${view.playVisits === 1 ? '' : 's'}`);
        },
    };
}
