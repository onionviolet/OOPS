// Conversation view (docs/representations/TALK.md). Three columns at 1920x1080: what you can say now (the scene
// card, actions first, UR42), what is already covered, and what this person knows of you. Draws only into the
// node it is given and builds elements through that node's document, so pop-outs work (MDL13).
// model: talk_bridge.talkModel(). hooks: {onChoose(topic), onPerson(id)}. options: {answerNode} a node moved
// into the card as the person's last line (the native #dialogue_answer_div keeps its id and text).
import {renderSceneCard} from './scene_card.js';
import {renderFigure} from './figure.js';
import {talkText} from '../read_models/talk_bridge.js';

const STATE_MARK = {new: '●', heard: '✓', closed: '·', locked: '○'};
const STATE_WORD = {new: 'new', heard: 'heard', closed: 'settled another way', locked: 'not yet'};

export function renderTalkView(host, model, hooks = {}, options = {}) {
    const doc = host.ownerDocument || globalThis.document;
    const make = (tag, className, text) => { const n = doc.createElement(tag); if (className) n.className = className; if (text) n.textContent = text; return n; };
    const root = make('section', 'talk-view');
    root.dataset.talkPerson = model.person.id;
    root.setAttribute('aria-label', `Conversation with ${model.person.name}`);

    // Center: the card. Options carry the three looks (PIR16) through data-topic-state; a locked row prints its reason (SUI5).
    const cardHost = make('div', 'talk-card-slot');
    const byId = new Map(model.open.map(t => [t.id, t]));
    const card = renderSceneCard(cardHost, {
        kind: 'talk', id: model.person.id,
        header: {lead: `Talking with ${model.person.name}`, place: model.place},
        stakes: model.stakes,
        options: model.open.map(t => ({id: t.id, label: t.label, time: model.noTime ? '' : t.quote.time, cost: t.quote.cost, affects: t.quote.effects.join(' · '),
            attrs: {topicId: t.id, topicState: t.state}, blocked: t.state === 'locked' ? (t.reason || 'Not possible yet.') : '', onChoose: () => hooks.onChoose?.(byId.get(t.id))})),
    });
    if (options.answerNode) { const first = card.querySelector('.scene-card-stakes'); (first || card.firstChild).after(options.answerNode); options.answerNode.classList.add('talk-answer'); }
    if (model.hiddenMore) card.append(make('p', 'talk-more', 'There may be more to ask as you learn more.'));

    // Left: already covered. Heard rows stay normal text with a quiet mark and open to recall the answer.
    const covered = make('aside', 'talk-covered');
    covered.append(make('h3', '', 'Already covered'));
    if (!model.covered.length) covered.append(make('p', 'talk-empty', 'Nothing yet. Each thing you say is kept here.'));
    for (const t of model.covered) {
        const row = make('details', 'talk-covered-row'); row.dataset.topicState = t.state;
        row.append(make('summary', '', `${STATE_MARK[t.state]} ${t.label}`));
        row.append(make('small', '', t.recall || STATE_WORD[t.state]));
        covered.append(row);
    }

    // Right: what they know of you, then the rapport ladder (a figure track, so glyphs and words match everywhere).
    const knows = make('aside', 'talk-knows');
    knows.append(make('h3', '', `What ${model.person.name} knows of you`));
    if (!model.knows.rows.length) knows.append(make('p', 'talk-empty', model.knows.empty));
    const list = make('ul', 'talk-knows-list');
    for (const r of model.knows.rows) { const li = make('li', 'talk-knows-row'); li.dataset.knowsKind = r.kind; li.append(make('small', '', r.source), make('span', '', r.text)); list.append(li); }
    if (model.knows.rows.length) knows.append(list);
    if (model.cheat) knows.append(make('p', 'talk-cheat', 'Cheat view: shows what they privately think.'));
    const rapport = make('div', 'talk-rapport'); rapport.dataset.rapportStage = model.rapport.stage.id;
    rapport.append(make('h4', '', 'Rapport'), make('p', '', model.rapport.text));
    if (model.rapportFigure) { const fig = make('div', 'talk-rapport-figure'); rapport.append(fig); renderFigure(fig, model.rapportFigure, {idPrefix: `talk-${model.person.id}`, text: false}); }
    knows.append(rapport);

    const text = make('pre', 'talk-text'); text.textContent = talkText(model); text.hidden = true; text.dataset.talkText = '';
    root.append(covered, cardHost, knows, text);
    host.append(root);
    return root;
}
