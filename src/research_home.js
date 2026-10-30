import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort} from './ui_ports.js';
import {node, visibleRenderer} from './reference_kit.js';
import {openWorkspaceModule} from './workspace_layout.js';
import {centerModes} from './center_modes.js';
import {observerView} from './observer_view.js';
import {createMeterBar} from './meter_bar.js';
import {renderFigure} from './ui/figure.js';
import {mountFormSwitch} from './ui/figure_forms.js';
const mapForms = new Map(); // form chosen per map, kept across redraws (bk-forms)
import {researchView, researchLadderSpec, researchMapSpec, findingLine, stepLine} from './research_view.js';

// The Study panel (proposal, docs/representations/RESEARCH.md). A list of what you are studying
// beside a pinned inspector (UR24): level, time left, the steps with their state, the partial
// findings so far and what finishing opens. All of it is a projection (research_view.js); the panel
// saves nothing and the steps' own buttons stay where the lessons live, so this only points there.

const GLYPH = {done: '✓', doing: '▶', ready: '◆', locked: '·'};

function createPanel() {
    const root = node('section', null, {id: 'research_panel', class: 'reference-panel expedition_panel research-panel', 'aria-label': 'Study'});
    const head = node('p', '', {class: 'research-glance', role: 'status', 'aria-live': 'polite'});
    const queue = node('ul', null, {class: 'research-queue', 'aria-label': 'What you are studying'});
    const inspector = node('div', null, {class: 'research-inspector', 'aria-live': 'polite'});
    const body = node('div', null, {class: 'research-body'});
    body.append(queue, inspector);
    root.append(node('h2', 'Study'), head, body);
    let selected = null;
    const meters = new Map();
    const meter = (key, spec) => {
        let m = meters.get(key); if (!m) { m = createMeterBar(); meters.set(key, m); }
        m.update(spec); return m.node;
    };
    const section = (title, ...children) => { const s = node('section', null, {class: 'research-section'}); s.append(node('h4', title), ...children); return s; };
    // The lesson's own buttons live in the notes panel (Here view). Say what happened either way (FLR3).
    const where = node('p', '', {class: 'research-where-note', role: 'status', 'aria-live': 'polite'});
    const showWhere = p => {
        centerModes().showHere();
        openWorkspaceModule('notebook');
        const target = document.getElementById(p.panel);
        if (target && 'open' in target) target.open = true;
        target?.scrollIntoView?.({block: 'nearest'});
        where.textContent = target?.checkVisibility?.() ? `Opened ${target.querySelector('summary')?.textContent || 'the panel'} in your notes.` : 'It is not on screen from here. Go to the place named in the step, then open Notes and its Here view.';
    };

    const render = visibleRenderer(root, () => {
        const state = readPort('expansion');
        if (!state) return {projects: [], glance: '', empty: '', selected: null};
        const view = researchView(observerView(state), state);
        if (!view.projects.some(p => p.id === selected)) selected = view.projects[0]?.id ?? null;
        return {...view, selected};
    }, view => {
        head.textContent = view.projects.length ? `${view.glance}. Pick one to see what it needs and what it opens.` : view.empty;
        queue.replaceChildren(...view.projects.map(p => {
            const li = node('li', null, {'data-project': p.id}); const b = node('button', null, {type: 'button', class: 'research-row', 'aria-pressed': String(p.id === view.selected)});
            b.dataset.status = p.status;
            b.append(node('strong', p.title), node('span', `${p.statusLabel} · ${p.level.label}`, {class: 'research-chip'}),
                node('small', p.timeLeft.text));
            b.onclick = () => { selected = p.id; render(true); };
            li.append(b); return li;
        }));
        const p = view.projects.find(x => x.id === view.selected);
        if (!p) { inspector.replaceChildren(); return; }
        const next = p.steps.find(s => s.id === p.nextStep);
        const steps = node('ol', null, {class: 'research-steps'});
        for (const s of p.steps) {
            const li = node('li', null, {class: 'research-step', 'data-status': s.status, 'data-step': s.id});
            li.append(node('span', GLYPH[s.status], {class: 'research-glyph', 'aria-hidden': 'true'}), node('span', stepLine(s)), ...(s.status === 'done' ? [] : [node('small', `${s.where}. ${s.how}`)]));
            steps.append(li);
        }
        const findings = p.findings.length ? node('ul', null, {class: 'research-findings'}) : node('p', 'Nothing learned yet. Each step you finish leaves a note here, in your own words.', {class: 'reference-empty'});
        for (const f of p.findings) findings.append?.(node('li', findingLine(f), {'data-stage': f.stage}));
        const ladder = node('div'), map = node('div');
        renderFigure(ladder, researchLadderSpec(p, {size: 640}), {idPrefix: `study-ladder-${p.id}`, text: true});
        mountFormSwitch(map, researchMapSpec(p, {size: 720}), {idPrefix: `study-map-${p.id}`, text: true, memory: mapForms, forms: ['web', 'table', 'sentences']});
        const whereButton = node('button', next ? `Show me where: ${next.label}` : 'Nothing left to do', {type: 'button', class: 'research-where'});
        whereButton.disabled = !next; whereButton.onclick = () => showWhere(p);
        const mapBox = node('details', null, {class: 'research-map'}); mapBox.append(node('summary', 'Map: what needs what'), map, ladder);
        inspector.replaceChildren(
            node('h3', p.title), node('p', p.summary),
            node('p', `${p.level.label} (level ${p.level.index + 1} of ${p.level.of}): ${p.level.means}`, {class: 'research-level'}),
            meter('understanding', {id: 'understanding', label: 'Understanding', kind: 'track', value: p.understanding.done, max: p.understanding.total, note: 'Evidence gathered and the rule explained.'}),
            p.usability.total ? meter('usable', {id: 'usable', label: 'Usable', kind: 'track', value: p.usability.done, max: p.usability.total, note: 'Practised enough to do it yourself.'}) : node('span'),
            node('p', `Time left: ${p.timeLeft.text}.`, {class: 'research-time'}), whereButton, where,
            section('Steps', steps),
            section('What you have found so far', findings),
            section('What it opens', node('p', `${p.opens.state === 'open' ? '★ Open' : '☆ Closed'}: ${p.opens.label}. ${p.opens.how}${p.opens.state === 'open' ? '' : ` (${p.opens.gate})`}`, {class: 'research-opens', 'data-state': p.opens.state})),
            p.next ? section('Next level', node('p', `${p.next.label}: ${p.next.changes}`)) : node('span'),
            mapBox);
    });
    definePanel({id: 'research', title: 'Study', role: 'records', node: root, home: document.getElementById('main_content'), defaultDock: 'right', after: 'records',
        unavailableReason: () => 'Nothing here can be studied yet', discovered: () => true,
        eligible: () => { const s = readPort('expansion'); return !!s && researchView(observerView(s), s).projects.length > 0; }});
    return {render};
}

let panel = null;
registerDomain({id: 'research', panels: [() => { panel = createPanel(); }], refresh: () => panel?.render(false),
    projection: () => { const s = readPort('expansion'); return s ? researchView(observerView(s), s) : null; }});
