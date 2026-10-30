// Living style guide (VSX1, UI audit). Draws the shipped visual grammar from the shared tokens so the gallery shows
// what a theme or world skin would change. Renders nothing the game does not already style; every size, color, glow
// and time comes from styles/ui_tokens.css. New representations start here and add a swatch with the token they add.
import {FIGURE_STATES} from '../figure.js';
import {createMeterBar} from '../../meter_bar.js';
import {applyCustomizationProfile, defaultCustomizationState} from '../../customization_profiles.js';

const STATE_WORDS = {filled: 'filled', empty: 'empty', broken: 'broken', strained: 'strained', active: 'active', done: 'done', current: 'current', pending: 'pending', guessed: 'guessed (rumour)', unknown: 'unknown'};
const GLOW_LEVELS = [['none', 'No glow: static content, prose, numbers (quiet backing).'], ['affordance', '--ui-glow-affordance: a control you can use; hover, focus.'], ['active', '--ui-glow-active: the selected or current thing; underline plus soft halo.'], ['discovery', '--ui-glow-discovery: something new to read (a count, a first view). Text only.']];
const MOTIONS = [['--ui-motion-fast', 'hover, focus, press'], ['--ui-motion-normal', 'bars, panels, reveals'], ['--ui-motion-settle', 'a row that just firmed up (cs-firm)']];
const EXTEND = [
    'Start from a token. Colors, radius, frame, spacing (--ui-space-1 to -7), type (--ui-type-*, --ui-line-*, --ui-weight-*), heights (--ui-control-*), layers (--ui-layer-*) and times (--ui-motion-*) are all in styles/ui_tokens.css. The contract test (UR6, UR65-UR68) rejects literals.',
    'Missing a value? Add one token there first, with a comment saying what it is for, then use it. Add its swatch to this page in the same change.',
    'State is a mark plus a word, never color alone (UR37). Pick the mark from the glyph set above; add a glyph here before using a new one.',
    'Glow marks a control or a meaningful state. Prose and numbers sit on quiet backing. Motion uses the three times above, so Effects off and reduced-motion silence everything with one switch.',
    'A world skin sets theme tokens (--theme-surface, -text, -muted, -border, -accent, -warning, -danger); a representation reads them through its own local names, as figure.css and character_sheet.css do.',
    'Make the text form first and the drawing second (RCT2): the drawing adds nothing the words do not say.'
];

