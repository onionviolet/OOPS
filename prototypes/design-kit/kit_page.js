// The live design kit (docs/DESIGN_GRAMMAR.md). Imports the real components from src/ and draws each primitive in each state.
// Where no shared component exists, the cell says so in red ("gap") and draws with the nearest real form. Nothing here
// copies a component's markup except the report line, which display.js still builds inline (gap G1).
import {kitRow, kitVerb, kitChip, kitTooltip, kitNumber, kitControl, KIT_VOCABULARY} from '../../src/ui/kit.js';
import {panelSection, reasonLine, infoRow, chip} from '../../src/ui/panel_sections.js';
import {createTabs} from '../../src/reference_kit.js';
import {createFold} from '../../src/ui/fold.js';
import {createMeterBar} from '../../src/meter_bar.js';
import {renderFigure, FIGURE_STATES} from '../../src/ui/figure.js';
import {withLayout} from '../../src/ui/figure_graph.js';
import {fieldRecord} from '../../src/ui/field_record.js';
import {semanticInk} from '../../src/ui/semantic_ink.js';
import {ACTION_VERBS} from '../../src/ui/action_verbs.js';
import {createCreatureRecord} from '../../src/ui/creature_record.js';
import {applyCustomizationProfile, defaultCustomizationState} from '../../src/customization_profiles.js';

const doc = document;
const el = (tag, cls, text) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

// The page takes the game's own stylesheets, in manifest order, so nothing is redrawn here.
const manifest = (await (await fetch('../../styles/manifest.txt')).text()).split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
await Promise.all([...manifest, 'styles/fold.css'].map(href => new Promise(res => {
    const link = el('link'); link.rel = 'stylesheet'; link.href = `../../${href}`; link.onload = link.onerror = res; doc.head.append(link);
})));
await doc.fonts.ready;

// The game's own profile applier sets the type size, spacing unit and theme tokens on the module (Graphite is the default look, DSG2).
const profile = defaultCustomizationState();
const page = doc.querySelector('.customization-module');
applyCustomizationProfile(profile, {moduleNodes: {kit: page}});
page.dataset.componentTheme = 'graphite';
const grid = doc.getElementById('kit');
const stateOf = (label, ...nodes) => { const s = el('div', 'kit-state'); s.append(el('small', '', label), ...nodes); return s; };
const gap = text => el('p', 'kit-gap', `Gap: ${text}`);
function cell(no, title, source, nodes, {wide = false} = {}) {
    const c = el('section', `kit-cell${wide ? ' kit-wide' : ''}`); c.dataset.primitive = title.toLowerCase().replace(/[^a-z]+/g, '-');
    const head = el('header'); head.append(el('strong', '', `${no} ${title}`), el('code', '', source));
    const body = el('div', 'kit-body'); body.append(...nodes);
    c.append(head, body); grid.append(c); return c;
}

// 1 Box: a framed section with a heading, a body, a disclosure form, a tab bar and the empty state that says how to fill it.
{
    const filled = panelSection('Condition', {description: 'Rested. A dull ache in the left knee.'});
    filled.body.append(kitRow({label: 'Fatigue', fact: 'low', from: 'body'}), kitRow({label: 'Warmth', fact: 'comfortable', from: 'weather'}));
    const folded = panelSection('Old injuries', {disclosure: true, open: false}); folded.body.append(el('p', '', 'Left knee, healed badly.'));
    const empty = panelSection('Carried'); empty.body.append(el('p', '', 'Nothing carried. Pick something up and it is listed here.'));
    const tabs = createTabs({label: 'Journal sections', tabs: [{id: 'quests', label: 'Quests'}, {id: 'people', label: 'People'}, {id: 'data', label: 'Data'}]});
    cell('1', 'Box', 'ui/panel_sections.js panelSection', [stateOf('filled', filled.node), stateOf('folded section', folded.node), stateOf('empty (UR32)', empty.node), stateOf('box tabs', tabs.bar),
        gap('the workspace frame (makeShell in workspace_layout.js) is not exported, so the kit shows the section inside it, not the frame.')]);
}

