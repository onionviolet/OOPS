import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {node, createFactTable, visibleRenderer, minutesText} from './reference_kit.js';

// SX3: Statistics and records. Every number is one the game already keeps: the lifetime counters
// the titles read (one authority, so a record here cannot disagree with a title), the skill
// levels and the gathered-materials tally. It adds no counter. The game keeps no per-activity time
// or per-world tally, so this panel does not show one; adding those needs a counter with a save
// decision first (see the palette's Round 12).

const TOP_SKILLS = 10, TOP_MATERIALS = 8;
const num = n => (Number.isFinite(n) ? Math.round(n).toLocaleString() : '0');
// The purse as the game writes it (10C 2W), from its own formatter; its HTML is read as text only.
function purseText(amount) {
    try {
        const html = globalThis.format_money?.(amount);
        if (typeof html === 'string') { const text = new DOMParser().parseFromString(html, 'text/html').body.textContent.trim(); if (text) return text; }
    } catch { /* fall through to the plain number */ }
    return num(amount);
}

// Pure: counters, raw stats and skill progress in; ordered [label, value] groups out.
export function projectStatistics({counters = {}, stats = {}, skills = {}}) {
    const hours = counters.playtime_hours || 0;
    const lifetime = [
        ['Time played', minutesText(hours * 60)],
        ['Years lived', num(counters.years)],
        ['Level', num(counters.level)],
        ['Deaths', num(counters.deaths)],
        ['Enemies defeated', num(counters.kills)],
        ['Kinds of enemy met', num(counters.enemy_kinds)],
        ['Critical hits dealt', num(counters.crits_done)],
        ['Strongest hit', num(counters.strongest_hit)],
        ['Hits taken', num(counters.hits_taken)],
        ['Successful crafts', num(counters.crafts)],
        ['Materials gathered', num(counters.gathered)],
        ['Books finished', num(counters.books)],
        ['Minutes spent at home', num(counters.home_minutes)],
        ['Items bought', num(counters.items_bought)],
        ['Purse', purseText(counters.money || 0)],
    ];
    const rank = (record, pick) => Object.entries(record || {}).map(([name, row]) => [name, pick(row)]).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return {
        lifetime,
        skills: rank(skills, row => row?.current_level || 0).slice(0, TOP_SKILLS).map(([name, level]) => [name, `Lv ${level}`]),
        materials: rank(stats.gathered_materials, n => n).slice(0, TOP_MATERIALS).map(([name, n]) => [name, num(n)]),
    };
}

const played = () => (readPort('counters')?.playtime_hours || 0) > 0;

function createStatisticsPanel() {
    const panel = node('section', null, {id: 'statistics_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'reference';
    const lifetime = createFactTable('Lifetime'), skills = createFactTable(`Top skills (up to ${TOP_SKILLS})`), materials = createFactTable(`Most gathered (up to ${TOP_MATERIALS})`);
    const note = node('p', 'These come from records the game already keeps. Per-activity time and per-world tallies are not recorded yet.', {class: 'reference-empty'});
    const none = text => { const p = node('p', text, {class: 'panel-empty-hint'}); return p; };
    const noSkills = none('Practice something and your skills are ranked here.'), noMaterials = none('Gather a material and it is tallied here.');
    panel.append(node('h2', 'Statistics and records'), lifetime.table, skills.table, noSkills, materials.table, noMaterials, note);
    const compute = () => {
        const character = readPort('character');
        return projectStatistics({counters: readPort('counters') || {}, stats: readPort('gameStats') || {}, skills: character?.getLevelableComponent?.().skill_progress});
    };
    const render = visibleRenderer(panel, compute, view => {
        lifetime.update(view.lifetime); skills.update(view.skills); materials.update(view.materials);
        skills.table.hidden = !view.skills.length; noSkills.hidden = view.skills.length > 0;
        materials.table.hidden = !view.materials.length; noMaterials.hidden = view.materials.length > 0;
    });
    panel.render = render;
    whenPortsReady(() => render(true));
    definePanel({id: 'statistics', title: 'Statistics', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: played, eligible: played, emptyText: 'Play a little and your records appear here'});
    return panel;
}

let panel = null;
registerDomain({id: 'statistics', deps: [], initialState: () => null, refresh: () => panel?.render(false), panels: [() => { panel = createStatisticsPanel(); }]});