export function mountStyleGuide(main) {
    const doc = main.ownerDocument;
    const el = (tag, attrs = {}, text = '') => { const n = doc.createElement(tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (text) n.textContent = text; return n; };
    const group = (title, note, ...kids) => { const g = el('div', {class: 'sg-group'}); g.append(el('h3', {}, title)); if (note) g.append(el('p', {class: 'sg-note'}, note)); g.append(...kids); return g; };
    const cell = (token, ...kids) => { const c = el('div', {class: 'sg-cell'}); c.append(...kids); if (token) c.append(el('code', {}, token)); return c; };

    const section = el('section', {class: 'fig-gallery-section sg-section', 'data-fixture': 'style-guide'});
    section.append(el('h2', {}, 'Style guide: the grammar every representation shares'));
    const host = el('div', {class: 'theme-preview'}), module = el('div', {'data-theme-cell': 'luminous'}), guide = el('div', {class: 'sg'});
    host.append(module); module.append(guide); section.append(host);

    // Frames
    const frame = el('div', {class: 'sg-frame'}, 'Panel frame: --ui-frame, --ui-radius, --ui-shadow on --ui-panel-fill.');
    const log = el('div', {class: 'sg-frame sg-frame--log'}, 'Reports and log field: --ui-log-fill.');
    guide.append(group('Frames', 'Square, dark outer line, navy-to-teal field. Radius is a token (square in Luminous Gothic).', (() => { const g = el('div', {class: 'sg-grid'}); g.append(cell('--ui-frame', frame), cell('--ui-log-fill', log)); return g; })()));

    // Hairline rows
    const rows = el('ul', {class: 'sg-rows'});
    for (const [k, v] of [['Coin', '12 silver'], ['Standing', 'known by name'], ['Wound', 'dull ache, left hand']]) { const li = el('li'); li.append(el('span', {}, k), el('output', {}, v)); rows.append(li); }
    const rowFrame = el('div', {class: 'sg-frame'}); rowFrame.append(rows);
    guide.append(group('Hairline rows', 'Label left, value right, one --ui-hairline seam between rows. No boxes inside the frame.', cell('--ui-hairline, --ui-space-hairline', rowFrame)));

    // Gradient bars
    const bars = el('div', {class: 'sg-grid'});
    for (const [label, hue, pct] of [['Health', '--ui-meter-track', 72], ['Stamina', '--ui-meter-pool', 55], ['Strain', '--ui-meter-warn', 34], ['Limit', '--ui-meter-limit', 88]]) {
        const bar = el('span', {class: 'sg-bar', role: 'meter', 'aria-label': label, 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct)}), fill = el('i');
        fill.style.setProperty('--sg-hue', `var(${hue})`); fill.style.setProperty('--sg-fill', `${pct}%`); bar.append(fill);
        bars.append(cell(hue, el('span', {}, `${label} ${pct}/100`), bar));
    }
    const meters = el('div', {class: 'sg-grid'}), meterFrame = el('div', {class: 'sg-frame'});
    for (const [kind, label, value, max] of [['pool', 'Qi', 6, 10], ['accumulator', 'Backlash', 3, 8], ['track', 'Advancement', 4, 9]]) {
        const bar = createMeterBar(doc); bar.update({id: `sg-${kind}`, label, kind, value, max, note: `${kind} meter`}); meterFrame.append(bar.node);
    }
    meters.append(cell('meter_bar.js: pool, accumulator, track', meterFrame));
    guide.append(group('Gradient bars', 'Vitals read as a gradient from a pale mix of the text color to the meter hue, always beside a number. The shared meter bar (below) is the flat variant for world meters.', bars, meters));

    // Chips
    const chips = el('div', {class: 'sg-chips'});
    chips.append(el('span', {class: 'sg-chip'}, 'Known'), el('span', {class: 'sg-chip', 'data-tone': 'accent'}, 'Current'), el('span', {class: 'sg-chip', 'data-tone': 'warn'}, 'Strained'), el('span', {class: 'sg-chip', 'data-tone': 'limit'}, 'Broken'), el('span', {class: 'sg-chip', 'data-guess': ''}, 'Rumoured'));
    guide.append(group('Chips', 'Hairline outline, no fill. Tone changes the border and text; a guessed read is dashed. The word always carries the meaning (UR37).', chips));

    // Glyph tokens
    const glyphs = el('div', {class: 'sg-glyphs'});
    for (const [name, mark] of Object.entries(FIGURE_STATES)) { const g = el('span', {class: 'sg-glyph'}); g.append(el('b', {}, mark), el('span', {}, STATE_WORDS[name] || name)); glyphs.append(g); }
    const cjk = el('div', {class: 'sg-glyphs'});
    for (const [mark, word] of [['人', 'person'], ['兽', 'beast']]) { const g = el('span', {class: 'sg-glyph'}); g.append(el('b', {}, mark), el('span', {}, word)); cjk.append(g); }
    guide.append(group('Glyph tokens', 'One mark per state in the bitmap Gothic face (FIGURE_STATES in src/ui/figure.js), plus single-character kind marks. A mark never stands alone: the word sits beside it or in the text form.', glyphs, cjk));

    // Glow levels
    const glows = el('div', {class: 'sg-grid'});
    for (const [level, note] of GLOW_LEVELS) glows.append(cell(level === 'none' ? '' : `--ui-glow-${level}`, (() => { const b = el('div', {class: 'sg-glow', 'data-level': level}, level); b.append(el('p', {class: 'sg-note'}, note)); return b; })()));
    guide.append(group('Glow levels', 'Light marks a control or a meaningful state. Effects off turns the glow into a static underline.', glows));

    // Motion
    const motion = el('div', {class: 'sg-motion'});
    for (const [token, use] of MOTIONS) {
        const lane = el('div', {class: 'sg-motion-lane'}), track = el('span'), fill = el('i');
        fill.style.setProperty('--sg-time', `var(${token})`); track.append(fill); lane.append(el('code', {}, token), track); lane.title = use; motion.append(lane);
    }
    const replay = el('button', {type: 'button'}, 'Replay');
    replay.addEventListener('click', () => { if (motion.hasAttribute('data-on')) motion.removeAttribute('data-on'); else motion.setAttribute('data-on', ''); });
    motion.append(replay);
    guide.append(group('Motion set', 'Three times and one easing; each lane slides at its token time (zero under Effects reduced/off or the OS setting). Pulse and settle effects name them; none moves layout.', motion, el('p', {class: 'sg-note'}, MOTIONS.map(([t, u]) => `${t}: ${u}`).join(' · '))));

    // Scales
    const scale = el('div', {class: 'sg-frame'});
    for (let n = 1; n <= 7; n++) { const row = el('div', {class: 'sg-scale'}), bar = el('i'); bar.style.width = `var(--ui-space-${n})`; row.append(el('code', {}, `--ui-space-${n}`), bar); scale.append(row); }
    const type = el('div', {class: 'sg-frame'});
    for (const [token, line, text] of [['--ui-type-small', '--ui-line-small', 'Small: notes, captions, chips'], ['--ui-type-body', '--ui-line-body', 'Body: rows, values, controls'], ['--ui-type-heading', '--ui-line-compact', 'Heading: a sheet or view title'], ['--ui-type-title', '--ui-line-compact', 'Title: a panel title']]) {
        const p = el('p', {}, text); p.style.margin = '0'; p.style.fontSize = `var(${token})`; p.style.lineHeight = `var(${line})`; type.append(p, el('code', {}, `${token} / ${line}`));
    }
    const ctl = el('div', {class: 'sg-frame'});
    for (const n of ['sm', 'md', 'lg']) { const c = el('div', {class: 'sg-ctl'}, `control-${n}`); c.style.height = `var(--ui-control-${n})`; ctl.append(c, el('code', {}, `--ui-control-${n}`)); }
    const grid = el('div', {class: 'sg-grid'}); grid.append(cell('Spacing, UR65', scale), cell('Type roles, UR68', type), cell('Control heights, UR66', ctl));
    guide.append(group('Scales', 'Spacing, type and control heights grow with the player text setting.', grid));

    // How to extend
    const list = el('ol', {class: 'sg-extend'});
    for (const line of EXTEND) list.append(el('li', {}, line));
    guide.append(group('How to extend', '', list));

    applyCustomizationProfile(defaultCustomizationState(), {moduleNodes: {vitals: module}});
    main.append(section);
    return section;
}