// 2 Row: label, fact, source. Every state in the kit vocabulary, plus a disabled row with its reason beside it.
{
    const rows = KIT_VOCABULARY.states.map(s => stateOf(s, kitRow({label: `Trade with Mara (${s})`, state: s, fact: s === 'unknown' ? '?' : s === 'empty' ? 'nothing yet' : `${s} now`, from: 'market', action: {title: 'Open', run() {}}})));
    const off = kitRow({label: 'Brew a tonic', action: {title: 'Brew', disabled: true}, fact: 'blocked', from: 'bench'});
    cell('2', 'Row', 'ui/kit.js kitRow', [...rows, stateOf('disabled with a reason (DSG10)', off, reasonLine('Needs a clean flask.')),
        stateOf('the second row shape (infoRow, panel_sections.js)', infoRow({label: 'Standing', chips: [chip('liked', {tone: 'good'}), chip('guess', {guess: true})], more: 'Why: you paid the debt.'}))]);
}

// 3 Verb row: icon, label and a Ready mark; the mark states are word plus shape, not colour alone.
{
    const verbs = [['ready', '2 ready · 1 close'], ['near', '1 close'], ['far', 'later'], ['reason', 'not here']].map(([s, m]) => stateOf(`mark: ${s}`, kitVerb({label: ACTION_VERBS[0].label, icon: ACTION_VERBS[0].icon, mark: m, markState: s})));
    const off = kitVerb({label: 'Rest'}); off.disabled = true;
    cell('3', 'Verb row', 'ui/kit.js kitVerb + ui/action_verbs.js', [...verbs, stateOf('plain', kitVerb({label: ACTION_VERBS[1].label, icon: ACTION_VERBS[1].icon})), stateOf('disabled with a reason', off, reasonLine('You are not tired enough.')),
        stateOf('the shipped verb order (ACTION_VERBS)', el('p', '', ACTION_VERBS.map(v => v.label).join(' · ')))]);
}

// 4 Fold: the cat. Nested + and - folds of live state; unknown, empty and sealed folds speak in words.
{
    const cat = {key: 'cat', label: 'calm brown kitten', summary: 'body, thoughts', open: true, folds: [
        {key: 'body', label: 'body', summary: 'House cat', open: true, lines: ['Coat tabby.', {label: 'Bond', value: 62, how: {known: false}}, {label: 'Mood', value: 'content'}], folds: [{key: 'appetite', label: 'appetite', summary: 'hungry', lines: ['Wants fish.', {label: 'Hunger', value: null, how: {low: 6, high: 8}}]}]},
        {key: 'thoughts', label: 'thoughts', summary: 'where am I', open: true, lines: ['What is this place? Where am I? Is that a fish?']},
        {key: 'will', label: 'will', state: 'unknown', unknownText: 'You cannot tell what it wants yet.'},
        {key: 'history', label: 'history', state: 'empty', emptyText: 'Spend time with it and its history fills in.'},
        {key: 'secret', label: 'past life', state: 'sealed', reason: 'Needs a closer look first.'}]};
    const live = createFold(doc, cat);
    const bump = el('button', '', 'Tick the live state'); bump.type = 'button'; kitControl(bump);
    let bond = 62; bump.onclick = () => { bond += 1; live.update({...cat, folds: [{...cat.folds[0], lines: ['Coat tabby.', {label: 'Bond', value: bond, how: {known: false}}, {label: 'Mood', value: 'content'}]}, ...cat.folds.slice(1)]}); };
    const old = createCreatureRecord(doc, {expanded: true});
    old.update({name: 'Biscuit', mood: 'content', coat: 'tabby', bond: 62, posture: 'Curled by the hearth.', preference: '', metAt: 4, knownMinutes: 120, playVisits: 2});
    cell('4', 'Fold', 'ui/fold.js createFold (new)', [stateOf('states: known, estimated, unknown, empty, sealed', live.node), bump,
        stateOf('duplicate: creature_record.js (the original cat, one creature only)', old.node), gap('creature_record.js should be re-expressed through createFold; styles/fold.css is not in styles/manifest.txt yet.')]);
}

// 5 Glyph token and chip: a compact mark for a kind of subject (DSG4); figure state marks carry a word beside the shape.
{
    const kinds = el('div', 'kit-controls');
    for (const [glyph, word] of [['人', 'person'], ['兽', 'unknown creature'], ['夏', 'summer']]) kinds.append(kitChip({label: `${glyph} ${word}`}));
    const marks = el('p', '', Object.entries(FIGURE_STATES).map(([name, mark]) => `${mark} ${name}`).join('   '));
    const ink = el('div', 'kit-controls'); for (const role of ['person', 'place', 'item', 'state']) ink.append(semanticInk(el('span', '', role), role));
    const filters = el('div', 'kit-controls'); filters.append(kitChip({label: 'Combat', count: 3, pressed: true, run() {}}), kitChip({label: 'Loot', count: 0, pressed: false, run() {}}), chip('~12 gold', {guess: true}));
    cell('5', 'Glyph token, chip', 'ui/kit.js kitChip, ui/figure.js FIGURE_STATES, ui/semantic_ink.js', [stateOf('kind glyphs (DSG4)', kinds), stateOf('state marks (shape + word)', marks), stateOf('semantic ink roles', ink), stateOf('chips: pressed, off, guess', filters),
        gap('the CJK kind glyph has no shared component; it is a kitChip with the glyph in the label until one is named.')]);
}

// 6 Meter: pools, accumulators, tracks and the unknown and stale readings.
{
    const specs = [
        ['pool, ok', {id: 'hp', label: 'Health', kind: 'pool', value: 14, max: 20}], ['pool, low', {id: 'sta', label: 'Stamina', kind: 'pool', value: 2, max: 20}],
        ['pool, empty', {id: 'mana', label: 'Mana', kind: 'pool', value: 0, max: 12}], ['accumulator, near the limit', {id: 'tox', label: 'Toxicity', kind: 'accumulator', value: 9, max: 10, note: 'More is worse.'}],
        ['track, complete', {id: 'xp', label: 'Practice', kind: 'track', value: 8, max: 8}], ['discrete steps', {id: 'dose', label: 'Doses', kind: 'pool', value: 3, max: 6, discrete: true}],
        ['unknown reading', {id: 'foe', label: 'Foe health', kind: 'pool', value: 1, max: 1, unknown: true}], ['stale (last observed)', {id: 'old', label: 'Stock', kind: 'pool', value: 5, max: 10, observation: {text: 'Seen two days ago', stale: true}}]];
    const nodes = specs.map(([label, spec]) => { const m = createMeterBar(doc); m.update(spec); return stateOf(label, m.node); });
    cell('6', 'Meter', 'meter_bar.js createMeterBar', [...nodes, gap('bar_semantics.js (legacy vitals), relationship_web.js bars and combat_display.js still draw their own bars; meter_bar.js should win.')]);
}

// 7 Number as the life knows it.
{
    const row = (label, node) => stateOf(label, node);
    cell('7', 'Number', 'ui/kit.js kitNumber, ui/known_number.js', [row('known', kitNumber(12, {}, {field: 'Hit chance'})), row('estimated, one value', kitNumber(12, {known: false}, {field: 'Hit chance'})), row('estimated, range', kitNumber(null, {low: 10, high: 14}, {field: 'Hit chance'})),
        row('unknown (hover for the field)', kitNumber(undefined, {}, {field: 'Hit chance'}))]);
}

// 8 Report line. display.js still builds these inline: the kit uses the shipped class names, so styles are real, markup is not.
{
    const log = el('div'); log.id = 'message_log_div';
    const line = (kinds, text, voice) => { const m = el('div', `message ${kinds}`, text); if (voice) { const v = el('span', 'report-voice'); v.append(el('i', 'report-voice-flavour', voice[0]), ' ', el('span', 'report-voice-useful', voice[1])); m.append(v); } return m; };
    log.append(line('message_events', 'You walk to the mill.'), line('message_unlocks', 'You can now trade at the market.', ['Stalls are being set up.', 'Trade is open.']), line('message_loot', 'Found 3 herbs. x2'), line('message_combat', 'The boar hits you for 4.'));
    const filters = el('div', 'report-kinds'); for (const [label, on] of [['Events', true], ['Combat', true], ['Loot', false]]) filters.append(kitChip({label, pressed: on, run() {}}));
    cell('8', 'Report line', 'display.js (inline) + ui/report_filters.js', [stateOf('kinds, a voiced line (DSG13), a repeat (x2)', log), stateOf('filters', filters),
        gap('G1: no exported report-line component; display.js builds the markup inline. Needs one `reportLine({kind, text, voice, repeat})` before this cell can import it.')]);
}

// 9 Map node: the figure primitive; states carry a mark and a word.
{
    const nodes = ['home', 'mill', 'market', 'ford', 'hill'].map((id, i) => ({id, label: id[0].toUpperCase() + id.slice(1), state: ['current', 'filled', 'empty', 'guessed', 'unknown'][i], glyph: ['▶', '●', '○', '~', '?'][i]}));
    const edges = [{from: 'home', to: 'mill', kind: 'walk', label: '4 min'}, {from: 'home', to: 'market', kind: 'walk', label: '9 min'}, {from: 'mill', to: 'ford', kind: 'walk', label: '6 min'}, {from: 'market', to: 'hill', kind: 'unknown way', label: '?', state: 'unknown'}];
    const host = el('div'); renderFigure(host, withLayout({id: 'kit-map', title: 'Walking map', summary: 'Minutes from here.', size: 420, nodes, edges}, 'tree'), {idPrefix: 'kit-map'});
    cell('9', 'Map node', 'ui/figure.js renderFigure + ui/figure_graph.js', [stateOf('current, known, unvisited, guessed, unknown', host)]);
}

// 10 Motion beat: one pulse per meaning, off under reduced motion. Presentation only (styles/feel_finish.css).
{
    const stage = el('div'); stage.id = 'motion_stage';
    const ready = el('div', 'ready-hub__row ready-hub__row--ready', 'Brew a tonic: ready');
    const near = el('div', 'ready-hub__row ready-hub__row--near', 'Smelt iron: 1 short');
    const fresh = el('div', '', 'New item: Silver thread'); const tick = el('span', '', '12');
    const play = el('button', '', 'Replay the beats'); play.type = 'button'; kitControl(play);
    const replay = () => { for (const n of [ready, fresh]) { n.style.animation = 'none'; void n.offsetWidth; n.style.animation = ''; } fresh.dataset.itemNew = ''; tick.textContent = String(Number(tick.textContent) + 1); tick.removeAttribute('data-feel-tick'); void tick.offsetWidth; tick.dataset.feelTick = 'up'; };
    play.onclick = replay;
    const tickRow = el('p', '', 'Gold '); tickRow.append(tick);
    stage.append(stateOf('ready: green edge, one pulse', ready), stateOf('near: dashed gold outline', near), stateOf('new: one pulse', fresh), stateOf('growth: the number ticks up', tickRow), play,
        el('p', '', 'Effects reduced here (data-effects="reduced"), so the beats are still. Remove it to see them.'));
    cell('10', 'Motion beat', 'styles/feel_finish.css + ui/feel_finish.js', [stage]);
}

// 11 Tooltip record: title, label/value lines, a closing note. Shown pinned and in place.
{
    const tip = kitTooltip({title: 'Brew a tonic', lines: [{label: 'Chance', value: '~70%'}, {label: 'Needs', value: 'clean flask (have 0)'}, {label: 'Takes', value: '12 min'}], note: 'Stops if someone knocks.'});
    const unknown = kitTooltip({title: 'Strange herb', lines: [{label: 'Effect', value: '?'}], note: 'You have not tried it.'});
    const bare = kitTooltip({title: 'Locked door', note: 'Not yet. You have no key.'});
    cell('11', 'Tooltip', 'ui/kit.js kitTooltip', [stateOf('with numbers and a note', tip), stateOf('unknown effect', unknown), stateOf('disabled with a reason', bare),
        gap('item_card.js and display.js tooltips draw their own; kitTooltip should win (DY15: one tooltip path).')]);
}

// 12 Inspector content: the selected-entry record. ui/inspector.js only moves a view's detail node into the left box.
{
    const make = (extra = {}) => fieldRecord(doc, {kind: 'Place', name: 'Old mill', location: {name: 'Riverbank', here: true}, state: 'Quiet', description: 'A wheel turns slowly. Flour dust hangs in the light.',
        facts: [['Who is here', 'Mara, one stranger'], ['Can do', 'Talk, trade, rest']], links: [{label: 'Mara', open() {}}], ...extra});
    cell('12', 'Inspector', 'ui/field_record.js fieldRecord (content), ui/inspector.js (placement)', [stateOf('known', make()), stateOf('observer-limited', make({name: 'Something by the river', state: 'Unknown', description: '', facts: [['Who is here', '?'], ['Can do', 'not known yet']], links: []})),
        gap('inspector.js, chain_inspector_ui.js and known_things.js each place their own detail; fieldRecord plus createFold should be the one content form.')]);
}
doc.documentElement.dataset.kitReady = '1';
